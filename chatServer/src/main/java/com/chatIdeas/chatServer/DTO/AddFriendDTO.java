package com.chatIdeas.chatServer.DTO;

import jakarta.persistence.*;

public class AddFriendDTO {

        private int user_id;



        private int friend_id;






        public AddFriendDTO() {
        }

        public AddFriendDTO( int user_id, int friend_id) {

            this.user_id = user_id;
            this.friend_id = friend_id;

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




    @Override
    public String toString() {
        return "AddFriendDTO{" +
                "user_id=" + user_id +
                ", friend_id=" + friend_id +

                '}';
    }
}
