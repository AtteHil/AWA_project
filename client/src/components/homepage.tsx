import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "../css/homepage.css"
interface UserData {
    username: string;
    id: string
}
const loadfrontPage = () => { // Front page welcome text rendering (and if token is old we remove it)
    const [result, setResult] = useState<string | JSX.Element>("");
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const token: String | null = localStorage.getItem("auth_token");
        if (token) {
            const fetchUser = async (): Promise<void> => {
                try {
                    const response: Response = await fetch("http://localhost:3000/Profile", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (response.status == 401) {
                        localStorage.removeItem("auth_token")
                        window.location.reload()
                        setResult(<>{t("Hello please log in or register to use the site")}</>)
                    }
                    if (response.status == 200) {
                        const user: UserData = await response.json();

                        setResult(
                            <>
                                {t('Welcome')} {user.username} {' '}
                                <Link to="/Swipe">{t('Start swiping in this page')}</Link>
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

            fetchUser();
        } else {
            setResult(<>{t("Hello please log in or register to use the site")}</>)
        }
    }, [t]); // check the state of translation and if it changes we load the page again


    return (

        <div className='welcomeText'>
            <p>{result}</p>
        </div>)
}

export default loadfrontPage