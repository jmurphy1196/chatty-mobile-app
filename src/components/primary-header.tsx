import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, Icon } from "galio-framework";
import Colors from "../theme";

interface PrimaryHeaderProps {
  icon?: string;
  reverse?: boolean;
  iconColor?: string;
  iconSize?: number;
  title: string;
  onIconPress?: () => void;
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
  title,
  icon,
  reverse,
  iconColor,
  iconSize,
  onIconPress,
}) => {
  const reverseStyle = {
    ...styles,
    header: { ...styles.header, flexDirection: "row-reverse" },
  };
  return (
    <Block center style={!reverse ? styles.header : reverseStyle.header}>
      {icon && (
        <TouchableOpacity onPress={onIconPress}>
          <Icon
            family='Feather'
            name={icon}
            color={iconColor}
            size={iconSize ? iconSize : 30}
          />
        </TouchableOpacity>
      )}
      <Block style={styles.headerNameBlock} center>
        <Text h4 color='white'>
          {title}
        </Text>
      </Block>
    </Block>
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
});
export default PrimaryHeader;
