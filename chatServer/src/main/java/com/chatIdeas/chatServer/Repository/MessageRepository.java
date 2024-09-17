package com.chatIdeas.chatServer.Repository;

import com.chatIdeas.chatServer.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface MessageRepository extends JpaRepository<MessageEntity,Long> {
    List<MessageEntity> findByReceiver(String receiver);
    List<MessageEntity> findBySender(String receiver);

    void deleteByReceiver(String receiver);
}
