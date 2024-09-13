package com.chatIdeas.chatServer.Repository;

import com.chatIdeas.chatServer.Entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface Repo extends JpaRepository<UserDetails,Integer> {
//    UserDetails findByUser_name(String user_name);  //SELECT * FROM user_details WHERE user_name = ?;

}
