import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Block, Text, Card } from "galio-framework";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { capitalize } from "../util";

interface FriendTabProps {
  email: string;
  onPress?: () => void;
}

const FriendTab: React.FC<FriendTabProps> = ({ email, onPress }) => {
  const friend = useTypedSelector((state) => state.data.friends[email]);
  console.log(friend);
  return (
    <View>
      <Block>
        <TouchableOpacity onPress={onPress}>
          {friend.loading !== false ? (
            <Card
              title={"loading..."}
              caption={"..."}
              shadow
              avatar={
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              }
            />
          ) : (
            <Card
              title={capitalize(`${friend.firstName} ${friend.lastName}`)}
              caption={friend.email}
              shadow
              avatar={
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              }
            />
          )}
        </TouchableOpacity>
      </Block>
    </View>
  );
};

export default FriendTab;
