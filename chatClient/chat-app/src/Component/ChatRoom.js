// src/ChatApp.js
import React, { useState, useEffect } from 'react';
import { connect, sendPublicMessage, sendPrivateMessage } from '../services/WebSocket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import Layout from './Layout';
const ChatApp = () => {
    const location = useLocation();
    const [publicMessages, setPublicMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [privateRecipient, setPrivateRecipient] = useState('');
    const [UserDetail, SetUserDetail] = useState([]);
    const [id, setId] = useState();
    const [previousChat, setPreviousChat] = useState([]);
    const [msgSend, setMsgSend] = useState(false);
    const CurrentUser = location.state;
    const navigate = useNavigate();


    console.log("Data:" + CurrentUser);

    useEffect(() => {
        const fetchDataAndConnect = async () => {

            const response = await axios.get("http://localhost:8081/api/getData");
            console.log("userData:" + response.data);
            SetUserDetail(response.data);
            const user = response.data.filter(user => user.user_name === CurrentUser)[0];
            setId(user.user_id);
            const logInResponse = await axios.put(`http://localhost:8081/api/userLogInStatus/${user.user_id}`);
            console.log(logInResponse);

            const PreviousMsg = await axios.get(`http://localhost:8081/api/getChatHistory/${CurrentUser}`);
            console.log(PreviousMsg.data);
            setPreviousChat(PreviousMsg.data);



            // axios.get(`http://localhost:8081/api/messages/${CurrentUser}`)
            //     .then(response => {
            //         response.data.forEach((msg) => {
            //             setPrivateMessages((prev) => [...prev, msg])
            //         });
            //     })
            //     .catch(error => console.error('Error fetching Previous messages:', error));



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
    }, [CurrentUser]);

    const handleLogout = async () => {
        if (id) {
            const logoutResponse = await axios.put(`http://localhost:8081/api/userLogOutStatus/${id}`);
            console.log(logoutResponse);
            navigate('/');
        }

    }

    const handlePublicMessageSend = () => {
        sendPublicMessage({ senderName: CurrentUser, message });
        setMessage('');
    };

    const handlePrivateMessageSend = () => {
        const newMessage = {
            senderName: CurrentUser,
            receiverName: privateRecipient,
            message,
        };

        // Send the private message
        sendPrivateMessage(newMessage);

        // Update previousChat to include the new message
        // setPreviousChat((prevChat) => [...prevChat, newMessage]);


        setPrivateMessages((prev) => [...prev, newMessage]); //To append our currenly sent message to the list


        // Clear the message input
        setMessage('');

    };
    const getMessage = async () => {
        const messageResponse = await axios.post(`http://localhost:8081/api/user-connected/${CurrentUser}`); //TO get the offline messages
        console.log("New messages" + messageResponse.data);
        if (messageResponse.data) {
            // Assuming the data is in the expected format
            messageResponse.data.forEach((msg) => {
                setPrivateMessages((prev) => [...prev, msg]);
            });
        }
    }
    return (
        <div className='mainCont'>
            <Layout>
                <h1>Chat App</h1>
                <div>
                    <h2>{CurrentUser}</h2>
                    <h2>Public Chat</h2>
                    <button onClick={handleLogout}>Logout</button>
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
                        {previousChat.map((msg, index) => (
                            <div key={index}>{`${msg.senderName} to ${msg.receiverName}: ${msg.message}`}</div>
                        ))}
                    </div>
                    {/* <div>{`${CurrentUser} to ${privateRecipient}: ${message}`}</div> */}
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
                    <div>  <button onClick={getMessage}>Get Message</button>
                    </div>
                </div>
            </Layout>
        </div>

    );
};

export default ChatApp;