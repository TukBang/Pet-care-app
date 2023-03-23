import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import  Icon  from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "./HomeScreen";
import CalendarScreen from "./CalendarScreen";
import WalkingScreen from "./WalkingScreen";
import CommunityScreen from "./CommunityScreen";
import DiagnosisScreen from "./DiagnosisScreen";

const Tab = createBottomTabNavigator();

// function HomeScreen({navigation}) {
//   return (
//     <View>
//         <Text>Home</Text>
//         <Button title="detail 1 open"
//             onPress={() => navigation.push('Detail',{id:1,})}
//         ></Button>
//     </View>
//   );
// }


function MainScreen() {
  return(
    <Tab.Navigator initialRouteName="Home" screenOptions={{
    tabBarActiveTintColor: '#fb8c00',
    tabBarShowLabel: true,
    headerShown: true,
    }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
            title: '홈',
            tabBarIcon: ({color, size}) => (
            <Icon name='home' color={color} size={size}/>
            ),
        }}/>
        <Tab.Screen name="WalkingScreen" component={WalkingScreen} options={{
            title: '산책',
            tabBarIcon: ({color, size}) => (
            <Icon name='pets' color={color} size={size}/>
            ),
        }}/>
        <Tab.Screen name="DiagnosisScreen" component={DiagnosisScreen} options={{
            title: '진단',
            tabBarIcon: ({color, size}) => (
            <Icon name='medical-services' color={color} size={size}/>
            // <Icon name='stethoscope' color={color} size={size}/>
            ),
        }}/>
        <Tab.Screen name="CalendarScreen" component={CalendarScreen} options={{
            title: '일정',
            tabBarIcon: ({color, size}) => (
            <Icon name='event-available' color={color} size={size}/>
            ),
        }}/>
        <Tab.Screen name="CommunityScreen" component={CommunityScreen} options={{
            title: '커뮤니티',
            tabBarIcon: ({color, size}) => (
            <Icon name='dashboard' color={color} size={size}/>
            ),
        }}/>

    </Tab.Navigator>
  )
}


export default MainScreen;