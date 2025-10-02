import { StyleSheet } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";

const Home = () => {
  const { user, signOut } = useAuth();
  console.log("user: ", user);

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <ScreenWrapper>
      <Typo color={colors.white}>home sreen</Typo>

      <Button onPress={handleLogout}>
        <Typo>logout</Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
