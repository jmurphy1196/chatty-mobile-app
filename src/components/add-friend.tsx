import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Input, Button, Block, Icon } from "galio-framework";
import { isValidEmail } from "../util";
import { useActions } from "../hooks/use-actions";
import Colors from "../theme";

const AddFriend: React.FC = () => {
  const [email, setEmail] = useState("");
  const { addFriend } = useActions();
  return (
    <View>
      <Block style={styles.addFriendBar} row>
        <TouchableOpacity
          onPress={async () => {
            if (isValidEmail(email)) {
              if (await addFriend(email)) {
                Alert.alert(
                  "Friend Request Sent",
                  `Friend request sent to user ${email}`
                );
              } else {
                Alert.alert(
                  "Friend Request Failed",
                  `Cannot find user ${email}`
                );
              }
              setEmail("");
            }
          }}
        >
          <Icon
            size={30}
            family='Feather'
            name={"user-plus"}
            color={isValidEmail(email) ? Colors.SUCCESS : Colors.DARK_PRIMARY}
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
        <Block center style={styles.addInputBlock}>
          <TextInput
            style={styles.addInput}
            value={email}
            placeholder='email'
            onChangeText={(text) => setEmail(text.trim())}
          />
        </Block>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  addFriendBar: {
    width: "100%",
    paddingTop: 20,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    height: 50,
    marginBottom: 10,
  },
  cancelIcon: {
    marginRight: 30,
  },
  addInput: {
    height: 30,
    width: "75%",
  },
  addInputBlock: {
    width: "80%",
  },
});

export default AddFriend;
