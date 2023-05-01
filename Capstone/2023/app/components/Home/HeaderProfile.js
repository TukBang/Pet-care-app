import React from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";

// 게시글 Submit 할 때 사용
function HeaderProfile({ user, onPress }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  block: {
    // marginRight: -8,
    // borderRadius: 24,
    overflow: "hidden",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 16,
    marginRight: 10,
  },
});

export default HeaderProfile;
