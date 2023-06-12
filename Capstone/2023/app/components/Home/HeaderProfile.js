import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// 그라데이션
import LinearGradient from 'react-native-linear-gradient';

// Header Profile
function HeaderProfile({ user, onPress }) {
  return (
    <LinearGradient
      colors={['#FFF5EE', '#FFDFD4']}
      //colors={['#FFF0E6', '#FFD7C6']}
      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      >
      <View style={styles.container}>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        일반회원, 전문가
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Text style={styles.textStyle}>{user.isExpert ? '전문가' : '일반회원'}</Text>

        
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        엡 가이드 넣는 부분
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Icon style={styles.iconImage} name='help-outline' size={53} />

        <View style={styles.block}>
          <Pressable onPress={onPress}>
            <Image
              source={
                user.photoURL
                  ? {
                      uri: user.photoURL,
                    }
                  : require("../../assets/user.png")
              }
              resizeMode="cover"
              style={styles.avatar}
            />
          </Pressable>
        </View>
      </View>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  block: {
    width: 44,
    height: 44,
    right: 20,
    marginRight: 20,
    borderWidth: 4,
    borderColor: 'gray',
    borderRadius: 25,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: "hidden",
    // paddingHorizontal: 1,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconImage: {
    marginRight: 10,
    right: 20,
    color: 'gray',
  },
  textStyle: {
    marginRight: "64%",
    left: 40,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default HeaderProfile;