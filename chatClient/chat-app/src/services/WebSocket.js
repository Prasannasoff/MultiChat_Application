// src/services/WebSocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8081/ws'; // Adjust to your server URL

let stompClient = null;

export const connect = (CurrentUser, onMessageReceived, onPrivateMessageReceived) => {
  const socket = new SockJS(WEBSOCKET_URL);

  console.log("Name" + CurrentUser);
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {},
    debug: (str) => console.log(str),
    onConnect: () => {
      stompClient.subscribe('/chatroom/public', (message) => {
        console.log("Public Message Received", message.body);
        onMessageReceived(JSON.parse(message.body));
      });
      stompClient.subscribe(`/user/${CurrentUser}/queue/private`, (message) => {
        console.log("Private Message Received", message.body);
        onPrivateMessageReceived(JSON.parse(message.body));
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
  });

  stompClient.activate();
};

export const sendPublicMessage = (message) => {
  stompClient.publish({
    destination: '/app/message',
    body: JSON.stringify(message),
  });
};

export const sendPrivateMessage = (message) => {
  stompClient.publish({
    destination: '/app/private-message',
    body: JSON.stringify(message),
  });
};
