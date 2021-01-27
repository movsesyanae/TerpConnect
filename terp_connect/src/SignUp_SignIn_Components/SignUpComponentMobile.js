import {useState,useEffect,useRef} from 'react'
import SignIn from './SignIn'
import { Auth } from 'aws-amplify';
import Filter from 'bad-words';

import './SignInStyleMobile.scss'
import SignUp from './SignUp'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory, Link } from 'react-router-dom';

const SignUpComponentMobile = (props) => {
	const filter = new Filter();
	const [bio, setBio] = useState('');
	const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [male, setMale] = useState(true);
    const [female, setFemale] = useState(false);
	const [other, setOther] = useState(false);
	const [gender,setGender] = useState(0);
	const [lookingFor,setLookingFor] = useState([]);
    const [nonBinary, setNonBinary] = useState('');
	const [signUpFailMessage, setSignUpFailMessage] = useState('');
	const whereWeAt = useRef(document.getElementById('name'));

	useEffect(() => {window.scrollTo(0,0);},[]);

	useEffect(() => {whereWeAt.current.focus()},[nonBinary]);


	function genderHandler (eventValue) {
		setGender(eventValue);
		switch(eventValue) {
			case '0':
				setMale(true); 
				setFemale(false); 
				setOther(false);
				break;
			case '1':
				setMale(false); 
				setFemale(true); 
				setOther(false);
				break;
			case '2':
				setMale(false); 
				setFemale(false); 
				setOther(true);
				break;
			default:
				break;
		}
	}

	const NonBinary = () => {
        if (gender == 2) {
            return (
                    <div className="entry-mobile grid-unitx">
                    {/* <label htmlFor = "nonBinary"> Confirm Gender : </label> */}
                    <input 
                        className="entry-mobile"
                        type = 'text' 
                       
                        key = 'nonBinary'
                        name = 'nonBinary'
                        placeholder = 'specify gender' 
                        ref = {whereWeAt}
                        value = {nonBinary} 
                        onChange = {(e) => {setNonBinary(e.target.value); }} 
                    /> 
                </div>  
                );
        } else {
            return (<></>);
        }
	}
	
	const ErrorPopUp = () => {
		if(signUpFailMessage !== '') {
			return (
				// <div class = 'entry-mobile' id='errorBox'>
				// 	<p>{signUpFailMessage}</p>
				// </div>

				<div className="alert" ref={whereWeAt} id='alert-mobile'>
                <ref className="closebtn" onClick = {() => {setSignUpFailMessage(''); window.scrollTo(0,0);}}>&times;</ref>
                {signUpFailMessage}
            </div> 
			);
		} else {
			return (<></>);
		}
	}
	
	async function submitHandler (e) {
        e.preventDefault();

        let stringInputs = [name,email,password,confirmPassword,nonBinary];

        if(bio == '' || name == '' || email == '' || password == '' || confirmPassword == '' ||  lookingFor.length === 0 || (!male && !female && !other) || (other && nonBinary == '')) {
			// props.failMessage('You have not selected all fields');
			setSignUpFailMessage('Please complete all fields');
            return;
		}
		

        for(let x in stringInputs) { //injection prevention
            console.log(stringInputs[x]);
            if(stringInputs[x].includes('\'') || stringInputs[x].includes('<') || stringInputs[x].includes('>')) {
                setSignUpFailMessage('nice try bru');
                // props.failMessage('You may not include symbols such as \' or < >');
                return;
            }
		}
		
		if (bio.includes('<') || bio.includes('>')) {
			setSignUpFailMessage('please refrain from using the < and > characters in your bio');
			return;
		}

		if(!(password == confirmPassword)) { //FIX: passwords showing up in console
            setSignUpFailMessage('Please make sure your passwords match');
            // props.failMessage('Passwords must match!');
            return;
        }

        if(!email.endsWith('@umd.edu')) {
            setSignUpFailMessage('Please use your @umd.edu email');
            // props.failMessage('Please use a @umd.edu email');
            return;
		}
		if (filter.isProfane(name)) {
            setSignUpFailMessage('Please obstain from profanity in your name');
            return;
		}
		
		if (password.length < 8) {
            setSignUpFailMessage('Your password must contain at least 8 characters');
            return;
        }
		
		if (filter.isProfane(bio)) {
            setSignUpFailMessage('Please obstain from profanity in your bio');
            return;
        }

        
		  // Do server call here
		try {
			var gender = '';
			if (female) {
				gender = 'Female';
			} else if (male) {
				gender = 'Male';
			} else {
				gender = nonBinary;
			}

			var lookingForSB = 'false';
			var lookingForF = 'false';
			var lookingForSF = 'false';
			if (lookingFor.includes(0)){
				lookingForSB = 'true';
			}
			if (lookingFor.includes(1)){
				lookingForF = 'true';
			}
			if (lookingFor.includes(2)){
				lookingForSF = 'true';
			}

			const { user } = await Auth.signUp({
				username: email,
				password: password,
				attributes: {
					
					email: email,
					// other custom attributes 
					'custom:name': name,
					'custom:gender': gender,
					'custom:lookingForSB': lookingForSB,
					'custom:lookingForF': lookingForF,
					'custom:lookingForSF': lookingForSF,
					'custom:bio': bio,

				}
			});
			console.log(user);
			props.returnObject({
				nextPage: 'confirm-email',
				email: email,
				password: password
			});
		} catch (error) {
			if (error.code === 'UsernameExistsException' ){
				setSignUpFailMessage('An account has already been made with that email');
				return;
			}
			console.log('error signing up:', error);
		}



  
    }

    const createUser = () => {
        const crypto = require('crypto'); 
        const hash = crypto.createHash('sha256');
        const id = hash.update('email', 'binary').digest('hex');
        const passHash = hash.update('password', 'binary').digest('hex');
        // const user = {id: id, passHash: passHash};
        const user = {id: email, passHash: password};
        return user;
    }

    const createRequestJSON = () => {
        const user = createUser(); 

        // get gender
        let gender = '';
        if (male) gender = 'male';
        else if (female) gender = 'female';
        else gender = nonBinary;

    




        const grace = {user: user, email: email, name: name, gender: gender, lookingForList: lookingFor, verified: false, action: 0};
		console.log(grace);
		return grace;
        
    }
	const handleMult = (e) => {

		var value = [];
		var options = e.target.options;
		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) {
			value.push(parseInt(options[i].value));
			}
		}
		setLookingFor(value);

	}
	

    return(
			
			<div className = 'entry-mobile page-container'>

					<div className = 'entry-mobile grid-unit1'>
						<h1 id='cCLabel'className = 'entry-mobile course-connect'>Terp Connect</h1>
						<p>Already have an account? <Link to = '/sign-in-mobile' id ="signInLink">Sign in</Link></p>
					</div>

					<ErrorPopUp/>

					<div className = 'entry-mobile grid-unit2'>
						<input 
						className="entry-mobile"
						type = 'text' 
						id = 'name' 
						name = 'name'
						placeholder = 'name' 
						ref = {whereWeAt}
						value = {name} 
						onChange = { (e) => setName(e.target.value) } 
						/> 
					</div> 
					

					<div className = 'entry-mobile grid-unit3'>
						<input 
						className="entry-mobile"
						type = 'text' 
						id = 'email' 
						name = 'email'
						placeholder = 'email' 
						value = {email} 
						onChange = { (e) => setEmail(e.target.value) } 
						/>
					</div>

					<div className = 'entry-mobile grid-unit4'>
						<input 
						className="entry-mobile"
						type = 'password' 
						id = 'password' 
						name = 'password'
						placeholder = "password" 
						value = {password} 
						onChange = {(e) => setPassword(e.target.value)} 
						/>
					</div>

					<div className = 'entry-mobile grid-unit5'>
						<input 
						className="entry-mobile"
						type = 'password' 
						placeholder = 'confirm password'
						id = 'confirm password' 
						name = 'confirm password' 
						value = {confirmPassword} 
						onChange = {(e) => setConfirmPassword(e.target.value)} 
                		/>
					</div>

					<div className = 'entry-mobile grid-unit6'>
						<label className="entry-mobile genderLabel" htmlFor = "gender" > Gender: </label>
						{/* <div className="entry-mobile gender-buttons-mobile">
							<div className="entry-page" id = "gb1-button">
								<input className="entry-page" type = 'radio' onClick = {() => {setMale(true); setFemale(false); setOther(false);}} id = 'male' name = 'gender' value = '0' />
							</div>
							<div id='gb1-label'>
								<label className="gb1-label" htmlFor = 'male'> Male </label>
							</div>

                        	<div className="entry-page" id = "gb2-button">
                            	<input className="entry-page" type = 'radio' onClick = {() => {setMale(false); setFemale(true); setOther(false);}} id = 'female' name = 'gender' value = '1' />
                            </div>

							<div id='gb2-label'>
							<label className="entry-page" htmlFor = 'female'> Female </label>
                        	</div>

                        	<div className="entry-page" id = "gb3-button">
                            <input className="entry-page" type = 'radio' onClick = {() => {setMale(false); setFemale(false); setOther(true); }} id = 'other' name = 'gender' value = '2' />
							</div>

							<div id = 'gb3-label'>
                            <label className="entry-page" htmlFor = 'other'> Other </label>
                        	</div>

                    	</div> */}
						<select id='genderSelector' className = 'entry-mobile custom-select' name='genderSelector' value={gender} onChange = {(e) => {genderHandler(e.target.value)}} >
							<option value='0'> Male </option>
							<option value='1' > Female </option>
							<option value='2' > Other </option>
						</select>
					</div>

					<NonBinary/>


					<div className = 'entry-mobile grid-unit7'>
						<label className="entry-mobile"> I'm looking for a... </label>
						{/* <div className = 'entry-mobile looking-for-buttons-mobile'>
								<div  id='lfb1'>
								<input className="entry-mobile" id='innerLfb1'  type = 'checkbox' onClick = {() => {setStudyBuddy( !studyBuddy)}}  name = 'study buddy' value = '0'/>
								</div>
								<label className="entry-mobile" id='lfl1' htmlFor = 'study buddy' >Study buddy</label> 
						
								<div id='lfb2'>
								<input className="entry-mobile"  type = 'checkbox' onClick = {() => {setFriend(!friend)}} name = 'friend' value = '1'/>
								</div>
								<label className="entry-mobile" id='lfl2' htmlFor = 'friend'>friend</label> 
						
								<div id='lfb3'>
								<input className="entry-mobile" type = 'checkbox' onClick = {() => {setSex(!sex)}}  name = 'sex' value = '2'/>
								</div>
								<label className="entry-mobile" id = 'lfl3' htmlFor = 'sex'>friend ;)</label>
						</div> */}
						<select id='lookingForSelector'  onChange = {(e) => handleMult(e)} multiple>
							<option value={0}> Study Buddy </option>
							<option value={1} > Friend </option>
							<option value={2} > Friend ;) </option>
						</select>
					</div>

					<div className = 'entry-mobile grid-unit9'>
						<label>Bio</label>
                		<textarea maxLength = '256' placeholder = 'tell your classmates something about yourself ;)' value={bio} onChange = { (e) => setBio(e.target.value)}/>
					</div>


					<div className = 'entry-mobile grid-unit8'>
						<button className="entry-mobile" type = 'submit' onClick = { (e) => {submitHandler(e);} }> Sign Up </button>
					</div>
{/* 
					<div className = 'entry-mobile grid-footer'>
					</div> */}
			</div> 
    );
}

export default SignUpComponentMobile;