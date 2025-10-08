import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const NewConvoModal = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup == "1";
  const router = useRouter();

  const dummyUsers = [
    { id: 1, name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Bob Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Diana Prince", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Ethan Hunt", avatar: "https://i.pravatar.cc/150?img=5" },
    {
      id: 6,
      name: "Fiona Gallagher",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 7,
      name: "George Clooney",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: 8,
      name: "Hannah Montana",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: 9,
      name: "Ian Somerhalder",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: 10,
      name: "Julia Roberts",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
  ];

  return <ScreenWrapper isModal={true}>

  </ScreenWrapper>;
};

export default NewConvoModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom:
  },
  checked : {
    backgroundColor: colors.primary,
  },
  contactList: {
    gap: spacingY._12,
    marginTop
  }
  selectedIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  createGroupButton: {
    position: "absolute",
    bottom: spacingY._30, // distance from bottom
    right: spacingX._20, // distance from right
    backgroundColor: colors.primary,
    width: verticalScale(55),
    height: verticalScale(55),
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  }
});
