package com.chatIdeas.chatServer.conifg;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    //The configureMessageBroker configures the message routing and broker system that STOMP will use once the connection is established.Without configureMessageBroker(), STOMP wouldn’t know where to send or receive messages.
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //Message Broker Setup: The MessageBrokerRegistry helps configure two key aspects:
            // Application Destination Prefixes: Where the client sends messages that the server needs to handle.
            //Message Broker: Where the server sends messages for the clients to subscribe and receive.

        registry.setApplicationDestinationPrefixes("/app");//This defines the prefix for messages sent from the client to the server.Any messages sent to destinations starting with /app will be routed to message-handling methods in your server-side controller.

        //The message broker is responsible for broadcasting messages to clients subscribed to these destinations.
        registry.enableSimpleBroker("/chatroom","/user"); //Any client that subscribes to the /chatroom destination (such as /chatroom/public) on the client side will receive any messages that are sent to that destination. So whenever message is sent to this destination it will be updated to all whoever subscribed to this destination.

        registry.setUserDestinationPrefix("/user");//This is specific to private messaging.It defines the prefix for messages intended for specific users.
    }

    //Stomp:WebSockets provide a basic full-duplex communication channel, but they don’t define how to route messages, identify message types, handle subscriptions, or manage acknowledgments.  STOMP is a simple, text-based protocol that sits on top of WebSockets and provides features like message routing, broadcasting, and subscriptions.
    //SockJs:SockJS is a JavaScript library that provides WebSocket-like behavior for browsers that do not support WebSockets natively. It acts as a fallback mechanism. When a client cannot establish a WebSocket connection, SockJS automatically switches to using alternative communication protocols that mimic WebSocket functionality
    @Override
    // registerStompEndpoints establishes the WebSocket connection and enables STOMP protocol for the WebSocket communication,
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //In your WebSocket configuration, setAllowedOriginPatterns("*") means that you are allowing requests from any domain to connect to your WebSocket server, bypassing the CORS restrictions.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }


}
