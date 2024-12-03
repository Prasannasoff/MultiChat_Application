import React from 'react';
import style from '../styles/Layout.module.css';
import { useState, useEffect } from 'react';
import { setUser, clearUser } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Layout = React.memo(({ friendDetail }) => {
  console.log("FriendDetail", friendDetail)
  const friendList = friendDetail.filter(friendDetail => friendDetail.status == 'Accepted');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = useSelector(state => {
    if (state.userName.user === "GroupChat") {
      return "GroupChat";
    } else if (state.userName.user && state.userName.user.user_name) {
      return state.userName.user.user_name;
    } else {
      return null;
    }
  });

  const user_id = useSelector(state => state.currentUser.id);
  const currentUserName = useSelector(state => state.currentUser.user);
  console.log("CurrentUser: " + currentUserName);


  const groupChat = "GroupChat";


  const lst = [
    {
      name: 'Prasanna',
      image: "https://st4.depositphotos.com/10313122/22093/i/450/depositphotos_220936114-stock-photo-young-handsome-indian-man-against.jpg",
      desc: "My attitude is based on how you treat me"
    },
    {
      name: 'Ragul',
      image: "https://t4.ftcdn.net/jpg/06/40/07/03/360_F_640070383_9LJ3eTRSvOiwKyrmBYgcjhSlckDnNcxl.jpg",
      desc: "Can't talk, WhatsApp only"
    }, {
      name: 'Dinesh',
      image: "https://img.freepik.com/free-photo/close-up-portrait-young-indian-man-with-beard-white-shirt-isolated-standing-smiling_155003-23823.jpg",
      desc: "Busy!"
    },
  ];

  const handleContact = (user) => {
    dispatch(setUser(user));
  }



  return (
    <div className={style.ContactName}>
      <div className={`${userName === groupChat ? style.activeNameBanner : style.nameBanner}`} onClick={() => handleContact(groupChat)}>
        <img src={lst[1].image} className={style.profile_photo} alt="Group Chat" />
        <div className={style.about}>
          <div className={style.name}>{groupChat}</div>
        </div>
      </div>
      {friendList.map(data => {

        const isActive = userName === data.user_name;
        return (
          <div key={data.user_id} className={`${isActive ? style.activeNameBanner : style.nameBanner}`} onClick={() => handleContact(data)}>
            <img
              src={data.image && data.image.startsWith('data:image/') ? data.image : `data:image/jpeg;base64,${data.image}`}
              className={style.profile_photo}
              alt={`${data.user_name}'s profile`}
            />
            <div className={style.about}>
              <div className={style.name}>{data.user_name}</div>
              <div className={style.desc}>{data.about}</div>
            </div>
          </div>

        );

      })}

      <div className={style.PeopleKnow}>People You May Know</div>

      {/* {lst.map((person, index) => (
            <div key={index} className={style.nameBanner}>
              <img src={person.image} className={style.profile_photo} alt={person.name} />
              <div className={style.about}>
                <div className={style.name}>{person.name}</div>
                <div className={style.desc}>{person.desc}</div>
              </div>
              <div className={style.addBtn}>+</div>
            </div>
          ))} */}

      <div className={style.selectedUser}>
        {userName ? <p>Selected User: {userName}</p> : <p>No User Selected</p>}
      </div>
    </div>

  );
});

export default Layout;

