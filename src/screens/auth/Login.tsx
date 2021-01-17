import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FormInput,
  BaseButton,
  EmailInput,
  PasswordInput,
} from "../../components";
import { Pressable } from "react-native";
import AuthContext from "../../context";
import {
  Button,
  Icon,
  Div,
  Text,
  Snackbar,
  SnackbarRef,
} from "react-native-magnus";
import Wrapper from "./Wrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Axios from "../../server/axios";

const snackbarRef = React.createRef();

const Login = ({ navigation: { navigate } }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await Axios.post("/auth/local", data);
      await AsyncStorage.setItem(
        "user_details",
        JSON.stringify({
          jwt: response.data.jwt,
          username: response.data.user.username,
          id: response.data.user.id,
        })
      );
      setState({ isLoading: false, isSignedIn: true });
      setLoading(false);
    } catch (err) {
      setError("Incorrect Email or Password");
      snackbarRef.current.show();
      setLoading(false);
    }
  };
  return (
    <>
      <Wrapper title='Welcome back!'>
        <EmailInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='identifier'
          typedName='Email'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='password'
          typedName='Password'
        />

        <Pressable onPress={() => navigate("Forgot")}>
          <Text mb='lg' textAlign='right' fontSize='lg' color='gray700'>
            Forgot password?
          </Text>
        </Pressable>
        <BaseButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          fill
          block
        >
          Login
        </BaseButton>
        <Pressable onPress={() => navigate("Register")}>
          <Text mt='lg' textAlign='center' fontSize='lg' color='gray700'>
            No account yet?{" "}
            <Text fontSize='lg' color='yellow700'>
              Register
            </Text>
          </Text>
        </Pressable>
      </Wrapper>
      <Snackbar
        suffix={<Icon name='close' color='white' fontSize='md' />}
        onDismiss={() => {}}
        ref={snackbarRef}
        bg='#FF2323'
        color='white'
        duration={2000}
        mb='xl'
      >
        {error}
      </Snackbar>
    </>
  );
};

export { Login };
