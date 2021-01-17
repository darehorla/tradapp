import React, { useState, useEffect } from "react";
import { StatusBar, SafeAreaView, Pressable, FlatList } from "react-native";
import {
  Div,
  Header,
  Icon,
  ScrollDiv,
  Text,
  Button,
  Modal,
  Skeleton,
} from "react-native-magnus";
import Axios from "../server/axios";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";

const Transactions = () => {
  const [visible, setVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );

      const response = await Axios.get(`/transactions/?user=${id}`, {
        // const response = await Axios.get(`/transactions?_limit=-1`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setLoading(false);
      setTransactions(response.data.reverse());
    } catch (e) {
      setLoading(false);
      console.warn(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => setVisible(item)}>
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
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle='dark-content' />

      <Header
        p='sm'
        alignment='center'
        fontWeight='normal'
        borderBottomWidth={2}
        borderBottomColor='gray300'
        shadow='none'
        fontSize='4xl'
        textTransform='capitalize'
      >
        Transactions
      </Header>
      <Div px='xl'>
        {loading ? (
          <>
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
          </>
        ) : transactions.length === 0 ? (
          <Div h='100%' justifyContent='center' alignItems='center'>
            <Text fontSize='lg' fontWeight='300'>
              No transactions yet.
            </Text>
          </Div>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            onRefresh={getData}
            refreshing={loading}
            keyExtractor={(item) => item.id}
          />
        )}
      </Div>

      <Modal
        swipeDirection='down'
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
        roundedTop={50}
        h='60%'
        isVisible={visible}
        p='none'
      >
        {visible && (
          <Div flex={1} justifyContent='center' alignItems='center'>
            <Icon
              bg={
                visible.status === "PROCESSING"
                  ? "orange400"
                  : visible.status === "ACCEPTED"
                  ? "#47BC29"
                  : "#FF2323"
              }
              p={12}
              rounded='circle'
              name={
                visible.status === "PROCESSING"
                  ? "loading1"
                  : visible.status === "ACCEPTED"
                  ? "check"
                  : "close"
              }
              color='white'
              fontSize='3xl'
            />
            <Text mt='lg' fontWeight='bold' fontSize='3xl'>
              {visible.status === "PROCESSING"
                ? "Processing!"
                : visible.status === "ACCEPTED"
                ? " Successfull!"
                : "Declined!"}
            </Text>
            {/* <Text> {JSON.stringify(visible)}</Text> */}
            <Div mt='2xl' px='3xl'>
              <Div
                w='100%'
                borderBottomColor='gray200'
                borderBottomWidth={1}
                row
                justifyContent='space-between'
                py='lg'
              >
                <Div w='48%'>
                  <Text fontWeight='bold'>TYPE</Text>
                  <Text fontSize='lg' mt={1}>
                    {visible.type[0].__component === "transaction.bitcoin"
                      ? "Bitcoin"
                      : visible.type[0].__component === "transaction.card-order"
                      ? `${visible.type[0].name}`
                      : "Withdrawal"}
                  </Text>
                </Div>
                <Div w='48%'>
                  <Text textAlign='right' fontWeight='bold'>
                    Date
                  </Text>
                  <Text textAlign='right' fontSize='lg' mt={1}>
                    11 January 2021
                  </Text>
                </Div>
              </Div>
              <Div
                w='100%'
                borderBottomColor='gray200'
                borderBottomWidth={1}
                row
                justifyContent='space-between'
                py='lg'
              >
                <Div w='48%'>
                  <Text fontWeight='bold'>Value</Text>
                  <Text fontSize='lg' mt={1}>
                    {visible.type[0].__component === "transaction.bitcoin"
                      ? `USD ${visible.type[0].usdValue}`
                      : visible.type[0].__component === "transaction.card-order"
                      ? `USD ${visible.type[0].value}`
                      : `NGN ${visible.type[0].amount}`}
                  </Text>
                </Div>
                <Div w='48%'>
                  <Text textAlign='right' fontWeight='bold'>
                    Amount
                  </Text>
                  <Text textAlign='right' fontSize='lg' mt={1}>
                    {visible.type[0].__component === "transaction.bitcoin"
                      ? `NGN ${
                          visible.type[0].usdValue * visible.type[0].bitcoinRate
                        }`
                      : visible.type[0].__component === "transaction.card-order"
                      ? `NGN ${visible.type[0].totalCardValue}`
                      : `NGN ${visible.type[0].amount}`}
                  </Text>
                </Div>
              </Div>

              <Div py='lg' borderBottomColor='gray200' borderBottomWidth={1}>
                <Text fontWeight='bold'>Comment</Text>
                <Text fontSize='lg' mt={1}>
                  {visible.userComment}
                </Text>
              </Div>
              <Div py='lg' borderBottomColor='gray200' borderBottomWidth={1}>
                <Text fontWeight='bold'>Admin Comment</Text>
                <Text fontSize='lg' mt={1}>
                  {visible.adminComment}
                </Text>
              </Div>
            </Div>
          </Div>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export { Transactions };
