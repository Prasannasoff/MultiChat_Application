package com.chatIdeas.chatServer.Controller;

import com.chatIdeas.chatServer.Controller.model.Message;
import com.chatIdeas.chatServer.Entity.ChatHistory;
import com.chatIdeas.chatServer.Entity.MessageEntity;
import com.chatIdeas.chatServer.Entity.UserDetails;
import com.chatIdeas.chatServer.Repository.ChatHistoryRepo;
import com.chatIdeas.chatServer.Repository.MessageRepository;
import com.chatIdeas.chatServer.Repository.Repo;
import com.chatIdeas.chatServer.Service.OfflineMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    //    @GetMapping("/messages/{username}")
//
//    public List<MessageEntity> getMessagesForUser(@PathVariable String username) {
//        // Fetch all messages where the receiver is the specified user
//        List<MessageEntity> messages = messageRepository.findByReceiver(username);
//
//        return messages;
//
//    }
    @Autowired
    private OfflineMessageService offlineMessageService;

    @PostMapping("/user-connected/{username}")
    public void userConnected(@PathVariable String username) {
        // Send pending messages to the user who has just connected
        offlineMessageService.sendPendingMessages(username);
    }


    @PutMapping("/userLogInStatus/{id}")
    public String logInStatus(@PathVariable int id) {
        UserDetails changeState = repo.findById(id).orElseThrow(() -> new RuntimeException("Id not Found"));
        changeState.setActive(true);
        repo.save(changeState);
        return "Online";
    }

    @PutMapping("/userLogOutStatus/{id}")
    public String logOutStatus(@PathVariable int id) {
        UserDetails changeState = repo.findById(id).orElseThrow(() -> new RuntimeException("Id not Found"));
        changeState.setActive(false);
        repo.save(changeState);
        return "Offline";
    }

    @Autowired
    private ChatHistoryRepo chatHistoryRepo;

    @GetMapping("/getChatHistory/{username}")
    public List<Message> getPreviousMessages(@PathVariable String username) {
        // Fetch received and sent messages from ChatHistory
        List<ChatHistory> previousMessages = chatHistoryRepo.findByReceiver(username);
        List<ChatHistory> senderMessages = chatHistoryRepo.findBySender(username);

        // Fetch offline messages from MessageEntity
        List<MessageEntity> offlineSenderMessages = messageRepository.findBySender(username);

        // Combine the lists
        List<Object> allMessages = new ArrayList<>();
        allMessages.addAll(previousMessages);
        allMessages.addAll(senderMessages);
        allMessages.addAll(offlineSenderMessages);

        // Sort by timestamp, assuming both entities have a getTimestamp() method
        allMessages.sort((msg1, msg2) -> {
            LocalDateTime timestamp1 = (msg1 instanceof ChatHistory) ?
                    ((ChatHistory) msg1).getTimestamp() :
                    ((MessageEntity) msg1).getTimestamp();
            LocalDateTime timestamp2 = (msg2 instanceof ChatHistory) ?
                    ((ChatHistory) msg2).getTimestamp() :
                    ((MessageEntity) msg2).getTimestamp();
            return timestamp1.compareTo(timestamp2);
        });

        // Convert both ChatHistory and MessageEntity to Message DTOs
        List<Message> messageList = new ArrayList<>();
        for (Object messageObject : allMessages) {
            Message message = new Message();
            if (messageObject instanceof ChatHistory) {
                ChatHistory chatHistory = (ChatHistory) messageObject;
                message.setSenderName(chatHistory.getSender());
                message.setReceiverName(chatHistory.getReceiver());
                message.setMessage(chatHistory.getMessage());
            } else if (messageObject instanceof MessageEntity) {
                MessageEntity messageEntity = (MessageEntity) messageObject;
                message.setSenderName(messageEntity.getSender());
                message.setReceiverName(messageEntity.getReceiver());
                message.setMessage(messageEntity.getMessage());
            }
            messageList.add(message);
        }

        return messageList;
    }
//    public List<Message> PreviousMsg(@PathVariable String username) {
//        List<ChatHistory> previousMessages = chatHistoryRepo.findByReceiver(username);
//        List<ChatHistory> senderMessages = chatHistoryRepo.findBySender(username);
//
//        System.out.print("Pending Messages" + previousMessages);
//        List<Message> messageList = new ArrayList<>();
//        for (ChatHistory chatHistory : previousMessages) {
//            Message message = new Message();
//            message.setSenderName(chatHistory.getSender());
//            message.setReceiverName(chatHistory.getReceiver());
//            message.setMessage(chatHistory.getMessage());
//            messageList.add(message);
//        }
//        for (ChatHistory chatHistory : senderMessages) {
//            Message message = new Message();
//            message.setSenderName(chatHistory.getSender());
//            message.setReceiverName(chatHistory.getReceiver());
//            message.setMessage(chatHistory.getMessage());
//            messageList.add(message);
//        }
//        return messageList;
//
//    }
}
