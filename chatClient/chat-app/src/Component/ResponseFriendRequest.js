import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import style from '../styles/ResponseFriendRequest.module.css'
function ResponseFriendRequest({ userDetail }) {
    const [friendDetail, setFriendDetail] = useState([]);

    const friend_id = useSelector(state => state.currentUser.id);
    useEffect(() => {
        const getRequest = async () => {
            const response = await axios.get(`http://localhost:8081/api/getRequest/${friend_id}`);
            console.log(response.data);
            const enrichedDetails = response.data.map(friendRequest => {
                const friend = userDetail.find(user => user.user_id === friendRequest.user_id);

                return {
                    ...friendRequest,
                    friend_name: friend.user_name
                };
            });

            setFriendDetail(enrichedDetails);

        }
        getRequest()
    }, [friend_id]);
    return (
        <div className={style.responseFriendCont}>

            {friendDetail.map(data => {
                return (
                    <div>
                        <div>{data.friend_name} has send you friend request</div>
                        {/* <div>{data.user_id}</div> */}
                    </div>

                )
            })}
        </div>
    )
}

export default ResponseFriendRequest