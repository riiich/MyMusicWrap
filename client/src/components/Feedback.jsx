import { useState } from 'react';
import axios from 'axios';


export const Feedback = () => {
    return (
        <div className="user-feedback">
            <h1>Feedback Page</h1>
            <textarea name="feedback" id="" cols="30" rows="10">
                
            </textarea>
        </div>
    );
};  