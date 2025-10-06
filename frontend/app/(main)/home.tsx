import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import Button from "@/components/Button";

const Home = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dm");
  const [loading, isLoading] = useState(false);

  const coversations = [
    {
      name: "John Doe",
      type: "dm",
      lastMessage: {
        senderName: "John Doe",
        content: "Hey, are we still meeting later?",
        createdAt: "2025-10-06T14:23:00Z",
      },
    },
    {
      name: "Project Alpha",
      type: "group",
      lastMessage: {
        senderName: "Ava Smith",
        content: "Pushed the latest commit to main.",
        createdAt: "2025-10-06T13:50:00Z",
      },
    },
    {
      name: "Liam Brown",
      type: "dm",
      lastMessage: {
        senderName: "Liam Brown",
        content: "Got the update. Looks good!",
        createdAt: "2025-10-06T12:10:00Z",
      },
    },
    {
      name: "Design Team",
      type: "group",
      lastMessage: {
        senderName: "Sophia Taylor",
        content: "Let’s finalize the color palette today.",
        createdAt: "2025-10-05T22:35:00Z",
      },
    },
    {
      name: "Ethan Lee",
      type: "dm",
      lastMessage: {
        senderName: "Ethan Lee",
        content: "Thanks for the help earlier!",
        createdAt: "2025-10-05T20:15:00Z",
      },
    },
    {
      name: "Hackathon Crew",
      type: "group",
      lastMessage: {
        senderName: "You",
        content: "Let’s deploy the test build tonight.",
        createdAt: "2025-10-05T19:42:00Z",
      },
    },
  ];

  let directConversations = coversations
    .filter((item: any) => item.type === "dm")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversations = coversations
    .filter((item: any) => item.type === "group")
    .sort((a: any, b: any) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.neutral200}>
              welcome back, {currentUser?.name} 👋
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/profileModal")}
          >
            <Icons.GearSixIcon color={colors.white} size={verticalScale(22)} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tabStyle,
                    activeTab === "dm" && styles.activeTabStyle,
                  ]}
                  onPress={() => setActiveTab("dm")}
                  disabled={activeTab === "dm"}
                >
                  <Typo color={colors.black}>Direct Messages</Typo>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabStyle,
                    activeTab === "group" && styles.activeTabStyle,
                  ]}
                  onPress={() => setActiveTab("group")}
                  disabled={activeTab === "group"}
                >
                  <Typo color={colors.black}>Group Chat</Typo>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.conversationalList}>
              {activeTab === "dm" &&
                directConversations.map((item: any, index) => (
                  <ConversationItem
                    item={item}
                    key={index}
                    router={router}
                    showDivider={directConversations.length !== index + 1}
                  />
                ))}

              {activeTab === "group" &&
                groupConversations.map((item: any, index) => (
                  <ConversationItem
                    item={item}
                    key={index}
                    router={router}
                    showDivider={groupConversations.length !== index + 1}
                  />
                ))}
            </View>

            {/* Empty and loading states */}
            <>
              {!loading &&
                activeTab === "dm" &&
                directConversations.length === 0 && (
                  <Typo style={{ textAlign: "center" }}>
                    send your first message
                  </Typo>
                )}

              {!loading &&
                activeTab === "group" &&
                groupConversations.length === 0 && (
                  <Typo style={{ textAlign: "center" }}>
                    create your first group
                  </Typo>
                )}

              {loading && <Loading />}
            </>
          </ScrollView>
        </View>
      </View>
      <Button
        style={styles.floatingButton}
        onPress={() => router.push({
          pathname: "/(main)/newConvoModal",
          params: {isGroup: activeTab}
        })}
      >
        <Typo>
          <Icons.PlusIcon />
        </Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral200,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationalList: {
    paddingVertical: spacingY._20,
  },
  floatingButton: {
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
  },
});
