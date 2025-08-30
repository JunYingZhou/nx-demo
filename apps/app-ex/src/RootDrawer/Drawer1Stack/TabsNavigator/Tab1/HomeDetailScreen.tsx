import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

export function HomeDetailScreen({ route, navigation }) {
  const { userId, name } = route.params;
  return (
    <View>
      <Text>详情页</Text>
      <Text>ID: {userId}</Text>
      <Text>名字: {name}</Text>
    </View>
  );
}