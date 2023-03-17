import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { CarDetails } from "../screens/CarDetails";
import { Scheduling } from "../screens/Scheduling";
import { SchedulingDetails } from "../screens/SchedulingDetails";
import { Confirmation } from "../screens/Confirmation";
import { MyCars } from "../screens/MyCars";
import { Car as ModelCar } from "../database/model/Car";
import { ParamListBase } from "@react-navigation/native";

export interface AppStackParamList extends ParamListBase {
  Home: undefined;
  MyCars: undefined;
  Scheduling: { car: ModelCar };
  Confirmation: {
    title: string;
    message: string;
    nextScreenRoute: string;
  };
  SchedulingDetails: {
    car: ModelCar;
    dates: string[];
  };
  CarDetails: { car: ModelCar };
}

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Screen name="Home" component={Home} />
      <Screen name="CarDetails" component={CarDetails} />
      <Screen name="Scheduling" component={Scheduling} />
      <Screen name="SchedulingDetails" component={SchedulingDetails} />
      <Screen name="Confirmation" component={Confirmation} />
      <Screen name="MyCars" component={MyCars} />
    </Navigator>
  );
}
