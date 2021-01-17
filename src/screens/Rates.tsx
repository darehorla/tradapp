import React, { useState, useEffect } from "react";
import { StatusBar, SafeAreaView, Pressable, FlatList } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Axios from "../server/axios";
import {
  Div,
  Header,
  Icon,
  Text,
  Button,
  Image,
  Skeleton,
} from "react-native-magnus";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const CardStack = createStackNavigator();

const Rates = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
        Rates
      </Header>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 16, textTransform: "capitalize" },
          showIcon: true,
          indicatorContainerStyle: {
            marginHorizontal: 60,
            paddingHorizontal: 120,
          },
          indicatorStyle: {
            backgroundColor: "#000",
            height: 3,
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                name='bitcoin-circle'
                color='#FB8915'
                fontSize='4xl'
                fontFamily='Foundation'
              />
            ),
          }}
          name='Bitcoin'
          component={FirstRoute}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                name='card-giftcard'
                color={color}
                fontSize='4xl'
                fontFamily='MaterialIcons'
              />
            ),
          }}
          name='Giftcards'
          component={SecondRoute}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export { Rates };

const FirstRoute = () => {
  const [bitcoinRates, setBitcoinRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/bitcoin-rates`);
      setBitcoinRates(
        data.map((item) => {
          return { value: item.usdValue, rate: item.rate, id: item.id };
        })
      );
      setLoading(false);
    })();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <Div
        row
        justifyContent='space-between'
        py='lg'
        alignItems='center'
        borderBottomColor='gray200'
        borderBottomWidth={1}
      >
        <Div row alignItems='center'>
          <Icon
            name='bitcoin-circle'
            color='#FB8915'
            fontSize={45}
            fontFamily='Foundation'
            mr='lg'
          />
          <Text fontSize='xl'>
            Quantity: {index === 0 ? 0 : bitcoinRates[index - 1].value} -{" "}
            {item.value}
          </Text>
        </Div>

        <Text fontSize='xl'>{item.rate}/$</Text>
      </Div>
    );
  };

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

  return (
    <Div flex={1} bg='white' p='xl' pt='md'>
      <FlatList
        data={bitcoinRates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Div>
  );
};

const SecondRoute = () => {
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <CardStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <CardStack.Screen name='FirstCard' component={FirstCard} />
        <CardStack.Screen name='SecondCard' component={SecondCard} />
      </CardStack.Navigator>
    </>
  );
};

const FirstCard = ({ navigation: { navigate } }) => {
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
        onPress={() =>
          navigate("SecondCard", { id: item.id, cardName: item.name })
        }
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
    <Div flex={1} bg='white' p='xl' pt='md'>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Div>
  );
};

const SecondCard = ({ navigation, route }) => {
  const { id, cardName } = route.params;
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Axios.get(`/card-types/${id}`).then((response) => {
      setCards(
        response.data.cards
          .filter((card) => {
            return card.active === true;
          })
          .map((item) => {
            return { name: item.name, rate: item.rate, id: item.id };
          })
      );

      setLoading(false);
    });
  });

  const renderItem = ({ item }) => {
    return (
      <Div
        py={20}
        row
        justifyContent='space-between'
        borderBottomColor='gray200'
        borderBottomWidth={1}
      >
        <Text fontSize='xl'>{item.name}</Text>
        <Text textAlign='right' fontSize='xl'>
          {item.rate}
        </Text>
      </Div>
    );
  };

  return (
    <Div flex={1} bg='white' pt='md'>
      <Header
        borderBottomWidth={1}
        borderBottomColor='gray200'
        alignment='center'
        shadow='none'
        fontSize='2xl'
        textTransform='none'
        prefix={
          <Button bg='transparent' onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
          </Button>
        }
      >
        {cardName}
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
        ) : (
          <FlatList
            data={cards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </Div>
    </Div>
  );
};
