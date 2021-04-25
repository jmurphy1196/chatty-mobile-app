import React, { Component, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../settings-screen";
import { Block, Button, Icon, Text } from "galio-framework";
import PrimaryHeader from "../../components/primary-header";
import Colors from "../../theme";

import { useTypedSelector } from "../../hooks/use-typed-selector";
interface SettingsHomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
}

const SettingsHomeScreen: React.FC<SettingsHomeScreenProps> = ({
  navigation,
}) => {
  const userId = useTypedSelector(({ user }) => user.id);
  const accountButtonStyle = userId
    ? styles.buttons
    : { ...styles.buttons, ...styles.mutedButtons };
  return (
    <View>
      <PrimaryHeader icon='heart' iconColor={Colors.PRIMARY} title='Settings' />

      <Block center style={styles.mainBlock}>
        <Text h6>Account</Text>
        <TouchableOpacity
          style={{ width: "100%" }}
          disabled={userId === null}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text color='white' style={accountButtonStyle}>
            <Icon name='user' color='white' family='Feather' /> Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={userId === null}
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("FriendRequests")}
        >
          <Text color='white' style={accountButtonStyle}>
            <Icon name='users' color='white' family='Feather' /> Friend requests
          </Text>
        </TouchableOpacity>
        <Text h6>General</Text>
        <TouchableOpacity style={{ width: "100%" }}>
          <Text
            color='white'
            style={{ ...styles.buttons, backgroundColor: Colors.WARNING }}
          >
            <Icon name='help-circle' color='white' family='Feather' /> About
          </Text>
        </TouchableOpacity>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderColor: Colors.MUTED,
    borderWidth: 0.5,
    margin: 0,
  },
  mutedButtons: {
    backgroundColor: Colors.MUTED,
  },
  mainBlock: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
  icon: {},
  text: {
    width: "100%",
    color: "white",
    textAlign: "center",
    marginRight: 20,
  },
  block: {
    height: "100%",
  },
  view: {
    height: "100%",
  },
});

export default SettingsHomeScreen;
