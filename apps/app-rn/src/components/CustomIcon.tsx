import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CustomIcon = ({ title, iconSource }: { title: string, iconSource: any }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <Image source={iconSource} style={styles.pin} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  bubble: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    marginBottom: 6,
  },
  text: { fontSize: 12 },
  pin: { width: 28, height: 28, resizeMode: 'contain' }
});

export default CustomIcon;