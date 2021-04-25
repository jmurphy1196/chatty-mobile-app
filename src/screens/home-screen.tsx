import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableOpacityBase,
} from "react-native";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { Block, Text, Icon } from "galio-framework";
import { capitalize } from "../util";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./main-screen-stack";
import PrimaryHeader from "../components/primary-header";
import FriendTab from "../components/friend-tab";
import AddFriend from "../components/add-friend";
import Colors from "../theme";

interface MainScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Main">;
}

const HomeScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [toggleAddFriend, setToggleAddFriend] = useState(false);
  const fullName = useTypedSelector((state) =>
    capitalize(`${state.user.firstName} ${state.user.lastName}`)
  );
  const friends = useTypedSelector(({ user }) => user.friends);
  const { getFriends } = useActions();

  useEffect(() => {
    getFriends(friends);
  }, []);

  return (
    <View>
      <PrimaryHeader
        reverse
        title={fullName}
        icon={!toggleAddFriend ? "user-plus" : "user-x"}
        iconColor='white'
        onIconPress={() => {
          setToggleAddFriend(!toggleAddFriend);
        }}
      />
      {toggleAddFriend && <AddFriend />}
      <ScrollView scrollEnabled={true} style={styles.friendsTab}>
        {friends.map((email) => {
          return (
            <FriendTab
              key={email}
              email={email}
              onPress={() => {
                navigation.push("Messages", { friendEmail: email });
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 35,
    paddingTop: 50,
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  headerNameBlock: {
    width: "85%",
  },
  friendsTab: {
    overflow: "scroll",
    height: "87%",
  },
});

export default HomeScreen;
