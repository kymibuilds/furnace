import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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
import { getContacts, newConversation } from "@/sockets/socketEvents";
import { useAuth } from "@/context/authContext";

interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

const NewConvoModal = () => {
  const { user: currentUser } = useAuth(); // ✅ get currentUser from context
  const { isGroup } = useLocalSearchParams();
  const router = useRouter();
  const [contacts, setContacts] = useState<User[]>([]);
  const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const isGroupMode = isGroup === "group";

  useEffect(() => {
    // Register socket listeners
    getContacts(processGetContacts);
    newConversation(processNewConversation);

    // Fetch contacts
    getContacts(null);

    // Cleanup listeners on unmount
    return () => {
      getContacts(processGetContacts, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    console.log("got Contacts", res);
    if (res?.success && Array.isArray(res.data)) {
      setContacts(res.data);
    }
  };

  const processNewConversation = (res: any) => {
    console.log("new conversation result:", res);
    if (res.success && res.data) {
      console.log("Conversation created/populated:", res.data);
      router.back(); // Close modal after conversation creation
    }
  };

  const onPickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setGroupAvatar(result.assets[0].uri);
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const onSelectUser = (user: User) => {
    if (!currentUser) return; // safety check
    if (!isGroupMode) {
      newConversation({
        type: "dm",
        participants: [currentUser.id, user.id],
      });
    } else {
      toggleUserSelection(user.id);
    }
  };

  const onCreateGroup = () => {
    if (!currentUser) return;
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("Please select at least one member");
      return;
    }

    newConversation({
      type: "group",
      participants: [currentUser.id, ...selectedUsers],
      name: groupName,
      avatar: groupAvatar,
    });
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "Create a Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        />

        {/* Group setup section */}
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
                  isGroup
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

        {/* Contacts list */}
        <ScrollView
          style={styles.contactList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(90) }}
        >
          {contacts.map((user) => {
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

        {/* Floating "Create Group" button */}
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
  container: { marginHorizontal: spacingX._15, flex: 1 },
  groupInfoContainer: { alignItems: "center", marginTop: spacingY._10 },
  avatarContainer: { marginBottom: spacingY._10 },
  groupNameContainer: {
    width: "100%",
    marginTop: spacingY._10,
    paddingHorizontal: spacingX._10,
    height: verticalScale(45),
    flexDirection: "row",
    alignItems: "center",
  },
  contactList: { marginTop: spacingY._10 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacingY._10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.neutral200,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: spacingX._10 },
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
