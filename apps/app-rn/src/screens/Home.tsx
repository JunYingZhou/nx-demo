import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { NAVIGATION } from '../constants/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // 渐变背景，可选

interface NavigationItem {
  id: string;
  title: string;
  route: string;
  color: string;
}

const Home = () => {
  const navigation = useNavigation();

  const navigationItems: NavigationItem[] = [
    { id: 'map', title: '地图', route: NAVIGATION.map, color: '#4A90E2' },
    { id: 'hotel', title: '酒店', route: NAVIGATION.Hotel, color: '#50C878' },
    { id: 'bluetooth', title: '蓝牙', route: NAVIGATION.blueTooth, color: '#FFB347' },
    { id: 'nfc', title: 'NFC', route: NAVIGATION.nfc, color: '#FF6B6B' },
    { id: 'keychain', title: '密钥链', route: NAVIGATION.KeyChain, color: '#9370DB' },
    { id: 'Camera', title: '相机', route: NAVIGATION.Camera, color: '#FF69B4' },
    { id: 'Animation', title: '动画', route: NAVIGATION.Animation, color: '#FFD700' },
  ];

  const handleNavigate = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 顶部标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>功能导航</Text>
          <View style={styles.decorLine} />
          <Text style={styles.subtitle}>选择您需要的功能</Text>
        </View>

        {/* 功能网格 */}
        <View style={styles.grid}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleNavigate(item.route)}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={[item.color + '40', item.color + '15']}
                style={[styles.card, { borderColor: item.color + '50' }]}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                  <View style={[styles.iconPlaceholder, { backgroundColor: item.color }]} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 底部 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 应用名称</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  decorLine: { width: 60, height: 4, backgroundColor: '#007AFF', borderRadius: 2, marginVertical: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrapper: { width: '48%', marginBottom: 16 },
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  iconPlaceholder: { width: 28, height: 28, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' },
  footer: { marginTop: 20, paddingTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#999' },
});

export default Home;
