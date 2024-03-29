import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card'
import "../css/cards.css"
import { useTranslation } from 'react-i18next';
import { matchMessages } from './Messages';

interface UserData {
    username: string;
    information: string;
    registerationdate: string;
    _id: string
}

const loadfrontPage = () => { //function to load cards of the users to like or dislike them
    const [result, setResult] = useState<null | UserData[]>(null);
    const [currentShown, setCurrentShown] = useState<number>(0);
    const { t, i18n } = useTranslation();

    const fetchData = async (): Promise<void> => {
        try {
            const response: Response = await fetch("http://localhost:3000/fetchUsers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("auth_token")}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.status == 200) {
                const data: UserData[] = await response.json();
                setResult(data);

            }

        } catch (error) {
            console.error('Error fetching own profile:', error);
        }
    };
    useEffect(() => { // on page load get token and fetch data if there is no token => user is not logged in and redirect to login page
        const token: String | null = localStorage.getItem("auth_token");
        if (token) {


            fetchData();
        } else {
            window.location.replace("/login")
        }
    }, []);
    const Like = async () => { // like function called by button or swipe to right
        if (result) {
            try {
                const response: Response = await fetch("http://localhost:3000/updateLiked", { // send liked user to backend to be added on the liked 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem("auth_token")}`
                    },
                    body: JSON.stringify({ _id: result[currentShown] }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (response.status == 200) {
                    const result = await response.json()
                    if (result.message == "Match") {
                        // if backend returns Match we got match and both users have liked each other
                        const currentLanguage: string = i18n.language // current language is got 
                        alert(matchMessages[currentLanguage]); // present correct language in the alert
                    }
                }

            } catch (error) {
                console.error('Error fetching own profile:', error);
            }
            increaseCounter()
        }

    }
    const Dislike = () => {
        increaseCounter()
    }

    const increaseCounter = () => {
        if (result) {
            setCurrentShown((prevShown) => (prevShown + 1 < (result ? result.length + 1 : 0) ? prevShown + 1 : prevShown)) // set state to show next user 
        }
    }

    const swiped = (direction: string, user: UserData) => { //swipe function to like or dislike depending the direction it is getting
        if (direction === 'right') {
            console.log(user.username)
            Like()
        } else if (direction === 'left') {
            console.log('You disliked ' + user.username)
            increaseCounter()
        }
    }
    return (
        <div>
            {result && result.length > 0 && currentShown < result.length && ( // if there is users to match with we return the page to dislike and like
                <div className='cardAndButtons'>
                    <div className='swipableCard'>
                        <TinderCard key={currentShown} onSwipe={(direction) => { swiped(direction, result[currentShown]) }} preventSwipe={['up', 'down']}><div className='TinderCard'><h3 >{result[currentShown].username}</h3><br /><p id='bio'> Bio: {result[currentShown].information}</p><br /><p> {t('Member since')}: {result[currentShown].registerationdate}</p></div></TinderCard>

                    </div>
                    <div className='ButtonsDiv'>
                        <button className='Buttons' onClick={Dislike}>{t('Dislike')}</button>
                        <button className='Buttons' onClick={Like}>{t('Like')}</button>

                    </div>
                </div>
            )}
            {result && result.length === 0 && <p id='infoText'>{t('No users to display')}.</p>}

            {result && result.length > 0 && currentShown == result.length && (
                <p id='infoText' >{t('You have seen all available users, If you want to see more paypall me some money :)')}</p>
            )}

        </div>
    )
}

export default loadfrontPage