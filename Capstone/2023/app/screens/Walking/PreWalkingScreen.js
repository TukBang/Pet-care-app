import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


const PreWalkingScreen = ({onPress}) => {
  const [walkingStart, setWalkingStart] = useState(false);
  const [isWalked, setIsWalked] = useState(false);

  return (
    <View>
        <Text>Container</Text>
        <TouchableOpacity onPress={onPress}>
            <Text>산책 시작</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // 버튼
  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: 40,
    width: 330,
    borderRadius: 5,
  },
})

export default PreWalkingScreen;