import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';

const loginform = () => {
    const [email, setEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    
    const loginFunction = async () => {// logging in to existing user
        interface Data{ // interface for the return data of the fetch
            message?: string 
            token?: string
        }
        console.log(email, password)
        console.log(email|| password === "")
        if(email =="" &&password == "" ){
            alert("you have to fill every field");
        }else {
        
            try {
                const response = await fetch("http://localhost:3000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password}),
                });
                if(response.status==403){ // incorrect credentials: password | email
                    const missing: JSON = await response.json()
                    console.log(missing)    
                    
                }
                if (response.ok) {
                    console.log('Login successful!');
                            
                }
                if(response.status == 200){ // succesfull logging ing to user
                    const data: Data = await response.json()
                    console.log(data);
                    if(data.token){
                        window.localStorage.setItem("auth_token",data.token) // store token to localstorage of the browser
                    }
                    window.location.replace("/");// redirect to mainpage
                }

                
            } catch (error) {
                console.error('Error during login:', error);
            }
      }
    }
    

    return (
    <div>
        <label htmlFor="username">Email: </label>
        <input type="text" id='username' placeholder='Email' autoComplete='off' onChange={(e)=>setEmail(e.target.value)}/>
        <br />
        <label htmlFor="password">Password: </label>
        <input type="text" id="password" placeholder='password' autoComplete='off' onChange={(e)=>setPassword(e.target.value)}/>
        <br />
        <button id="submitLogin" onClick={loginFunction}>Login</button>
        <br />
        <p>Are you new here? <Link to="/register"> Sign up here</Link></p>
        
        
    </div>)
}

export default loginform