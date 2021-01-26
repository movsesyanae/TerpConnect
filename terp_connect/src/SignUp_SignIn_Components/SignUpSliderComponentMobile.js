import {useState,useEffect,useRef} from 'react'
import SignIn from './SignIn'

import './SignInStyleMobile.scss'
import SignUp from './SignUp'
import SignInComponentMobile from './SignInComponentMobile';
import SignUpComponentMobile from './SignUpComponentMobile';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory, Link } from 'react-router-dom';

const SignUp_SignIn_Component_Mobile = () => {
	return(
		<Router>
			<Switch>
				<Route exact path = '/' component = {SignUpComponentMobile} />
				<Route exact path = '/signIn' component = {SignInComponentMobile} /> 
			</Switch>
		</Router>
	);
}

export default SignUp_SignIn_Component_Mobile;