import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {NavigationProp, ParamListBase, NavigatorScreenParams} from '@react-navigation/native';

export type Counter = {
  increment: () => void;
  decrement: () => void;
  goBack: () => void;
  value: number;
  isEven: boolean;
  isOdd: boolean;
};

export type InitialProps = {
  navigation: NavigationProp<ParamListBase>;
  route: NavigatorScreenParams<ParamListBase>;
};

const useCounter = (initialProps: InitialProps): Counter => {
  const [value, setValue] = useState(0);

  const increment = () => setValue(value + 1);
  const decrement = () => setValue(value - 1);

  const goBack = () => initialProps.navigation.navigate('Default');

  useEffect(() => {
    if (value >= 10) {
      Alert.alert('Value reached 10! Rolling back to 0');
      setValue(0);
    }
  }, [value]);

  const isEven = value % 2 === 0;

  return {
    value,
    increment,
    decrement,
    goBack,
    isEven,
    isOdd: !isEven,
  };
};

export default useCounter;
