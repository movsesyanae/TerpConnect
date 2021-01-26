import {useState,useEffect,useRef} from 'react'
import SignIn from './SignIn'

import './SignInStyleMobile.scss'
import SignUp from './SignUp'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory, Link } from 'react-router-dom';

const SignUpComponentMobile = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [signUpFailMessage, setSignUpFailMessage] = useState('');
	const whereWeAt = useRef(document.getElementById('name'));




	
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
	
	function submitHandler (e) {
        e.preventDefault();

        let stringInputs = [email,password];
        let submitPass = true;  //as long as true should succefully submit

        if(email == '' || password == '') {
			// props.failMessage('You have not selected all fields');
			setSignUpFailMessage('You have not selected all fields');
            submitPass = false;
            return;
		}
		

        for(let x in stringInputs) { //injection prevention
            if(stringInputs[x].includes('\'') || stringInputs[x].includes('<') || stringInputs[x].includes('>')) {
				setSignUpFailMessage('Stop hacking ;)');
                // props.failMessage('You may not include symbols such as \' or < >');
                submitPass = false;
                return;
            }
        }


     
        //check servers return here
        const verified = true; // needs to be changed to be seen from server call

   
        // Once everything is handled
        const user = createUser();
        const logInObject = {user: user, verified: verified}
        props.logIn(logInObject);  
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
        const grace = {user: user, action: 1};
        console.log(grace);
        return grace;
    }
	

    return(
			<div className = 'entry-mobile page-container'>

					<div className = 'entry-mobile grid-unit1'>
						<h1 id='cCLabel'className = 'entry-mobile course-connect'>Course Connect</h1>
						<p>New User? <Link to = '/sign-up-mobile' id ="signInLink">Sign up</Link></p>
					</div>

					<ErrorPopUp/>

					 
					

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

				

					


					

					<div className = 'entry-mobile grid-unit8'>
						<button className="entry-mobile" type = 'submit' onClick = { (e) => {submitHandler(e);} }> Sign In </button>
					</div>

			</div> 
    );
}

export default SignUpComponentMobile;