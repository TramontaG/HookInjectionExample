import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, Alert, StyleSheet} from 'react-native';

import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {NavigatorScreenParams} from '@react-navigation/native';

type InitialProps = {
  navigation: NavigationProp<ParamListBase>;
  route: NavigatorScreenParams<ParamListBase>;
};

const DefaultPattern = (props: InitialProps) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value >= 10) {
      Alert.alert('Value is 10! Rolling back to 0');
      setValue(0);
    }
  }, [value]);

  return (
    <View>
      <Text style={styles.header}>Default version {'\n'}</Text>

      <View style={styles.controlsContainer}>

      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={() => setValue(currentValue => currentValue - 1)}
      >
        <Text>-</Text>
      </TouchableOpacity>
      <Text style={styles.valueLabel}>{value}</Text>
      <TouchableOpacity 
        style={[styles.button, styles.rightButton]}
        onPress={() => setValue(currentValue => currentValue + 1)}
      >
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => props.navigation.navigate('MyPattern')}
      >
        <Text>Go forward</Text>
      </TouchableOpacity>

      {value % 2 === 0 && (
        <Text style={styles.evenLabel}>Number is even</Text>
      )}

      {value % 2 !== 0 && (
        <Text style={styles.oddLabel}>Number is odd</Text>
      )}
    </View>
  );
};

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

export default DefaultPattern;
