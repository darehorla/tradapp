import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import {
  Button,
  Div,
  Text,
  Avatar,
  Image,
  Skeleton,
  Select,
  Icon,
  Input,
  Modal,
} from "react-native-magnus";

const Places = [
  {
    name: "Change Password",
    icon: "form-textbox-password",
    family: "MaterialCommunityIcons",
    link: "Change Password",
  },
  { name: "Change Pin", icon: "lock", family: "Entypo", link: "Change Pin" },
];

const Security = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Div p='xl'>
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
      </Div>
    </SafeAreaView>
  );
};

export { Security };
