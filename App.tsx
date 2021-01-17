import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator, StatusBar } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import { Button, Icon, Div, Text } from "react-native-magnus";
import { NavigationContainer } from "@react-navigation/native";
import { Register, Login, Forgot, Reset, SetPin } from "./src/screens/auth";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeStack, Transactions, Rates, MoreStack } from "./src/screens";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AuthProvider } from "./src/context";
import Axios from "./src/server/axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-community/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  colors: {
    white: "#ffffff",
    black: "#000000",
    dark: "#2f2e41",
    gray50: "#F7FAFC",
  },
};

export default function App() {
  const [state, setState] = useState({ isLoading: true, isSignedIn: false });

  useEffect(() => {
    (async () => {
      try {
        const { jwt } = JSON.parse(await AsyncStorage.getItem("user_details"));
        if (!jwt) {
          throw Error;
        }
        await Axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setState({ isLoading: false, isSignedIn: true });
      } catch (e) {
        setState({ isLoading: false, isSignedIn: false });
      }
    })();
  }, []);

  if (state.isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <Div justifyContent='center' alignItems='center' h='100%'>
          <ActivityIndicator size='small' color='#0000ff' />
        </Div>
      </ThemeProvider>
    );
  }

  return (
    <AuthProvider value={[state, setState]}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isSignedIn ? (
              <>
                <Stack.Screen name='MyTabs' component={MyTabs} />
              </>
            ) : (
              <>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Register' component={Register} />
                <Stack.Screen name='Forgot' component={Forgot} />
                <Stack.Screen name='Reset' component={Reset} />
                <Stack.Screen name='SetPin' component={SetPin} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

const MyTabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#F2994A",
        inactiveTintColor: "#000",
        style: {
          borderTopWidth: 0,
        },
        labelStyle: {
          fontSize: 14,
          margin: 0,
          padding: 0,
        },
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Entypo
              size={20}
              style={{ marginBottom: -3 }}
              name='home'
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Rates'
        component={Rates}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Feather
              style={{ marginBottom: -3 }}
              name='trending-up'
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name='Transactions'
        component={Transactions}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              style={{ marginBottom: -3 }}
              name='history'
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='More'
        component={MoreStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Feather
              style={{ marginBottom: -3 }}
              name='more-vertical'
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
