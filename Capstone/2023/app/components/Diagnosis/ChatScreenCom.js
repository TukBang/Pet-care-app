import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreenCom = () => {
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages = []) => {
    // 내가 보낸 메시지를 생성하여 화면에 표시합니다.
    const sentMessage = generateSentMessage(newMessages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, sentMessage)
    );

    // 상대방의 응답 메시지를 생성하여 화면에 표시합니다.
    const receivedMessage = generateReceivedMessage(newMessages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, receivedMessage)
    );
  };

  const generateSentMessage = (messages) => {
    // 내가 보낸 메시지를 생성합니다.
    const sentMessage = messages.map((message) => ({
      _id: Math.round(Math.random() * 1000000),
      text: message.text,
      createdAt: new Date(),
      user: {
        _id: 1, // 현재 사용자 ID
        name: '나', // 현재 사용자 이름
      },
    }));

    return sentMessage;
  };

  const generateReceivedMessage = (messages) => {
    // 예시로, 상대방이 다시 보낸 메시지를 생성합니다.
    const receivedMessage = messages.map((message) => ({
      _id: Math.round(Math.random() * 1000000),
      text: message.text, // 상대방이 보내는 메시지 텍스트
      createdAt: new Date(),
      user: {
        _id: 2, // 상대방 사용자 ID
        name: '상대방', // 상대방 사용자 이름
      },
    }));

    return receivedMessage;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1, // 현재 사용자 ID
      }}
    />
  );
};

export default ChatScreenCom;

// import React, { useState, useCallback, useEffect } from 'react'
// import { GiftedChat } from 'react-native-gifted-chat'

// function ChatScreenCom() {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'Hello developer',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//     ])
//   }, [])

//   const onSend = useCallback((messages = []) => {
//     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//   }, [])

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={messages => onSend(messages)}
//       user={{
//         _id: 1,
//       }}
//     />
//   )
// }

// export default ChatScreenCom;