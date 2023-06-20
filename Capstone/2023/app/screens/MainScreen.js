import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import HomeScreen from "./Home/HomeScreen";
import CalendarScreen from "./Calendar/CalendarScreen";
import CommunityScreen from "./Community/CommunityScreen";
import DiagTabNavigator from "./Diagnosis/DiagTabNavigator";
import WalkTabNavigator from "./Walking/WalkingTabNavigator";

const Tab = createBottomTabNavigator();

// 하단 네비케이터를 구성하고 있는 모듈
function MainScreen() {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#3A8DF8",        
        tabBarActiveBackgroundColor: '#D1EEFD',
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          title: "일정",
          tabBarIcon: ({ color, size }) => (
            <Icon name="event-available" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="WalkingScreen"
        component={WalkTabNavigator}
        options={{
          title: "산책",
          tabBarIcon: ({ color, size }) => <Icon name="pets" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          headerShown: true,
        }}
      />
      
      <Tab.Screen
        name="DiagTabNavigator"
        component={DiagTabNavigator}
        options={{
          title: "진단",
          tabBarIcon: ({ color, size }) => (
            <Icon name="medical-services" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color, size }) => <Icon name="dashboard" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainScreen;