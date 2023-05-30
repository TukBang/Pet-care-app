import React from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";

// Header Profile
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
    width: 41,
    height: 41,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#827397',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
    // overflow: "hidden",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: "hidden",


  },
});

export default HeaderProfile;
