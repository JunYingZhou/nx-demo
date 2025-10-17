import { View, Text } from 'react-native';
import { Button } from 'react-native';
import { NAVIGATION } from '../constants/navigation';
import { useNavigation } from '@react-navigation/native';


const Home = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Home</Text>
      <Button title="Map" onPress={() => navigation.navigate(NAVIGATION.map as never)} />
      <Button title="Map1" onPress={() => navigation.navigate(NAVIGATION.Hotel as never)} />
      <Button title="BlueTooth" onPress={() => navigation.navigate(NAVIGATION.blueTooth as never)} />
    </View>
  );
};

export default Home;