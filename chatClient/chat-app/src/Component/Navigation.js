import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Tabs } from 'antd';
import Layout from './Layout';
import style from '../styles/Navigation.module.css'
import FriendRequest from './AddFriendRequest'
import ResponseFriendRequest from './ResponseFriendRequest'
import { setUser, clearUser } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
    const navigate = useNavigate();

    const { TabPane } = Tabs;
    const user_id = useSelector(state => state.currentUser.id);
    const currentUserName = useSelector(state => state.currentUser.user);
    const [friendDetail, setFriendDetail] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [nonFriendList, setNonFriendList] = useState([]);
    const [activePage, setActivePage] = useState('chatPage');
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [getResponse, response] = await Promise.all([
                    axios.get("http://localhost:8081/api/getData"),
                    axios.get(`http://localhost:8081/api/getFriendList/${user_id}`)
                ]);

                const users = getResponse.data;
                const friends = response.data;

                if (users && users.length > 0 && friends) {
                    setUserDetail(users);

                    // Filter out non-friends



                    // Enrich the friend list with names
                    const enrichedDetails = friends.map(friendList => {
                        const friend = users.find(user => user.user_id === friendList.user_id);
                        const friend2 = users.find(user => user.user_id === friendList.friend_id);
                        let friend_name = currentUserName !== friend?.user_name ? friend?.user_name : friend2?.user_name;

                        return {
                            ...friendList,
                            friend_name: friend_name || 'Unknown'
                        };
                    });

                    const friendNames = enrichedDetails.map(detail => detail.friend_name);

                    const filteredUsers = users.filter(user => {
                        return friendNames.includes(user.user_name);
                    });
                    const addFriendStatus = filteredUsers.map(filteredData => {
                        const friend = friends.find(friend => filteredData.user_id === friend.user_id || filteredData.user_id === friend.friend_id);
                        return {
                            ...filteredData,
                            status: friend ? friend.status : 'none'  // Add status if found, else 'none'
                        };
                    });
                    const nonFriends = users.filter(user =>
                        !friends.some(friend => user.user_id === friend.user_id || user.user_id === friend.friend_id)
                    );
                    const nonFriendWithoutCurrentUser = nonFriends.filter(nonFriend => nonFriend.user_name !== currentUserName);
                    const nonFriendUpdated = nonFriendWithoutCurrentUser.map(data => {
                        return {
                            ...data,
                            status: "none"

                        }   
                    });

                    const requestedFriendList = addFriendStatus.filter(friend => friend.status == 'requested');
                    const combinedNonFriendList = [...nonFriendUpdated, ...requestedFriendList];
                    setNonFriendList(combinedNonFriendList);
                    console.log("List: ", combinedNonFriendList);
                    setFriendDetail(addFriendStatus);
                } else {
                    console.error("Data is missing or undefined.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user_id && currentUserName) {
            fetchDetails();
        }
    }, [user_id, currentUserName]);
    const handleLogout = async () => {
        if (user_id) {
            const logoutResponse = await axios.put(`http://localhost:8081/api/userLogOutStatus/${user_id}`);
            console.log(logoutResponse);
            navigate('/');
        }
    }
    return (
        <div className={style.LayoutCont}>
            <div className={style.logoutBtn}>
                <button onClick={handleLogout} >Logout</button>
            </div>
            <div className={style.NavCont}>
                <div className={style.NavigationMenu}>
                    <div className={`${style.NavItem} ${activePage === 'chatPage' ? style.NavItemActive : ''}`}
                        onClick={() => setActivePage('chatPage')}>
                        Chat Page
                    </div>
                    <div className={`${style.NavItem} ${activePage === 'addFriend' ? style.NavItemActive : ''}`}
                        onClick={() => setActivePage('addFriend')}>
                        Add Friend
                    </div>
                    <div className={`${style.NavItem} ${activePage === 'friendRequest' ? style.NavItemActive : ''}`}
                        onClick={() => setActivePage('friendRequest')}>
                        Friend Request
                    </div>
                </div>
            </div>
            <div className={style.Content}>
                {activePage === 'chatPage' && <Layout friendDetail={friendDetail} />}
                {activePage === 'addFriend' && <FriendRequest nonFriendList={nonFriendList} />}
                {activePage === 'friendRequest' && <ResponseFriendRequest userDetail={userDetail} />}
            </div>

        </div>
    );
}

export default Navigation