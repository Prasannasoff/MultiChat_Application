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
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate; //SimpMessagingTemplate is a helper class used to send messages to specific destinations. It is used for  private messaging.
    @MessageMapping("/message") //When a message with the destination /app/message is received that is config will send this to here whenever client send a request to server, the @MessageMapping("/message") annotation tells Spring to route this message to the receivePublicMessage method in the ChatController.
    @SendTo("/chatroom/public") //This annotation specifies that the return value of the receivePublicMessage method should be sent to the destination /chatroom/public
    public Message receivePublicMessage(@Payload Message message){
        //When a WebSocket client sends a message to the server, the message typically includes a body(such as a JSON object).The @Payload annotation is used in the method parameter to automatically convert and inject this message payload into the method parameter.It simply converts the json object into varaibles specified in message method
        return message;
    }
//    @MessageMapping("/private-message")
//    public Message receivePrivateMessage(@Payload Message message) {
//        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/queue/private", message);//  The convertAndSendToUser method uses the message.getReceiverName() to determine the recipient and routes the message to /user/{username}/private.
//        return message;
//    }
@Autowired
private MessageRepository messageRepository;

    @Autowired
    private ChatHistoryRepo chatHistoryRepo;
    @MessageMapping("/private-message")
    public void receivePrivateMessage(@Payload Message message) {
        boolean isRecipientOnline = checkUserOnline(message.getReceiverName()); // Implement this logic
        System.out.println("Status"+isRecipientOnline);
        if (isRecipientOnline) {
            simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/queue/private", message);
            ChatHistory chatHistory = new ChatHistory(message.getSenderName(), message.getReceiverName(), message.getMessage(), LocalDateTime.now());
            chatHistoryRepo.save(chatHistory);
        } else {
            // Store the message in the database for offline users
            MessageEntity messageEntity = new MessageEntity(message.getSenderName(), message.getReceiverName(), message.getMessage(), LocalDateTime.now());
            messageRepository.save(messageEntity);
        }
    }


    // Implement logic to check if the user is online

    @Autowired
    private Repo repo;
    private boolean checkUserOnline(String receiverName) {
        UserDetails user=repo.findByUserName(receiverName);
        System.out.println("USerName"+user.isActive());
        if(user.isActive()){
            return true;
        }
        else{
            return false;
        }

    }


}