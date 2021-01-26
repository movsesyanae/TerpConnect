import {useState, useEffect, useRef, useImperativeHandle} from 'react'
import './newSignUpIn.scss';
import { Auth } from 'aws-amplify';
import SignUp from './SignUp'
import SignIn from './SignIn'
import Switcheroo from './Switcheroo'


const NewSignUpSignIn = (props) => {
    const [needsConfirm, setNeedsConfirm] = useState(false);
    const [authCode, setAuthCode] = useState('');
    const [backUpEmail, setBackUpEmail] = useState('');
    const [message, setMessage] = useState('');


    

    const MessageBox = () => {
        return (
            <div id='entry-alert' >
                <ref className="closebtn" onClick = {(e) => setMessage('')}>&times;</ref>
                {message}
            </div> 
        );
    }

    return(
        <div id = "newOuterBox">
            
            <SignUp returnObject = {(value) => props.returnObject(value)} message = {(value) => setMessage(value)} />
            <SignIn returnObject = {(value) => props.returnObject(value)} message = {(value) => setMessage(value)} />
            <Switcheroo/>
            {message !== '' ? <MessageBox /> : null}
        </div>
    );

}
export default NewSignUpSignIn;