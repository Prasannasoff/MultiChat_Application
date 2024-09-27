import React from 'react'
import style from '../styles/Layout.module.css';
import { useState, useEffect } from 'react';
import { setUser, clearUser } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import { Link, useNavigate } from "react-router-dom";

import FriendRequest from './AddFriendRequest'
import ResponseFriendRequest from './ResponseFriendRequest';
import axios from 'axios';

function Layout() {

  const { TabPane } = Tabs;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector(state => state.userName.user);
  const user_id = useSelector(state => state.currentUser.id);
  const currentUserName = useSelector(state => state.currentUser.user);
  console.log("CurrentUser" + currentUserName);
  const [friendDetail, setFriendDetail] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [nonFriendList, setNonFriendList] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [getResponse, response] = await Promise.all([
          axios.get("http://localhost:8081/api/getData"),
          axios.get(`http://localhost:8081/api/getFriendList/${user_id}`)
        ]);

        const users = getResponse.data;
        const friends = response.data;

        // Make sure userDetail is not undefined or empty before proceeding
        if (users && users.length > 0 && friends) {
          setUserDetail(users);

          // Filter out non-friends
          const nonFriends = users.filter(user =>
            !friends.some(friend => user.user_id === friend.user_id || user.user_id === friend.friend_id)
          );
          const nonFriendWithoutCurrentUser = nonFriends.filter(nonFriend => nonFriend.user_name !== currentUserName);
          setNonFriendList(nonFriendWithoutCurrentUser);
          console.log("List" + nonFriendWithoutCurrentUser);
          // Enrich the friend list with names
          const enrichedDetails = friends.map(friendList => {
            const friend = users.find(user => user.user_id === friendList.user_id);
            const friend2 = users.find(user => user.user_id === friendList.friend_id);
            let friend_name = currentUserName !== friend?.user_name ? friend?.user_name : friend2?.user_name;

            return {
              ...friendList,
              friend_name: friend_name || 'Unknown' // Handle undefined friend_name
            };
          });

          setFriendDetail(enrichedDetails);
        } else {
          console.error("Data is missing or undefined.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [user_id, currentUserName]);
  const lst = [{
    name: 'Prasanna',
    image: "https://st4.depositphotos.com/10313122/22093/i/450/depositphotos_220936114-stock-photo-young-handsome-indian-man-against.jpg",
    desc: "My attitude is based on how you treat me"
  },
  {
    name: 'Ragul',
    image: "https://t4.ftcdn.net/jpg/06/40/07/03/360_F_640070383_9LJ3eTRSvOiwKyrmBYgcjhSlckDnNcxl.jpg",
    desc: "Can't talk whatsapp only"
  }, {
    name: 'Dinesh',
    image: "https://img.freepik.com/free-photo/close-up-portrait-young-indian-man-with-beard-white-shirt-isolated-standing-smiling_155003-23823.jpg",
    desc: "Busy!"
  },]
  const handleContact = (name) => {
    dispatch(setUser(name));


  }
  const handleLogout = async () => {
    if (user_id) {
      const logoutResponse = await axios.put(`http://localhost:8081/api/userLogOutStatus/${user_id}`);
      console.log(logoutResponse);
      navigate('/');
    }

  }
  return (

    <div className={style.LayoutCont}>
      <Tabs>
        <TabPane tab="chatPage" key="1">


          <button onClick={handleLogout}>Logout</button>
          <div className={style.searchBar}>
            <input type="text" className='input' placeholder='Search Contacts'></input>
          </div>
          <div className={style.ContactName}>
            {friendDetail.map(data => {
              const isActive = userName === data.friend_name;
              return (
                <div className={`${isActive ? style.activeNameBanner : style.nameBanner}`} onClick={() => handleContact(data.friend_name)}>
                  <img src={data.image} className={style.profile_photo}></img>
                  <div className={style.about}>
                    <div className={style.name}>{data.friend_name}</div>
                    <div className={style.desc}>{data.desc}</div>
                  </div>

                </div>
              )
            }
            )}

            <div className={style.PeopleKnow}>People You may know</div>

            <div className={style.nameBanner}>
              <img src={lst[0].image} className={style.profile_photo}></img>
              <div className={style.about}>
                <div className={style.name}>Raj</div>
                <div className={style.desc}>Hi</div>
              </div>
              <div className={style.addBtn}>+</div>

            </div>
            <div className={style.selectedUser}>
              {userName ? <p>Selected User: {userName}</p> : <p>No User Selected</p>}
            </div>

          </div>
        </TabPane>
        <TabPane tab="FriendRequest" key="2"><FriendRequest nonFriendList={nonFriendList} /></TabPane>
        <TabPane tab="FriendRequest" key="3"><ResponseFriendRequest userDetail={userDetail} /></TabPane>

      </Tabs>
    </div >
  )
}

export default Layout;