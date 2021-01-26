import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import SignUpPackage from './SignUp_SignIn_Components/NewSignUpSignIn';
import SignUpComponentMobile from './SignUp_SignIn_Components/SignUpComponentMobile';
import SignInComponentMobile from './SignUp_SignIn_Components/SignInComponentMobile';
import CourseSelector from './Course_Selector_Component/CourseSelector';
import Verification from './SignUp_SignIn_Components/Verification';
import {isMobile} from 'react-device-detect';
import MainPage from './MainPage';
import { Auth } from 'aws-amplify';



const CreateRouter = () => {

    const [currentPage, setCurrentPage] = useState('');
    // const [user, setUser] = useState(null);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const history = useHistory();
    

    useEffect(() => {
        checkUser();
    }, [])

    async function checkUser() {
        console.log('doing this ');
        try {
            // const x = await Auth.currentSession();
            // console.log('well damn', x);
            const user = await Auth.currentAuthenticatedUser();
            console.log('user:', user);
            console.log(user['attributes']['email']);
            setVerified(true);
            setEmail(user['attributes']['email']);
        } catch(error) {
            setVerified(false);
            setEmail(null);
            setPassword(null);
            console.log('got an error', error);
        }

    }

    const handleReturn = (returnObject) => {
        if (returnObject['nextPage'] === 'confirm-email') {
            setEmail(returnObject['email']);
            setPassword(returnObject['password']);
            setCurrentPage('confirm-email');
            console.log('this be a good place to be');
            history.push('/verification');
        } else if (returnObject['nextPage'] === 'course-selection') {
            history.push('/courses');
        } else if (returnObject['nextPage'] === 'home-page') {
            history.push('/main');

        } else if (returnObject['nextPage'] === 'sign-out') {
            Auth.signOut();
            setEmail(null);
            setVerified(false);
            setPassword(null);
            setCurrentPage('');
            history.push('/');
        }
    }

 

    return(
        <div>

            
            {/* { email ?  
            <h1>User: {email}</h1> : null
            }
             */}

            {/* <Router> */}
                <Switch>
                    {/* <Route exact path = '/' render = {() => <SignUpSliderComponent user = {(user) => setUser(user)} verified = {(value) => handleAfterSignIn(value)}  />} />  */}
                    <Route exact path = '/'> 
                        {/* {isMobile ? <Redirect to = '/sign-up-mobile' /> : <SignUpPackage logIn = {(value) => handleLogIn(value)} />} */}
                        {isMobile ? <Redirect to = '/sign-up-mobile' /> : <SignUpPackage returnObject = {handleReturn} updateVerified = {(value) => setVerified(value)} />}
                    </Route>
                    
                    {/* <Route exact path = '/courses' render = {() => <CourseSelector nextPage = {(value) => handleNextPage(value)} user = {user}/>}/> */}
                    <Route exact path = '/courses' render = { () => (
                        <CourseSelector returnObject = {handleReturn} />
                    )} /> 
                        {/* <CourseSelector email = {email} returnObject = {handleReturn} /> */}
                    {/* </Route> */}
                    
                    <Route exact path = '/verification'> 
                        {email && password && !verified && currentPage === 'confirm-email' ? <Verification email = {email} password = {password} returnObject = {handleReturn} /> : <Redirect to = '/' /> }
                    </Route>

                    <Route exact path = '/sign-up-mobile'> 
                        {/* {user ? <Verification /> : <h1>damn</h1>} */}
                        {/* {!isMobile ? <Redirect to = '/' /> : <SignUpComponentMobile logIn = {(value) => handleLogIn(value)} user = {(user) => handleLogIn(user)}  />} */}
                        {!isMobile ? <Redirect to = '/' /> : <SignUpComponentMobile />}
                    </Route>
                    
                    <Route exact path = '/sign-in-mobile'> 
                        {/* {!isMobile ? <Redirect to = '/' /> : <SignInComponentMobile logIn = {(value) => handleLogIn(value)} user = {(user) => handleLogIn(user)}  />} */}
                        {!isMobile ? <Redirect to = '/' /> : <SignInComponentMobile />}
                    </Route>

                    <Route exact path = '/main'>
                        {/* {user === null ? <Redirect to = '/' /> : <MainPage returnObject = {handleReturn} />} */}
                        <MainPage returnObject = {handleReturn} />
                    </Route>
                </Switch>
            {/* </Router> */}
        </div>
    );
}

export default CreateRouter;