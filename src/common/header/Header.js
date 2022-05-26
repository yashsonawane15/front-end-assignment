import React from "react";
import './Header.css';
import logo from '../../assets/logo.svg';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';


const Header = (props) => {

    {/* CSS for the auth tabs */ }
    const requiredCss = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    { /* STATE VARIABLES */ } 
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token") == null ? false : true);
    const [username, setUsername] = useState("");
    const [usernameRequired, setUsernameRequired] = useState("dispNone");
    const [loginPassword, setloginPassword] = useState("");
    const [loginPasswordRequired, setLoginPasswordRequired] = useState("dispNone");
    const [authTabOpen, setAuthTabOpen] = useState(false);
    const [authTab, setAuthTab] = useState("login");
    const [bookingRequested, setBookingRequested] = useState(false);
    const [firstnameRequired, setFirstnameRequired] = useState("dispNone");
    const [firstname, setFirstname] = useState("");
    const [lastnameRequired, setLastnameRequired] = useState("dispNone");
    const [lastname, setLastname] = useState("");
    const [emailRequired, setEmailRequired] = useState("dispNone");
    const [email, setEmail] = useState("");
    const [registerPasswordRequired, setRegisterPasswordRequired] = useState("dispNone");
    const [registerPassword, setRegisterPassword] = useState("");
    const [contactRequired, setContactRequired] = useState("dispNone");
    const [contact, setContact] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    { /* STATE MANIPULATION FUNCTIONS */ }

    { /*Render the auth modal on screen */}
    const openAuthTab = () => {
        setAuthTabOpen(true);
    }

    const closeAuthTab = () => {
        setAuthTab(false);
    }
    {/* Change the tab in the auth modal */}
    const tabChangeHandler = (event, newTab) => {
        setAuthTab(newTab);
    }

    
    const TabContainer = function (props) {
        return (
            <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
                {props.children}
            </Typography>
        )
    }

    const logoutHandler = (e) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("access-token"),
        }
        axios.post(props.baseUrl + "auth/logout", {}, {
            headers
        }).then(res => {

            sessionStorage.removeItem("uuid");
            sessionStorage.removeItem("access-token");
            setLoggedIn(false);
        });
    }

    const guestBookShowHandler = (e) => {
        openAuthTab();
        setBookingRequested(true);
    }

    const inputUsernameChangeHandler = (e) => {
        setUsername(e.target.value);
    }

    const inputLoginPasswordChangeHandler = (e) => {
        setloginPassword(e.target.value)
    }

    {/* Handles login with backend */}
    const loginClickHandler = () => {

        if(username === "") {
             setUsernameRequired("dispBlock")
        } else { 
                 setUsernameRequired("dispNone");
        }

        if(loginPassword === "") {
            setLoginPasswordRequired("dispBlock")
        } else {
            setLoginPasswordRequired("dispNone");
        }

        if (username && loginPassword) {

            const headers = {
                "Authorization": `Basic ${window.btoa(username + ":" + loginPassword)}`,
                'Content-Type': 'application/json',
            }

            axios.post(props.baseUrl + "auth/login", {}, {
                headers
            }).then( (response) => {
                sessionStorage.setItem("uuid", response.data.id);
                sessionStorage.setItem("access-token", response.headers['access-token']);

                setLoggedIn(true)

                setTimeout(() => {
                    closeAuthTab();
                }, 2000);

                if (bookingRequested) {
                    window.history.push('/bookshow/' + props.id);
                    setBookingRequested(false);
                }
            }).catch(
                function (error) {
                    if (error.response) {
                        let message = error.response.data.message;
                        if (message === 'Password match failed' ||
                            message === 'Username does not exist' ||
                            message === 'User account is LOCKED') {
                            alert(error.response.data.message);
                        } else {
                            console.log(error.message);
                        }

                    } else {
                        alert('Error', error.message);
                    }
                }
            );
        } else {
            alert('Please enter valid credentials');
        }

    }

    { /* Handles signup with db */}
    const registerClickHandler = () => {
        firstname === "" ? setFirstnameRequired("dispBlock") : setFirstnameRequired("dispNone");
        lastname === "" ? setLastnameRequired("dispBlock") : setLastnameRequired("dispNone");
        email === "" ? setEmailRequired("dispBlock") : setEmailRequired("dispNone");
        registerPassword === "" ? setRegisterPasswordRequired("dispBlock") : setRegisterPasswordRequired("dispNone");
        contact === "" ? setContactRequired("dispBlock") : setContactRequired("dispNone");

        if (firstname && lastname && email && registerPassword && contact) {
            let dataSignup = {
                "email_address": email,
                "first_name": firstname,
                "last_name": lastname,
                "mobile_number": contact,
                "password": registerPassword
            };

            axios.post(props.baseUrl + "signup", dataSignup).then(res => {
                setRegistrationSuccess(true);

                setTimeout(() => {
                    setAuthTab("login");
                    setFirstname('');
                    setLastname('');
                    setEmail('');
                    setContact('');
                    setRegisterPassword('');
                    setRegistrationSuccess(false);
                }, 2000);
            });
        } else {
            alert('Please fill all mandatory fields');
            setRegistrationSuccess(false);
        }
    }

    const inputFirstNameChangeHandler = (e) => {
        setFirstname(e.target.value);
    }

    const inputLastNameChangeHandler = (e) => {
        setLastname(e.target.value);
    }

    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value)
    }

    const inputRegisterPasswordChangeHandler = (e) => {
        setRegisterPassword(e.target.value);
    }

    const inputContactChangeHandler = (e) => {
        setContact(e.target.value)
    }


    { /* CONDITIONAL COMPONENTS */ }
    const loginButton = <div className="authButton">
                            <Button variant="contained" color="default" onClick={openAuthTab}>
                                Login
                            </Button>
                        </div>;

    const logoutButton = <div className="authButton">
                            <Button variant="contained" color="default" onClick={logoutHandler}>
                                Logout
                            </Button>
                        </div>;
    
    

    const loggedInBookShow =     <div className="bookshow-button">
                                        <Link to={"/bookshow/" + props.id}>
                                            <Button variant="contained" color="primary">
                                                Book Show
                                            </Button>
                                        </Link>
                                    </div>;

    const notLoggedInBookShow = <div className="bookShowButton">
                                    <Button variant="contained" color="primary" onClick={guestBookShowHandler}>
                                        Book Show
                                    </Button>
                                </div>;

    const loginTab = <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" username={username} onChange={inputUsernameChangeHandler} />
                            <FormHelperText className={usernameRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" type="password" loginpassword={loginPassword} onChange={inputLoginPasswordChangeHandler} />
                            <FormHelperText className={loginPasswordRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {loggedIn === true &&
                            <FormControl>
                                <span className="successText">
                                    Login Successful!
                                </span>
                            </FormControl>
                        }
                        <br />
                        <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                    </TabContainer>;

    const signupTab = <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" firstname={firstname} onChange={inputFirstNameChangeHandler} />
                            <FormHelperText className={firstnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" lastname={lastname} onChange={inputLastNameChangeHandler} />
                            <FormHelperText className={lastnameRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" email={email} onChange={inputEmailChangeHandler} />
                            <FormHelperText className={emailRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" type="password" registerpassword={registerPassword} onChange={inputRegisterPasswordChangeHandler} />
                            <FormHelperText className={registerPasswordRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="tel" contact={contact} onChange={inputContactChangeHandler} />
                            <FormHelperText className={contactRequired}>
                                <span className="warning">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {registrationSuccess === true &&
                            <FormControl>
                                <span className="successText">
                                    Registration Successful. Please Login!
                                </span>
                            </FormControl>
                        }
                        <br />
                        <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                    </TabContainer>;


    

    

    { /* Component */ }
    return (
        <div className="headerComponent">
            <div className="header">
                <img src={logo} className="logo" alt="upGrad project logo" />

                { /* CONDITIONAL BUTTONS RENDERING */ }

                {/*Login/Logout*/}
                { !loggedIn? loginButton : logoutButton }

                { /*Book show button */ }
                { loggedIn && props.bookShow === "true" ? loggedInBookShow : "" }
                { !loggedIn && props.bookShow === "true" ? notLoggedInBookShow : ""}

            </div>

            { /* AUTH MODAL */}
            <Modal
                ariaHideApp={false}
                isOpen={authTabOpen}
                contentLabel="Login"
                onRequestClose={closeAuthTab}
                style={requiredCss}
            >
                <Tabs className="tabs" value={authTab} onChange={tabChangeHandler}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                { authTab === "login" && loginTab }
                { authTab === "signup" && signupTab }

            </Modal>
        </div>
    )
};

export default Header;