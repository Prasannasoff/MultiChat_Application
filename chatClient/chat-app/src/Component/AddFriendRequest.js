import React, { useEffect, useState } from 'react'
import style from '../styles/FriendRequest.module.css';
import { useSelector } from 'react-redux';
import api from '../services/api';

import axios from 'axios';
function AddFriendRequest({ nonFriendList }) {
    const userName = useSelector(state => state.currentUser.user);
    const user_id = useSelector(state => state.currentUser.id);
    const [friendStatusUpdate, setFriendStatusUpdate] = useState({});
    console.log(nonFriendList);

    const addFriend = async (friend_id) => {
        console.log(friend_id);
        try {
            const response = await api.post("/addFriendRequest", { user_id, friend_id });
            console.log(response.data);
            setFriendStatusUpdate(prevState => ({
                ...prevState,
                [friend_id]: "requested"   // Update only the clicked friend
            }));
        } catch (error) {
            console.error("Error sending friend request", error);
        }
    }

    return (
        <div className={style.FriendReqCont}>
            {nonFriendList.map(data => {

                return (
                    <div className={style.nameBanner}>
                        <img
                            src={data.image && data.image.startsWith('data:image/') ? data.image : `data:image/jpeg;base64,${data.image}`}
                            className={style.profile_photo}
                            alt={`${data.user_name}'s profile`}
                        />
                        <div className={style.about}>
                            <div className={style.name}>{data.user_name}</div>


                            {/* <div className={style.desc}>Hi</div> */}
                        </div>
                        {data.status == 'requested' || friendStatusUpdate[data.user_id] === 'requested' ? <div>Requested</div> :

                            <div className={style.addBtn} onClick={() => addFriend(data.user_id)}>+</div>
                        }
                    </div>
                )
            })}

        </div>
    )
}

export default AddFriendRequest;