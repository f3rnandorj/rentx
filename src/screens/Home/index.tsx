import React, { useEffect, useState } from "react";
import { ListRenderItem, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/app.stack.routes";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";
import Logo from "../../assets/logo.svg";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";

type ScreenProps = NativeStackScreenProps<AppStackParamList, "Home">;

export function Home({ navigation }: ScreenProps) {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);

  function handleCarDetails(car: CarDTO) {
    navigation.navigate("CarDetails", { car });
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const response = await api.get("/cars");
        if (isMounted) {
          setCars(response.data);
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

  const renderItem: ListRenderItem<CarDTO> = ({ item }) => (
    <Car data={item} onPress={() => handleCarDetails(item)} />
  );
  const keyExtractor = (item: CarDTO) => item.id;

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
