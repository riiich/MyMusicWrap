import React from "react";
import { useState, useEffect } from "react";
import {clientCredentials} from "../credentials";


export const Dashboard = ({code}) => {
    const accessToken = clientCredentials(code);    // this access token allows us to do things with spotify api

    // grab user's playlist and get the top listened songs

    // 

}