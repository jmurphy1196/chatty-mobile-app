import React, { Component } from "react";
import Colors from "../../theme";
import PrimaryHeader from "../../components/primary-header";
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../settings-screen";

interface FriendRequestsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "FriendRequests">;
}

const FriendRequestScreen: React.FC<FriendRequestsScreenProps> = ({
  navigation,
}) => {
  return (
    <View>
      <PrimaryHeader
        icon='arrow-left'
        iconColor='white'
        title='Friend Requests'
        onIconPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default FriendRequestScreen;
