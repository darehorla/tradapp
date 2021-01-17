import React, { useContext } from "react";
import {
  Div,
  Header,
  Icon,
  Text,
  Button,
  Image,
  Skeleton,
} from "react-native-magnus";
import { SafeAreaView, Pressable } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import AuthContext from "../../context";

const Places = [
  { name: "Profile", icon: "user", family: "AntDesign", link: "Profile" },
  {
    name: "Bank Accounts",
    icon: "bank",
    family: "FontAwesome",
    link: "Accounts",
  },
  { name: "Contact", icon: "message", family: "Entypo", link: "Contact" },
  { name: "Security", icon: "lock", family: "Entypo", link: "Security" },
];

const More = ({ navigation: { navigate } }) => {
  const [state, setState] = useContext(AuthContext);
  const logout = async () => {
    await AsyncStorage.removeItem("user_details");
    setState({ isLoading: false, isSignedIn: false });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Div p='xl' flex={1} justifyContent='center'>
        {Places.map((item) => (
          <Pressable onPress={() => navigate(item.link)}>
            <Div
              key={item.name}
              row
              bg='white'
              alignItems='center'
              p='lg'
              shadow='xs'
              rounded='sm'
              mt='xl'
            >
              <Icon
                bg='#FB8915'
                p={10}
                rounded='circle'
                name={item.icon}
                color='white'
                fontSize='lg'
                fontFamily={item.family}
                mr={20}
              />
              <Text fontWeight='500' fontSize='2xl'>
                {item.name}
              </Text>
            </Div>
          </Pressable>
        ))}

        <Pressable onPress={logout}>
          <Div
            mt='xl'
            row
            bg='white'
            alignItems='center'
            p='lg'
            shadow='xs'
            rounded='sm'
          >
            <Icon
              bg='red'
              p={10}
              rounded='circle'
              name='logout'
              color='white'
              fontSize='lg'
              fontFamily='MaterialIcons'
              mr={20}
            />
            <Text fontWeight='500' fontSize='2xl'>
              Logout
            </Text>
          </Div>
        </Pressable>
      </Div>
    </SafeAreaView>
  );
};

export { More };
