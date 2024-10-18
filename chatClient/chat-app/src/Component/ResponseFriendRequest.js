import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import style from '../styles/ResponseFriendRequest.module.css'
function ResponseFriendRequest({ userDetail }) {
    const [friendDetail, setFriendDetail] = useState([]);
    const [response, setResponse] = useState({});

    const friend_id = useSelector(state => state.currentUser.id);
    useEffect(() => {
        const getRequest = async () => {
            const response = await axios.get(`http://localhost:8081/api/getRequest/${friend_id}`);
            console.log("FriendList" + response.data);
            if (response.data.length > 0) {
                const enrichedDetails = response.data.map(friendRequest => {
                    const friend = userDetail.find(user => user.user_id === friendRequest.user_id);

                    return {
                        ...friendRequest,
                        friend_name: friend.user_name
                    };
                });
                setFriendDetail(enrichedDetails);
            }



        }
        getRequest()
    }, [friend_id]);
    const handleAccept = async (user_id) => {
        const response = await axios.put(`http://localhost:8081/api/acceptRequest?user_id=${user_id}&friend_id=${friend_id}`);

        setResponse(prevState => ({
            ...prevState,
            [user_id]: "Accepted"   // Update only the clicked friend
        }));
        console.log(response.data);
    }
    const handleReject = async (user_id) => {
        const response = await axios.put(`http://localhost:8081/api/rejectRequest?user_id=${user_id}&friend_id=${friend_id}`);

        setResponse(prevState => ({
            ...prevState,
            [user_id]: "Rejected"   // Update only the clicked friend
        }));
        console.log(response.data);
    }
    return (
        <div className={style.responseFriendCont}>

            {friendDetail.map(data => {
                return (
                    <div className={style.requestsCont}>
                        <div className={style.friendName}>{data.friend_name}</div>

                        {data.status == 'requested' && !response[data.user_id] ?

                            <div className={style.responseBtn}>
                                <div className={style.rejectBtn} onClick={() => handleReject(data.user_id)}>Reject</div>
                                <div className={style.acceptBtn} onClick={() => handleAccept(data.user_id)}>Accept</div>

                            </div>

                            : <div>{data.status == 'requested' ? response[data.user_id] : data.status}</div>
                        }

                        {/* <div>{data.user_id}</div> */}
                    </div>

                )
            })}
        </div>
    )
}

export default ResponseFriendRequest