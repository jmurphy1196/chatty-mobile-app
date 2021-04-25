import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Switch, Text, Block, Button, Icon } from "galio-framework";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { isValidEmail, isValidPassword } from "../util";

import Colors from "../theme";

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { signin, signup } = useActions();
  const loading = useTypedSelector((state) => state.user.loading);

  const canSubmit = isLogin
    ? isValidEmail(email) && isValidPassword(password)
    : isValidEmail(email) &&
      isValidPassword(password) &&
      isValidPassword(password, confirmPassword) &&
      firstName.length > 1 &&
      lastName.length > 1;

  const handleSubmit = () => {
    if (isLogin) {
      signin(email, password);
    } else if (!isLogin) {
      signup(email, password, confirmPassword, firstName, lastName);
    }
  };
  return (
    <View style={styles.page}>
      <Block style={styles.heading} center>
        <Text h2 color='white'>
          Chatty
        </Text>
      </Block>
      <Block style={styles.radioButtons} center space='around'>
        <Block>
          <Text style={styles.subHead} size={22}>
            {isLogin ? "Login" : "Signup"}
          </Text>
          <Switch
            style={styles.toggleSwitch}
            value={isLogin}
            onChange={() => setIsLogin(!isLogin)}
          />
        </Block>
      </Block>
      <Block center>
        <Input
          placeholder='email'
          onChangeText={(text) => setEmail(text.trim())}
          family='Feather'
          icon={isValidEmail(email) ? "check" : "alert-circle"}
          iconColor={isValidEmail(email) ? Colors.SUCCESS : Colors.DANGER}
          right
        />
        <Input
          placeholder='password'
          password
          onChangeText={(text) => setPassword(text.trim())}
          family='Feather'
          viewPass
          iconColor={isValidPassword(password) ? Colors.SUCCESS : Colors.DANGER}
        />

        {!isLogin && (
          <>
            <Input
              placeholder='confirm password'
              password
              viewPass
              onChangeText={(text) => setConfirmPassword(text.trim())}
              iconColor={
                isValidPassword(password, confirmPassword)
                  ? Colors.SUCCESS
                  : Colors.DANGER
              }
            />
            <Input
              placeholder='first name'
              onChangeText={(text) => setFirstName(text.trim())}
              family='Feather'
              icon={firstName.length > 1 ? "check" : "alert-circle"}
              iconColor={firstName.length > 1 ? Colors.SUCCESS : Colors.DANGER}
              right
            />

            <Input
              placeholder='last name'
              onChangeText={(text) => setLastName(text.trim())}
              family='Feather'
              icon={lastName.length > 1 ? "check" : "alert-circle"}
              iconColor={lastName.length > 1 ? Colors.SUCCESS : Colors.DANGER}
              right
            />
          </>
        )}
        {!loading ? (
          <Button
            onPress={handleSubmit}
            color={!canSubmit ? Colors.MUTED : Colors.SUCCESS}
            disabled={!canSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button color='primary' disabled>
            ...
          </Button>
        )}
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    padding: 10,
    paddingTop: 35,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
  },
  radioButtons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  page: {
    backgroundColor: "#F5F5F5",
    height: "100%",
  },
  loadingBar: {
    width: "100%",
    height: 20,
  },
  subHead: {
    paddingBottom: 10,
    textAlign: "center",
  },
  toggleSwitch: {},
});

export default AuthScreen;
