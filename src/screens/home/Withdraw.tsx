import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import {
  Button,
  Div,
  Text,
  Avatar,
  Image,
  Icon,
  Input,
  Overlay,
  Select,
  Skeleton,
  Snackbar,
} from "react-native-magnus";
import Axios from "../../server/axios";
import { FormInput, BaseButton, EmailInput, PinInput } from "../../components";
import AsyncStorage from "@react-native-community/async-storage";

const selectRef = React.createRef();
const snackbarRef = React.createRef();

const Withdraw = ({ navigation, route }) => {
  const [focus, setFocus] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectValue, setSelectedValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const verify = async () => {
    setVerifying(true);
    try {
      if (!selectValue.value) {
        setError("Please select an account");
        throw Error;
      } else if (!amount) {
        setError("Please input the amount to withdraw");
        throw Error;
      }

      if (Number(route.params.wallet) || 0 < Number(amount)) {
        setError("You do not have enough balance");
        throw Error;
      }

      if (Number(amount) < 500) {
        setError("Minimum Withdrawal is  ₦500");
        throw Error;
      }
      setOverlayVisible(true);
      setVerifying(false);
    } catch (error) {
      setVerifying(false);
      snackbarRef.current.show();
    }
  };

  const submit = async () => {
    setVerifying(true);
    try {
      if (!pin) {
        setError("Please input your pin");
        throw Error;
      }
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );
      await Axios.post("verification/verify-pin", {
        userId: id,
        code: pin,
      });

      console.warn(selectValue.value);

      // await Axios.post(
      //   "/transactions",
      //   {
      //     userComment: "",
      //     type: [
      //       {
      //         __component: "transaction.widthdrawal",
      //         amount,
      //         bank_accounts: selectValue.value,
      //       },
      //     ],
      //     user: id,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${jwt}`,
      //     },
      //   }
      // );

      // await Axios.post(
      //   `/customer/withdraw`,
      //   {
      //     userId: id,
      //     amount,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${jwt}`,
      //     },
      //   }
      // );

      // await Axios.get("/email/send-alert");

      setVerifying(false);
      navigation.goBack();
    } catch (error) {
      snackbarRef.current.show();
      setVerifying(false);
    }
  };

  const onSelectOption = (data) => {
    setSelectedValue(data);
  };

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );
      const response = await Axios.get(`accounts?user=${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const bankoo = response.data.map((item) => {
        return {
          label: `${item.bank.name} ${" "}${item.accountName}`,
          value: item.id,
        };
      });

      console.log(response.data);

      setLoading(false);
      setBanks(bankoo);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", async () => {
      await fetchBanks();
    });
    fetchBanks();
  }, []);

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

      <Div p='xl' flex={1}>
        <Div mb={20}>
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

          <Text fontSize='lg' mb='md'>
            Amount
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
            onChangeText={(value) => setAmount(value)}
            value={amount}
            rounded='sm'
            mb='md'
          />
        </Div>
        <BaseButton loading={verifying} fill block onPress={verify}>
          Withdraw
        </BaseButton>

        <Overlay visible={overlayVisible} py='3xl' px='xl'>
          <Button
            bg='#FF2323'
            h={35}
            w={35}
            position='absolute'
            top={5}
            right={5}
            rounded='circle'
            onPress={() => {
              setOverlayVisible(false);
            }}
          >
            <Icon color='white' name='close' />
          </Button>
          <Text fontSize='lg' mb='md' textAlign='center'>
            Enter Pin
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
            onChangeText={(value) => setPin(value)}
            value={pin}
            rounded='sm'
            keyboardType='number-pad'
            returnKeyLabel='done'
            returnKeyType='done'
            mb='md'
            secureTextEntry
          />
          <BaseButton mt='xl' loading={verifying} fill block onPress={submit}>
            Submit
          </BaseButton>
        </Overlay>

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

export { Withdraw };
