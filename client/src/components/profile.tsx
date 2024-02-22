import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import "../css/Profile.css"

const registerform = () => {
  const [isEditing, setisEditing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');// usestates to save credentials and information
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [information, setInformation] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const token: String | null = localStorage.getItem("auth_token");
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (token) {
      const fetchUser = async (): Promise<void> => {
        try {
          const response = await fetch("http://localhost:3000/profile", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },

          });
          if (response.status === 401) {
            window.localStorage.removeItem("auth_token");
            window.location.replace("/login");
          }
          if (response.ok) {
            const data = await response.json()

            setEmail(data.user.email);
            setInformation(data.user.information);
            setUsername(data.user.username);


          } else { //update unsuccesfull more detailed answer later
            console.error('profile fetch failed');

          }
        } catch (error) {
          console.error('Error during getting profile:', error);
        }
      }
      fetchUser();
    } else {
      window.location.replace("/login")
    }
  }, [])

  const UpdateUser = async () => { // function to update new user
    if (email === "" || password === "" || information === "" || username === "") {
      alert("You have to fill every field");
    } else {


      try {
        const updateBody = newPassword ? ({ email, username, password, newPassword, information }) : ({ email, username, password, information })
        const response = await fetch("http://localhost:3000/updateUser", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateBody),
        });

        if (response.ok) {
          alert("User updated. Please login again");
          window.localStorage.removeItem("auth_token");
          window.location.replace('/login');



        } else { //update unsuccesfull more detailed answer later
          console.error('updating user failed');

        }
      } catch (error) {
        console.error('Error during updating:', error);
      }
    }
  }

  return (
    <div className='editDiv'>
      <label htmlFor="email">{t('Email')}: </label>
      {isEditing ? (<input type="text" id='email' placeholder='Email' value={email} autoComplete='off' onChange={(e) => setEmail(e.target.value)} />) : (<p style={{ display: 'inline' }}>{email}</p>)}
      <br />
      <label htmlFor="Username">{t('Username')}: </label>
      {isEditing ? (<input type="text" id='Username' placeholder='Username' value={username} autoComplete='off' onChange={(e) => setUsername(e.target.value)} />) : (<p style={{ display: 'inline' }}>{username}</p>)}
      <br />
      <label htmlFor="password">{t('Password')}: </label>
      {isEditing ? (<input type="text" id="password" placeholder='old password' autoComplete='off' onChange={(e) => setPassword(e.target.value)} />) : (<p style={{ display: 'inline' }}>***</p>)}

      <br />
      {isEditing ? (<div><label htmlFor="password">{t('New Password *Optional')}: </label><input type="text" id="newPassword" placeholder='new password' autoComplete='off' onChange={(e) => setNewPassword(e.target.value)} /></div>) : null}
      <label htmlFor="information"> Bio: </label>

      {isEditing ? (<div style={{ display: 'inline' }}>
        <br />
        <textarea id="information" cols={30} rows={10} value={information} onChange={(e) => setInformation(e.target.value)}></textarea>
      </div>) : (<p style={{ display: 'inline' }}>{information}</p>)}

      <br />
      {isEditing ? (<button id="submitLogin" onClick={() => { UpdateUser() }}>{t('Save')}</button>) : (<button id="submitLogin" onClick={() => { setisEditing(true) }}>{t('Edit')}</button>)}

      <br />



    </div>)
}

export default registerform