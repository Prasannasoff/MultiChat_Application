package com.chatIdeas.chatServer.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FriendList")
public class FriendList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id") // The current user
    private int user_id;
    @Column(name = "friend_id") // The friend's user ID (also from UserDetails)
    private int friend_id;

    @Column(name = "status", length = 10) // Can store 'accepted' or 'rejected'
    private String status;


    // Constructors


    public FriendList() {
    }

    public FriendList(int user_id, int friend_id, String status) {

        this.user_id = user_id;
        this.friend_id = friend_id;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getFriend_id() {
        return friend_id;
    }

    public void setFriend_id(int friend_id) {
        this.friend_id = friend_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "FriendList{" +
                "id=" + id +
                ", user_id=" + user_id +
                ", friend_id=" + friend_id +
                ", status='" + status + '\'' +
                '}';
    }
}
