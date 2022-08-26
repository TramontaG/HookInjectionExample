import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Counter} from './Logic';
import RenderIf from './../../Components/Render';

const Render = (props: Counter) => (
  <View>
    <Text style={styles.header}>MyVersion</Text>

    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={props.decrement}>
        <Text>-</Text>
      </TouchableOpacity>

      <Text style={styles.valueLabel}>{props.value}</Text>

      <TouchableOpacity
        style={[styles.button, styles.rightButton]}
        onPress={props.increment}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.button} onPress={props.goBack}>
      <Text>Go Back</Text>
    </TouchableOpacity>

    <RenderIf if={props.isEven}>
      <Text style={styles.evenLabel}>Even</Text>
    </RenderIf>

    <RenderIf if={!props.isEven}>
      <Text style={styles.oddLabel}>Odd</Text>
    </RenderIf>
  </View>
);

const styles = StyleSheet.create({
  header: {fontSize: 20, fontWeight: 'bold'},
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#BBB',
    elevation: 5,
    borderRadius: 4,
    minWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evenLabel: {
    color: 'green',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  oddLabel: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  valueLabel: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#BBB',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingHorizontal: 8,
  },
});

export default Render;
