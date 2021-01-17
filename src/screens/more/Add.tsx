import React, { useEffect, useState } from "react";
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
import Axios from "../../server/axios";
import { BaseButton } from "../../components";

import { StatusBar, SafeAreaView, Pressable, FlatList } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
const snackbarRef = React.createRef();

const Add = ({ navigation: { goBack } }) => {
  const [visible, setVisible] = useState(false);
  const [selectValue, setSelectedValue] = useState({});
  const selectRef = React.createRef();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountNumber, setAcctNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [accountName, setAcctName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSelectOption = (data) => {
    setSelectedValue(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/banks");
        const bankoo = response.data.map((item) => {
          return {
            label: item.name,
            id: item.id,
            code: item.code,
          };
        });
        setBanks(bankoo);
        setLoading(false);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);
  const [focus, setFocus] = useState(false);

  const verify = async () => {
    setVerifying(true);

    if (selectValue.code && accountNumber) {
      try {
        const paystackKey = await Axios.get("/paystack");

        const accountVerifcation = await Axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${selectValue.code}`,
          {
            headers: {
              Authorization: `Bearer ${paystackKey.data.key}`,
            },
          }
        );

        setAcctName(accountVerifcation.data.data.account_name);
        setVerifying(false);
        setVisible(true);
      } catch (error) {
        setError("Invalid Bank Details");
        snackbarRef.current.show();
        setVerifying(false);
      }
    } else {
      setError("Please fill all fields");
      snackbarRef.current.show();
      setVerifying(false);
    }
  };

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );

      await Axios.post(
        "/accounts",
        {
          accountName,
          accountNumber,
          bank: selectValue.id,
          user: id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setSubmitting(false);
      goBack();
    } catch (error) {
      console.warn(error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Div p='xl'>
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
        </Div>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle='dark-content' />

      <Div p='xl'>
        <Text fontSize='lg' mb='md'>
          Select Bank
        </Text>
        <Button
          block
          justifyContent='space-between'
          borderWidth={1}
          bg='white'
          color='black'
          py={16}
          borderColor='gray200'
          mb='lg'
          rounded='sm'
          suffix={
            <Icon
              position='absolute'
              right={8}
              name='select-arrows'
              fontFamily='Entypo'
              color='black'
            />
          }
          onPress={() => {
            if (selectRef.current) {
              selectRef.current.open();
            }
          }}
        >
          {selectValue.label ? selectValue.label : "Select..."}
        </Button>
        <Div mb={20}>
          <Text fontSize='lg' mb='md'>
            Account Number
          </Text>
          <Input
            py={16}
            fontSize='lg'
            focusBorderColor='gray600'
            onBlur={() => {
              setFocus(false);
            }}
            px='lg'
            borderWidth={1}
            borderColor={focus ? "gray600" : "gray200"}
            onChangeText={(value) => setAcctNumber(value)}
            value={accountNumber}
            rounded='sm'
            mb='md'
          />
        </Div>

        <BaseButton loading={verifying} fill block onPress={verify}>
          Verify
        </BaseButton>

        <Select
          onSelect={onSelectOption}
          ref={selectRef}
          value={selectValue}
          title='Select Bank'
          mt='md'
          pb='2xl'
          // message='This is the long message used to set some context'
          roundedTop='2xl'
          data={banks}
          renderItem={(item) => (
            <Select.Option value={item} py='md'>
              <Text>{item.label}</Text>
            </Select.Option>
          )}
        />
      </Div>
      <Modal
        swipeDirection='down'
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
        roundedTop={50}
        h='50%'
        isVisible={visible}
        p='none'
      >
        <Div p='2xl' flex={1} alignItems='center'>
          <Icon
            name='bank'
            color='gray300'
            fontSize={50}
            fontFamily='FontAwesome'
          />
          <Div alignItems='center' flex={1} justifyContent='center'>
            <Text textAlign='center' fontWeight='bold'>
              Bank
            </Text>
            <Text fontSize='2xl'>{selectValue.label}</Text>

            <Text mt='xl' textAlign='center' fontWeight='bold'>
              Account Number
            </Text>
            <Text fontSize='2xl'>{accountNumber}</Text>

            <Text mt='xl' textAlign='center' fontWeight='bold'>
              Account Name
            </Text>
            <Text fontSize='2xl'>{accountName}</Text>
          </Div>
          <BaseButton fill block onPress={onSubmit} loading={submitting}>
            Submit
          </BaseButton>
        </Div>
      </Modal>
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

export { Add };
