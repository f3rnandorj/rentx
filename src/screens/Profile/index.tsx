import React, { useState } from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Feather } from "@expo/vector-icons";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";

import { useTheme } from "styled-components";
import { BackButton } from "../../components/BackButton";
import { PasswordInput } from "../../components/PasswordInput";

import { AppTabParamList } from "../../routes/app.tab.routes";
import {
  Container,
  Content,
  Header,
  HeaderTitle,
  HeaderTop,
  LogoutButton,
  Option,
  Options,
  OptionTitle,
  Photo,
  PhotoButton,
  PhotoContainer,
  Section,
} from "./styles";
import { Input } from "../../components/Input";
import { useAuth } from "../../hooks/auth";

type ScreenProps = BottomTabScreenProps<AppTabParamList, "Profile">;

export function Profile({ navigation }: ScreenProps) {
  const { user, signOut } = useAuth();

  const [option, setOption] = useState<"dataEdit" | "passwordEdit">("dataEdit");
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.avatar);
  const [driverLicense, setDriverLicense] = useState(user.avatar);

  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (result.canceled) {
      return;
    }

    if (result.assets) {
      setAvatar(result.assets[0].uri);
    }
  }

  function handleOptionChange(optionSelected: "dataEdit" | "passwordEdit") {
    setOption(optionSelected);
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={signOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>

            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleAvatarSelect}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>

          <Content>
            <Options>
              <Option
                active={option === "dataEdit"}
                onPress={() => handleOptionChange("dataEdit")}
              >
                <OptionTitle active={option === "dataEdit"}>Dados</OptionTitle>
              </Option>
              <Option
                active={option === "passwordEdit"}
                onPress={() => handleOptionChange("passwordEdit")}
              >
                <OptionTitle active={option === "passwordEdit"}>
                  Trocar Senha
                </OptionTitle>
              </Option>
            </Options>
            {option === "dataEdit" ? (
              <Section style={{ marginBottom: useBottomTabBarHeight() }}>
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  autoCorrect={false}
                  defaultValue={user.email}
                />
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  onChangeText={setDriverLicense}
                />
              </Section>
            ) : (
              <Section style={{ marginBottom: useBottomTabBarHeight() }}>
                <PasswordInput iconName="lock" placeholder="Senha atual" />
                <PasswordInput iconName="lock" placeholder="Nova senha" />
                <PasswordInput iconName="lock" placeholder="Repitir senha" />
              </Section>
            )}
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
