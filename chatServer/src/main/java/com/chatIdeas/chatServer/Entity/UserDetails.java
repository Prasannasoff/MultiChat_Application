package com.chatIdeas.chatServer.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="UserDetail")
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;

    @Column(name="user_name", length=50,unique = true)
    private String user_name;

    @Column(name="email", length=100, unique=true) // Email should be unique
    private String email;

    @Column(name="password", length=100) // Store hashed passwords
    private String password;
    @Column(name="about", length=100) // Store hashed passwords
    private String about;

    @Column(name="phone_number", length=15)
    private String phone_number;

//    @Lob // Use Lob for storing large objects like images
//    @Column(name="image")
//    private byte[] image;

    @Column(name = "Active", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean Active;


    // Constructors
    public UserDetails() {
    }

    public UserDetails(int user_id, String user_name, String email, String password, String phone_number,String about, byte[] image, boolean active) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.about=about;
        this.password = password;
        this.phone_number = phone_number;
//        this.image = image;
        this.Active = active;
    }

    // Getters and setters
    public int getUser_id() {
        return user_id;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

//    public byte[] getImage() {
//        return image;
//    }
//
//    public void setImage(byte[] image) {
//        this.image = image;
//    }

    public boolean isActive() {
        return Active;
    }

    public void setActive(boolean active) {
        Active = active;
    }

    @Override
    public String toString() {
        return "UserDetails{" +
                "user_id=" + user_id +
                ", user_name='" + user_name + '\'' +
                ", email='" + email + '\'' +
                ", about='" + about + '\'' +

                ", password='[PROTECTED]'" +
                ", phone_number='" + phone_number + '\'' +
                ", Active=" + Active +
                '}';
    }
}
