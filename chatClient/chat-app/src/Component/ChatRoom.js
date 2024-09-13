// src/ChatApp.js
import React, { useState, useEffect } from 'react';
import { connect, sendPublicMessage, sendPrivateMessage } from '../services/WebSocket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ChatApp = () => {
    const location = useLocation();
    const [publicMessages, setPublicMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [privateRecipient, setPrivateRecipient] = useState('');
    const [UserDetail, SetUserDetail] = useState([]);
    const CurrentUser = location.state;

    console.log("Data:" + CurrentUser);

    useEffect(() => {
        const fetchDataAndConnect = async () => {

            const response = await axios.get("http://localhost:8081/api/getData");
            console.log("Data:" + response.data);
            SetUserDetail(response.data);


            const webSocketConnection = connect(
                CurrentUser,
                (msg) => setPublicMessages((prev) => [...prev, msg]),
                (msg) => setPrivateMessages((prev) => [...prev, msg])
            );

            // Cleanup function to close WebSocket on component unmount
            return () => {
                if (webSocketConnection && typeof webSocketConnection.close === 'function') {
                    webSocketConnection.close();
                }
            };
        };

        fetchDataAndConnect();
    }, []);


    const handlePublicMessageSend = () => {
        sendPublicMessage({ senderName: CurrentUser, message });
        setMessage('');
    };

    const handlePrivateMessageSend = () => {
        sendPrivateMessage({
            senderName: CurrentUser,
            receiverName: privateRecipient,
            message,
        });
        setMessage('');
    };

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                <h2>Public Chat</h2>
                <div>
                    {publicMessages.map((msg, index) => (
                        <div key={index}>{`${msg.senderName}: ${msg.message}`}</div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handlePublicMessageSend}>Send Public Message</button>
            </div>

            <div>
                <h2>Private Chat</h2>
                <select
                    value={privateRecipient}
                    onChange={(e) => setPrivateRecipient(e.target.value)}
                >
                    <option value="">Select Recipient</option> {/* Default option */}
                    {UserDetail.map(user => (
                        <option key={user.id} value={user.user_name}>
                            {user.user_name}
                        </option>
                    ))}
                </select>

                <div>
                    {privateMessages.map((msg, index) => (
                        <div key={index}>{`${msg.senderName} to ${msg.receiverName}: ${msg.message}`}</div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handlePrivateMessageSend}>Send Private Message</button>

            </div>
        </div>
    );
};

export default ChatApp;
