import React from "react";
import {clientCredentials} from "../credentials";
import { SearchBar } from "./SearchBar";
import { GetToken } from "./Token";

export const Dashboard = ({code}) => {
    const accessToken = clientCredentials(code);    // this access token allows us to do things with spotify api

    // return <SearchBar aToken={accessToken} />

    <GetToken aToken={accessToken} />
}

// export default Dashboard