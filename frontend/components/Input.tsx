import { StyleSheet, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        props.containerStyle,
        isFocused && styles.primaryBorder,
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props} // optional: spread remaining props like value, onChangeText
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: verticalScale(56),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._20,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    backgroundColor: colors.neutral100,
    gap: spacingX._10,
    width: '100%',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: verticalScale(14),
  },
  primaryBorder: {
    borderColor: colors.neutral600,
    borderWidth: 2,
  },
});
