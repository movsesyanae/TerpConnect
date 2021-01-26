import {useState} from 'react';
import {motion} from "framer-motion"
import './newSignUpIn.scss';

const Switcheroo = () => {
    const [titleText,setTitleText] = useState('Welcome to TerpConnect');
    const [descripText,setDescripText] = useState('Meet people in your classes!');
    const [btnText,setBtnText] = useState('Sign Up');
    const [sideA,setSideA] = useState(false);

    const variants = {
        init: {x: '100%'},
        left: {x: '0%'},
        right: {x:'100%'}

        // init: {opacity: 0},
        // left: {opacity: 0},
        // right: {opacity:1}
    }

    function onClickHandler(e) {
        e.preventDefault();
        setSideA(!sideA);
        console.log('clicked btn');

        if(sideA){
            setBtnText('Sign Up')
        } else {
            setBtnText('Sign In')
        }

    }

    return (
        <div id='positionBox'>
            <motion.div id='switchBox'
            variants = {variants}
            initial = "init"
            animate = {(sideA) ? "left" : "right"}
            transition={{type:'spring',delay:0.1}}
            >
                <div id='height-box'>
                    <div id='title-tag'>
                        <h1>{titleText}</h1>
                    </div>

                    <div id='descrip-text'>
                        <p>{descripText}</p>
                    </div>

                    <div id='switch-btn'>
                        <button onClick = {(e) => {onClickHandler(e)}}> {btnText} </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
export default Switcheroo;