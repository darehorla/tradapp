import React, { useState } from "react";
import { Input, Text, Div, ScrollDiv } from "react-native-magnus";

const PinInput = (props) => {
  const { name, control, errors, Controller, typedName } = props;
  const [focus, setFocus] = useState(false);

  return (
    <ScrollDiv mb={20}>
      <Text fontSize='lg' mb='md'>
        {typedName}
      </Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Input
            py={16}
            fontSize='lg'
            focusBorderColor='yellow700'
            onBlur={() => {
              onBlur();
              setFocus(false);
            }}
            borderWidth={1}
            borderColor={focus ? "yellow300" : "gray200"}
            onChangeText={(inputValue) => onChange(inputValue.slice(0, 4))}
            value={String(value)}
            rounded='sm'
            secureTextEntry
            mb='md'
            keyboardType='number-pad'
            returnKeyLabel='done'
            returnKeyType='done'
            {...props}
          />
        )}
        name={name}
        rules={{
          required: true,
          valueAsNumber: true,
        }}
        defaultValue=''
      />
      {errors[name] && (
        <Text textTransform='capitalize' mb='lg' color='red500'>
          {errors[name].message ? errors[name].message : `${name} is required.`}
        </Text>
      )}
    </ScrollDiv>
  );
};
export { PinInput };
