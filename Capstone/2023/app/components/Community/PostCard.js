import React, {useMemo} from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';

// PostCard는 커뮤니티 화면에 보이는 게시글을 불러옵니다
// 유저 닉네임, 유저 프로필 사진, 게시글 제목, 이미지, 게시글 내용으로 구성되어 있습니다.

function PostCard({user, category,title, photoURL, description, createdAt, id}) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt],
  );

  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };

  return (
    <View style={styles.block}>
      {/* 게시글 윗부분(헤더) - 프로필 사진, 유저 닉네임, 게시글 제목으로 구성되어 있음 */}
      <View style={[styles.head, styles.paddingBlock]}>
        <Pressable style={styles.profile} onPress={onOpenProfile}>
          {/* Pressable 내부 요소를 누르면 onOpenProfile 작동 -> 프로필 정보 확인 (아직 미구현) */}
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
          {
            category ? (<Text style={styles.displayName}>{category}</Text>)
            : (<Text style={styles.displayName}>[없음] </Text>)
          }
          <Text style={styles.displayName}>{title}</Text>
        </Pressable>
      </View>
      {/* 게시글 이미지 */}
      <Image
        source={{uri: photoURL}}
        style={styles.image}
        resizeMethod="resize"
        resizeMode="cover"
      />
      {/* 게시글 내용 */}
      <View style={styles.paddingBlock}>
        <Text style={styles.description}>{description}</Text>
        <Text date={date} style={styles.date}>
          {date.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    lineHeight: 20,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '100%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default PostCard;