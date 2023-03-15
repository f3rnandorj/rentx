import React from "react";

import HomeSvg from "../assets/home.svg";
import CarSvg from "../assets/car.svg";
import PeopleSvg from "../assets/people.svg";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";

import { AppStackParamList, AppStackRoutes } from "./app.stack.routes";

import { MyCars } from "../screens/MyCars";

import { useTheme } from "styled-components";
import { Profile } from "../screens/Profile";
import { Platform } from "react-native";

export interface AppTabParamList extends ParamListBase {
  Home: AppStackParamList;
  MyCars: undefined;
  Profile: undefined;
}

const { Navigator, Screen } = createBottomTabNavigator<AppTabParamList>();

export function AppTabRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.main,
        tabBarInactiveTintColor: theme.colors.text_detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
          height: 78,
          backgroundColor: theme.colors.background_primary,
        },
      }}
    >
      <Screen
        name="AppStackRoutes"
        component={AppStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={24} height={24} fill={color} />
          ),
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <CarSvg width={24} height={24} fill={color} />
          ),
        }}
      />
      <Screen
        name="MyCars"
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => (
            <PeopleSvg width={24} height={24} fill={color} />
          ),
        }}
      />
    </Navigator>
  );
}
