import React from "react";
import {clientCredentials} from "../credentials";

export const Dashboard = ({code}) => {
    const accessToken = clientCredentials(code);
    console.log(accessToken);

    // return <div>{code}</div>
}

// export default Dashboard