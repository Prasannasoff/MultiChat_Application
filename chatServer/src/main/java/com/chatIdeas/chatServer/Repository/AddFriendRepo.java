package com.chatIdeas.chatServer.Repository;

import com.chatIdeas.chatServer.Entity.FriendList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@EnableJpaRepositories
@Repository
public interface AddFriendRepo extends JpaRepository<FriendList,Integer> {
    //SELECT * FROM FriendList f
    //JOIN UserDetails u ON f.user_id = u.user_id
    //WHERE u.user_id = :userId
    @Query("SELECT f FROM FriendList f WHERE f.user_id = :userId AND f.friend_id = :friendId")
    FriendList findByUserAndFriend(int userId, int friendId);

    @Query("SELECT f FROM FriendList f WHERE f.friend_id = :friendId")
    List<FriendList> findByFriendId(@Param("friendId") int friendId);

    @Query("SELECT f FROM FriendList f WHERE (f.friend_id = :userId OR f.user_id = :userId)")
    List<FriendList> findByUserOrFriendId(@Param("userId") int userId);

}
