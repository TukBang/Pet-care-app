import React from "react";
import { StyleSheet, View } from "react-native";
import { useUserContext } from "../../contexts/UserContext";

// const {user} = useUserContext();

function HomeScreen() {
    return (
    <View style={styles.block}>
        {/* {user.photoURL && (
        <Image
          source={{uri: user.photoURL}}
          style={{width: 128, height: 128, marginBottom: 16}}
          resizeMode="cover"
        />
      )} */}
    </View>
    )
}

const styles = StyleSheet.create({
    block: {},
});

export default HomeScreen;