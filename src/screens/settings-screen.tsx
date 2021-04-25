import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsHomeScreen from "./settings/main-screen";
import SettingsProfileScreen from "./settings/profile-screen";
import FriendRequestScreen from "./settings/friend-requests-screen";

export type RootStackParamList = {
  Settings: undefined;
  Profile: undefined;
  FriendRequests: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const SettingsScreen: React.FC = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Settings' component={SettingsHomeScreen} />
      <Stack.Screen name='Profile' component={SettingsProfileScreen} />
      <Stack.Screen name='FriendRequests' component={FriendRequestScreen} />
    </Stack.Navigator>
  );
};
export default SettingsScreen;
