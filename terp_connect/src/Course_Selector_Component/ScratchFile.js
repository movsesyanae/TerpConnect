import React from 'react';


const ScratchFile = () => {
    const try_reading = () => {
        // const section = document.querySelector('./classes.json');
        var json = require('./classes.json'); //(with path)
        var returnArray = ['Damn Shadi'];
        const course_id = 'CMSC352';
        if(json.hasOwnProperty(course_id)){
            returnArray = json[course_id]
        }


        return(<div> {returnArray}</div>);
    }
    return (
        <div>
            {try_reading()}
        </div>
    );
}

export default ScratchFile