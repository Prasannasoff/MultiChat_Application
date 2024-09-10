// src/ChatApp.js
import React, { useState, useEffect } from 'react';
import { connect, sendPublicMessage, sendPrivateMessage } from '../services/WebSocket';

const ChatApp = () => {
    const [publicMessages, setPublicMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [privateRecipient, setPrivateRecipient] = useState('');

    useEffect(() => {
        connect(
            (msg) => setPublicMessages((prev) => [...prev, msg]),
            (msg) => setPrivateMessages((prev) => [...prev, msg])
        );
    }, []);

    const handlePublicMessageSend = () => {
        sendPublicMessage({ senderName: 'User', message });
        setMessage('');
    };

    const handlePrivateMessageSend = () => {
        sendPrivateMessage({
            senderName: 'User',
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
                <input
                    type="text"
                    placeholder="Recipient"
                    value={privateRecipient}
                    onChange={(e) => setPrivateRecipient(e.target.value)}
                />
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
