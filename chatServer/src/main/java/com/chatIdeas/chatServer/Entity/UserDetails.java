package com.chatIdeas.chatServer.Entity;



import jakarta.persistence.*;

@Entity
@Table(name="UserDetail")

public class UserDetails {
@Id
@Column(name="user_id",length=50)
@GeneratedValue(strategy = GenerationType.AUTO) //Auto increments the id
private int user_id;
        @Column(name="user_name",length=50)
    private String user_name;

    public UserDetails(int user_id, String user_name) {
        this.user_id = user_id;
        this.user_name = user_name;
    }

    public UserDetails() {
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    @Override
    public String toString() {
        return "UserDetails{" +
                "user_id=" + user_id +
                ", user_name='" + user_name + '\'' +
                '}';
    }
}
