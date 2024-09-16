package com.chatIdeas.chatServer.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

//Since we are using lombok library we can import getters and setters as just annotations

@Entity
@Table(name="messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender", nullable = false)
    private String sender;

    @Column(name = "receiver", nullable = false)
    private String receiver;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    public MessageEntity(String sender, String receiver, String message, LocalDateTime timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.timestamp = timestamp;
    }
}
