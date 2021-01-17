import React, { useState } from "react";
import { Input, Text, Div } from "react-native-magnus";

const PasswordInput = (props) => {
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
            onChangeText={(inputValue) => onChange(inputValue)}
            value={value}
            rounded='sm'
            secureTextEntry
            mb='md'
            {...props}
          />
        )}
        name={name}
        rules={{
          required: true,
          pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message:
              "Password should contain minimum of eight characters, at least one letter and one number",
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
export { PasswordInput };
