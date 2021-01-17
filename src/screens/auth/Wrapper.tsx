import React from "react";
import { Pressable, SafeAreaView, StatusBar } from "react-native";
import { Button, Icon, Div, Text, ScrollDiv } from "react-native-magnus";

const Wrapper = (props) => {
  const { title, children } = props;
  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <StatusBar barStyle='dark-content' />

      <ScrollDiv px='xl' bg='white' pt='3xl'>
        <Div flex={1} pb='3xl'>
          <Text mb='xl' fontWeight='400' fontSize='5xl'>
            {title}
          </Text>
          {children}
        </Div>
      </ScrollDiv>
    </SafeAreaView>
  );
};

export default Wrapper;
