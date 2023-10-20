import React from "react";
import clientCredentials from "../credentials";

const Dashboard = ({code}) => {
    const accessToken = clientCredentials(code);

    return <div>{code}</div>
}

export default Dashboard