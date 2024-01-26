
import { Button } from '@mui/material';
import React, {useState, useEffect} from 'react';

interface UserData {
    username: string;
    information: string;
    registerationDate: string;
    _id:string
}

const loadfrontPage = () => { //function to load cards of the users to like or dislike them
    const [result, setResult] = useState<null | UserData[]>(null);
    const [currentShown, setCurrentShown] = useState<number>(0);
    useEffect(()=>{
        const token: String |null = localStorage.getItem("auth_token");
        if (token) {
            const fetchData = async (): Promise<void> => {
                try {
                    const response: Response = await fetch("http://localhost:3000/fetchUsers", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    if(response.status == 200){
                        const data: UserData[] = await response.json();
                        setResult(data);
                    }
                    
                } catch (error) {
                    console.error('Error fetching own profile:', error);
                }
            };
    
            fetchData();
        } 
    }, []);
    const Like =async  () =>{
        if(result){
            try {
                const token: String |null = localStorage.getItem("auth_token");

                const response: Response = await fetch("http://localhost:3000/updateLiked", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ _id:result[currentShown]}),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if(response.status == 200){
                    const result = await response.json()
                    console.log("user added to liked")
                    if(result.message == "Match"){
                        alert("YOU GOT MATCH!");
                    }
                }
                
            } catch (error) {
                console.error('Error fetching own profile:', error);
            }
            setCurrentShown((prevShown)=>(prevShown+1 < (result ? result.length+1 : 0) ? prevShown + 1 : prevShown)) //set state to show next user
        }
        
    }
    const Dislike = () =>{
        if(result){
            setCurrentShown((prevShown)=>(prevShown+1 < (result ? result.length+1 : 0) ? prevShown + 1 : prevShown)) // set state to show next user 
        }
    }
    return (
    <div>
        {result && result.length > 0 && currentShown<result.length && ( // if there is users to match with we return the page to dislike and like
        <>
          <p>User: {result[currentShown].username }, Bio: {result[currentShown].information}, Member since: {result[currentShown].registerationDate}</p>
          <Button onClick={Like}>Like</Button>
          <Button onClick={Dislike}>Dislike</Button>
        </>
        )}
        {result && result.length === 0 && <p>No users to display.</p>}

        {result && result.length > 0 && currentShown== result.length && (
        <p>You have seen all available users.</p>
        )}
    
    </div>
)}

export default loadfrontPage