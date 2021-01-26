import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import './VerificationPageStyle.scss';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../graphql/mutations'

const Verification = (props) => {
    const [code, setCode] = useState('');

    useEffect(() => {
        checkUser();
    }, [])

    async function checkUser() {
        console.log('doing this ');
        try {
            // const x = await Auth.currentSession();
            // console.log('well damn', x);
            const user = await Auth.currentAuthenticatedUser();
            console.log('already verified in verification page', user['attributes']['email']);
            props.returnObject({nextPage: 'sign-out', message: 'already verified in email confirmation page'});            
        } catch(error) {
        }

    }

    const createUser = async() => {
        
    
    }

    async function handleSubmit(e) {

        try {
            // confirm the email address
            await Auth.confirmSignUp(props.email, code);
            
            // sign in user
            let userSignedIn = await Auth.signIn(props.email, props.password);
            console.log(userSignedIn);
            
            // get user's information
            const currentUserInfo = await Auth.currentUserInfo()
            const email = currentUserInfo.attributes['email']

            const name = currentUserInfo.attributes['custom:name'];
            const gender = currentUserInfo.attributes['custom:gender'];
            const bio = currentUserInfo.attributes['custom:bio'];
            
            var lookingForList = [];
            if (currentUserInfo.attributes['custom:lookingForSB'] == 'true'){
                lookingForList.push('Study Buddy');
            }
            if (currentUserInfo.attributes['custom:lookingForF'] == 'true'){
                lookingForList.push('Friend');
            }
            if (currentUserInfo.attributes['custom:lookingForSF'] == 'true'){
                lookingForList.push('Friend ;)');
            }
            let x = {name, email, gender, bio, lookingForList}

            console.log(x);

            // push the users information to dynamodb with graphql
            let user = {id: email, bio: bio, courseList: [], gender: gender, lookingForList: lookingForList, name: name, matches: [] }
            await API.graphql(graphqlOperation(mutations.createUser, { input: user }))
            console.log('item created!')
            


            // go back to router with next page
            props.returnObject({
                nextPage: 'home-page'
            });


         




        } catch (error) {
            console.log('in verification', error);
            // props.returnObject({
            //     nextPage: 'sign-out',
            //     message: 'something went wrong during email verification',
            //     error: error
            // });
        }

    }

    return(
        <div id='outerScreen'>
                <div id='areaBox'>
                    <div id='title'>
                        <p>Please Verify</p>
                    </div>
                    <div id='text'>
                        <p>Please check your umd email for <br/> an email from us containing your security code</p>
                    </div>
                    <div id = 'input-and-submit'>
                        <input type = 'number' pattern = '\d*' placeholder = 'code' value = {code} onChange = {(e) => setCode(e.target.value)}/>
                        <button type = 'submit' onClick = {(e) => handleSubmit(e)} >Submit Code</button>
                    </div>
                </div>
            </div>
        // <body >
        //     <div className = 'verification-page'>
        //         <h3> We need to verify your email </h3>
        //         <h4> Please check your umd email to for an email from us containing your security code </h4>
        //         <div className = 'input-and-submit'>
        //             <input type = 'number' pattern = '\d*' placeholder = 'code' value = {code} onChange = {(e) => setCode(e.target.value)}/>
        //             <button type = 'submit' onClick = {(e) => handleSubmit(e)} >Submit Code</button>
        //         </div>
        //     </div>
        // </body>
    );

}

export default Verification;