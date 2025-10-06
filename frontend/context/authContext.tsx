import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { connectSocket, disconnectSocket } from "@/sockets/socket";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
  updateUserData: async () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          await AsyncStorage.removeItem("token");
          gotoWelcomePage();
          return;
        }
        // map decoded payload into UserProps
        const userObj: UserProps = {
          id: (decoded as any).id,
          name: (decoded as any).name,
          email: (decoded as any).email,
          avatar: (decoded as any).avatar,
        };
        setToken(storedToken);
        await connectSocket();
        setUser(userObj);
        gotoHomePage();
      } catch (error) {
        gotoWelcomePage();
        console.log("failed to decode the token", error);
      }
    } else {
      gotoWelcomePage();
    }
  };

  const gotoHomePage = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };

  const gotoWelcomePage = () => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
  };

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);
      const decoded = jwtDecode<DecodedTokenProps>(token);
      const userObj: UserProps = {
        id: (decoded as any).id,
        name: (decoded as any).name,
        email: (decoded as any).email,
        avatar: (decoded as any).avatar,
      };
      console.log("Decoded token:", decoded);
      setUser(userObj);
    }
  };

  const updateUserData = async (updatedUser: Partial<UserProps>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);

      // Update the token with new user data
      if (token) {
        try {
          const decoded = jwtDecode<any>(token);
          // Create a new token payload with updated user data
          const updatedPayload = {
            ...decoded,
            name: newUser.name,
            avatar: newUser.avatar,
          };

          // Note: In a real app, you'd get a new token from the server
          // For now, we're just updating the local state
          // The server should return a new token after profile update

          console.log("User data updated locally:", newUser);
        } catch (error) {
          console.log("Error updating user data:", error);
        }
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    await updateToken(response.token);
    await connectSocket();
    router.replace("/(main)/home");
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
  ) => {
    const response = await register(email, password, name, avatar);
    console.log("SignUp got:", response);
    await updateToken(response.token);
    await connectSocket();
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    disconnectSocket();
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        signIn,
        signOut,
        signUp,
        updateToken,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
