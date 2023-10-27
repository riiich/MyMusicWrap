import axios from 'axios';
import { useState, useEffect } from 'react';

export const User = () => {
    const [user, setUser] = useState({});

    useEffect(() => {
        if(!sessionStorage.getItem("accessToken")) return;

        const getUserInfo =  (accessToken) => {
            axios
                .get('http://localhost:3001/user', {
                    params: {accessToken},
                })
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
        };

        getUserInfo(sessionStorage.getItem("accessToken"));

    }, [])

    return(
        <div>
            <h3>Hi <img src={user.image} alt="user pic" width={30} height={30} />{user.name}</h3>
        </div>
    );
};