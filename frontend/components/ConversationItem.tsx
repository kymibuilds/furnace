import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import { ConversationListItemProps } from "@/types";
import Typo from "./Typo";
import { useRouter } from "expo-router";

const ConversationItem = ({ item, showDivider }: ConversationListItemProps) => {
  const router = useRouter(); // <-- router must be defined before using

  const openConversationHandler = () => {
    router.push({
      pathname: "/(main)/conversation", // make sure this matches your folder route
      params: {
        id: item._id,
        type: item.type,
        name: item.name,
        participants: JSON.stringify(item.participants),
      },
    });
  };

  const getLastMessageDate = (
    message: { createdAt?: string | number | Date } | null | undefined
  ) => {
    if (!message?.createdAt) return "";

    const date = new Date(message.createdAt);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    return date.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  const getLastMessageContent = (
    message: { content?: string; senderName?: string } | null | undefined
  ) => {
    if (!message) return "";
    if (message.content?.trim()) return message.content;
    return message.senderName ? `${message.senderName} sent a message` : "";
  };

  return (
    <>
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={openConversationHandler}
      >
        <Avatar uri={null} size={47} isGroup={item.type === "group"} />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Typo size={17} fontWeight="600">
              {item.name}
            </Typo>
            {item?.lastMessage && (
              <Typo size={15}>{getLastMessageDate(item.lastMessage)}</Typo>
            )}
          </View>
          <Typo
            size={13}
            color={colors.neutral600}
            textProps={{ numberOfLines: 1 }}
          >
            {getLastMessageContent(item.lastMessage)}
          </Typo>
        </View>
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  conversationItem: {
    gap: spacingX._10,
    marginVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginTop: spacingY._5,
  },
});
