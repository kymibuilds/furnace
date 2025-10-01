import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn } from "react-native-reanimated";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.3}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Typo color={colors.white} size={43} fontWeight={"900"}>
            furnace
          </Typo>
        </View>
        <Animated.Image
          entering={FadeIn.duration(700).springify()}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode={"contain"}
        />
        <View>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            stay connected
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            with your friends
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            and family
          </Typo>
        </View>
        <Button loading={false} style={{ backgroundColor: colors.white }} onPress={()=>router.push('/(auth)/register')}>
          <Typo fontWeight={"700"}>Get Started</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._10,
  },
  background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: "center",
  },
});
