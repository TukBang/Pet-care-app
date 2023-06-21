import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import WalkingScreen from './WalkingScreen';
import WalkRecord from './WalkingRecord';

const Tab = createMaterialTopTabNavigator();

function WalkTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="산책 하기">
      <Tab.Screen
        name="산책 하기"
        component={WalkingScreen}
        options={{
        }}
      />
      <Tab.Screen
        name="산책 기록"
        component={WalkRecord}
        options={{

        }}
      />
    </Tab.Navigator>
  );
}


export default WalkTabNavigator;