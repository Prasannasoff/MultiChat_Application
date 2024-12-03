// src/ChatApp.js
import React, { useState, useEffect } from 'react';
import { connect, sendPublicMessage, sendPrivateMessage } from '../services/WebSocket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Layout from './Layout';
import style from '../styles/chatRoom.module.css'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navigation from './Navigation';
import { setCurrentUser, clearCurrentUser } from '../redux/store';
import api from '../services/api';
import { setUser, clearUser } from '../redux/store';
import { faArrowLeft } from 'react-icons/fa';

import chatbg from '../assets/chatbg.jpg';
const ChatApp = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [publicMessages, setPublicMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [privateRecipient, setPrivateRecipient] = useState('');
    const [UserDetail, SetUserDetail] = useState([]);
    const navigate = useNavigate();
    const [id, setId] = useState();
    const [previousChat, setPreviousChat] = useState([]);
    const [msgSend, setMsgSend] = useState(false);
    const [CurrentUser, setCurrentuser] = useState();
    const { email } = location.state;

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(`/getCurrentUser/${email}`);
                console.log("Fetching user with email: ", email);

                console.log("CurrentUserDetail ", response.data);
                setCurrentuser(response.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [email]);

    useEffect(() => {
        if (CurrentUser) {
            console.log("Dispatch ", CurrentUser.user_id);
            dispatch(setCurrentUser({ user: CurrentUser.user_name, id: CurrentUser.user_id }));
        }
    }, [dispatch, CurrentUser]);

    // const ContactName = useSelector(state => state.userName.user);
    const ContactDetails = useSelector(state => {
        // Check if `userName.user` is the group chat or a user object
        if (state.userName.user === "GroupChat") {
            return "GroupChat"; // If it's a group chat, return the group chat name
        } else if (state.userName.user && state.userName.user.user_name) {
            return state.userName.user; // Return the user_name if it exists
        } else {
            return null; // Return null if neither case is valid
        }
    });
    const ContactName = useSelector(state => {
        // Check if `userName.user` is the group chat or a user object
        if (state.userName.user === "GroupChat") {
            return "GroupChat"; // If it's a group chat, return the group chat name
        } else if (state.userName.user && state.userName.user.user_name) {
            return state.userName.user.user_name; // Return the user_name if it exists
        } else {
            return null; // Return null if neither case is valid
        }
    });


    useEffect(() => {
        const fetchDataAndConnect = async () => {
            if (CurrentUser) {
                const user_id = CurrentUser.user_id;
                const logInResponse = await api.put(`/userLogInStatus/${user_id}`);
                console.log(logInResponse);
                const webSocketConnection = connect(
                    CurrentUser.user_name,
                    (msg) => {
                        setPublicMessages((prevMessages) => {
                            // Log to ensure messages are updating correctly
                            console.log("Received public message: ", msg);
                            return [...prevMessages, msg];
                        });
                    },
                    (msg) => setPrivateMessages((prev) => [...prev, msg])
                );



                // Cleanup function to close WebSocket on component unmount
                return () => {
                    if (webSocketConnection && typeof webSocketConnection.close === 'function') {
                        webSocketConnection.close();
                    }
                };
            };
        }
        fetchDataAndConnect();
    }, [CurrentUser]);

    useEffect(() => {
        console.log("Public messages length: ", publicMessages.length);
    }, [publicMessages]);

    const handlePublicMessageSend = () => {
        sendPublicMessage({ senderName: CurrentUser.user_name, message });
        setMessage('');
    };

    const handlePrivateMessageSend = () => {
        const newMessage = {
            senderName: CurrentUser.user_name,
            receiverName: ContactName,
            message,
        };

        // Send the private message
        sendPrivateMessage(newMessage);

        setPrivateMessages((prev) => [...prev, newMessage]);


        // Clear the message input
        setMessage('');

    };
    const getMessage = async () => {
        const messageResponse = await api.post(`/api/user-connected/${CurrentUser.user_name}`); //TO get the offline messages
        console.log("New messages" + messageResponse.data);
        if (messageResponse.data) {
            // Assuming the data is in the expected format
            messageResponse.data.forEach((msg) => {
                setPrivateMessages((prev) => [...prev, msg]);
            });
        }
    }
    useEffect(() => {
        const fetchPreviousChatsForContact = async () => {
            if (CurrentUser) {
                const PreviousMsg = await api.get(`/getChatHistory/${CurrentUser.user_name}`);
                if (ContactName) {
                    setPreviousChat(PreviousMsg.data.filter(data => data.receiverName === ContactName || data.senderName === ContactName));
                }
            };
            setPrivateMessages(privateMessages.filter(data => data.receiverName === ContactName || data.senderName === ContactName));
        }

        fetchPreviousChatsForContact();
    }, [ContactName, CurrentUser]);

    const toggleBack = () => {

        dispatch(clearUser());


    }
    return (
        <div className={style.mainCont}>
            {ContactDetails ? <div className={style.offNavigation}><Navigation /></div> :
                <div className={style.onNavigation}><Navigation /></div>}
            <div className={`${style.chatCont} ${ContactDetails ? style.visible : ''}`} style={{ backgroundImage: `url(${chatbg})` }}>

                <div className={style.header}>
                    {ContactDetails ?
                        <>
                            <div className={style.headerDetails}>
                                <div className={style.toggleButton} onClick={toggleBack}>
                                    <FaArrowLeft /> {/* You can use a hamburger icon here */}
                                </div>
                                <img
                                    src={ContactDetails.image && ContactDetails.image.startsWith('data:image/') ? ContactDetails.image : `data:image/jpeg;base64,${ContactDetails.image}`}
                                    className={style.header_photo}
                                    alt={`${ContactDetails.user_name}'s profile`}
                                />
                                <div className={style.headerMain}>
                                    <div className={style.headerName}>{ContactDetails.user_name ? ContactDetails.user_name : ContactDetails}</div>

                                    <div className={style.headerStatus}>{ContactDetails.active ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>
                        </>

                        : <div>No user Selected</div>}
                </div>




                {/* <h2>Public Chat</h2> */}
                {ContactName === "GroupChat" ?
                    (

                        <div>

                            <div className={style.msgCont}>
                                {publicMessages.map((msg, index) => (
                                    console.log(`Rendering message from ${msg.senderName}: ${msg.message}`),
                                    msg.senderName == CurrentUser.user_name ? (
                                        <div key={index} className={style.senderOutCont}>
                                            <div className={style.senderBox}>{msg.message}</div>
                                        </div>

                                    ) : (

                                        //< div key={index} > {`${msg.senderName} to ${msg.receiverName}: ${msg.message}`}</div>)
                                        <div key={index} className={style.receiverOutCont}>
                                            <div className={style.receiverBox} key={index}>{`${msg.senderName}: ${msg.message}`}</div>
                                        </div>
                                    )
                                ))}
                                {/* </div> */}
                            </div>
                            <div className={style.sendMsgCont}>
                                <div className={style.msgInput}>
                                    <input
                                        type="text"
                                        placeholder='Type a message here'
                                        value={message}
                                        className={style.inputBox}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <div onClick={handlePublicMessageSend} className={style.sendMsgBtn}><FaArrowRight /></div>
                                </div>
                            </div>



                        </div>
                    ) :

                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <div className={style.msgCont}>
                            {previousChat.map((msg, index) => (
                                msg.senderName == CurrentUser.user_name ? (
                                    <div key={index} className={style.senderOutCont}>
                                        <div className={style.senderBox}>{msg.message}</div>
                                    </div>

                                ) : (

                                    //< div key={index} > {`${msg.senderName} to ${msg.receiverName}: ${msg.message}`}</div>)
                                    <div key={index} className={style.receiverOutCont}>
                                        <div className={style.receiverBox}>{msg.message}</div>
                                    </div>
                                )
                            ))}

                            {/* <div>{`${CurrentUser} to ${privateRecipient}: ${message}`}</div> */}

                            {privateMessages.map((msg, index) => (
                                msg.senderName == CurrentUser.user_name ? (
                                    <div key={index} className={style.senderOutCont}>
                                        <div className={style.senderBox}>{msg.message}</div>
                                    </div>

                                ) : (

                                    //< div key={index} > {`${msg.senderName} to ${msg.receiverName}: ${msg.message}`}</div>)
                                    <div key={index} className={style.receiverOutCont}>
                                        <div className={style.receiverBox}>{msg.message}</div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className={style.sendMsgCont}>
                            <div className={style.msgInput}>
                                <input
                                    type="text"
                                    placeholder='Type a message here'
                                    value={message}
                                    className={style.inputBox}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div onClick={handlePrivateMessageSend} className={style.sendMsgBtn}><FaArrowRight /></div>
                            </div>
                        </div>

                        {/* <div>  <button onClick={getMessage}>Get Message</button>   </div>*/}

                    </div>
                }
            </div>

        </div >

    );
};

export default ChatApp;