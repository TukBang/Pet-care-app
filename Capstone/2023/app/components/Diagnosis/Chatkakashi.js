import React, { useState, useEffect } from 'react';
import { GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import { View, TouchableOpacity, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { handleEmail } from '../commonProperty/handleEmail';
import RBSheet from 'react-native-raw-bottom-sheet';
import { globalStyles } from '../commonProperty/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text:
        '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);
  const [uid, setUid] = useState('');
  const [reportUser, setReportUser] = useState(null);
  const StandardRef = React.useRef();

  useEffect(() => {
    const onAuthStateChanged = (user) => {
      if (user) {
        setUid(user.uid);
      }
    };

    const loadMessages = (callback) => {
      database()
        .ref('chat')
        .off();
      const onReceive = (data) => {
        const message = data.val();
        callback({
          _id: data.key,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
        });
      };

      database()
        .ref('chat')
        .orderByChild('locationInfo')
        .equalTo(route.params.city)
        .limitToLast(mChatLimit)
        .on('child_added', onReceive);
    };

    let sendMessage = (message) => {
      const today = new Date();
      const timestamp = today.toISOString();
      message.forEach((msg) => {
        if (setFilterText(msg.text)) {
          database().ref('chat').push({
            text: msg.text,
            user: msg.user,
            createdAt: timestamp,
            locationInfo: route.params.city,
            email: route.params.email,
          });
        } else {
          showToast(
            '불쾌감을 줄 수 있는 내용은 삼가 부탁드립니다',
            '전송 실패',
            defaultDuration,
            'top'
          );
        }
      });
    };

    const closeChat = () => {
      database().ref('chat').off();
    };

    let getLimit = () => {
      const today = new Date();
      today.setDate(today.getDate() - 31);
      return new Date(today).toISOString();
    };

    auth().onAuthStateChanged(onAuthStateChanged);
    loadMessages((message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
    });

    return () => {
      closeChat();
    };
  }, [route.params.city]);

  const onRenderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      containerStyle={{ backgroundColor: '#7cc8c3' }}
      textStyle={{ color: 'white', fontWeight: '500', fontSize: 17, textAlign: 'center' }}
    />
  );

  const onHandleEmail = () => {
    handleEmail(reportUser, '채팅 중 부적절한 메시지 사용 (스크린샷 첨부 권장)', route.params.city, null);
  };

  const onPressAvatar = (user) => {
    setReportUser(user.name);
    StandardRef.current.open();
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(message) => sendMessage(message)}
        user={{
          _id: uid,
          name: route.params.nickname,
        }}
        renderSystemMessage={onRenderSystemMessage}
        placeholder="메시지 입력"
        onPressAvatar={onPressAvatar}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <RBSheet
        ref={StandardRef}
        height={230}
        closeOnDragDown
        customStyles={{
          container: {
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <View style={globalStyles.GlobalRawBottomView}>
          <TouchableOpacity style={globalStyles.GlobalRawBottomTouchable} onPress={onHandleEmail}>
            <MaterialIcons name={'report-problem'} style={globalStyles.GlobalRawBottomIcon} />
            <Text style={globalStyles.GlobalRawBottomLabelStart}>신고하기</Text>
            <Text style={globalStyles.GlobalRawBottomLabelEnd} />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.GlobalRawBottomView}>
          <View style={globalStyles.GlobalRawBottomTouchable}>
            <Ionicons name={'ios-person'} style={globalStyles.GlobalRawBottomIcon} />
            <Text style={globalStyles.GlobalRawBottomLabelStart}>유저정보</Text>
            <Text style={globalStyles.GlobalRawBottomLabelEnd}>{reportUser}</Text>
          </View>
        </View>
        <View style={globalStyles.GlobalRawBottomView}>
          <TouchableOpacity style={globalStyles.GlobalRawBottomTouchable}>
            <MaterialIcons name={'thumb-down-alt'} style={globalStyles.GlobalRawBottomGrayIcon} />
            <Text style={globalStyles.GlobalRawBottomLabelGray}>싫어요</Text>
            <Text style={globalStyles.GlobalRawBottomLabelEnd} />
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default ChatScreen;
