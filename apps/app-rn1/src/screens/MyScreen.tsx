// MyScreen.tsx (UI 优化版)
// 更漂亮的聊天界面：圆角卡片、浮动输入框、阴影、现代气泡、对话中提示
// 基于 React Native + Markdown Display + AsyncStorage

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";

// ---------------------- Types ----------------------
type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

// ---------------------- Constants ----------------------
const API_URL = "http://192.168.31.115:3000/chat/prompt/chat";
const STORAGE_KEY = "CHAT_MESSAGES_V3";

const now = () => Date.now();
const genId = () => `${now()}_${Math.random().toString(36).slice(2, 9)}`;

// ---------------------- Component ----------------------
export default function MyScreen() {
  const isDark = useColorScheme() === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const flatRef = useRef<FlatList>(null);

  // 初始加载
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        const welcome: Message = {
          id: genId(),
          role: "assistant",
          content: "你好，我是你的 Agent 🤖，随时准备为你提供帮助！",
          createdAt: now(),
        };
        setMessages([welcome]);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
      }
    })();
  }, []);

  // 持久化
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // 自动滚动
  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // ---------------------- Send & Streaming Logic ----------------------
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: genId(), role: "user", content: text, createdAt: now() };
    const newList = [...messages, userMsg];
    setMessages(newList);
    setInput("");

    setLoading(true);
    setStreaming(true);

    const placeholder: Message = {
      id: genId(),
      role: "assistant",
      content: "",
      createdAt: now(),
    };
    setMessages((prev) => [...prev, placeholder]);

    try {
      const payload = { message: newList.map(({ role, content }) => ({ role, content })) };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();

      let msg: string;
      try {
        const json = JSON.parse(raw);
        msg = json.msg || "(空消息)";
      } catch {
        msg = raw;
      }

      await typeOut(placeholder.id, msg);
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id ? { ...m, content: "❌ 请求失败，请检查网络。" } : m
        )
      );
    }

    setStreaming(false);
    setLoading(false);
  };

  // 字符逐字打字效果
  const typeOut = (id: string, text: string) =>
    new Promise<void>((resolve) => {
      let i = 0;
      const tick = () => {
        i++;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: text.slice(0, i) } : m))
        );
        if (i >= text.length) return resolve();
        setTimeout(tick, 14);
      };
      tick();
    });

  // ---------------------- UI: 消息渲染 ----------------------
  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.row,
          isUser ? styles.rowUser : styles.rowBot,
        ]}
      >
        {!isUser && (
          <Image
            style={styles.avatar}
            source={{ uri: "../assets/image/GPT.png" }}
          />
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleBot,
            isDark && (isUser ? styles.bubbleUserDark : styles.bubbleBotDark),
          ]}
        >
          {item.role === "assistant" ? (
            <Markdown style={markdownStyles}>{item.content || " "}</Markdown>
          ) : (
            <Text style={[styles.userText]}>{item.content}</Text>
          )}
        </View>

        {isUser && (
          <Image
            style={styles.avatar}
            source={{ uri: "../assets/image/user.png" }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, isDark ? styles.bgDark : styles.bgLight]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14, paddingBottom: 50 }}
        />

        {/* 正在输入… */}
        {(loading || streaming) && (
          <View style={styles.typingWrap}>
            <ActivityIndicator size="small" color="#0B84FF" />
            <Text style={styles.typingText}>对方正在输入…</Text>
          </View>
        )}

        {/* 浮动输入栏 */}
        <View style={[styles.inputBarWrap]}>
          <View
            style={[
              styles.inputBar,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="输入内容…"
              placeholderTextColor={isDark ? "#888" : "#999"}
              multiline
              style={styles.input}
            />

            <TouchableOpacity
              onPress={sendMessage}
              disabled={loading || streaming}
              style={[
                styles.sendBtn,
                (loading || streaming) && { opacity: 0.5 },
              ]}
            >
              {loading || streaming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendText}>发送</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  bgLight: { backgroundColor: "#F4F6FA" },
  bgDark: { backgroundColor: "#0A0F1A" },

  row: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  rowUser: { justifyContent: "flex-end" },
  rowBot: { justifyContent: "flex-start" },

  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 8 },

  bubble: {
    maxWidth: "78%",
    padding: 10,
    borderRadius: 18,
    paddingBottom: 12,
  },

  bubbleUser: {
    backgroundColor: "#4A90E2",
    borderBottomRightRadius: 4,
  },
  bubbleUserDark: {
    backgroundColor: "#1D4ED8",
  },

  bubbleBot: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
  },
  bubbleBotDark: {
    backgroundColor: "#162032",
  },

  userText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },

  // 输入栏
  inputBarWrap: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 18,
    padding: 10,
  },

  inputLight: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  inputDark: {
    backgroundColor: "#0D1726",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    color: "#fff",
    paddingRight: 12,
  },

  sendBtn: {
    backgroundColor: "#0B84FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  sendText: { color: "#fff", fontWeight: "600" },

  typingWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingBottom: 6,
  },
  typingText: {
    color: "#7A8BAA",
    marginLeft: 8,
  },
});

// ---------------------- Markdown 样式 ----------------------
const markdownStyles = {
  body: { color: "#E9ECF3", fontSize: 15, lineHeight: 22 },
  paragraph: { marginBottom: 6 },
  code_inline: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fence: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
};
