import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useUserContext } from '../../contexts/UserContext';
import { TextInput } from 'react-native/types';

const ChatScreenCom = () => {
  const [messages, setMessages] = useState([]);
  // rconst [responseMessage, setResponseMessage] = useState("");
  const [textInputEnable, setTextInputEnable] = useState(true);
  const [textInputValue, setTextInputValue] = useState("챗봇에게 궁금한 것을 물어보세요!");
  const {user} = useUserContext();
  const uid = user["id"];
  const userNickName = user['displayName'];
  const serverUrl = "http://222.98.82.134:5000/chatbot";

  const postMessage = async (message) => {
    try {
      const textMessage = message[0].text;
      console.log("서버에 전달 될 메시지 내용: " + textMessage);
      
      // POST and Response
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          uid: uid,
          message: textMessage,
        })
      });
      const responseJson = await response.json();

      console.log("서버에서 받은 메시지 내용: " + responseJson.message);
      // setResponseMessage(responseJson.message);

      // 서버에서 받은 메시지를 화면에 표시합니다.
      const receivedMessage = generateResponseMessage(responseJson.message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, receivedMessage)
      );

      // Enable TextInput
      setTextInputEnable(true);
      setTextInputValue("챗봇에게 궁금한 것을 물어보세요!")
    }
    catch (error) {
      console.log(error);

      // Enable TextInput
      setTextInputEnable(true);
      setTextInputValue("서버 응답 실패!")
    }
  };

  const generateSentMessage = (messages) => {
    // Disable TextInput
    setTextInputEnable(false);

    // 서버에 메시지를 전달합니다.
    postMessage(messages);

    // 내가 보낸 메시지를 생성합니다.
    const sentMessage = messages.map((message) => ({
      _id: Math.round(Math.random() * 1000000),
      text: message.text,
      createdAt: new Date(),
      user: {
        _id: uid,           // 현재 사용자 ID
        name: userNickName, // 현재 사용자 이름
      },
    }));

    setTextInputValue("서버 응답 대기 중...")
    return sentMessage;
  };

  const generateResponseMessage = (message) => {
    const responseMessage = [{
      _id: Math.round(Math.random() * 1000000),
      text: message,          // 응답 텍스트
      createdAt: new Date(),  // 보낸 시간
      user: {
        _id: 2,               // 챗봇 사용자 ID
        name: 'chatbot',      // 챗봇 이름
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
        _id: uid, // 현재 사용자 ID
      }}
      textInputProps={{
        editable: textInputEnable,
        multiline: false,
        placeholder: textInputValue
      }}
    />
  );
};

export default ChatScreenCom;