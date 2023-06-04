import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Header Profile
function HeaderProfile({ user, onPress }) {
  return (
    <View style={styles.container}>
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      일반회원, 전문가
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      <Text style={styles.textStyle}> 일반회원</Text>

      
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

  );
}

const styles = StyleSheet.create({
  block: {
    width: 44,
    height: 44,
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
    marginRight: 7,
    color: 'gray',
  },
  textStyle: {
    marginRight: "54%",
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default HeaderProfile;