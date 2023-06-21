import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ChatScreenCom from './ChatScreenCom';

function ChatBot() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6FAFF" }}>
      <StatusBar 
        barStyle="dark-content" />
      <ChatScreenCom />
    </SafeAreaView>
  );
};

export default ChatBot;