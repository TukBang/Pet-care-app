import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
        <View
          style={styles.container}
        >
          <AnimatedMarkers setWalkingStart={setWalkingStart}/>
        </View>
      )
    }
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default WalkingScreen;
