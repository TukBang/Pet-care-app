import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import useCommentActions from '../../hooks/useCommentAction';
import ActionSheetModal from '../ActionSheetModal';
import { useUserContext } from '../../contexts/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

function CommentCard({ user, txt, postId, createdAt,id}) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt],
  );
  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };
  const {user: me} = useUserContext();
  const isMyPost = me.id === user.id;

  const {isSelecting, onPressMore, onClose, actions} = useCommentActions({
    id:id,
    comment:txt,

  });

  return (
    <>
        <View style={styles.block}>
            <View style={styles.paddingBlock}>
                <View style={styles.tail}>
                    <View style={{flexDirection:'row'}}>
                        <Pressable style={styles.profile} onPress={onOpenProfile}>
                            <Image
                            source={
                                user.photoURL
                                ? {
                                    uri: user.photoURL,
                                    }
                                : require('../../assets/user.png')
                            }
                            resizeMode="cover"
                            style={styles.avatar}
                            />
                            <Text style={styles.displayName}>{user.displayName}</Text>
                        </Pressable>
                        {isMyPost && (
                            <Pressable style={{alignSelf: 'flex-end'}} onPress={onPressMore} hitSlop={8}>
                                <Icon name="more-vert" size={25} />
                            </Pressable>
                        )}
                    </View>
                    <Text style={{fontSize:15}}>
                        {txt}
                    </Text>
                    <Text date={date} style={styles.date}>
                        {date.toLocaleString()}
                    </Text>
                </View>
            </View>
                <View style={styles.border} />
            </View>
            <ActionSheetModal
            visible={isSelecting}
            actions={actions}
            onClose={onClose}
            />
    </>
  );
}
const styles = StyleSheet.create({
  block: {
    // paddingTop: 16,
    // paddingBottom: 16,
  },
  border: {
    height: 1, 
    backgroundColor: 'gray',
    // marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  tail: {
    // flexDirection: 'row',
    // marginBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    flex:1,
    // alignItems: 'center',
  },
  displayName: {
    // lineHeight: 20,
    fontSize: 13,
    marginLeft: 3,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  boardTitle: {
    // lineHeight: 20,
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '20%',
    aspectRatio: 1,
    // marginBottom: 6,
    // marginTop: 6,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    // lineHeight: 24,
    marginLeft: 8,
  },
  date: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 14
  },
});


export default React.memo(CommentCard);