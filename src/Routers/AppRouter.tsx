import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PresentationRouter from './PresentationRouter';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Presentation"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Presentation" component={PresentationRouter} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
