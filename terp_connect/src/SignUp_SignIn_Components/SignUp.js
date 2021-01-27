import React, { useState, useEffect, useRef} from 'react';
import './newSignUpIn.scss';
import axios from 'axios'
import { Auth } from 'aws-amplify';
import Filter from 'bad-words';


const SignUp = (props) => {
    const filter = new Filter();
    const [signUpFields,setSignUpFields] = 
    useState({name:'',email:'',password:'',confirmPassword:'',
    studyBuddy:false,friend:false,sex:false,male:false,
    female:false,other:false,nonBinary:'',bio:''});
    const [signUpFailMessage, setSignUpFailMessage] = useState('');
    const whereWeAt = useRef(document.getElementById('name'));

    useEffect(() => {whereWeAt.current.focus()},[signUpFields.nonBinary]);

    const NonBinary = () => {
        if(signUpFields.other){
            return(
                <div id='nonBinary-field'>
                    <input 
                        type = 'text'
                        key = 'nonBinary'  
                        name = 'nonBinary'
                        ref = {whereWeAt}
                        placeholder = 'gender' 
                        maxLength = '256'
                        value = {signUpFields.nonBinary} 
                        onChange = { (e) => setSignUpFields({...signUpFields,nonBinary:e.target.value}) } 
                    /> 
                    </div>
            )
        } else {
            return(<></>)
        }
    }

    async function handleSignUp(e) {
        e.preventDefault();

        if (signUpFields.name.length < 1 || signUpFields.email.length < 1 || signUpFields.password.length < 1
            || signUpFields.confirmPassword.length < 1 || signUpFields.bio.length < 1 || 
            (!signUpFields.female && !signUpFields.male && !signUpFields.other) || 
            (signUpFields.other && signUpFields.nonBinary.length < 1) || 
            (!signUpFields.studyBuddy && !signUpFields.friend && !signUpFields.sex)) {
                props.message('Please complete all fields');
                return;
        }

        if (filter.isProfane(signUpFields.name)) {
            props.message('Please obstain from profanity in your name');
            return;
        }
        
        if (!signUpFields.email.endsWith('umd.edu')) {
            props.message('Please use your @umd.edu email');
            return;
        }
        
        if (signUpFields.password.length < 8) {
            props.message('Your password must contain at least 8 characters');
            return;
        }
        
        if (signUpFields.password !== signUpFields.confirmPassword) {
            props.message('Please make sure your passwords match');
            return;
        }
        
        if (filter.isProfane(signUpFields.bio)) {
            props.message('Please obstain from profanity in your bio');
            return;
        }
        
        let inputs = [signUpFields.name, signUpFields.password, signUpFields.nonBinary, signUpFields.email];
        var i;
        for(i = 0; i < inputs.length; i++){
            if(inputs[i].includes('\'') || inputs[i].includes('<') || inputs[i].includes('>')) {
                props.message('nice try bru');
                return;
            }
        }
        if(signUpFields.bio.includes('<') || signUpFields.bio.includes('>')) {
            props.message('please refrain from using the < and > characters in your bio');
            return;
        }
        
        
        try {
            var gender = '';
            if (signUpFields.female) {
                gender = 'Female';
            } else if (signUpFields.male) {
                gender = 'Male';
            } else {
                gender = signUpFields.nonBinary;
            }

            var lookingForSB = 'false';
            var lookingForF = 'false';
            var lookingForSF = 'false';
            if (signUpFields.studyBuddy){
                lookingForSB = 'true';
            }
            if (signUpFields.friend){
                lookingForF = 'true';
            }
            if (signUpFields.sex){
                lookingForSF = 'true';
            }

            const { user } = await Auth.signUp({
                username: signUpFields.email,
                password: signUpFields.password,
                attributes: {
                    
                    email: signUpFields.email,
                    // other custom attributes 
                    'custom:name': signUpFields.name,
                    'custom:gender': gender,
                    'custom:lookingForSB': lookingForSB,
                    'custom:lookingForF': lookingForF,
                    'custom:lookingForSF': lookingForSF,
                    'custom:bio': signUpFields.bio,

                }
            });
            console.log(user);
            props.returnObject({
                nextPage: 'confirm-email',
                email: signUpFields.email,
                password: signUpFields.password
            });
        } catch (error) {

            if(error['code'] === 'UsernameExistsException'){
                props.message('An account has already been made with that email');
                return;
            }

            console.log('error signing up:', error.code);
			
        }
    }

    return (
        <div id = "newSignUpBox">

            <div id='Label-field'>
                <h1>Sign Up</h1>
            </div>

            <div id='name-field'>
            <input 
                id='name'
                ref = {whereWeAt}
                type = 'text'  
                name = 'name'
                placeholder = 'name' 
                maxLength = '256'

                value = {signUpFields.name} 
                onChange = { (e) => setSignUpFields({...signUpFields,name:e.target.value}) }
            /> 
            </div>

            <div id='email-field'>
                <input 
                    type = 'text'  
                    name = 'email'
                    placeholder = 'email' 
                    value = {signUpFields.email} 
                    onChange = { (e) => setSignUpFields({...signUpFields,email:e.target.value}) }
                /> 
            </div> 

            <div id='password-field'>
                <input 
                    type = 'password'  
                    name = 'password'
                    placeholder = 'password' 
                    value = {signUpFields.password} 
                    onChange = { (e) => setSignUpFields({...signUpFields,password:e.target.value}) }
                /> 
            </div> 

            <div id='confirmPassword-field'>
                <input 
                    type = 'password'  
                    name = 'confirm password'
                    placeholder = 'confirm password' 
                    value = {signUpFields.confirmPassword} 
                    onChange = { (e) => setSignUpFields({...signUpFields,confirmPassword:e.target.value}) }
                /> 
            </div>

            <div id='gender-field'>
                <label>Gender</label>
                <input type = 'radio'  id = 'male-r' name = 'gender' value = '0' onClick = { (e) => setSignUpFields({...signUpFields,male:true,female:false,other:false}) }/>
                <input type = 'radio'  id = 'female-r' name = 'gender' value = '1' onClick = { (e) => setSignUpFields({...signUpFields,male:false,female:true,other:false}) }/>
                <input type = 'radio'  id = 'other-r' name = 'gender' value = '2' onClick = { (e) => setSignUpFields({...signUpFields,male:false,female:false,other:true}) }/>
                <label id= 'male-l'>Male</label>
                <label id= 'female-l'>Female</label>
                <label id= 'other-l'>Other</label>
            </div>

            <NonBinary/>

            <div id='lookingfor-field'>
                <label>Looking For:</label>
                    <input type = 'checkbox'  id = 'study-buddy-c' name = 'studdy-buddy' value = '0' onClick = { (e) => setSignUpFields({...signUpFields,studyBuddy:!signUpFields.studyBuddy})}/>
                    <input type = 'checkbox'  id = 'friend-c' name = 'friend' value = '1' onClick = { (e) => setSignUpFields({...signUpFields,friend:!signUpFields.friend})}/>
                    <input type = 'checkbox'  id = 'sex-c' name = 'sex' value = '2' onClick = { (e) => setSignUpFields({...signUpFields,sex:!signUpFields.sex})}/>
                    <label id= 'study-buddy-l'>Studdy <br/>Buddy</label>
                    <label id= 'friend-l'>Friend</label>
                    <label id= 'sex-l'>Friend ;)</label>
            </div>

            <div id='bio-field'>
                <label>Bio</label>
                <textarea maxLength = '256' placeholder = 'tell your classmates something about yourself ;)' value={signUpFields.bio} onChange = { (e) => setSignUpFields({...signUpFields,bio:e.target.value})}/>
            </div>

            <div id='submit-field'>
                <button type = 'submit' onClick = { handleSignUp }> Sign Up </button>
            </div>

        </div>
    );
}


export default SignUp;
