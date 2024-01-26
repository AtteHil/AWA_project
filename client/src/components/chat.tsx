import { useEffect, useRef, useState } from "react";
import { MessageBox, MessageList } from 'react-chat-elements';
import "react-chat-elements/dist/main.css"
import "../css/chat.css"
interface Message {
    userId: string;
    message: string;
    date: Date;
}
const loadChats = ()=> {
    
    const [chatLogs, setChatLogs] = useState([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage]= useState<string>('');
    const [chatID, setChatID] = useState<string>('');
    const [currentIndex, setIndex] = useState<number>(0);
    const [ownID, setownID] = useState<string>('');
    const messageRef = useRef<null | HTMLDivElement>(null); 
    useEffect(() => {
        
        const fetchData = async () => { // on page load fetch chat logs and display them in messageList from react-chat-elements
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

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    if (response.status === 200) {
                        const data = await response.json();
                        setChatID(data.chatLogs[0]._id);
                        setChatLogs(data.chatLogs);
                        const messagesArray = data.chatLogs[currentIndex].chatLog.map((messageObj:Message) => ({ // make messages from data fecthed
                            position: messageObj.userId === data.userID ? 'right' : 'left',
                            type: 'text',
                            text: messageObj.message,
                            date: messageObj.date,
                        }));
                        setMessages(messagesArray);
                        
                        
                    }

                } catch (error) {
                    console.error('Error fetching chats:', error);
                }
            }
        };

        fetchData();
    }, []);
    useEffect(()=> {scrollToBottom}, [messages])
    
    const scrollToBottom = () => { // scrolls to bottom of the chat when messages get's new message 
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block:'end'});
        }
      };

    
    const sendMessage=async ()=> { // send new message to server and to store in db
        const token: String |null = localStorage.getItem("auth_token");
        
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
                    body: JSON.stringify({ chatID, message}),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if(response.status == 200){
                    
                    const newMessage = {
                        position: 'right', 
                        type: 'text',
                        
                        text: message,
                        date: new Date(),
                    };
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    setMessage('');
                    
                    
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
            }
    }
    return(
        
        <div >
            <MessageList
                referance={messageRef}
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={messages}
                
            />
            <input type="text" placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
            <button id="sendMessage" onClick={sendMessage}>Send</button>
        </div>
    )
} 
export default loadChats