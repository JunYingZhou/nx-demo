import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  LayoutAnimation,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  View,
  ScrollView,
} from "react-native";
import * as Animatable from 'react-native-animatable';
const { width } = Dimensions.get("window");

interface AnimationType {
  name: string;
  color: string;
}

const AnimationScreen = () => {
  // 创建动画变量 初始透明度 0
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [boxCount, setBoxCount] = useState(1);

  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>({
    name: "天蓝色",
    color: "#87CEEB",
  });

  const colorOptions = [
    { name: "天蓝色", color: "#87CEEB" },
    { name: "玫瑰红", color: "#FF69B4" },
    { name: "草绿色", color: "#90EE90" },
    { name: "紫罗兰", color: "#9370DB" },
  ];

  // 添加方块
  const addBox = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBoxCount(boxCount + 1);
  };

  // 淡入动画
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // 淡出动画
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // 目标透明度 0
      duration: 1000, // 动画时长 1 秒
      useNativeDriver: true, // 使用原生驱动，提高性能
    }).start();
  };

  // 缩放动画
  const scaleAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 旋转动画
  const rotateAnimation = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0); // 重置动画值
    });
  };

  // 组合动画
  const combinedAnimation = () => {
    fadeAnim.setValue(0); // 重置透明度
    scaleAnim.setValue(0.5); // 重置缩放
    rotateAnim.setValue(0); // 重置旋转

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 计算旋转插值
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView>
        {/* 标题区域 */}
        <View style={styles.header}>
          <Text style={styles.title}>动画展示</Text>
          <Text style={styles.subtitle}>探索React Native动画效果</Text>
        </View>

        {/* 动画展示区域 */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.animatedBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { rotate: spin }],
                backgroundColor: selectedAnimation.color,
              },
            ]}
          >
            <Text style={styles.boxText}>动画演示</Text>
          </Animated.View>
        </View>

        {/* 颜色选择器 */}
        <View style={styles.colorSelector}>
          <Text style={styles.sectionTitle}>选择颜色</Text>
          <View style={styles.colorOptions}>
            {colorOptions.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={[
                  styles.colorOption,
                  { backgroundColor: option.color },
                  selectedAnimation.name === option.name &&
                    styles.selectedColorOption,
                ]}
                onPress={() => setSelectedAnimation(option)}
                activeOpacity={0.7}
              />
            ))}
          </View>
        </View>

        {/* 动画控制按钮 */}
        <View style={styles.controls}>
          <Text style={styles.sectionTitle}>动画控制</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={fadeIn}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>淡入</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={fadeOut}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>淡出</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={scaleAnimation}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>缩放</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={rotateAnimation}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>旋转</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.combinedButton]}
              onPress={combinedAnimation}
              activeOpacity={0.8}
            >
              <Text style={styles.combinedButtonText}>组合动画</Text>
            </TouchableOpacity>

            <View style={{ padding: 20 }}>
              {Array.from({ length: boxCount }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    height: 50,
                    backgroundColor: "tomato",
                    marginVertical: 5,
                  }}
                />
              ))}
              <TouchableOpacity onPress={addBox}>
                <View style={{ padding: 10, backgroundColor: "green" }}>
                  <Text style={{ color: "#fff" }}>添加方块</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Animatable.View animation="zoomIn" duration={1500}>
              <Text style={styles.animationText}>Hello Animation!</Text>
            </Animatable.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  animatedBox: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  boxText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  colorSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "#333",
  },
  controls: {
    marginBottom: 30,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  controlButton: {
    width: (width - 50) / 2, // 两列布局，考虑间距
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  combinedButton: {
    width: "100%",
    backgroundColor: "#50E3C2",
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  combinedButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  animationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
});

export default AnimationScreen;
