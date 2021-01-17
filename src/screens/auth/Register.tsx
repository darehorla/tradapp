import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FormInput,
  BaseButton,
  EmailInput,
  PasswordInput,
} from "../../components";
import Wrapper from "./Wrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Axios from "../../server/axios";
import { Pressable } from "react-native";
import { Text, Snackbar, SnackbarRef, Icon } from "react-native-magnus";

const snackbarRef = React.createRef();

const Register = ({ navigation: { navigate } }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError("Password do not match");
      snackbarRef.current.show();
      setLoading(false);
    } else {
      delete data.confirmPassword;
      try {
        const response = await Axios.post("/auth/local/register", data);
        await AsyncStorage.setItem(
          "user_details",
          JSON.stringify({
            jwt: response.data.jwt,
            username: response.data.user.username,
            id: response.data.user.id,
          })
        );
        // await Axios.post("/email/send-auth-code", {
        //   email: response.data.user.email,
        // });

        // navigate("OTP", {
        //   email: response.data.user.email,
        // });
        navigate("SetPin", { email: response.data.user.email });
        setLoading(false);
      } catch (err) {
        setError("Email or username already exist");
        snackbarRef.current.show();
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Wrapper title='Register'>
        <EmailInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='email'
          typedName='Email'
        />
        <FormInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='username'
          typedName='Username'
        />
        <FormInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='phone'
          keyboardType='number-pad'
          returnKeyLabel='done'
          returnKeyType='done'
          typedName='Phone Number'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='password'
          typedName='Password'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='confirmPassword'
          typedName='Confirm Password'
        />
        <BaseButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          fill
          block
        >
          Register
        </BaseButton>
        <Pressable onPress={() => navigate("Login")}>
          <Text
            mb='2xl'
            mt='lg'
            textAlign='center'
            fontSize='lg'
            color='gray700'
          >
            Already registered?{" "}
            <Text fontSize='lg' color='yellow700'>
              Login
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

export { Register };
