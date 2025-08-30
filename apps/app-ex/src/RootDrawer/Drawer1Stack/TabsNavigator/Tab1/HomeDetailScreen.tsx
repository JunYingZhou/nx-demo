import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export function HomeDetailScreen({ route, navigation }) {
  const { userId, name } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>用户详情</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>User Details</Text>
      </View>
      
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, isDark && styles.labelDark]}>用户ID:</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>{userId}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, isDark && styles.labelDark]}>姓名:</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>{name}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isDark && styles.buttonDark]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>返回</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  titleDark: {
    color: '#ecf0f1',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#bdc3c7',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#2c2c2c',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    flex: 1,
  },
  labelDark: {
    color: '#bdc3c7',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  valueDark: {
    color: '#ecf0f1',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDark: {
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextDark: {
    color: '#ecf0f1',
  },
});
