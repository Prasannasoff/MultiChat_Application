import React, { useEffect } from 'react'
import style from '../styles/FriendRequest.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
function AddFriendRequest({ nonFriendList }) {
    const userName = useSelector(state => state.currentUser.user);
    const user_id = useSelector(state => state.currentUser.id);
    console.log(nonFriendList);

    const addFriend = async (friend_id) => {
        console.log(friend_id);
        const response = await axios.post("http://localhost:8081/api/addFriendRequest", { user_id, friend_id });
        console.log(response.data);
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
                        <div className={style.addBtn} onClick={() => addFriend(data.user_id)}>+</div>
                    </div>
                )
            })}

        </div>
    )
}

export default AddFriendRequest;