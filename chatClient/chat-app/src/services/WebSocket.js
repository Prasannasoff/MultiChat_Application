import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const WEBSOCKET_URL = 'http://localhost:8081/ws';

let stompClient = null;

export const connect = (CurrentUser, onMessageReceived, onPrivateMessageReceived) => {
  const socket = new SockJS(WEBSOCKET_URL);

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {},
    debug: (str) => console.log(str),
    onConnect: () => {
      stompClient.subscribe('/chatroom/public', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      stompClient.subscribe(`/user/${CurrentUser}/queue/private`, (message) => {
        onPrivateMessageReceived(JSON.parse(message.body));
      });

      // Fetch missed messages via an API call

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