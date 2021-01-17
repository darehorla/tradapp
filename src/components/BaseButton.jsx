import React from "react";
import { Button } from "react-native-magnus";

const BaseButton = (props) => {
  const { fill, children } = props;
  return (
    <Button
      py={16}
      fontWeight='300'
      fontSize='lg'
      bg={fill ? "gray300" : "white"}
      borderColor={fill ? "white" : "gray200"}
      borderWidth={fill ? 0 : 1}
      color='gray900'
      {...props}
    >
      {children}
    </Button>
  );
};

export { BaseButton };
