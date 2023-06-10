import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Button, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DiagnosisScreen from './DiagnosisScreen';
import DiagRecord from './DiagRecord';

const Tab = createMaterialTopTabNavigator();

function DiagTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="진단하기" 
      screenOptions={{
        
      }}
      >
      <Tab.Screen
        name="진단하기"
        component={DiagnosisScreen}
        options={{
          
        }}
      />
      <Tab.Screen
        name="진단 기록"
        component={DiagRecord}
        options={{

        }}
      />
    </Tab.Navigator>
  );
}


export default DiagTabNavigator;