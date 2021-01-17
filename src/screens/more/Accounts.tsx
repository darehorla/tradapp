import React, { useEffect, useState } from "react";
import Axios from "../../server/axios";
import { StatusBar, SafeAreaView, Pressable, FlatList } from "react-native";
import {
  Button,
  Div,
  Text,
  Avatar,
  Image,
  Skeleton,
} from "react-native-magnus";
import { BaseButton } from "../../components";
import AsyncStorage from "@react-native-community/async-storage";

const Accounts = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState([]);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { id, jwt } = JSON.parse(
        await AsyncStorage.getItem("user_details")
      );
      const response = await Axios.get(`accounts?user=${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setLoading(false);
      setBanks(response.data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", async () => {
      await fetchBanks();
    });
    fetchBanks();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Div
        row
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        px='lg'
        py='md'
        shadow='xs'
        rounded='sm'
        mb='lg'
      >
        <Image
          h={40}
          w={40}
          m={10}
          mr={20}
          resizeMode='contain'
          source={{
            uri: item.bank.image.url,
          }}
        />
        <Div>
          <Text textAlign='right' fontSize='lg'>
            {item.accountName}
          </Text>
          <Text fontSize='lg' textAlign='right'>
            {item.accountNumber}
          </Text>
        </Div>
      </Div>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' />
      <Div
        p='xl'
        pt='2xl'
        flex={1}
        justifyContent={`${loading ? "flex-start" : "center"}`}
      >
        {loading ? (
          <Div flex={1}>
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
            <Skeleton.Box h={40} mt='xl' w='100%' />
          </Div>
        ) : banks.length === 0 ? (
          <Div flex={1} justifyContent='center' alignItems='center'>
            <Text fontSize='lg' fontWeight='300'>
              No bank accounts.
            </Text>
          </Div>
        ) : (
          <FlatList
            data={banks}
            renderItem={renderItem}
            onRefresh={fetchBanks}
            refreshing={loading}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <Skeleton.Box h={40} mt='xl' w='100%' />
                <Skeleton.Box h={40} mt='xl' w='100%' />
                <Skeleton.Box h={40} mt='xl' w='100%' />
                <Skeleton.Box h={40} mt='xl' w='100%' />
                <Skeleton.Box h={40} mt='xl' w='100%' />
              </SafeAreaView>
            )}
          />
        )}
        <BaseButton
          fontSize='lg'
          mt='xl'
          block
          fill
          onPress={() => navigation.navigate("Add")}
        >
          Add Account
        </BaseButton>
      </Div>
    </SafeAreaView>
  );
};

export { Accounts };

// const deleteButton = (id) =>
//     Alert.alert(
//       'Delete Bank Account ',
//       'Confirm ',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'OK',
//           onPress: async () => {
//             try {
//               const { jwt } = JSON.parse(
//                 await AsyncStorage.getItem('user_details'),
//               )
//               await instance.delete(
//                 `/accounts/${id}`,

//                 {
//                   headers: {
//                     Authorization: `Bearer ${jwt}`,
//                   },
//                 },
//               )
//               await fetchBanks()
//             } catch (error) {
//               console.warn(error)
//             }
//           },
//         },
//       ],
//       { cancelable: false },
//     )
