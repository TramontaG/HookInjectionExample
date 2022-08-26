import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import Default from '../screens/Default';
import MyPattern from '../screens/MyPattern';

const Router = () => (
  <Tab.Navigator>
    <Tab.Screen name="Default" component={Default} />
    <Tab.Screen name="MyPattern" component={MyPattern} />
  </Tab.Navigator>
);

export default Router;
