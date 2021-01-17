import React, { useState, useEffect } from "react";
import { StatusBar, SafeAreaView, Pressable, Clipboard } from "react-native";
import {
  Div,
  Header,
  Icon,
  ScrollDiv,
  Text,
  Button,
  Modal,
  Skeleton,
  Input,
  Snackbar,
  Image,
} from "react-native-magnus";
import { BaseButton } from "../../components";
import Axios from "../../server/axios";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const snackbarRef = React.createRef();

const TradeBitcoin = ({ navigation: { navigate } }) => {
  const [rate, setRate] = useState("0");
  const [amount, setAmount] = useState(0);
  const [bitcoinRates, setBitcoinRates] = useState([]);
  const [getting, setGetting] = useState(0);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [donevisible, setDoneVisible] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState(null);
  const [hash, setHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const proceed = () => {
    if (!amount || amount < 10) {
      setError("Enter an amount greater than $10");
      snackbarRef.current.show();
    } else {
      setVisible(true);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: bitcoinData } = await Axios.get(`bitcoin-rates`);
      setBitcoinRates(
        bitcoinData.map((item) => {
          return { value: item.usdValue, rate: item.rate, id: item.id };
        })
      );
      const localUserDetails = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );
      setUserDetails(localUserDetails);
      const { data } = await Axios.get("/bitcoin-address");
      setBitcoinAddress({
        qrCode: data.qrCode.url,
        walletAddress: data.walletAddress,
      });
    })();
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(bitcoinAddress.walletAddress);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://blockchain.info/tobtc?currency=USD&value=${Number(amount)}`
      );
      setGetting(
        bitcoinRates.filter((item) => {
          return item.value > amount;
        })[0].rate * amount
      );
      setRate(data);
    })();
  }, [amount]);

  const submitTransaction = async () => {
    setSubmitting(true);
    if (!hash) {
      setError("Enter the hash");
      snackbarRef.current.show();
      setSubmitting(false);
    } else {
      const data = {
        userComment: "",
        type: [
          {
            __component: "transaction.bitcoin",
            usdValue: amount,
            bitcoinRate: getting / amount,
            hash,
          },
        ],
        user: userDetails.id,
      };

      await Axios.post("/transactions", data, {
        headers: {
          Authorization: `Bearer ${userDetails.jwt}`,
        },
      });
      // await Axios.get("/email/send-alert");

      // navigate("WaitSellScreen");
      setDoneVisible(true);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle='dark-content' />

      <Div justifyContent='center' alignItems='center' flex={1} p='xl'>
        <Text fontWeight='normal'>You send</Text>
        <Text my='lg' fontWeight='normal' fontSize='3xl'>
          USD
        </Text>

        <Input
          textAlign='center'
          p={0}
          fontWeight='400'
          fontSize='6xl'
          placeholder='0.00'
          focusBorderColor='blue700'
          value={amount}
          onChangeText={(val) => setAmount(val)}
        />
        <Text fontSize='lg' color='gray700' fontWeight='400'>
          BTC - {rate}
        </Text>

        <Icon
          my='xl'
          bg='#F2994A'
          p={10}
          rounded='circle'
          name='retweet'
          color='white'
          fontSize='6xl'
        />

        <Text my='lg' fontWeight='normal'>
          You get
        </Text>

        <Text fontWeight='500' fontSize='6xl'>
          ₦{getting}
        </Text>
      </Div>
      <BaseButton onPress={proceed} m='xl' block fill>
        Next
      </BaseButton>
      <Modal
        swipeDirection='down'
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
        roundedTop={50}
        h='80%'
        isVisible={visible}
        p='none'
      >
        {donevisible ? (
          <Div flex={1} justifyContent='center' alignItems='center' p='2xl'>
            <Image
              alignSelf='center'
              resizeMode='contain'
              w='100%'
              flex={0.5}
              mt='xl'
              source={{
                uri:
                  "https://res.cloudinary.com/danjhay/image/upload/v1610810657/4529819_yd7dh5.png",
              }}
            />
            <Text my='lg' fontSize='4xl'>
              Transaction Successful
            </Text>
            <Text mb='xl' fontSize='lg' textAlign='center'>
              Your transaction is now sucessful you can check the status in the
              transactions history
            </Text>
            <BaseButton
              onPress={() => {
                setVisible(false);
                navigate("Transactions");
              }}
              alignSelf='center'
              fill
            >
              Go to transactions
            </BaseButton>
          </Div>
        ) : (
          <Div flex={1} justifyContent='center' alignItems='center' pt='xl'>
            {bitcoinAddress && (
              <ScrollDiv bg='white' mt='xl' p='xl'>
                <Image
                  alignSelf='center'
                  h={150}
                  w={150}
                  mt='xl'
                  source={{
                    uri: bitcoinAddress.qrCode,
                  }}
                />
                <Text
                  fontSize='lg'
                  fontWeight='bold'
                  textAlign='center'
                  mt='xl'
                >
                  Wallet Address
                </Text>
                <Text
                  color='gray900'
                  fontWeight='300'
                  fontSize='lg'
                  mb='xl'
                  mt='lg'
                  textAlign='center'
                >
                  {bitcoinAddress.walletAddress}
                </Text>
                <BaseButton
                  onPress={copyToClipboard}
                  mt='xl'
                  block
                  fontSize='2xl'
                >
                  Copy Address
                </BaseButton>

                <Input
                  rounded='sm'
                  mb='md'
                  mt='lg'
                  placeholder='Enter hash'
                  px='lg'
                  py={16}
                  fontSize='lg'
                  focusBorderColor='gray600'
                  borderWidth={1}
                  borderColor={"gray200"}
                  value={hash}
                  onChangeText={(val) => setHash(val)}
                />

                <BaseButton
                  onPress={submitTransaction}
                  mt='xl'
                  fill
                  block
                  loading={submitting}
                >
                  Next
                </BaseButton>
              </ScrollDiv>
            )}
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
          </Div>
        )}
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

export { TradeBitcoin };
