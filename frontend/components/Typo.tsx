import { View, Text, StyleSheet, TextStyle } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'
import { TypoProps } from '@/types'
import { verticalScale } from '@/utils/styling'

const Typo = ({
    size=16,
    color=colors.text,
    fontWeight = '400',
    children,
    style,
    textProps = {}
}: TypoProps) => {

    const textStyle: TextStyle = {
        fontSize: verticalScale(size),
        color,
        fontWeight
    }
  return (
    <View>
      <Text style={[textStyle,style]} {...textProps}>{children}</Text>
    </View>
  )
}

export default Typo