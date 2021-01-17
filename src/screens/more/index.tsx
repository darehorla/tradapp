import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Accounts } from "./Accounts";
import { More } from "./More";
import { Add } from "./Add";
import { Security } from "./Security";
import { Password } from "./Password";
import { Pin } from "./Pin";
import { Profile } from "./Profile";

import { Button, Div, Header, Icon } from "react-native-magnus";

const Stack = createStackNavigator();

const MoreStack = ({ navigation }) => {
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
        name='More'
        component={More}
      />
      <Stack.Screen
        name='Accounts'
        component={Accounts}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("More")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='Add'
        component={Add}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Accounts")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("More")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='Security'
        component={Security}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("More")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='Change Password'
        component={Password}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Security")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name='Change Pin'
        component={Pin}
        options={{
          headerLeft: () => (
            <Button
              ml='lg'
              bg='red100'
              onPress={() => navigation.navigate("Security")}
            >
              <Icon name='arrow-left' fontFamily='Feather' fontSize='2xl' />
            </Button>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export { MoreStack };
