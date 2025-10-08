import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import Typo from "@/components/Typo";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import { Ionicons } from "@expo/vector-icons";

const NewConvoModal = () => {
  const { isGroup } = useLocalSearchParams();
  const router = useRouter();

  const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

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
      name: "George Kostanza",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    { id: 8, name: "Hannah Baker", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 9, name: "Isaac Newton", avatar: "https://i.pravatar.cc/150?img=9" },
    {
      id: 10,
      name: "Julia Roberts",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
    {
      id: 11,
      name: "Kevin Malone",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    { id: 12, name: "Laura Croft", avatar: "https://i.pravatar.cc/150?img=12" },
    {
      id: 13,
      name: "Michael Scott",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    { id: 14, name: "Nina Simone", avatar: "https://i.pravatar.cc/150?img=14" },
    { id: 15, name: "Oscar Wilde", avatar: "https://i.pravatar.cc/150?img=15" },
    { id: 16, name: "Paula Abdul", avatar: "https://i.pravatar.cc/150?img=16" },
    {
      id: 17,
      name: "Quentin Tarantino",
      avatar: "https://i.pravatar.cc/150?img=17",
    },
    {
      id: 18,
      name: "Rachel Green",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
    {
      id: 19,
      name: "Steve Rogers",
      avatar: "https://i.pravatar.cc/150?img=19",
    },
    { id: 20, name: "Tina Fey", avatar: "https://i.pravatar.cc/150?img=20" },
  ];

  const isGroupMode = isGroup === "group";

  const onPickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setGroupAvatar(result.assets[0].uri);
  };

  const toggleUserSelection = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const onSelectUser = (user: any) => {
    if (!isGroupMode) {
      router.back();
    } else {
      toggleUserSelection(user.id);
    }
  };

  const onCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("Please select at least one member");
      return;
    }

    console.log("Creating group:", {
      groupName,
      groupAvatar,
      selectedUsers,
    });
    router.back();
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "Create a Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        />

        {/* Group mode setup */}
        {isGroupMode && (
          <>
            <View style={styles.groupInfoContainer}>
              <TouchableOpacity
                onPress={onPickImageHandler}
                style={styles.avatarContainer}
              >
                <Avatar
                  uri={groupAvatar || "https://i.pravatar.cc/150?img=11"}
                  size={100}
                  isGroup={true}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group name"
                value={groupName}
                onChangeText={setGroupName}
                style={{
                  flex: 1,
                  borderWidth: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
              />
            </View>
          </>
        )}

        {/* User list */}
        <ScrollView
          style={styles.contactList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(90) }}
        >
          {dummyUsers.map((user) => {
            const isSelected = selectedUsers.includes(user.id);
            return (
              <TouchableOpacity
                key={user.id}
                style={styles.contactRow}
                onPress={() => onSelectUser(user)}
              >
                <View style={styles.userInfo}>
                  <Avatar uri={user.avatar} size={50} />
                  <Typo size={16}>{user.name}</Typo>
                </View>
                {isGroupMode && (
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={24}
                    color={isSelected ? colors.primary : colors.neutral500}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Create group button */}
        {isGroupMode && (
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={onCreateGroup}
          >
            <Ionicons name="checkmark" size={28} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
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
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
    marginTop: spacingY._10,
    paddingHorizontal: spacingX._10,
    height: verticalScale(45),
    flexDirection: "row",
    alignItems: "center",
  },
  contactList: {
    marginTop: spacingY._10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ensures checkbox stays at extreme right
    paddingVertical: spacingY._10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.neutral200,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  createGroupButton: {
    position: "absolute",
    bottom: spacingY._30,
    right: spacingX._20,
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
  },
});
