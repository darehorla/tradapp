import React, { useEffect, useState } from "react";
import {
  StatusBar,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BaseButton } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import Axios from "../../server/axios";
import moment from "moment";
import {
  Button,
  Div,
  Text,
  Snackbar,
  Image,
  Icon,
  ScrollDiv,
} from "react-native-magnus";
import AsyncStorage from "@react-native-community/async-storage";

const Home = ({ navigation: { navigate } }) => {
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { jwt } = JSON.parse(await AsyncStorage.getItem("user_details"));
        if (!jwt) {
          throw Error;
        }

        const { data } = await Axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const latestTransaction = await Axios.get(
          `/transactions?user=${data.id}&_sort=createdAt:DESC&_limit=5`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        setLatestTransactions(latestTransaction.data);
        setLoading(false);
        setUser(data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const RenderItem = ({ item }) => {
    return (
      <Div
        row
        py='lg'
        justifyContent='space-between'
        alignItems='center'
        borderBottomColor='gray300'
        borderBottomWidth={2}
      >
        <Div row alignItems='center'>
          <Icon
            bg={
              item.status === "PROCESSING"
                ? "orange400"
                : item.status === "ACCEPTED"
                ? "#47BC29"
                : "#FF2323"
            }
            p={4}
            rounded='circle'
            name={
              item.status === "PROCESSING"
                ? "loading1"
                : item.status === "ACCEPTED"
                ? "check"
                : "close"
            }
            color='white'
            fontSize='3xl'
            mr='lg'
          />
          <Div>
            <Text fontSize='lg'>
              {item.type[0].__component === "transaction.bitcoin"
                ? "Bitcoin"
                : item.type[0].__component === "transaction.card-order"
                ? `${item.type[0].name}`
                : "Withdrawal"}
            </Text>
            <Text fontSize='lg'>
              {item.type[0].__component === "transaction.bitcoin"
                ? `USD ${item.type[0].usdValue}`
                : item.type[0].__component === "transaction.card-order"
                ? `USD ${item.type[0].value}`
                : `NGN ${item.type[0].amount}`}
            </Text>
          </Div>
        </Div>

        <Div>
          <Text fontWeight='bold' fontSize='lg'>
            {item.status === "PROCESSING"
              ? "Processing!"
              : item.status === "ACCEPTED"
              ? " Successfull!"
              : "Declined!"}
          </Text>
          <Text fontSize='lg'>
            {moment(item.createdAt).startOf("hour").fromNow()}
          </Text>
        </Div>
      </Div>
    );
  };

  if (loading) {
    return (
      <Div justifyContent='center' alignItems='center' h='100%'>
        <ActivityIndicator size='large' color='#000' />
      </Div>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <Div h='100%' bg='black'>
        <StatusBar barStyle='light-content' />
        <Div p='xl'>
          <Div row w='100%' mb={20}>
            <Div mr={10}>
              <Image
                w={30}
                h={30}
                rounded='circle'
                source={{
                  uri: "https://i.imgur.com/iLhww5H.png",
                }}
              />
            </Div>
            <Div>
              <Text color='white' fontSize='3xl'>
                Hi, {user.username}
              </Text>
            </Div>
          </Div>

          <Div rounded='xl' bg='gray400' p={20}>
            <Text color='gray900' textAlign='center'>
              Account Balance
            </Text>
            <Text
              my='sm'
              color='gray900'
              textAlign='center'
              fontSize='6xl'
              fontWeight='bold'
            >
              ₦{user.wallet ? user.wallet.toLocaleString() : "0.00"}
            </Text>
            <BaseButton
              py='md'
              block
              onPress={() =>
                navigate("Withdraw", { amount: user.wallet ? user.wallet : 0 })
              }
            >
              Withdraw
            </BaseButton>
          </Div>
        </Div>
        <Div p='xl' bg='white' roundedTop={20} mt='sm'>
          <Div row justifyContent='space-between' flexWrap='wrap'>
            <Button
              mt='md'
              w='49%'
              color='white'
              p='none'
              onPress={() => navigate("TradeBitcoin")}
            >
              <Div
                flex={1}
                p='lg'
                bgImg={{
                  uri:
                    "https://res.cloudinary.com/danjhay/image/upload/v1610814885/image_2_olyywk.jpg",
                }}
              >
                <Text color='white' fontSize='3xl' fontWeight='bold'>
                  Bitcoin
                </Text>
                <Div row mt='xl'>
                  <Text color='white'>Trade Now</Text>
                  <Icon name='arrowright' color='white' ml='md' />
                </Div>
              </Div>
            </Button>
            <Button
              mt='md'
              w='49%'
              color='white'
              p='none'
              onPress={() => navigate("TradeGiftCard")}
            >
              <Div
                flex={1}
                p='lg'
                bgImg={{
                  uri:
                    "https://res.cloudinary.com/danjhay/image/upload/v1610814672/image_w5kkxb.jpg",
                }}
              >
                <Text color='white' fontSize='3xl' fontWeight='bold'>
                  Giftcard
                </Text>
                <Div row mt='xl'>
                  <Text color='white'>Trade Now</Text>
                  <Icon name='arrowright' color='white' ml='md' />
                </Div>
              </Div>
            </Button>
          </Div>
        </Div>
        <Div bg='white' flex={1} pt={0} p='xl'>
          <Div
            row
            justifyContent='space-between'
            borderBottomColor='gray300'
            borderBottomWidth={2}
            alignItems='center'
            pb='lg'
          >
            <Div row alignItems='center'>
              <MaterialIcons name='history' size={20} color='black' />
              <Text ml='md' fontSize={20} fontWeight='bold'>
                Transaction History
              </Text>
            </Div>
            <Pressable onPress={() => navigate("Transactions")}>
              <Text color='gray600' fontSize='lg'>
                view all
              </Text>
            </Pressable>
          </Div>

          {latestTransactions.length === 0 ? (
            <Div h='100%' justifyContent='center' alignItems='center'>
              <Text fontSize='lg' fontWeight='300'>
                No transactions yet.
              </Text>
            </Div>
          ) : (
            <FlatList
              data={latestTransactions}
              renderItem={RenderItem}
              // onRefresh={getData}
              refreshing={loading}
              keyExtractor={(item) => item.id}
            />
          )}
        </Div>
      </Div>
    </SafeAreaView>
  );
};

export { Home };
