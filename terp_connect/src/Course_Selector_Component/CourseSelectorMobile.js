import React, {useState, useEffect} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import './CourseSelectorStyle.scss'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'







const CourseSelector = (props) => {

    const [course, setCourse] = useState({id: '', prof: ''});
    const [valid, setValid] = useState(false);
    const [courseList, setCourseList] = useState([]);
    const [errorCode, setErrorCode] = useState(0);
    const [email, setEmail] = useState(null);
    // 0 - all works well 
    // 1 - course isn't valid 
    // 2 - professor isn't selected
    // 3 - max number of courses already added


    useEffect(() => {
        checkUser();
    }, [])

    async function checkUser() {
        console.log('doing this ');
        try {
            // const x = await Auth.currentSession();
            // console.log('well damn', x);

            const currentUserInfo = await Auth.currentUserInfo()
            setEmail(currentUserInfo.attributes['email']);

        } catch(error) {
            setEmail(null);
            console.log('got an error in course-selector', error);
            props.returnObject({nextPage: 'sign-out', message: 'authorization failure in course selector', error: error});
        }

    }


    const updateProfessor = (e) => {
        console.log(e.target.value);
        setCourse({ ...course, prof: e.target.value});
    }

    const updateCourseList = () => {

        const newCourse = {id: course.id.toUpperCase(), prof: course.prof};
        setCourseList([...courseList, newCourse]);
        
        
    }

    const removeCourse = (tempCourse) => {
        const index = courseList.indexOf(tempCourse);
        let newData = courseList.filter((courseInList) => courseInList !== tempCourse );
        setCourseList(newData);
    }

    const ShowCourseList = () => {
        return (
            <fieldset className = 'course-selection-page course-display-package' id = 'course-list'>
                <legend> Your Classes </legend>
                <ul className = 'course-display-package'>
                    <h3 className = 'course-list-element' id>
                       <div id='course-label'> Course ID </div>
                       <div> Professor</div>  
                    </h3>
                    {courseList.map( (tempCourse) => {
                        return (
                            <li className = 'course-list-element'> 
                                <div id = 'course-list-element'>
                                    <div>
                                        {tempCourse.id} 
                                    </div>
                                    <div id='profSpacing'>
                                        {tempCourse.prof} 
                                    </div>
                                    <div>
                                        <button className = 'remove-class-btn' onClick = {(e) => removeCourse(tempCourse)}>&times;</button> 
                                    </div>
                                </div> 

                            </li>);
                    })} 

                </ul>
            </fieldset>
        );
    }

    const getProfessorList = (classId) => {
        var json = require('./new_updated_classes.json');
        return(json[classId.toUpperCase()]);
    }

    const CreateProfessorDropdown = () => {
        const profList = getProfessorList(course.id);
        return (
            <div className = 'dropdown-package'> 
                <label htmlFor = 'profSelector' id = 'professor-label'> Professor:</label>

                <div id='dropdownBox'>
                <select name='professors' value = {course.prof}  id='professor-dropdown2' onChange = {(e) => {updateProfessor(e)}}>
                    <option  value = '' disabled selected>Please choose one</option>

                    {
                        
                        profList.map( (profName) => {
                            return(<option value={profName}>{profName}</option>);
                        })
                    }

                </select>
                </div>




            </div>
        );
    }


    const ResetProfessor = () => {
        return(null);
    }


    const addCourse = (e) => {
        // 0 - all works well 
        // 1 - max number of courses already added
        // 2 - course isn't valid 
        // 3 - professor isn't selected
        // 4 - course is already added

        if (courseList.length >= 7) {
            setErrorCode(1);
        } else if (!valid) {
            setErrorCode(2);
        } else if (course.prof === '') {
            setErrorCode(3);
        } else if (courseList.filter((element) => element.id === course.id.toUpperCase()).length > 0) {
            setErrorCode(4);
        }
        else {
            setErrorCode(0);
            updateCourseList();
        }

    }

    const DisplayErrorMessage = () => {
        var errorMessage = '';
        switch (errorCode) {
            case 1:
                errorMessage = 'You can only select up to seven courses'
                break;

            case 2:
                errorMessage = 'Please enter a valid UMD Course ID'
                break;
            
            case 3:
                errorMessage = 'Please select your professor'
                break;
            
            case 4:
                errorMessage = 'You have already added this course'
                break;
        
            default:
                break;
        }

        return (
            <div className="alert">
                <ref className="closebtn" onClick = {(e) => setErrorCode(0)}>&times;</ref>
                {errorMessage}
            </div> 
        )

    }

    const checkCourseValid = (courseId) => {
        var json = require('./classes.json'); //(with path)
        // var returnArray = ['Damn Shadi'];
        // const course_id = 'CMSC352';
        // if(json.hasOwnProperty(course_id)){
        //     returnArray = json[course_id]
        // }
        if (json.hasOwnProperty(courseId.toUpperCase())) {
            setValid(true);
        } else { 
            setValid(false);
        }

    }

    const handleSubmit = async() => {
        //do server call

        try {
            // convert course list to string list
            let newCourseList = [];
            var i;
            for( i = 0; i < courseList.length; i++){
                let cName = courseList[i].id + ' ' + courseList[i].prof;
                newCourseList.push(cName);
            }
            
            // remove student from previous set of courses
            var user = await API.graphql(graphqlOperation(queries.getUser, {id: email}));
            var pastCourses = user.data.getUser.courseList;
            for(i = 0; i < pastCourses.length; i++){
                let course = await API.graphql(graphqlOperation(queries.getCourse, {id: pastCourses[i]}));
                if (course.data.getCourse != null) {
                    let studentList = course.data.getCourse.studentList;
                    studentList = studentList.filter(item => item !== email);
                    let courseUpdate = {id: pastCourses[i], studentList: studentList};
                    await API.graphql(graphqlOperation(mutations.updateCourse, { input: courseUpdate}));
                }
            }

            // add student to new set of courses
            for(i = 0; i < newCourseList.length; i++) {
                let course = await API.graphql(graphqlOperation(queries.getCourse, {id: newCourseList[i]}));
                if (course.data.getCourse == null) {
                    let createCourseInput = {id: newCourseList[i], studentList: [email]};
                    await API.graphql(graphqlOperation(mutations.createCourse, {input: createCourseInput}));
                } else {
                    let studentList = course.data.getCourse.studentList;
                    console.log(studentList);
                    if(!studentList.includes(email)) {
                        studentList.push(email);
                        console.log(studentList);
                        let courseUpdate = {id: newCourseList[i], studentList: studentList};
                        await API.graphql(graphqlOperation(mutations.updateCourse, { input: courseUpdate}))

                    }
                }
            }
            
            // update student's course list
            let updateInput = {id: email, courseList: newCourseList}
            await API.graphql(graphqlOperation(mutations.updateUser, { input: updateInput}))
            console.log('course list updated');
    
            
    
            //make next page main page
            props.returnObject({
                nextPage: 'home-page'
            });
            
        } catch(err) {
            console.log('something went wrong: ', err);
            props.returnObject({
                nextPage: 'sign-out',
                message: 'error in course-selection',
                error: err
            })
        }
    }


    return (
        <body id="courseSelectorBodyMobile">
        <main className = 'course-selection-page'>
        
            {courseList.length > 0 ? <ShowCourseList /> : null}
            <fieldset className = 'course-input-package course-selection-page' id = 'class-selector'>
                <legend> Add a course </legend>
                <div className = 'course-inputs'>
                    
                    <div className = 'course-id-input'>
                        <label htmlFor = "course-id-input"> Course: </label>
                        <input 
                            type = "text" 
                            id = 'course-id-input' 
                            name = 'course'
                            className = 'course-selection-page' 
                            value = {course.id}
                            onChange = {(e) => {
                                checkCourseValid(e.target.value.toUpperCase().trim()); 
                                setCourse({ id: e.target.value.toUpperCase().trim(), prof: '' });
                            }
                            }
                        /> 
                    </div>
                    
                    { valid ? <CreateProfessorDropdown /> : null }

                </div>

                <div>
                    <button className = 'add-class-btn' type = 'submit' onClick = {(e) => {addCourse();}}> Add Class </button>
                </div> 
                

            </fieldset>

            <button className = 'add-class-btn' id = 'submit-courses-btn' type = 'submit' onClick = {(e) => {handleSubmit(e);}}> Submit Class List </button>
            
            
            {errorCode !== 0 ? <DisplayErrorMessage /> : null}

            


        </main>
        </body>
    

    );
}

export default CourseSelector;