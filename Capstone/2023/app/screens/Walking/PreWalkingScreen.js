import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";


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

export default PreWalkingScreen;