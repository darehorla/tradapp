import React, { useState, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  Pressable,
  Clipboard,
  FlatList,
} from "react-native";
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

const TradeGiftCard = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Axios.get("/card-types").then((response) => {
      setCards(
        response.data
          .filter((card) => {
            return card.active === true;
          })
          .map((item) => {
            return { id: item.id, name: item.name, image: item.image.url };
          })
      );

      setLoading(false);
    });
  });

  if (loading) {
    return (
      <Div flex={1} bg='white' p='xl' pt='md'>
        <Skeleton.Box h={40} mt='xl' w='100%' />
        <Skeleton.Box h={40} mt='xl' w='100%' />
        <Skeleton.Box h={40} mt='xl' w='100%' />
        <Skeleton.Box h={40} mt='xl' w='100%' />
        <Skeleton.Box h={40} mt='xl' w='100%' />
      </Div>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => navigate("Trade", { id: item.id, cardName: item.name })}
      >
        <Div
          row
          justifyContent='space-between'
          py='lg'
          alignItems='center'
          borderBottomColor='gray200'
          borderBottomWidth={1}
        >
          <Div row alignItems='center'>
            <Image
              w={45}
              h={45}
              resizeMode='contain'
              source={{
                uri: item.image,
              }}
              mr='xl'
            />
            <Text fontSize='2xl'>{item.name}</Text>
          </Div>
        </Div>
      </Pressable>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle='dark-content' />
      <Div flex={1} bg='white' p='xl' pt='md'>
        <FlatList
          data={cards}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </Div>
    </SafeAreaView>
  );
};

export { TradeGiftCard };
