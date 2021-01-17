import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormInput, BaseButton } from "../../components";
import { Button, Icon, Div, Text, Input, Snackbar } from "react-native-magnus";
import Wrapper from "./Wrapper";
import Axios from "../../server/axios";

const snackbarRef = React.createRef();

const Forgot = ({ navigation: { navigate } }) => {
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setcodeSent] = useState(false);
  const [code, setCode] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!code) {
        setError("Enter code");
        throw Error;
      }

      await Axios.post("/verification/verify-auth-code", {
        code: Number(code),
        email: email.toLowerCase(),
      });

      navigate("Reset", { email: email.toLowerCase() });
    } catch (err) {
      snackbarRef.current.show();
      setLoading(false);
    }
  };

  const sendCode = async () => {
    setLoading(true);
    try {
      if (!email || !email.includes("@")) {
        setError("Enter a valid email");
        throw Error;
      }
      setError("Invalid Pin, resend");
      await Axios.post("/email/send-auth-code", {
        email: email.toLowerCase(),
      });
      setcodeSent(true);
      setLoading(false);
    } catch (error) {
      snackbarRef.current.show();
      setLoading(false);
    }
  };

  return (
    <>
      <Wrapper title='Reset Password'>
        <Div row alignItems='flex-end' justifyContent='space-between' mb='md'>
          <Div flex={2} h='100%' mr='lg'>
            <Text fontSize='lg' mb='md'>
              Email
            </Text>
            <Input
              py={16}
              fontSize='lg'
              focusBorderColor='gray600'
              px='lg'
              borderWidth={1}
              borderColor={"gray200"}
              onChangeText={(value) => setEmail(value.trim())}
              value={email}
              rounded='sm'
            />
          </Div>
          <Div flex={1}>
            <BaseButton loading={loading} onPress={sendCode} block fill>
              {codeSent ? "Resend" : " Send Code"}
            </BaseButton>
          </Div>
        </Div>

        <Text fontSize='lg' my='md'>
          Enter code from email
        </Text>
        <Input
          py={16}
          fontSize='lg'
          focusBorderColor='gray600'
          px='lg'
          borderWidth={1}
          borderColor={"gray200"}
          onChangeText={(value) => setCode(value)}
          value={code}
          rounded='sm'
          mb='lg'
          keyboardType='number-pad'
          returnKeyLabel='done'
          returnKeyType='done'
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

export { Forgot };
