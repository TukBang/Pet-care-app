// import React, {useMemo} from 'react';
// import {View, StyleSheet, Text, Image, Pressable} from 'react-native';

// // PostCard는 커뮤니티 화면에 보이는 게시글을 불러옵니다
// // 유저 닉네임, 유저 프로필 사진, 게시글 제목, 이미지, 게시글 내용으로 구성되어 있습니다.

// function PostCard({user, category,title, photoURL, description, createdAt, id}) {
//   const date = useMemo(
//     () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
//     [createdAt],
//   );

//   const onOpenProfile = () => {
//     // TODO: 사용자 프로필 화면 열기
//   };

//   return (
//     <View style={styles.block}>
//       {/* 게시글 윗부분(헤더) - 이미지와 게시글 제목 및 내용 으로 구성되어 있음 */}
//       <View style={ styles.paddingBlock}>
//         <View style={styles.head}>
//           {/* 게시글 이미지 */}
//           <Image
//             source={{uri: photoURL}}
//             style={styles.image}
//             resizeMethod="resize"
//             resizeMode="cover"
//           />
//           <View>
//             {
//               category ? (<Text numberOfLines={2} ellipsizeMode="tail" style={styles.boardTitle}>{category} {title}</Text>)
//               : (<Text style={styles.boardTitle}>[없음] {title}</Text>)
//             }
//             <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>{description}</Text>
//           </View>
//         </View>
//         {/* tail 프로필 이미지, 닉네임, 게시글 게시 시각으로 구성되어 있음 */}
//         <View style={styles.tail}>
//           <Pressable style={styles.profile} onPress={onOpenProfile}>
//             {/* Pressable 내부 요소를 누르면 onOpenProfile 작동 -> 프로필 정보 확인 (아직 미구현) */}
//               <Image
//                   source={
//                       user.photoURL
//                       ? {
//                           uri: user.photoURL,
//                       }
//                       : require('../../assets/user.png')
//                   } 
//                   resizeMode="cover"
//                   style={styles.avatar} 
//               />
//             <Text style={styles.displayName}>{user.displayName}</Text>
//           </Pressable>
//           <Text date={date} style={styles.date}>
//             {date.toLocaleString()}
//           </Text>
//         </View>
//       </View>
//       {/* 게시글 아래 구분선 */}
//       <View style={styles.border} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   block: {
//     // paddingTop: 16,
//     // paddingBottom: 16,
//   },
//   border: {
//     height: 1, 
//     backgroundColor: 'gray',
//     // marginBottom: 10,
//     marginLeft: 10,
//     marginRight: 20,
//   },
//   avatar: {
//     width: 15,
//     height: 15,
//     borderRadius: 16,
//     // alignSelf:'right'
//   },
//   paddingBlock: {
//     paddingHorizontal: 16,
//   },
//   head: {
//     flexDirection: 'row',
//     marginTop: 16,
//     marginBottom: 6,
//     // marginBotton: 20,
//     // paddingBotton: 14,
//   },
//   tail: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   profile: {
//     flexDirection: 'row',
//     // alignItems: 'center',
//   },
//   displayName: {
//     // lineHeight: 20,
//     fontSize: 13,
//     marginLeft: 3,
//     fontWeight: 'bold',
//     justifyContent: 'space-between',
//   },
//   boardTitle: {
//     // lineHeight: 20,
//     fontSize: 16,
//     marginLeft: 6,
//     fontWeight: 'bold',
//   },
//   image: {
//     backgroundColor: '#bdbdbd',
//     width: '20%',
//     aspectRatio: 1,
//     // marginBottom: 6,
//     // marginTop: 6,
//     borderRadius: 10,
//   },
//   description: {
//     fontSize: 16,
//     // lineHeight: 24,
//     marginLeft: 8,
//   },
//   date: {
//     color: '#757575',
//     fontSize: 12,
//     lineHeight: 18,
//     marginLeft: 14
//   },
// });

// export default PostCard;
import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';

function PostCard({ user, category, title, photoURL, description, createdAt, id }) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt],
  );

  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };

  return (
    <View style={styles.block}>
      <View style={styles.paddingBlock}>
        <View style={styles.head}>
          <Image
            source={{ uri: photoURL }}
            style={styles.image}
            resizeMethod="resize"
            resizeMode="cover"
          />
          <View>
            {category ? (
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.boardTitle}>
                {category} {title}
              </Text>
            ) : (
              <Text style={styles.boardTitle}>[없음] {title}</Text>
            )}
            <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>
              {description}
            </Text>
          </View>
        </View>
        <View style={styles.tail}>
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
          <Text date={date} style={styles.date}>
            {date.toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.border} />
    </View>
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
    marginRight: 20,
  },
  avatar: {
    width: 15,
    height: 15,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 6,
    // marginBotton: 20,
    // paddingBotton: 14,
  },
  tail: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  displayName: {
    // lineHeight: 20,
    fontSize: 13,
    marginLeft: 3,
    fontWeight: 'bold',
    justifyContent: 'space-between',
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


export default React.memo(PostCard);