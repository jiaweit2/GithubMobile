import React from 'react';
import { View, TouchableOpacity, AsyncStorage, Platform, } from 'react-native';
import { Icon } from 'react-native-elements';
import { HeaderBackButton, createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import RepoScreen from '../screens/RepoScreen';
import FollowerScreen from '../screens/FollowerScreen';
import FollowingScreen from '../screens/FollowingScreen';
import NotiScreen from '../screens/NotiScreen';
import SearchScreen from '../screens/SearchScreen';
import VisualScreen from '../screens/VisualScreen';



const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: <View style={{ marginRight: 20 }}><TouchableOpacity onPress={() => {
          navigation.navigate("Signin");
        }} ><Icon name={`ios-exit`} type='ionicon' /></TouchableOpacity></View>,

        headerLeft: <View style={{ marginLeft: 20 }}><TouchableOpacity onPress={() => {
          navigation.navigate("Noti");
        }} ><Icon name={`ios-notifications`} type='ionicon' /></TouchableOpacity></View>
      })
    },
    Noti: {
      screen: NotiScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    },
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={`logo-github${focused ? '' : ''}`}
    />
  ),
};

HomeStack.path = '';

const RepoStack = createStackNavigator(
  {
    Repo: RepoScreen,
    Search: {
      screen: SearchScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    },
    Visual: {
      screen: VisualScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    },
  },
  config
);

RepoStack.navigationOptions = {
  tabBarLabel: 'Repos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={`ios-apps${focused ? '' : ''}`} />
  ),
};

RepoStack.path = '';

const FollowerStack = createStackNavigator(
  {
    Follower: FollowerScreen,
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    }
  },
  config
);

FollowerStack.navigationOptions = {
  tabBarLabel: 'Follower',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={`md-contacts${focused ? '' : ''}`} />
  ),
};

FollowerStack.path = '';

const FollowingStack = createStackNavigator(
  {
    Following: FollowingScreen,
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => {
          navigation.goBack(null);
        }} />
      })
    },
  },
  config
);

FollowingStack.navigationOptions = {
  tabBarLabel: 'Following',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={`ios-heart${focused ? '' : ''}`} />
  ),
};

FollowingStack.path = '';



const tabNavigator = createBottomTabNavigator({
  HomeStack,
  RepoStack,
  FollowerStack,
  FollowingStack,
});

tabNavigator.path = '';

export default tabNavigator;
