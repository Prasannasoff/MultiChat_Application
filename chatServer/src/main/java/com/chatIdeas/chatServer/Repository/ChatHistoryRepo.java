package com.chatIdeas.chatServer.Repository;

import com.chatIdeas.chatServer.Entity.ChatHistory;
import com.chatIdeas.chatServer.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface ChatHistoryRepo extends JpaRepository<ChatHistory,Long> {
    List<ChatHistory> findByReceiver(String receiver);
    List<ChatHistory> findBySender(String sender);

}
