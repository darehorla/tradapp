import React, { useState } from "react";
import { Input, Text, Div } from "react-native-magnus";

const EmailInput = (props) => {
  const { name, control, errors, Controller, typedName } = props;
  const [focus, setFocus] = useState(false);

  return (
    <Div mb={20}>
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
            onChangeText={(inputValue) => onChange(inputValue.trim())}
            value={value}
            rounded='sm'
            mb='md'
            {...props}
          />
        )}
        name={name}
        rules={{
          required: true,
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Email is not valid",
          },
        }}
        defaultValue=''
      />
      {errors[name] && (
        <Text textTransform='capitalize' mb='lg' color='red500'>
          {errors[name].message ? errors[name].message : `${name} is required.`}
        </Text>
      )}
    </Div>
  );
};
export { EmailInput };
