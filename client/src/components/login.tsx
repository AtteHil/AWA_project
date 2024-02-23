import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import "../css/Login.css"
import { useTranslation } from 'react-i18next';
import { loginEmailErrorMessages, loginPasswordErrorMessages } from './Messages';

const loginform = () => {
    const [email, setEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    const { t, i18n } = useTranslation();




    const loginFunction = async () => {// logging in to existing user
        interface Data { // interface for the return data of the fetch
            message?: string
            token?: string
        }
        console.log(email, password)
        console.log(email || password === "")
        if (email == "" && password == "") {
            alert("you have to fill every field");
        } else {

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                if (response.status == 403) { // incorrect credentials: password | email
                    const missing: Data = await response.json()
                    const currentLanguage: string = i18n.language

                    if (missing.message == "password") {
                        alert(loginPasswordErrorMessages[currentLanguage]);
                    }
                    else if (missing.message == "email") {
                        alert(loginEmailErrorMessages[currentLanguage]);
                    }

                }
                if (response.ok) {
                    console.log('Login successful!');

                }
                if (response.status == 200) { // succesfull logging in to user
                    const data: Data = await response.json()

                    if (data.token) {
                        window.localStorage.setItem("auth_token", data.token) // store token to localstorage of the browser for other pages to use it and user doesn't have to log in again
                    }
                    window.location.replace("/");// redirect to mainpage
                }


            } catch (error) {
                console.error('Error during login:', error);
            }
        }
    }


    return (
        <div className='Form'>
            <label htmlFor="username">{t('Email')}: </label>
            <input type="text" id='username' placeholder='Email' autoComplete='off' onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label htmlFor="password">{t('Password')}: </label>
            <input type="text" id="password" placeholder='password' autoComplete='off' onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button id="submitLogin" onClick={loginFunction}>{t('Login')}</button>
            <br />
            <p>{t('Are you new here?')} <Link to="/register"> {t('Sign up here')}</Link></p>


        </div>)
}

export default loginform