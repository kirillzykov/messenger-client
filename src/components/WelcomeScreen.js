import React from 'react';
import { Link } from "react-router-dom";

const WelcomeScreen = () =>
    <div className="welcomeScreen">
        <Link className="welcomeScreen-link" to={`/login`}>Login</Link>
        <Link className="welcomeScreen-link" to={`/register`}>Signup</Link>
    </div>

WelcomeScreen.displayName = 'WelcomeScreen'

export default WelcomeScreen;