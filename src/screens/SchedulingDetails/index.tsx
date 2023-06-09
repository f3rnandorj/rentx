import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { Alert, StatusBar } from "react-native";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";

import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";
import { format, parseISO } from "date-fns";
import { api } from "../../services/api";

import {
  Accessories,
  Brand,
  CalendarIcon,
  CarImages,
  Container,
  Content,
  DateInfo,
  DateTitle,
  DateValue,
  Description,
  Details,
  Footer,
  Header,
  Name,
  Period,
  Price,
  Rent,
  RentalPeriod,
  RentalPrice,
  RentalPriceDetails,
  RentalPriceLabel,
  RentalPriceQuota,
  RentalPriceTotal,
} from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/app.stack.routes";
import { useNetInfo } from "@react-native-community/netinfo";
import { CarDTO } from "../../dtos/CarDTO";

interface RentalPeriod {
  start: string;
  end: string;
}

type ScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "SchedulingDetails"
>;

export function SchedulingDetails({ route, navigation }: ScreenProps) {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [rentalPeriod, setRentalPeriod] = useState({} as RentalPeriod);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const netInfo = useNetInfo();

  const { car, dates } = route.params;

  const rentTotal = Number(dates.length * car.price);

  async function handleConfirmRental() {
    setLoading(true);

    await api
      .post("/rentals", {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentTotal,
      })
      .then(() =>
        navigation.navigate("Confirmation", {
          title: "Carro alugado!",
          message:
            "Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automovél",
          nextScreenRoute: "Home",
        })
      )
      .catch((error) => {
        setLoading(false);

        console.log(new Date(dates[0]));
        console.log(error);

        Alert.alert("Não foi possível confirmar o agendamento.");
      });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(parseISO(dates[0]), "dd/MM/yyyy"),
      end: format(parseISO(dates[dates.length - 1]), "dd/MM/yyyy"),
    });
  }, []);

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }

    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        {carUpdated.accessories && (
          <Accessories>
            {carUpdated.accessories.map((accessory) => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>De</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(24)}
            color={theme.colors.shape}
          />

          <DateInfo>
            <DateTitle>Até</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x ${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          disabled={loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
