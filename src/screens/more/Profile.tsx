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
  Snackbar,
  SnackbarRef,
} from "react-native-magnus";

const Places = [
  {
    name: "Olawale Peter",
    icon: "person",
    family: "Ionicons",
  },
  {
    name: "mama@gss.com",
    icon: "email",
    family: "Entypo",
  },
];

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Div p='xl'>
        {Places.map((item) => (
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
        ))}
      </Div>
    </SafeAreaView>
  );
};

export { Profile };
