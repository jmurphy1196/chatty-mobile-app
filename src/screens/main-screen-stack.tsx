import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTypedSelector } from "../hooks/use-typed-selector";
import HomeScreen from "./home-screen";
import Messages from "./messages";
export type RootStackParamList = {
  Main: undefined;
  Messages: { friendEmail: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const MainScreenStack: React.FC = () => {
  const token = useTypedSelector(({ user }) => user.token);
  return (
    <Stack.Navigator headerMode='none' initialRouteName='Main'>
      <Stack.Screen name='Main' component={HomeScreen} />
      <Stack.Screen name='Messages' component={Messages} />
    </Stack.Navigator>
  );
};

export default MainScreenStack;
