import React, { useState } from "react";
import { View, Text } from "react-native";
import AnimatedMarkers from "../../components/Walking/MapView";

const WalkingScreen = () => {
  const [walkingStart, setWalkingStart] = useState(false);

  return (
    <View>
      <AnimatedMarkers />
      {/* <Text>
        산책 미구현
      </Text> */}
    </View>
  );
};

export default WalkingScreen;
