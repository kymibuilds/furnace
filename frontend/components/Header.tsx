import { StyleSheet, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";
import { spacingX, spacingY } from "@/constants/theme";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo size={22} fontWeight={"600"} style={styles.title}>
          {title}
        </Typo>
      )}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center", // center title
    paddingVertical: spacingY._15,
  },
  title: {
    textAlign: "center",
  },
  leftIcon: {
    position: "absolute",
    left: spacingX._20,
  },
  rightIcon: {
    position: "absolute",
    right: spacingX._20,
  },
});

