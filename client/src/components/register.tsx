import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import { format } from 'date-fns';
import "../css/Register.css"
import { useTranslation } from 'react-i18next';

// password requirements show on hover help looked from this site:
//https://plainenglish.io/blog/how-to-handle-mouse-hover-events-in-react


const registerform = () => {
  const [email, setEmail] = useState<String>('');// usestates to save credentials and information
  const [password, setPassword] = useState<String>('');
  const [information, setInformation] = useState<String>('');
  const [registrationdate, setRegistrationdate] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showRequirements, setShowRequirements] = useState(false);

  const toggleRequirements = () => {
    setShowRequirements(!showRequirements);
  };
  const { t, i18n } = useTranslation();
  const successMessages: { [key: string]: string } = {
    en: "Profile created. Log in to proceed",
    fi: "Käyttäjä luotu. jatka kirjautumalla sisään."
  }
  const errorMessages: { [key: string]: string } = {
    en: "Error while creating profile. Check your credentials",
    fi: "Käyttäjän luonti ei onnistunut. Tarkista antamasi tiedot"
  }
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
          const currentLanguage = i18n.language
          alert(successMessages[currentLanguage])
          window.location.replace("/login")

        } else { //registration unsuccesfull 
          const currentLanguage = i18n.language
          alert(errorMessages[currentLanguage])
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
      <input type="text" id="password" placeholder='password' autoComplete='off' onMouseEnter={toggleRequirements}
        onMouseLeave={toggleRequirements} onChange={(e) => setPassword(e.target.value)} />
      {showRequirements && (
        <div className='requirements'>
          <p>{t('Password requirements:')}</p>
          <ul>
            <li>{t('At least 8 characters')}</li>
            <li>{t('At least one uppercase letter')}</li>
            <li>{t('At least one lowercase letter')}</li>
            <li>{t('At least one number')}</li>
          </ul>
        </div>
      )}
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