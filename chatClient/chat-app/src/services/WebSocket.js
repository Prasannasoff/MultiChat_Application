import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const WEBSOCKET_URL = 'https://multichat-application-1.onrender.com/ws';

let stompClient = null;

let isSubscribed = false;

export const connect = (CurrentUser, onMessageReceived, onPrivateMessageReceived) => {
  if (!isSubscribed) {
    const socket = new SockJS(WEBSOCKET_URL);
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        if (!isSubscribed) {
          stompClient.subscribe('/chatroom/public', (message) => {
            onMessageReceived(JSON.parse(message.body));
          });

          stompClient.subscribe(`/user/${CurrentUser}/queue/private`, (message) => {
            onPrivateMessageReceived(JSON.parse(message.body));
          });

          isSubscribed = true;  // Mark as subscribed
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    stompClient.activate();
  }
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
