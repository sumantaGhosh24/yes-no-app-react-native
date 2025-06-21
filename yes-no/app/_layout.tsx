import "../global.css";

import {useEffect} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useFonts} from "expo-font";
import {Stack, useRouter, useSegments} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";

import "react-native-reanimated";

import {AuthProvider, useAuth} from "@/context/auth-context";

export {ErrorBoundary} from "expo-router";

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

  return (
    <>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}

function RootLayoutNav() {
  const {authState} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup1 = segments[0] === "(stacks)";
    const inAuthGroup2 = segments[0] === "(tabs)";

    if (!authState?.accesstoken && (inAuthGroup1 || inAuthGroup2)) {
      router.replace("/login");
    } else if (authState?.accesstoken && (inAuthGroup1 || inAuthGroup2)) {
    } else if (authState?.accesstoken) {
      router.replace("/home");
    }
  }, [authState, router, segments]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(stacks)" options={{headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack>
    </>
  );
}
