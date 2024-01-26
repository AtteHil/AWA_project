import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import {format} from 'date-fns';

const registerform = () => {
    const [email, setEmail] = useState<String>('');// usestates to save credentials and information
    const [password, setPassword] = useState<String>('');
    const [information, setInformation] = useState<String>('');
    const [registerationdate, setRegisterationdate] = useState<string>('');
    const [username, setUsername]=useState<string>('');
    useEffect(() => { // function to get the day user is on the site
      const current: string = format(new Date(), "yyyy-MM-dd");
      setRegisterationdate(current);
    }, []); 
    const registerFunction = async () => { // function to register new user
      if(email== ""&& password== ""&&information== ""&&registerationdate== "" && username == "" ){
        alert("you have to fill every field");
      }else {
      
      
        try {
            const response = await fetch("http://localhost:3000/register", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, username, password, information, registerationdate }),
            });
      
            if (response.ok) {
              console.log('Registration successful!');
              
            } else { //registeration unsuccesfull more detailed answer later
              console.error('Registration failed');
              
            }
          } catch (error) {
            console.error('Error during registration:', error);
          }
    }
    }

    return (
    <div className='registerDiv'> 
        <label htmlFor="email">Email: </label>
        <input type="text" id='email' placeholder='Email' autoComplete='off' onChange={(e)=>setEmail(e.target.value)}/>
        <br />
        <label htmlFor="Username">Username: </label>
        <input type="text" id='Username' placeholder='Username' autoComplete='off' onChange={(e)=>setUsername(e.target.value)}/>
        <br />
        <label htmlFor="password">Password: </label>
        <input type="text" id="password" placeholder='password' autoComplete='off' onChange={(e)=>setPassword(e.target.value)}/>
        <br />
        <label htmlFor="information"> Tell about yourself</label>
        <br />
        <textarea id="information" cols={30} rows={10} onChange={(e)=>setInformation(e.target.value)}></textarea>
        <br />
        <button id="submitLogin" onClick={registerFunction}>Register</button>
        <br />
        <p>Already have an account? <Link to="/login"> Login here</Link></p>
        
        
    </div>)
}

export default registerform