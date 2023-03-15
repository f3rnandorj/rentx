import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";

import theme from "./src/styles/theme";
import { AppProvider } from "./src/hooks";
import { ThemeProvider } from "styled-components";

import * as SplashScreen from "expo-splash-screen";

import { Routes } from "./src/routes";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
} from "@expo-google-fonts/archivo";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
  });

  useEffect(() => {
    async function show() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(() => setIsAppReady(true), 500);
      }
    }

    show();
  }, []);

  useEffect(() => {
    async function hide() {
      if (isAppReady) {
        await SplashScreen.hideAsync();
      }
    }

    hide();
  }, [isAppReady]);

  if (!fontsLoaded || !isAppReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Routes />
      </AppProvider>
    </ThemeProvider>
  );
}
