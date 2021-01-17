import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./Home";
import { Withdraw } from "./Withdraw";
import { TradeBitcoin } from "./TradeBitcoin";
import { TradeGiftCard } from "./TradeGiftCard";
import { Trade } from "./Trade";

import { Button, Div, Header, Icon } from "react-native-magnus";

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 115,
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name='Home'
        component={Home}
      />
      <Stack.Screen
        name='Withdraw'
        component={Withdraw}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Home")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='TradeBitcoin'
        component={TradeBitcoin}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Home")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='TradeGiftCard'
        component={TradeGiftCard}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Home")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />

      <Stack.Screen
        name='Trade'
        component={Trade}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Home")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export { HomeStack };
