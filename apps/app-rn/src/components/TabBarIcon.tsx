import React from 'react';
import { Image, View, Text } from 'react-native';
import {homeIcon, ticketIcon, myIcon} from '../assets/index';
import { TABS } from '../constants/navigation';


interface TabBarIconProps {
  name?: string;
  color?: string;
  iconSource?: any;
}

const tabIcon = {
    [TABS.eventList]: homeIcon,
    [TABS.ticket]: ticketIcon,
    [TABS.my]: myIcon,
}

const TabBarIcon = ({ name = 'TabBarIcon', color }: TabBarIconProps) => {
  return (
    <View>
      {name ? (
        <Image source={tabIcon[name]} style={{ width: 24, height: 24, tintColor: color}} />
      ) : (
        <Text>{name}</Text>
      )}
    </View>
  );
};

export default TabBarIcon;