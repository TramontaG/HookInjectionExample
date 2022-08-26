import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Counter} from './Logic';
import RenderIf from './../../Components/Render';

const Render = (props: Counter) => (
  <View>
    <Text>MyVersion{'\n'}</Text>
    <TouchableOpacity onPress={props.increment}>
      <Text>Increment</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={props.decrement}>
      <Text>Decrement</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={props.goBack}>
      <Text>Go Back</Text>
    </TouchableOpacity>

    <RenderIf if={props.isEven}>
      <Text>Number is even</Text>
    </RenderIf>

    <RenderIf if={props.isOdd}>
      <Text>Number is Odd</Text>
    </RenderIf>

    <Text>Value = {props.value}</Text>
  </View>
);


export default React.memo(Render);
