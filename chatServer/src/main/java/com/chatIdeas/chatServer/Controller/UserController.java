package com.chatIdeas.chatServer.Controller;
import org.springframework.web.multipart.MultipartFile;

import com.chatIdeas.chatServer.Controller.model.Message;
import com.chatIdeas.chatServer.DTO.AddFriendDTO;
import com.chatIdeas.chatServer.Entity.ChatHistory;
import com.chatIdeas.chatServer.Entity.FriendList;
import com.chatIdeas.chatServer.Entity.MessageEntity;
import com.chatIdeas.chatServer.Entity.UserDetails;
import com.chatIdeas.chatServer.Repository.AddFriendRepo;
import com.chatIdeas.chatServer.Repository.ChatHistoryRepo;
import com.chatIdeas.chatServer.Repository.MessageRepository;
import com.chatIdeas.chatServer.Repository.Repo;
import com.chatIdeas.chatServer.Service.OfflineMessageService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class UserController {
    @Autowired
    private Repo repo;
    @Autowired
    private MessageRepository messageRepository;

    @PostMapping("/register")
    public String saveUser(
            @RequestParam("user_name") String userName,
            @RequestParam("about") String about,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("image") MultipartFile image) {

        try {
            // Convert the uploaded image into byte array
            byte[] imageBytes = image.getBytes();

            // Create a new UserDetails object and set the fields
            UserDetails user = new UserDetails();
            user.setUser_name(userName);
            user.setAbout(about);
            user.setEmail(email);
            user.setPassword(password);
            user.setPhone_number(phone);
            user.setImage(imageBytes);  // Set the image data

            // Save the user object to the database
            repo.save(user);

            return "User Saved Successfully";
        } catch (Exception e) {
            return "Error saving user: " + e.getMessage();
        }
    }
    @GetMapping("/getCurrentUser/{email}")
    public UserDetails getCurrentUser(@PathVariable String email){
        UserDetails currentUser=repo.findByEmail(email);
        System.out.println("CurrentUser"+currentUser);
        return currentUser;
    }

    @GetMapping("/getData")

    public List<UserDetails> getDetails() {
        System.out.print("List:"+repo.findAll());
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

    @Autowired
    private AddFriendRepo addFriendRepo;


    @PostMapping("/addFriendRequest")
    public String addFriendRequest(@RequestBody AddFriendDTO addFriendDTO) {
        // Fetch the UserDetails for both the user and the friend using their IDs

        // Create a new FriendList entry and set the status to "requested"
        FriendList friendList = new FriendList(
                addFriendDTO.getUser_id(),
                addFriendDTO.getFriend_id(),
                "requested");

        // Save the friend request in the repository
        addFriendRepo.save(friendList);

        return "Request Sent successfully";
    }



        @PutMapping("/acceptRequest")
        public String acceptRequest(@RequestParam int user_id, @RequestParam int friend_id){
            FriendList friendList = addFriendRepo.findByUserAndFriend(user_id, friend_id);
            friendList.setStatus("Accepted");
            System.out.println(friendList);
            addFriendRepo.save(friendList);
            return "Friend request accepted successfully";
        }

    @PutMapping("/rejectRequest")
    public String deleteRequest(@RequestParam int user_id, @RequestParam int friend_id){
        FriendList friendList = addFriendRepo.findByUserAndFriend(user_id, friend_id);
        friendList.setStatus("Rejected");
        System.out.println(friendList);
        addFriendRepo.save(friendList);
        return "Friend request Rejected successfully";
    }

    @GetMapping("/getRequest/{friend_id}")
    public ResponseEntity getRequest(@PathVariable int friend_id) {
        System.out.println("Fetching friend request for friend_id: " + friend_id);

          List<FriendList> friendList = addFriendRepo.findByFriendId(friend_id);
        if (friendList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(Collections.emptyList());
        }
        System.out.println("Found friend request: " + friendList);
        return ResponseEntity.status(HttpStatus.OK).body(friendList);

    }
    @GetMapping("/getFriendList/{user_id}")
    public ResponseEntity getFriendList(@PathVariable int user_id) {
        System.out.println("Fetching friend request for friend_id: " + user_id);

        List<FriendList> friendList = addFriendRepo.findByUserOrFriendId(user_id);

        if (friendList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(Collections.emptyList());
        }
        System.out.println("Found friend request: " + friendList);
        return ResponseEntity.status(HttpStatus.OK).body(friendList);

    }

}

