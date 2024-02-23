import { useEffect, useRef, useState } from "react";
import { MessageBox, MessageList } from 'react-chat-elements';
import "react-chat-elements/dist/main.css"
import "../css/chat.css"
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
interface Message {
    userId: string;
    message: string;
    date: Date;
}
interface ChatLog {
    _id: string;
    userOne: string;
    userNameOne: string;
    userTwo: string;
    userNameTwo: string;
}
const loadChats = () => {

    const [chatLogs, setChatLogs] = useState<any>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const [chatID, setChatID] = useState<string>('');
    const [currentIndex, setIndex] = useState<number>(0);
    const [user, setUser] = useState<string>('');
    const [own, setOwn] = useState<string>('');
    const messageRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => { // fetch chats on the page load
        fetchChat();
    }, []);
    const { t, i18n } = useTranslation();
    useEffect(() => { scrollToBottom }, [messages]) // useeffect calls chat scroll function if new message is sent
    useEffect(() => {

        if (chatLogs.length != 0) {
            setChatID(chatLogs.chatLogs[currentIndex]._id);

            const messagesArray = chatLogs.chatLogs[currentIndex].chatLog.map((messageObj: Message) => ({ // make messages from data fecthed
                position: messageObj.userId === chatLogs.userID ? 'right' : 'left',
                type: 'text',
                text: messageObj.message,
                date: messageObj.date,
            }));
            if (chatLogs.chatLogs[currentIndex].userOne == chatLogs.userID) {
                setUser(chatLogs.chatLogs[currentIndex].userNameTwo)
            } else {
                setUser(chatLogs.chatLogs[currentIndex].userNameOne)
            }
            setMessages(messagesArray);
        }
    }, [currentIndex])



    const scrollToBottom = () => { // scrolls to bottom of the chat when messages get's new message 
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };


    const fetchChat = async () => { // fetches chatLogs of logged in user
        const token = localStorage.getItem("auth_token");
        if (token) {
            try {
                const response = await fetch("http://localhost:3000/ChatLogs", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.status == 401) {
                    alert("Session expired! Please log in again")
                    window.location.replace("/login")
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                if (response.status === 200) {
                    const data = await response.json();

                    if (data.chatLogs.length != 0) {
                        setChatID(data.chatLogs[currentIndex]._id);


                        setChatLogs(data);
                        const messagesArray = data.chatLogs[currentIndex].chatLog.map((messageObj: Message) => ({
                            position: messageObj.userId === data.userID ? 'right' : 'left',
                            type: 'text',
                            text: messageObj.message,
                            date: messageObj.date,
                        }));
                        if (data.chatLogs[currentIndex].userOne === data.userID) {
                            setUser(data.chatLogs[currentIndex].userNameTwo);
                            setOwn(data.chatLogs[currentIndex].userOne)
                        } else {
                            setUser(data.chatLogs[currentIndex].userNameOne);
                            setOwn(data.chatLogs[currentIndex].userTwo)
                        }
                        setMessages(messagesArray);

                    }
                }


            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        }
    };
    const getChatLogs = async () => { // simple function to fetch chatLogs
        fetchChat();

    };
    const makeChatButtons = (chatLogs: any) => { //make buttons for each chat to open the selected chat

        return chatLogs.map((chatLog: any, index: number) => {

            let otherUserName
            if (chatLog.userOne === own) {
                otherUserName = chatLog.userNameTwo
            } else if (chatLog.userTwo === own) {
                otherUserName = chatLog.userNameOne
            }

            return (

                <button key={index} onClick={() => { setIndex(index); }}>
                    {otherUserName}
                </button>
            );
        });
    };
    const sendMessage = async () => { // send new message to server and to store in db
        const token: String | null = localStorage.getItem("auth_token");

        try {

            if (!chatID || !message) {
                throw new Error("Invalid chatID or message");
            }
            const response: Response = await fetch("http://localhost:3000/message", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chatID, message }), //as body send which chat are we trying to send the message to and then message itself
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.status == 401) {
                alert("Session expired! Please log in again")
                window.location.replace("/login")
            }
            if (response.status == 200) {

                const newMessage = {
                    position: 'right',
                    type: 'text',

                    text: message,
                    date: new Date(),
                };
                setMessages(prevMessages => [...prevMessages, newMessage]); // update messages to include new send message
                setMessage(''); // set messagebox where user writes to empty


            }

        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    return (
        chatLogs && chatLogs.length != 0 ? (
            <div className="ChatDiv">
                <div className="buttons">{makeChatButtons(chatLogs.chatLogs)}
                </div>


                <div className="chats">


                    <h1 id="ChatTitle">{user}</h1>
                    <MessageList
                        referance={messageRef}
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={messages}

                    />
                    <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button id="sendMessage" onClick={sendMessage}>{t('Send')}</button>
                    <button className="Refresh" onClick={getChatLogs}>{t('Refresh')}</button>
                </div>

            </div>
        ) : null)
}
export default loadChats