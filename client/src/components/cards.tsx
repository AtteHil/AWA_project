
import React, {useState, useEffect} from 'react';

const loadfrontPage = () => { //function to load cards of the users to like or dislike them
    const [result, setResult] = useState<null | string>(null);
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
    
                    const data: { message: string } = await response.json();
                    setResult(data.message);
                } catch (error) {
                    console.error('Error fetching own profile:', error);
                }
            };
    
            fetchData();
        }
    }, []);

    return (
    <div>
        <p>{result}</p>
    </div>)
}

export default loadfrontPage