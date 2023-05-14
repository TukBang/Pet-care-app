import React, { useState } from "react";
import { View, Text } from "react-native";
import AnimatedMarkers from "../../components/Walking/MapView";
import PreWalkingScreen from "./PreWalkingScreen";

const WalkingScreen = () => {
  const [walkingStart, setWalkingStart] = useState(false);
  const [isWalked, setIsWalked] = useState(false);

  return (
    <View>
      { !walkingStart
       ? (
      <View>
        <PreWalkingScreen onPress={() => setWalkingStart(true)}/>
      </View>
      ) : (
      <AnimatedMarkers />
      )
    }
      {/* <Text>
        산책 미구현
      </Text> */}
    </View>
  );
};

export default WalkingScreen;
