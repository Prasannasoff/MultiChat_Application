package com.chatIdeas.chatServer.Controller;

import com.chatIdeas.chatServer.Entity.MessageEntity;
import com.chatIdeas.chatServer.Entity.UserDetails;
import com.chatIdeas.chatServer.Repository.MessageRepository;
import com.chatIdeas.chatServer.Repository.Repo;
import com.chatIdeas.chatServer.Service.OfflineMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class UserController {
    @Autowired
    private Repo repo;
    @Autowired
    private MessageRepository messageRepository;

    @PostMapping("/save")
    public String saveUser(@RequestBody UserDetails user) {

        repo.save(user);


        return "User Saved Successfully";

    }

    @GetMapping("/getData")

    public List<UserDetails> getDetails() {
        return repo.findAll();

    }

    @GetMapping("/messages/{username}")

    public List<MessageEntity> getMessagesForUser(@PathVariable String username) {
        // Fetch all messages where the receiver is the specified user
        List<MessageEntity> messages = messageRepository.findByReceiver(username);

        return messages;

    }
    @Autowired
    private OfflineMessageService offlineMessageService;
    @PostMapping("/user-connected/{username}")
    public void userConnected(@PathVariable String username) {
        // Send pending messages to the user who has just connected
        offlineMessageService.sendPendingMessages(username);
    }


    @PutMapping("/userLogInStatus/{id}")
    public String logInStatus(@PathVariable int id){
        UserDetails changeState=repo.findById(id).orElseThrow(()->new RuntimeException("Id not Found"));
        changeState.setActive(true);
        repo.save(changeState);
        return "Online";
    }
    @PutMapping("/userLogOutStatus/{id}")
    public String logOutStatus(@PathVariable int id){
        UserDetails changeState=repo.findById(id).orElseThrow(()->new RuntimeException("Id not Found"));
        changeState.setActive(false);
        repo.save(changeState);
        return "Offline";
    }
}
