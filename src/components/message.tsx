import React, { Component, useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { Block, Text } from "galio-framework";
import { ChatData } from "../socket-service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Colors from "../theme";

dayjs.extend(relativeTime);

interface MessageProps {
  message: ChatData;
  messageBefore?: ChatData;
}

const Message: React.FC<MessageProps> = ({ message, messageBefore }) => {
  const timeFromNow = dayjs(message.created_at).fromNow();
  let hoursFromNow: number | undefined;
  if (timeFromNow.includes("hours")) {
    hoursFromNow = +timeFromNow.split(" ")[0];
  } else if (timeFromNow.includes("minute")) {
    hoursFromNow = +timeFromNow.split(" ")[0];
    hoursFromNow = hoursFromNow === NaN ? 1 / 60 : hoursFromNow / 60;
  } else if (timeFromNow.includes("seconds")) {
    hoursFromNow = 1 / 60;
  } else {
    //is days
    hoursFromNow = +timeFromNow.split(" ")[0] * 24;
  }

  const currentHour = new Date().getHours();
  const timeToDisplay =
    hoursFromNow < currentHour
      ? timeFromNow
      : dayjs(message.created_at).format("MM/DD/YY");
  let timeFromLastMessage: any;
  if (messageBefore) {
    timeFromLastMessage = dayjs(messageBefore.created_at).from(
      message.created_at!
    );
  }
  const shouldDisplayTime =
    timeFromLastMessage?.includes("hour") || timeFromLastMessage === undefined
      ? true
      : false;
  const userEmail = useTypedSelector(({ user }) => user.email);
  let messageWidth = 0.1;
  messageWidth += message.content.length * 0.016;
  if (messageWidth > 0.6) {
    messageWidth = 0.6;
  }

  const newStyles = {
    ...styles,
    messageCardUser: {
      ...styles.messageCardUser,
      width: `${messageWidth * 100}%`,
      left: `${(1 - messageWidth) * 100}%`,
    },
    messageCardFriend: {
      ...styles.messageCardFriend,
      width: `${messageWidth * 100}%`,
    },
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.wrapper}>
      {message.status !== "sending" && shouldDisplayTime && (
        <Text style={{ textAlign: "center" }}>{timeToDisplay}</Text>
      )}
      {message.sender === userEmail ? (
        <Block card style={newStyles.messageCardUser}>
          <Text color='white'>{message.content}</Text>
        </Block>
      ) : (
        <Block card style={newStyles.messageCardFriend}>
          <Text color='black'>{message.content}</Text>
        </Block>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    padding: 5,
  },
  messageCardFriend: {
    backgroundColor: "white",
    padding: 10,
    width: "60%",
  },
  messageCardUser: {
    backgroundColor: Colors.DARK_PRIMARY,
    padding: 10,
    width: "60%",
    left: "40%",
  },
  timeDisplay: {},
});

export default Message;
