import React, { useEffect, useState } from "react";
import { FlatList, StatusBar } from "react-native";

import { useTheme } from "styled-components";

import { BackButton } from "../../components/BackButton";
import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import { Car as ModelCar } from "../../database/model/Car";
import { AntDesign } from "@expo/vector-icons";

import { api } from "../../services/api";

import {
  Appointments,
  AppointmentsQuantity,
  AppointmentsTitle,
  CarFooter,
  CarFooterDate,
  CarFooterPeriod,
  CarFooterTitle,
  CarWrapper,
  Container,
  Content,
  Header,
  SubTitle,
  Title,
} from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/app.stack.routes";
import { format, parseISO } from "date-fns";
import { useIsFocused } from "@react-navigation/native";

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

type ScreenProps = NativeStackScreenProps<AppStackParamList, "MyCars">;

export function MyCars({ navigation }: ScreenProps) {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenIsFocus = useIsFocused();
  const theme = useTheme();

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get("/rentals");
        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            id: data.id,
            car: data.car,
            start_date: format(parseISO(data.start_date), "dd-MM-yyyy"),
            end_date: format(parseISO(data.end_date), "dd-MM-yyyy"),
          };
        });

        setCars(dataFormatted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, [cars, screenIsFocus]);

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton color={theme.colors.shape} onPress={handleGoBack} />
        <Title>
          Escolha uma {"\n"}data de início e {"\n"}fim do aluguel
        </Title>
        <SubTitle>Conforto, segurança e praticidade.</SubTitle>
      </Header>

      {isLoading ? (
        <LoadAnimation />
      ) : (
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos.</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
            showsVerticalScrollIndicator={false}
          />
        </Content>
      )}
    </Container>
  );
}
