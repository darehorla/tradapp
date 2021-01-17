import React, { useState, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  Pressable,
  Clipboard,
  FlatList,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
  Select,
} from "react-native-magnus";
import { BaseButton } from "../../components";
import Axios from "../../server/axios";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const selectRef = React.createRef();
const snackbarRef = React.createRef();

const Trade = ({ navigation, route }) => {
  const { id, cardName } = route.params;
  const [cards, setCards] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [selectValue, setSelectedValue] = useState({});
  const [loading, setLoading] = useState(true);
  const [cardValue, setValue] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [totalCardValue, setTotalCardValue] = useState(0);
  const [visible, setVisible] = useState(false);

  const onSelectOption = (data) => {
    setSelectedValue(data);
  };

  useEffect(() => {
    const selectedCard = cards.find((item) => item.value === selectValue.value);
    if (selectedCard) {
      setTotalCardValue(cardValue * selectValue.rate);
    }
  }, [selectValue, cardValue]);

  useEffect(() => {
    (async () => {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      try {
        const localUserDetails = JSON.parse(
          await AsyncStorage.getItem("user_details")
        );
        setUserDetails(localUserDetails);
        const response = await Axios.get(`/card-types/${id}`);
        // console.warn(
        //   response.data.cards
        //     .filter((card) => {
        //       return card.active === true;
        //     })
        //     .map((item) => {
        //       return { label: item.name, rate: item.rate, value: item.id };
        //     })
        // );

        setCards(
          response.data.cards
            .filter((card) => {
              return card.active === true;
            })
            .map((item) => {
              return { label: item.name, rate: item.rate, value: item.id };
            })
        );
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  const submit = () => {
    setSubmitLoading(true);
    try {
      if (!selectValue.value) {
        setError("Please select a card");
        throw Error;
      }
      if (!cardValue) {
        setError("Please input the amount to trade");
        throw Error;
      }

      const uploaders = image.map((file) => {
        const apiUrl = "https://api.cloudinary.com/v1_1/owkaz/image/upload";

        const data = {
          file: file.base64,
          upload_preset: "trade_Card",
        };

        return axios
          .post(apiUrl, data, {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            const onlinedata = response.data;
            return onlinedata.secure_url;
          })
          .catch((err) => console.warn(err, "here"));
      });

      axios.all(uploaders).then(async (res) => {
        console.warn(res);

        const data = {
          userComment: comment,
          type: [
            {
              __component: "transaction.card-order",
              images: res,
              name: cardName,
              totalCardValue,
              value: cardValue,
              card: selectValue.value,
            },
          ],
          user: userDetails.id,
        };

        await Axios.post("/transactions", data, {
          headers: {
            Authorization: `Bearer ${userDetails.jwt}`,
          },
        });
        setSubmitLoading(false);
        setVisible(true);

        //   // await instance.get("/email/send-alert");
      });
    } catch (error) {
      snackbarRef.current.show();
      setSubmitLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    const base64Img = `data:image/jpg;base64,${result.base64}`;

    if (!result.cancelled) {
      setImage([...image, { base64: base64Img, uri: result.uri }]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Div p='xl'>
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
          <Skeleton.Box h={40} mt='xl' w='100%' />
        </Div>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle='dark-content' />

      <ScrollDiv bg='white' p='xl'>
        <Div pb='xl' flex={1}>
          <Text fontSize='lg' mb='md'>
            Select Card
          </Text>
          <Button
            block
            justifyContent='space-between'
            borderWidth={1}
            bg='white'
            color='black'
            py={16}
            borderColor='gray200'
            mb='lg'
            rounded='sm'
            suffix={
              <Icon
                position='absolute'
                right={8}
                name='select-arrows'
                fontFamily='Entypo'
                color='black'
              />
            }
            onPress={() => {
              if (selectRef.current) {
                selectRef.current.open();
              }
            }}
          >
            {selectValue.label ? selectValue.label : "Select..."}
          </Button>

          <Text fontSize='lg' mb='md'>
            Amount
          </Text>
          <Input
            py={16}
            fontSize='lg'
            focusBorderColor='gray600'
            px='lg'
            borderWidth={1}
            borderColor={"gray200"}
            onChangeText={(value) => setValue(value)}
            value={cardValue}
            rounded='sm'
            mb='md'
          />

          <Text fontSize='lg' mb='md'>
            Comment
          </Text>
          <Input
            multiline={true}
            numberOfLines={4}
            py={16}
            fontSize='lg'
            focusBorderColor='gray600'
            px='lg'
            borderWidth={1}
            borderColor={"gray200"}
            onChangeText={(value) => setComment(value)}
            value={comment}
            rounded='sm'
            mb='lg'
          />

          <Text fontSize='lg' mb='md'>
            Upload Gift Card(S)
          </Text>
          <Div flex={1} row flexWrap='wrap'>
            <Button
              mt={20}
              bg='gray100'
              alignSelf='center'
              onPress={pickImage}
              w={100}
              h={100}
            >
              <Icon
                p='lg'
                bg='gray200'
                name='plus'
                fontSize='5xl'
                color='black'
                rounded='sm'
              />
            </Button>

            <ScrollView
              style={styles.container}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              snapToStart={false}
              pagingEnabled={false}
            >
              {image &&
                image.reverse().map((item, index) => (
                  <Div mr={15} w={100} h={100} mt={10}>
                    <Image
                      rounded='md'
                      w='100%'
                      h='100%'
                      key={index}
                      source={{ uri: item.uri }}
                    />
                    <Icon
                      position='absolute'
                      name='x'
                      color='#FF2323'
                      rounded='sm'
                      fontFamily='Feather'
                      top={5}
                      fontSize='2xl'
                      right={5}
                    />
                  </Div>
                ))}
            </ScrollView>
          </Div>

          <Text mt='lg' fontWeight='500' fontSize='4xl'>
            Total: ₦{totalCardValue}
          </Text>

          <BaseButton
            mt='xl'
            loading={submitLoading}
            onPress={submit}
            fill
            block
          >
            Submit
          </BaseButton>

          <Select
            onSelect={onSelectOption}
            ref={selectRef}
            value={selectValue}
            title='Select Bank'
            mt='md'
            pb='2xl'
            roundedTop='2xl'
            data={cards}
            renderItem={(item) => (
              <Select.Option value={item} py='md'>
                <Text>{item.label}</Text>
              </Select.Option>
            )}
          />
        </Div>
      </ScrollDiv>
      <Snackbar
        suffix={<Icon name='close' color='white' fontSize='md' />}
        onDismiss={() => {}}
        ref={snackbarRef}
        bg='#FF2323'
        color='white'
        duration={2000}
        mb='xl'
      >
        {error}
      </Snackbar>
      <Modal
        swipeDirection='down'
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
        roundedTop={50}
        h='80%'
        isVisible={visible}
        p='none'
      >
        <Div flex={1} justifyContent='center' alignItems='center' p='2xl'>
          <Image
            alignSelf='center'
            resizeMode='contain'
            w='100%'
            flex={0.5}
            mt='xl'
            source={{
              uri:
                "https://res.cloudinary.com/danjhay/image/upload/v1610810657/4529819_yd7dh5.png",
            }}
          />
          <Text my='lg' fontSize='4xl'>
            Transaction Successful
          </Text>
          <Text mb='xl' fontSize='lg' textAlign='center'>
            Your transaction is now sucessful you can check the status in the
            transactions history
          </Text>
          <BaseButton
            onPress={() => {
              setVisible(false);
              navigation.navigate("Transactions");
            }}
            alignSelf='center'
            fill
          >
            Go to transactions
          </BaseButton>
        </Div>
      </Modal>
    </SafeAreaView>
  );
};

export { Trade };

var styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    paddingRight: 80,
    flex: 1,
  },
});
