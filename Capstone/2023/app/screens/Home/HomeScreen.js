import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import Ggupdeagi from "../Ggupdeagi";



function HomeScreen() {

  const {user} = useUserContext();
    return (
    <View style={styles.block}>
      <Ggupdeagi />
      {user.photoURL && (
        <Image
          source={{uri: user.photoURL}}
          style={{width: 128, height: 128, marginBottom: 16}}
          resizeMode="cover"
        />
      )}
    </View>
    )
}

const styles = StyleSheet.create({
    block: {},
});

export default HomeScreen;