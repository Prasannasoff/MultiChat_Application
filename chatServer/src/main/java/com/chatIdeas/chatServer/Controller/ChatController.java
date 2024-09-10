package com.chatIdeas.chatServer.Controller;

import com.chatIdeas.chatServer.Controller.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate; //SimpMessagingTemplate is a helper class used to send messages to specific destinations. It is used for  private messaging.
    @MessageMapping("/message") //When a message with the destination /app/message is received that is config will send this to here whenever client send a request to server, the @MessageMapping("/message") annotation tells Spring to route this message to the receivePublicMessage method in the ChatController.
    @SendTo("/chatroom/public") //his annotation specifies that the return value of the receivePublicMessage method should be sent to the destination /chatroom/publi
    public Message receivePublicMessage(@Payload Message message){
        //When a WebSocket client sends a message to the server, the message typically includes a body(such as a JSON object).The @Payload annotation is used in the method parameter to automatically convert and inject this message payload into the method parameter.It simply converts the json object into varaibles specified in message method

        return message;
    }
    @MessageMapping("/private-message")
    public Message receivePrivateMessage(@Payload Message message) {

        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message); //  The convertAndSendToUser method uses the message.getReceiverName() to determine the recipient and routes the message to /user/{username}/private.
        return message;
    }

}
