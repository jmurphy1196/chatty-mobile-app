import React, { Component, useEffect, useReducer } from "react";
import Colors from "../../theme";
import PrimaryHeader from "../../components/primary-header";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../settings-screen";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { useActions } from "../../hooks/use-actions";
import { Block, Text, Card } from "galio-framework";
interface FriendRequestsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "FriendRequests">;
}

const FriendRequestScreen: React.FC<FriendRequestsScreenProps> = ({
  navigation,
}) => {
  const userEmail = useTypedSelector(({ user }) => user.email);
  const myFriendRequests = useTypedSelector(
    ({ data }) => data.myFriendRequestOrder
  );
  const mySentFriendRequests = useTypedSelector(
    ({ data }) => data.mySentFriendRequestOrder
  );

  const {
    getFriendRequests,
    acceptOrDenyFriendRequest,
    getFriends,
  } = useActions();

  useEffect(() => {
    getFriendRequests();
  }, []);
  return (
    <View>
      <PrimaryHeader
        icon='arrow-left'
        iconColor='white'
        title='Friend Requests'
        onIconPress={() => navigation.goBack()}
      />
      <Block center>
        <Text h6>My Friend Requests</Text>
      </Block>
      {!myFriendRequests.length && (
        <Block center>
          <Text>none available</Text>
        </Block>
      )}
      <ScrollView>
        {myFriendRequests.map((request) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(request.sender, "accept or deny friend request", [
                  { text: "Deny" },
                  {
                    text: "Accept",
                    onPress: async () => {
                      const friendEmail = await acceptOrDenyFriendRequest(
                        request.id,
                        "accept"
                      );
                      if (friendEmail) {
                        //@ts-ignore
                        getFriends([`${friendEmail}`]);
                      }
                    },
                  },
                ]);
              }}
            >
              <Card
                title={request.sender}
                caption={request.status}
                shadow
                avatar={
                  "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                }
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Block center>
        <Text h6>Sent Friend Requests</Text>
      </Block>
      {!mySentFriendRequests.length && (
        <Block center>
          <Text>none available</Text>
        </Block>
      )}
      <ScrollView>
        {mySentFriendRequests.map((request) => {
          return (
            <Card
              title={request.recipient}
              caption={request.status}
              shadow
              avatar={
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FriendRequestScreen;
