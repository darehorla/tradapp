import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { PasswordInput, BaseButton } from "../../components";
import { Button, Icon, Div, Snackbar } from "react-native-magnus";
import Wrapper from "./Wrapper";
import Axios from "../../server/axios";

const snackbarRef = React.createRef();
const greensnackbarRef = React.createRef();

const Reset = ({ navigation: { navigate }, route }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);
  const { email } = route.params;
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (!data.password || !data.confirmPassword) {
        setError("Enter passwords");
        throw Error;
      }

      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        throw Error;
      }

      const idData = await Axios.post(`verification/email`, {
        email,
      });
      await Axios.put(
        `/users/${idData.data.id}`,
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${idData.data.jwt}`,
          },
        }
      );
      greensnackbarRef.current.show();
      setTimeout(function () {
        navigate("Login");
      }, 1500);
      setLoading(false);
    } catch (err) {
      snackbarRef.current.show();
      setLoading(false);
    }
  };
  return (
    <>
      <Wrapper title='Reset'>
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='password'
          secureTextEntry
          typedName='Password'
        />
        <PasswordInput
          control={control}
          Controller={Controller}
          errors={errors}
          name='confirmPassword'
          secureTextEntry
          typedName='Confirm Password'
        />

        <BaseButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          fill
          block
        >
          Submit
        </BaseButton>
      </Wrapper>

      <Snackbar
        suffix={<Icon name='close' color='white' fontSize='md' />}
        onDismiss={() => {}}
        ref={greensnackbarRef}
        bg='#47BC29'
        color='white'
        duration={2000}
        mb='xl'
      >
        Passwords changed successfully
      </Snackbar>

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

export { Reset };
