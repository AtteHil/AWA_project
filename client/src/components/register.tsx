import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import { format } from 'date-fns';
import "../css/Register.css"
import { useTranslation } from 'react-i18next';
const registerform = () => {
  const [email, setEmail] = useState<String>('');// usestates to save credentials and information
  const [password, setPassword] = useState<String>('');
  const [information, setInformation] = useState<String>('');
  const [registrationdate, setRegistrationdate] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { t, i18n } = useTranslation();
  useEffect(() => { // function to get the day user is on the site to use as registration date
    const current: string = format(new Date(), "yyyy-MM-dd");
    setRegistrationdate(current);
  }, []);
  const registerFunction = async () => { // function to register new user
    if (email == "" && password == "" && information == "" && registrationdate == "" && username == "") {
      alert("you have to fill every field");
    } else {


      try {
        const response = await fetch("http://localhost:3000/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password, information, registrationdate }),
        });

        if (response.ok) {
          console.log('Registration successful!');
          window.location.replace("/login")

        } else { //registration unsuccesfull more detailed answer later
          console.error('Registration failed');

        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  }

  return (
    <div className='Form'>
      <label htmlFor="email">{t('Email')}: </label>
      <input type="text" id='email' placeholder='Email' autoComplete='off' onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label htmlFor="Username">{t('Username')}: </label>
      <input type="text" id='Username' placeholder='Username' autoComplete='off' onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label htmlFor="password">{t('Password')}: </label>
      <input type="text" id="password" placeholder='password' autoComplete='off' onChange={(e) => setPassword(e.target.value)} />
      <br />
      <label htmlFor="information"> {t('Tell about yourself')}</label>
      <br />

      <textarea id="information" className="flexibleTextarea" cols={30} rows={5} onChange={(e) => setInformation(e.target.value)}></textarea>

      <br />
      <button id="submitLogin" onClick={registerFunction}>{t('Register')}</button>
      <br />
      <p>{t('Already have an account?')} <Link to="/login"> {t('Login here')}</Link></p>


    </div>)
}

export default registerform