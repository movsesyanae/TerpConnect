import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NewSignUpSignIn from './SignUp_SignIn_Components/NewSignUpSignIn'
import MainPage from './MainPage'
import CreateRouter from './CreateRouter';
import CourseSelector from './Course_Selector_Component/CourseSelector'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import SignUpComponentMobile from './SignUp_SignIn_Components/SignUpComponentMobile';
import VerificationPage from './SignUp_SignIn_Components/Verification';
import HomePage from './textingComponents/HomePage'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>

    {/* <SignUpSliderComponent /> */}

    {/* <SignUpComplete /> */}

     <Router>
      <CreateRouter />
    </Router> 
  

    {/* <NewSignUpSignIn/> */}


   {/* <VerificationPage /> */}

  {/* <SignUp_SignIn_Component_Mobile/> */}

	  {/* <CourseSelector /> */}

    {/* <SignUpComponentMobile/> */}

    {/* <MainPage/> */}
    {/* <HomePage/> */}

  </React.StrictMode>,
  document.getElementById('root')
);


