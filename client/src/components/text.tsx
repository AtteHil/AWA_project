import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import React, {useState, useEffect} from 'react';

const loadfrontPage = () => { // test file for background to use on different cases 
    const [result, setResult] = useState<string|JSX.Element>("");
    useEffect(()=>{
        const token: String |null = localStorage.getItem("auth_token");
        if (token) {
            const fetchData = async (): Promise<void> => {
                try {
                    const response: Response = await fetch("http://localhost:3000/Profile", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if(response.status == 401){
                        localStorage.removeItem("auth_token")
                        window.location.reload()
                        setResult("Hello pleaso log in or register to use the site")
                        }
                    if(response.status == 200){
                        setResult(
                            <>
                              Hello welcome back to using the app. {' '}
                              <Link to="/about">Start swiping in this page</Link>
                            </>
                          );
                    }
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
    
                    
                } catch (error) {
                    console.error('Error fetching own profile:', error);
                }
            };
            
            fetchData();
        }else {
            setResult("Hello pleaso log in or register to use the site")
        }
    }, []);

    return (
    <div>
        <p>{result}</p>
    </div>)
}

export default loadfrontPage