package com.chatIdeas.chatServer.Service;
import com.chatIdeas.chatServer.Entity.ChatHistory;
import com.chatIdeas.chatServer.Repository.ChatHistoryRepo;
import org.springframework.transaction.annotation.Transactional;
import com.chatIdeas.chatServer.Controller.model.Message;
import com.chatIdeas.chatServer.Entity.MessageEntity;
import com.chatIdeas.chatServer.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OfflineMessageService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatHistoryRepo chatHistoryRepo;
    @Transactional
    public void sendPendingMessages(String receiver) {

        List<MessageEntity> pendingMessages = messageRepository.findByReceiver(receiver);
        System.out.print("Pending Messages"+pendingMessages);
        for (MessageEntity messageEntity : pendingMessages) {
            Message message = new Message();
            message.setSenderName(messageEntity.getSender());
            message.setReceiverName(messageEntity.getReceiver());
            message.setMessage(messageEntity.getMessage());
            simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
            ChatHistory chatHistory = new ChatHistory(message.getSenderName(), message.getReceiverName(), message.getMessage(), LocalDateTime.now());
            chatHistoryRepo.save(chatHistory);
        }

        // Optionally clear messages after sending

        messageRepository.deleteByReceiver(receiver);
}
}
//package com.chatIdeas.chatServer.Service;
//
//import com.chatIdeas.chatServer.Entity.MessageEntity;
//import com.chatIdeas.chatServer.Repository.MessageRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.List;
//
//@Service
//public class OfflineMessageService {
//
//    private static final Logger logger = LoggerFactory.getLogger(OfflineMessageService.class);
//
//    @Autowired
//    private SimpMessagingTemplate simpMessagingTemplate;
//
//    @Autowired
//    private MessageRepository messageRepository;
//
//    @Transactional
//    public void sendPendingMessages(String receiver) {
//        if (receiver == null || receiver.isEmpty()) {
//            logger.error("Invalid receiver: {}", receiver);
//            return;
//        }
//
//        List<MessageEntity> pendingMessages = messageRepository.findByReceiver(receiver);
//
//        if (pendingMessages.isEmpty()) {
//            logger.info("No pending messages for receiver: {}", receiver);
//            return;
//        }
//
//        try {
//            for (MessageEntity message : pendingMessages) {
//                simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
//            }
//            messageRepository.deleteByReceiver(receiver);
//            logger.info("Sent and cleared {} messages for receiver: {}", pendingMessages.size(), receiver);
//        } catch (Exception e) {
//            logger.error("Error sending messages to receiver: {}", receiver, e);
//        }
//    }
//}

