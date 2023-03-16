import React, { useState } from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Yup from "yup";

import { Feather } from "@expo/vector-icons";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";

import { useTheme } from "styled-components";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/Button";
import { PasswordInput } from "../../components/PasswordInput";
import { Input } from "../../components/Input";

import { useAuth } from "../../hooks/auth";

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

type ScreenProps = BottomTabScreenProps<AppTabParamList, "Profile">;

export function Profile({ navigation }: ScreenProps) {
  const { user, signOut, updateUser } = useAuth();

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

  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required("CNH é obrigatória"),
        name: Yup.string().required("Nomde é obrigatório"),
      });

      const data = { name, driverLicense };
      await schema.validate(data);

      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token,
      });

      Alert.alert("Perfil atualizado!");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert("Opa", error.message);
      } else {
        Alert.alert("Não foi possível atualizar o perfil");
      }
    }
  }

  async function handleSignOut() {
    Alert.alert(
      "Tem certeza que deseja sair?",
      "Se sair, irá precisar de internet para conectar-se novamente",
      [
        {
          text: "Cancelar",
          onPress: () => {},
        },
        {
          text: "Confirmar",
          onPress: () => signOut(),
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
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
                <Button
                  title="Salvar alterações"
                  onPress={handleProfileUpdate}
                />
              </Section>
            ) : (
              <Section style={{ marginBottom: useBottomTabBarHeight() }}>
                <PasswordInput iconName="lock" placeholder="Senha atual" />
                <PasswordInput iconName="lock" placeholder="Nova senha" />
                <PasswordInput iconName="lock" placeholder="Repitir senha" />
                <Button
                  title="Salvar alterações"
                  onPress={handleProfileUpdate}
                />
              </Section>
            )}
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
