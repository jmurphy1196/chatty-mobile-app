import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "galio-framework";
import MainStackScreen from "./src/screens/main-screen-stack";
import SettingsScreen from "./src/screens/settings-screen";
import { useTypedSelector } from "./src/hooks/use-typed-selector";
import { useActions } from "./src/hooks/use-actions";
import { getData, deleteData } from "./src/util";
import axios from "axios";
import MainScreenStack from "./src/screens/main-screen-stack";
import AuthScreen from "./src/screens/auth-screen";
import SocketService from "./src/socket-service";
const Tabs = createBottomTabNavigator();

export interface RootStackParamList {
  Home: undefined;
  Auth: undefined;
}

export let socketService = new SocketService("");

export default function App() {
  const token = useTypedSelector((state) => state.user.token);
  const { getUser } = useActions();
  useEffect(() => {
    (async () => {
      if (!token) {
        const user_token = await getData("token");
        if (user_token) {
          console.log("SETTING AXIOS AUTH HEADER TO STORED USER TOKEN");
          axios.defaults.headers.Authorization = `Bearer ${user_token}`;
          getUser(user_token);
          socketService = new SocketService(user_token);
        }
      } else {
        socketService = new SocketService(token);
        if (!axios.defaults.headers.Authorization) {
          console.log("SETTING AXIOS AUTH HEADER TO REDUX TOKEN STATE");
          axios.defaults.headers.Authorization = `Bearer ${token}`;
        }
      }
    })();
  }, []);
  return (
    <>
      <NavigationContainer>
        <Tabs.Navigator
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        >
          <Tabs.Screen
            options={{
              tabBarIcon: ({ color }) => {
                return <Icon name='home' family='Feather' />;
              },
            }}
            name='home'
            component={token ? MainScreenStack : AuthScreen}
          />
          <Tabs.Screen
            options={{
              tabBarIcon: ({ color }) => {
                return <Icon name='settings' family='Feather' />;
              },
            }}
            name='settings'
            component={SettingsScreen}
          />
        </Tabs.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
