import React, { useContext, useEffect, useState } from "react";
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
import { FormInput, BaseButton, EmailInput, PinInput } from "../../components";
import Axios from "../../server/axios";
import AsyncStorage from "@react-native-community/async-storage";
import AuthContext from "../../context";

const snackbarRef = React.createRef();

const SetPin = ({ navigation: { goBack } }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("false");
  const [state, setState] = useContext(AuthContext);

  const onSubmit = async (data) => {
    setLoading(true);

    if (data.pin != data["confirm-pin"]) {
      setError("Pin do not match");
      snackbarRef.current.show();
      setLoading(false);
    } else {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );

      try {
        await Axios.put(
          `users/${id}`,
          {
            pin: data.pin,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setState({ isLoading: false, isSignedIn: true });
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
          typedName='New Pin'
        />
        <PinInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='confirm-pin'
          typedName='Confirm New Pin'
        />

        <BaseButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          fill
          block
        >
          Set Pin
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

export { SetPin };
