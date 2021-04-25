import React, { Component, useState, useEffect } from "react";
import { Input, Icon, Block } from "galio-framework";
import { View, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import Colors from "../theme";

interface MessageFooterProps {
  originalWindowHeight: number;
  originalWindowWidth: number;
  input: string;
  onInputChange: (text: string) => void;
  onSubmitMessage: () => void;
}

const MessageFooter: React.FC<MessageFooterProps> = ({
  originalWindowHeight,
  input,
  originalWindowWidth,
  onInputChange,
  onSubmitMessage,
}) => {
  const [windowHeight, setWindowHeight] = useState(originalWindowHeight - 55);
  const [inputHeight, setInputHeight] = useState(40);
  const [keyboardShowRan, setKeyboardShowRan] = useState(false);
  const ICON_SIZE = 30;
  const INPUT_GAP_TO_ICON = 30;
  const newStyles = {
    ...styles,
    footer: { ...styles.footer, top: windowHeight },
  };
  console.log("THIS IS THE WINDOW HEIGHT");
  console.log(windowHeight);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      "keyboardWillShow",
      ({ endCoordinates }) => {
        console.log("will show ran");
        console.log(endCoordinates);
        if (!keyboardShowRan) {
          setWindowHeight(windowHeight - endCoordinates.height + 70);
          setKeyboardShowRan(true);
        }
      }
    );
    const keyBoardHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        console.log("WILL HIDE RANs");
        if (inputHeight === 40) {
          setWindowHeight(originalWindowHeight - 55);
        } else if (inputHeight > 40) {
          setWindowHeight(originalWindowHeight - 55 - (inputHeight - 40));
        }
        setKeyboardShowRan(false);
      }
    );
    return () => {
      keyboardShowListener.remove();
      keyBoardHideListener.remove();
    };
  }, [inputHeight, windowHeight, setWindowHeight, keyboardShowRan]);
  return (
    <View style={newStyles.footer}>
      <Block style={styles.mainBlock} space='between'>
        <Input
          placeholder='...'
          onChangeText={(text) => onInputChange(text)}
          value={input}
          multiline={true}
          style={{
            ...styles.input,
            height: inputHeight,
            width: originalWindowWidth - (ICON_SIZE + INPUT_GAP_TO_ICON),
          }}
          onContentSizeChange={({ nativeEvent }) => {
            if (
              nativeEvent.contentSize.height > 40 &&
              nativeEvent.contentSize.height < 80
            ) {
              console.log("THIS IS THE CONTENT SI");
              console.log(nativeEvent.contentSize.height);
              setInputHeight(nativeEvent.contentSize.height);
              if (
                windowHeight !==
                windowHeight - (nativeEvent.contentSize.height - 40)
              ) {
                setWindowHeight(
                  windowHeight - (nativeEvent.contentSize.height - 40)
                );
              }
            }
            if (input.length <= 1) {
              setInputHeight(40);
            }
          }}
          keyboardAppearance='default'
        />
        <TouchableOpacity onPress={onSubmitMessage}>
          <Icon
            style={styles.submitIcon}
            name='send'
            family='Feather'
            size={ICON_SIZE}
            color={Colors.DARK_PRIMARY}
          />
        </TouchableOpacity>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    top: 600,
    left: 0,
    right: 0,
    position: "absolute",
    height: "93.5%",
  },
  input: {
    height: 40,
    marginLeft: 5,
  },
  mainBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  submitIcon: {
    marginRight: 10,
    padding: 5,
  },
});

export default MessageFooter;
