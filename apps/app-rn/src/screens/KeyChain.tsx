import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import {
  saveToken,
  clearToken,
  getToken,
  saveTokenByAuthentication,
} from "../utils/KeyChainService";
import { useState, useRef } from "react";

const KeyChain = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const getToken1 = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      setToken(token || "");
    } catch (error) {
      console.error('获取Token失败:', error);
      setToken("");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToken1 = async (token: string) => {
    try {
      setIsLoading(true);
      await saveToken(token);
    } catch (error) {
      console.error('保存Token失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearToken1 = async () => {
    try {
      setIsLoading(true);
      await clearToken();
      setToken("");
    } catch (error) {
      console.error('清除Token失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenByAuthentication1 = async (token: string) => {
    try {
      setIsLoading(true);
      await saveTokenByAuthentication(token);
    } catch (error) {
      console.error('通过认证保存Token失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.content}>
        <Text style={styles.title}>KeyChain 工具</Text>
        <Text style={styles.subtitle}>安全存储和管理您的Token</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => saveToken1("123456")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>保存 Token</Text>
          </TouchableOpacity>

          <Pressable
            onPress={() => getToken1()}
            onLongPress={() => clearToken1()}
            android_ripple={{ color: "rgba(0, 0, 0, 0.1)", borderless: false, radius: 8 }}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.secondaryButtonText}>单点获取，长按清除</Text>
          </Pressable>

          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => saveTokenByAuthentication1("123456")}
          >
            <Animated.View
              style={[
                styles.button,
                styles.primaryButton,
                { transform: [{ scale }] }
              ]}
            >
              <Text style={styles.buttonText}>通过认证保存 Token</Text>
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>当前 Token:</Text>
          <View style={[styles.tokenBox, !token && styles.emptyTokenBox]}>
            <Text style={[styles.tokenText, !token && styles.emptyTokenText]}>
              {token || "未找到 Token"}
            </Text>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>处理中...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonPressed: {
    backgroundColor: '#d0d0d0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  tokenContainer: {
    marginBottom: 20,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  tokenBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    justifyContent: 'center',
  },
  emptyTokenBox: {
    borderColor: '#ffcccc',
  },
  tokenText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    wordBreak: 'break-all',
  },
  emptyTokenText: {
    color: '#ff6b6b',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    backgroundColor: '#333',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default KeyChain;
