import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import WalkingScreen from './WalkingScreen';
import WalkRecord from './WalkingRecord';

const Tab = createMaterialTopTabNavigator();

function WalkTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="산책 하기"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F6FAFF",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#3A8DF8",
        },
        tabBarActiveTintColor: "#282828",
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen
        name="산책 하기"
        component={WalkingScreen}
        options={{
          headerStyle: {
            backgroundColor: '#F6FAFF',
          },
        }}
      />
      <Tab.Screen
        name="산책 기록"
        component={WalkRecord}
        options={{
          headerStyle: {
            backgroundColor: '#F6FAFF',
          },
        }}
      />
    </Tab.Navigator>
  );
}


export default WalkTabNavigator;