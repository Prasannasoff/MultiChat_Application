import React from 'react'
import style from '../styles/Layout.module.css';
import { useState, useEffect } from 'react';
import { setUser, clearUser } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import FriendRequest from './AddFriendRequest'
import ResponseFriendRequest from './ResponseFriendRequest';
import axios from 'axios';

function Layout() {

  const { TabPane } = Tabs

  const dispatch = useDispatch();
  const userName = useSelector(state => state.userName.user);
  const user_id = useSelector(state => state.currentUser.id);
  const currentUserName = useSelector(state => state.currentUser.user);
  const [friendDetail, setFriendDetail] = useState([]);
  const [userDetail, SetUserDetail] = useState([]);
  useEffect(() => {
    // const user = response.data.filter(user => user.user_name === CurrentUser)[0];
    // dispatch(setCurrentUser({ user: user.user_name, id: user.user_id }));
    // setId(user.user_id);
    const getRequest = async () => {
      const getResponse = await axios.get("http://localhost:8081/api/getData");
      console.log("userDatas:" + getResponse.data);
      SetUserDetail(getResponse.data);
      const response = await axios.get(`http://localhost:8081/api/getFriendList/${user_id}`);
      console.log(response.data);

      const enrichedDetails = response.data.map(friendList => {
        const friend = getResponse.data.find(user => user.user_id === friendList.user_id);
        const friend2 = getResponse.data.find(user => user.user_id === friendList.friend_id);
        let friend_name;
        if (currentUserName !== friend.user_name) {
          friend_name = friend.user_name;
        } else if (currentUserName !== friend2.user_name) {
          friend_name = friend2.user_name;
        }
        console.log("Friend" + friend);

        return {
          ...friendList,
          friend_name: friend_name
        };
      });

      setFriendDetail(enrichedDetails);

    }

    getRequest()

  }, [user_id]);
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
  // const handleLogout = async () => {
  //     if (id) {
  //         const logoutResponse = await axios.put(`http://localhost:8081/api/userLogOutStatus/${id}`);
  //         console.log(logoutResponse);
  //         navigate('/');
  //     }

  // }
  return (

    <div className={style.LayoutCont}>
      <Tabs>
        <TabPane tab="chatPage" key="1">


          {/* <button onClick={handleLogout}>Logout</button> */}
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
        <TabPane tab="FriendRequest" key="2"><FriendRequest userDetail={userDetail} /></TabPane>
        <TabPane tab="FriendRequest" key="3"><ResponseFriendRequest userDetail={userDetail} /></TabPane>

      </Tabs>
    </div >
  )
}

export default Layout;