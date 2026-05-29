import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ResidentsScreen from '../modules/residents/ResidentsScreen';
import DuesScreen from '../modules/dues/DuesScreen';
import ExpensesScreen from '../modules/expenses/ExpensesScreen';
import LogbookScreen from '../modules/logbook/LogbookScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sakinler" component={ResidentsScreen} />
      <Tab.Screen name="Aidat" component={DuesScreen} />
      <Tab.Screen name="Giderler" component={ExpensesScreen} />
      <Tab.Screen name="Kayıt Defteri" component={LogbookScreen} />
    </Tab.Navigator>
  );
}
