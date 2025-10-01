import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import { Link, useRouter } from "expo-router";
import Button from "@/components/Button";

const Login = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern={true} bgOpacity={0.5}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton iconSize={28} />
            <Typo color={colors.white} size={13}>
              {"need help?"}
            </Typo>
          </View>
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  gap: spacingY._10,
                  marginBottom: spacingY._15,
                  paddingTop: spacingY._15,
                }}
              >
                <Typo size={28} fontWeight={"600"}>
                  welcome back user!
                </Typo>
                <Typo color={colors.neutral600}>
                  login to continue
                </Typo>
                <Input
                  placeholder="enter your email"
                  onChangeText={(value: string) => (emailRef.current = value)}
                  icon={
                    <Icons.AtIcon
                      size={verticalScale(26)}
                      color={colors.neutral600}
                    />
                  }
                />
                <Input
                  placeholder="enter your password"
                  onChangeText={(value: string) =>
                    (passwordRef.current = value)
                  }
                  icon={
                    <Icons.LockIcon
                      size={verticalScale(26)}
                      color={colors.neutral600}
                    />
                  }
                  secureTextEntry={true}
                />
                <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                  <Button
                    loading={isLoading}
                    style={{ backgroundColor: colors.neutral900 }}
                    onPress={handleSubmit}
                  >
                    <Typo color={colors.white}>sign up</Typo>
                  </Button>
                </View>
              </View>
              <View style={styles.footer}>
                <Typo color={colors.neutral600}>{"don't have an account?"}</Typo>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Typo fontWeight="bold" color={colors.neutral800} style={{textDecorationLine: "underline"}}>
                    register
                  </Typo>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    // paddingHorizontal: spacingX._20,
    // marginVertical: spacingY._10,
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    borderCurve: "continuous",
  },
  form: {
    flexDirection: "column",
    paddingHorizontal: spacingX._20,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
