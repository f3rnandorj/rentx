import React, { useEffect, useState } from "react";
import { ListRenderItem, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/app.stack.routes";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import { Car as ModelCar } from "../../database/model/Car";
import { api } from "../../services/api";
import Logo from "../../assets/logo.svg";

import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../../database";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";
import { CarDTO } from "../../dtos/CarDTO";

type ScreenProps = NativeStackScreenProps<AppStackParamList, "Home">;

export function Home({ navigation }: ScreenProps) {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();

  function handleCarDetails(carData: ModelCar) {
    const car = carData._raw as unknown as CarDTO;
    navigation.navigate("CarDetails", { car });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );
        const { changes, latestVersion } = await response.data;
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post("/users/sync", user);
      },
    });
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const carCollection = database.get<ModelCar>("cars");
        const car = await carCollection.query().fetch();
        if (isMounted) {
          setCars(car);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

  const renderItem: ListRenderItem<ModelCar> = ({ item }) => (
    <Car data={item} onPress={() => handleCarDetails(item)} />
  );
  const keyExtractor = (item: ModelCar) => item.id;

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </Container>
  );
}
