import React, { Component } from "react";

import { View, StyleSheet } from "react-native";
import { Block, Text, Button } from "galio-framework";
import PrimaryHeader from "../../components/primary-header";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../settings-screen";
import { useActions } from "../../hooks/use-actions";
import Colors from "../../theme";

interface SettingsProfilesScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Profile">;
}

const SettingsProfileScreen: React.FC<SettingsProfilesScreenProps> = ({
  navigation,
}) => {
  const user = useTypedSelector(({ user }) => user);
  const { logout } = useActions();
  return (
    <View>
      <PrimaryHeader
        onIconPress={() => {
          navigation.goBack();
        }}
        icon='arrow-left'
        iconColor='white'
        title='Profile'
      />
      <Block center style={styles.wrapper}>
        <Text style={styles.fieldHead} h4>
          Name
        </Text>
        <Block card style={styles.fieldBlock} center>
          <Text color='white'>{`${user.firstName} ${user.lastName}`}</Text>
        </Block>
        <Text style={styles.fieldHead} h4>
          Email
        </Text>
        <Block card style={styles.fieldBlock} center>
          <Text color='white'>{user.email}</Text>
        </Block>
        <Button
          color={Colors.WARNING}
          onPress={() => {
            navigation.navigate("Settings");
            logout();
          }}
        >
          Signout
        </Button>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  fieldHead: {},
  fieldBlock: {
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    width: "80%",
    marginBottom: 10,
  },
});

export default SettingsProfileScreen;
