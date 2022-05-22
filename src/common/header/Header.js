import React from "react";
import './Header.css';
import { Button } from '@material-ui/core';

const Header = (props) => {
    let buttonName = "";

    const logoutHandler = () => {
        console.log('logout pressed');
    }

    const loginHandler = () => {
        console.log("login pressed");
    }

    return (
        <div className="header">
            <div className="leftSide">
                <div className="logo"> <img src="../assets/logo.svg" alt="Why" /> </div>
            </div>
            <div className="rightSide">
                <Button onClick={() => logoutHandler()} name={"login"} variant="contained"> LOGIN </Button>
            </div>
        </div>
    )
};

export default Header;