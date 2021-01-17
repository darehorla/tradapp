import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import {
  Button,
  Div,
  Text,
  Avatar,
  Image,
  Skeleton,
  Select,
  Icon,
  Input,
  Modal,
  Snackbar,
  SnackbarRef,
} from "react-native-magnus";
import { useForm, Controller } from "react-hook-form";
import {
  FormInput,
  BaseButton,
  EmailInput,
  PasswordInput,
  PinInput,
} from "../../components";
import Axios from "../../server/axios";
import AsyncStorage from "@react-native-community/async-storage";

const snackbarRef = React.createRef();

const Password = ({ navigation: { goBack } }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("false");

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.password != data["confirm-password"]) {
      setError("Password do not match");
      snackbarRef.current.show();
      setLoading(false);
      return;
    } else {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );

      try {
        await Axios.post("verification/verify-pin", {
          userId: id,
          code: data["old-pin"],
        });
        await Axios.put(
          `/users/${id}`,
          { password: data.password },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        goBack();
        setLoading(false);
      } catch (err) {
        setError("Incorrect Pin");
        snackbarRef.current.show();
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Div p='xl'>
        <PinInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='pin'
          typedName='Enter Pin'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='password'
          typedName='New Password'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='confirm-password'
          typedName='Confirm New Password'
        />

        <BaseButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          fill
          block
        >
          Change Password
        </BaseButton>
      </Div>

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
    </SafeAreaView>
  );
};

export { Password };
