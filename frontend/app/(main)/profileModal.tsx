import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useAuth } from "@/context/authContext";
import { UserDataProps } from "@/types";
import { router } from "expo-router";
import { updateProfile } from "@/sockets/socketEvents";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToCloundinary } from "@/services/imageService";

const ProfileModal = () => {
  const { user, signOut, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar,
    });
  }, [user]);

  const onPickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    console.log(result);
    if (!result.canceled) {
      setUserData({ ...userData, avatar: result.assets[0] });
    }
  };

  const handleLogout = async () => {
    router.back();
    await signOut();
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let { name, avatar } = userData;
      if (!name.trim()) {
        Alert.alert("User", "please enter your name");
        setLoading(false);
        return;
      }

      let data = {
        name,
        avatar,
      };
      
      if(avatar && avatar?.uri){
        const res = await uploadFileToCloundinary(avatar,"profiles");
        console.log("result:", res)
        if(res.success){
          data.avatar=res.data;
        }else{
          Alert.alert("User",res.msg);
          setLoading(false);
          return;
        }
      }
      
      // Update profile via socket
      updateProfile(data);
      
      // Update local context immediately with the new data
      if (updateUserData) {
        updateUserData({
          ...user,
          name: data.name,
          avatar: data.avatar,
        });
      }

      if (Platform.OS === "android") {
        ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
      } else {
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update failed:", error);
      if (Platform.OS === "android") {
        ToastAndroid.show("Failed to update profile", ToastAndroid.SHORT);
      } else {
        alert("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={"update profile"}
          leftIcon={
            Platform.OS === "android" && <BackButton color={colors.black} />
          }
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.container}>
            <Avatar size={170} uri={userData.avatar} />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={onPickImageHandler}
            >
              <Icons.PencilIcon
                size={verticalScale(30)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>
          <View style={{ gap: spacingY._20 }}>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>email</Typo>
              <Input
                value={userData.email}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  backgroundColor: colors.neutral200,
                }}
                editable={false}
              />
              <Typo style={{ paddingLeft: spacingX._10 }}>name</Typo>
              <Input
                value={userData.name}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  backgroundColor: colors.neutral100,
                }}
                editable={true}
                onChange={(event) =>
                  setUserData({ ...userData, name: event.nativeEvent.text })
                }
              />
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  loading && styles.updateButtonDisabled,
                ]}
                activeOpacity={0.9}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Icons.FloppyDiskBackIcon
                      size={verticalScale(22)}
                      color={colors.white}
                      weight="bold"
                    />
                    <Typo style={{ color: colors.white, fontWeight: "400" }}>
                      Update Profile
                    </Typo>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Icons.SignOutIcon
            size={verticalScale(22)}
            color={colors.white}
            weight="bold"
          />
          <Typo style={{ color: colors.white, fontWeight: "600" }}>Logout</Typo>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._25,
    borderTopColor: colors.neutral200,
    marginBottom: spacingY._10,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._65,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._7,
  },
  updateButton: {
    height: verticalScale(56),
    borderRadius: verticalScale(20),
    backgroundColor: colors.neutral600,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacingX._10,
    width: "100%",
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.rose,
    borderRadius: 50,
    paddingVertical: verticalScale(14),
    paddingHorizontal: spacingX._25,
    gap: spacingX._10,
    shadowColor: colors.rose,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
});