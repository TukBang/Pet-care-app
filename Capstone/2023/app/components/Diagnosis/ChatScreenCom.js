import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreenCom = () => {
  const [messages, setMessages] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const postMessage = async (message) => {
    try {
      console.log(message);
      const textMessage = message[0].text;
      console.log("서버에 전달 될 메시지 내용: " + textMessage);

      // 서버에 메시지를 전달하는 로직을 구현합니다.
      const response = await fetch("http://61.106.219.238:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // user uid도 가져와서 보내고 싶음
          // 뒤로가기 누르면 채팅 내용을 삭제시키거나, 보존시킬 수 있게 해야 함
          uid: "", // 여기에 보내는 사람의 uid를 채울 수 있게 해야함 (2023-05-21-2227)
          message: textMessage,
        }),
      });

      const responseJson = await response.json();
      console.log("서버에서 받은 메시지 내용: " + responseJson.message);
      setResponseMessage(responseJson.message);

      // 서버에서 받은 메시지를 화면에 표시합니다.
      const reponseMessage = generateResponseMessage(responseMessage);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, reponseMessage)
      );

      // 여기서 TextInput 활성화
      // setTextInputEnable(true);
    }
    catch (error) {
      console.log(error);
    }
  };

  const generateSentMessage = (messages) => {
    // setTextInputEnable(false);
    // 예시로, 상대방이 다시 보낸 메시지를 생성합니다.
    postMessage(messages);

    // 데이터가 오기 전까지는, TextInput을 비활성화
    // 데이터가 오면, TextInput을 활성화
    // 승훈이의 지식이 필요하다.

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

  const generateResponseMessage = (message) => {
    const responseMessage = [{
      _id: Math.round(Math.random() * 1000000),
      text: message, // 상대방이 보내는 메시지 텍스트
      createdAt: new Date(),
      user: {
        _id: 2, // 상대방 사용자 ID
        name: '상대방', // 상대방 사용자 이름
      },
    }];

    return responseMessage;
  };

  const onSend = (newMessages = []) => {
    // 내가 보낸 메시지를 생성하여 화면에 표시합니다.
    console.log(newMessages)
    const sentMessage = generateSentMessage(newMessages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, sentMessage)
    );
  };

  // prop TextInput 활성화 여부
  // prop TextInput에 입력된 값
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