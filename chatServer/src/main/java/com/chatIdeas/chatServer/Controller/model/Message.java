package com.chatIdeas.chatServer.Controller.model;

import lombok.*;

//Since we are using lombok library we can import getters and setters as just annotations
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private Status status;
}
