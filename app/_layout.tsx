import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import NotificationWrapper from "@/components/notification-wrapper";
import { useColorScheme } from "@/components/useColorScheme";
import { base_url } from "@/constants/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const query_client = new QueryClient();
  axios.defaults.baseURL = base_url;

  return (
    <QueryClientProvider client={query_client}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <NotificationWrapper>
          <StatusBar
            backgroundColor="transparent"
            style={colorScheme === "dark" ? "light" : "dark"}
            translucent
          />
          <RootSiblingParent>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="(manager)" options={{ headerShown: false }} />

              <Stack.Screen
                name="modal"
                options={{
                  presentation: "transparentModal",
                  animation: "none", // Disable popping animation
                  animationTypeForReplace: "push", // Ensure no popping animation
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="add_rm_modal"
                options={{
                  presentation: "transparentModal",
                  animation: "none", // Disable popping animation
                  animationTypeForReplace: "push", // Ensure no popping animation
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="add_client_modal"
                options={{
                  presentation: "transparentModal",
                  animation: "none", // Disable popping animation
                  animationTypeForReplace: "push", // Ensure no popping animation
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="add_tasklist_modal"
                options={{
                  presentation: "transparentModal",
                  animation: "none", // Disable popping animation
                  animationTypeForReplace: "push", // Ensure no popping animation
                  headerShown: false,
                }}
              />
            </Stack>
          </RootSiblingParent>
        </NotificationWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
