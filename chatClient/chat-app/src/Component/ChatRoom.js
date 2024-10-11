// src/ChatApp.js
import React, { useState, useEffect } from 'react';
import { connect, sendPublicMessage, sendPrivateMessage } from '../services/WebSocket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Layout from './Layout';
import style from '../styles/chatRoom.module.css'
import { FaArrowRight } from 'react-icons/fa';
import Navigation from './Navigation';
import { setCurrentUser, clearCurrentUser } from '../redux/store';

const ChatApp = () => {
    const dispatch = useDispatch();
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
        dispatch(setCurrentUser({ user: CurrentUser.user_name, id: CurrentUser.user_id }));
    }, [dispatch, CurrentUser]);
    useEffect(() => {
        const fetchDataAndConnect = async () => {
            const user_id = CurrentUser.user_id;
            const logInResponse = await axios.put(`http://localhost:8081/api/userLogInStatus/${user_id}`);
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

        fetchDataAndConnect();
    }, [CurrentUser.user_name]);

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
        const messageResponse = await axios.post(`http://localhost:8081/api/user-connected/${CurrentUser.user_name}`); //TO get the offline messages
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
            const PreviousMsg = await axios.get(`http://localhost:8081/api/getChatHistory/${CurrentUser.user_name}`);
            if (ContactName) {
                setPreviousChat(PreviousMsg.data.filter(data => data.receiverName === ContactName || data.senderName === ContactName));
            }
        };
        setPrivateMessages(privateMessages.filter(data => data.receiverName === ContactName || data.senderName === ContactName));


        fetchPreviousChatsForContact();
    }, [ContactName, CurrentUser.user_name]);


    return (
        <div className='mainCont'>
            <Navigation />

            <div className={style.chatCont}>
                <div className={style.header}>
                    {ContactDetails ?
                        <>
                            <div className={style.headerDetails}>
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

                    <div>

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