import React, { Component, useState, useEffect, useRef } from "react";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { ScrollView, View, StyleSheet, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./main-screen-stack";
import { capitalize } from "../util";
import PrimaryHeader from "../components/primary-header";
import Message from "../components/message";
import MessageFooter from "../components/message-footer";
import Colors from "../theme";
import { socketService } from "../../App";
interface MessagesScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Messages">;
  route: RouteProp<RootStackParamList, "Messages">;
}

const Messages: React.FC<MessagesScreenProps> = ({ navigation, route }) => {
  const { friendEmail } = route.params;
  const scrollViewRef = useRef<any>();
  const userEmail = useTypedSelector(({ user }) => user.email);
  const friend = useTypedSelector(({ data }) => data.friends[friendEmail]);
  const { messages } = friend;
  const [windowHeight, setWindowHeight] = useState(1);
  const [windowWidth, setWindowWidth] = useState(1);
  const [input, setInput] = useState("");
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    SetDummyMessages,
    sendMessage,
    getMessages,
    resetMessageFetch,
  } = useActions();

  useEffect(() => {
    getMessages(friendEmail);
  }, []);
  useEffect(() => {
    const keyBoardShowListener = Keyboard.addListener(
      "keyboardWillShow",
      ({ endCoordinates }) => {
        if (scrollHeight === 0) {
          setScrollHeight(endCoordinates.height + 20);
        }
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd();
        }, 100);
      }
    );
    const keyBoardHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setScrollHeight(0);
        scrollViewRef.current.scrollToEnd();
      }
    );
    if (socketService.socket.disconnected === true) {
      socketService.connect();
    }
    return () => {
      //disconnect socket when component unmounts
      socketService.disconnect();
      //remove events
      keyBoardShowListener.remove();
      keyBoardHideListener.remove();
      //reset message fetch
    };
  }, [socketService, scrollHeight, scrollViewRef]);
  return (
    <View
      style={styles.page}
      onLayout={({
        nativeEvent: {
          layout: { height, width },
        },
      }) => {
        if (windowHeight !== height) {
          setWindowHeight(height);
          setWindowWidth(width);
        }
      }}
    >
      <PrimaryHeader
        title={friend.firstName ? capitalize(friend.firstName) : friend.email}
        icon='arrow-left'
        iconColor='white'
        onIconPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}
        style={{
          maxHeight: scrollHeight !== 0 ? scrollHeight : "75%",
        }}
      >
        {messages.map((message, ind) => {
          return ind !== 0 ? (
            <Message
              messageBefore={messages[ind - 1]}
              key={`${Math.random()}.${message.created_at}`}
              message={message}
            />
          ) : (
            <Message
              key={`${Math.random()}.${message.created_at}`}
              message={message}
            />
          );
        })}
      </ScrollView>
      {windowHeight !== 1 && (
        <MessageFooter
          originalWindowWidth={windowWidth}
          originalWindowHeight={windowHeight}
          input={input}
          onInputChange={(text) => setInput(text)}
          onSubmitMessage={() => {
            sendMessage({
              content: input,
              recipient: friendEmail,
              sender: userEmail || "",
              status: "sending",
              created_at: new Date().toUTCString(),
              clientId: `${Math.random()}.${new Date().toISOString()}`,
            });
            setInput("");
          }}
        />
      )}
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
    flexDirection: "row",
    alignItems: "center",
  },
  headerNameBlock: {
    width: "85%",
  },
  messageScrollView: {},
  page: {
    height: "100%",
  },
});

export default Messages;
