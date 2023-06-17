import React, { useState } from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import AnimatedMarkers from "../../components/Walking/MapView";
import PreWalkingScreen from "./PreWalkingScreen";



const WalkingScreen = () => {
  const [walkingStart, setWalkingStart] = useState(false);
  const [isWalked, setIsWalked] = useState(false);
  
  return (
    <LinearGradient
      colors={['#f6faff', '#f6faff']}
      // colors={['#F0F8FF', '#D1EEFD']}

      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
    <View>
      { !walkingStart ? (
        <View>
          <PreWalkingScreen onPress={() => setWalkingStart(true)}/>
        </View>
      ) : (
        <View>
          <AnimatedMarkers />
        </View>
      )
    }
    </View>
    </LinearGradient>
  );
};

export default WalkingScreen;
