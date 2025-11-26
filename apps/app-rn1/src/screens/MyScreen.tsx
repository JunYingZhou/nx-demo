// MyScreen.tsx
// React Native chat screen with: markdown rendering, typing animation, streaming (best-effort),
// AsyncStorage persistence, avatars, dark mode support, smooth scrolling.
// NOTE: this is a single-file example (TypeScript). You may need to install the following packages:
//   yarn add react-native-markdown-display @react-native-async-storage/async-storage
// Or adapt to the markdown renderer you prefer.

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

type Message = {
  role: Role;
  content: string;
  id?: string; // optional id
  createdAt?: number;
};

// ---------------------- Constants ----------------------
const API_URL = "http://192.168.31.115:3000/chat/prompt/chat";
const STORAGE_KEY = "CHAT_MESSAGES_V2";

// ---------------------- Helpers ----------------------
const now = () => Date.now();
const genId = () => `${now()}_${Math.random().toString(36).slice(2, 9)}`;

// ---------------------- Component ----------------------
export default function MyScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const flatRef = useRef<FlatList>(null);

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Message[] = JSON.parse(raw);
          setMessages(parsed);
          // small delay to allow list to render then scroll
          setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 200);
        } else {
          // default welcome message
          const welcome: Message = {
            id: genId(),
            role: "assistant",
            content: "你好，我是你的 Agent，随时准备帮你！",
            createdAt: now(),
          };
          setMessages([welcome]);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
        }
      } catch (e) {
        console.warn("读取缓存失败", e);
      }
    })();
  }, []);

  // Persist messages on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch((e) => {
      console.warn("保存缓存失败", e);
    });
  }, [messages]);

  // Scroll when messages change
  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 120);
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

    // Prepare payload - send whole conversation as required by your API
    const payload = { message: newList.map(({ role, content }) => ({ role, content })) };

    try {
      // try streaming if possible, otherwise fallback to simple fetch
      // Note: React Native's fetch doesn't reliably support streaming across all platforms.
      // We'll attempt a streaming-friendly approach, but fall back gracefully.

      setStreaming(true);

      // optimistic assistant message placeholder (we'll show progressive typing)
      const placeholder: Message = { id: genId(), role: "assistant", content: "", createdAt: now() };
      setMessages((prev) => [...prev, placeholder]);

      // Standard fetch
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // try to parse as JSON (your API returns { msg: "..." })
      const textBody = await res.text();

      try {
        const json = JSON.parse(textBody);
        const msg = (json.msg as string) || "(空消息)";

        // Use typing animation to display the assistant message
        await typeOutAssistantMessage(placeholder.id!, msg);
      } catch (parseErr) {
        // If not json, just display raw text
        await typeOutAssistantMessage(placeholder.id!, textBody || "(空消息)");
      }
    } catch (err) {
      console.error("请求错误", err);
      // replace placeholder with error text
      setMessages((prev) =>
        prev.map((m) => (m.role === "assistant" && m.content === "" ? { ...m, content: "❌ 请求失败，请检查网络或服务器。" } : m))
      );
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  };

  // typing animation: progressively append characters
  const typeOutAssistantMessage = (id: string, fullText: string) => {
    return new Promise<void>((resolve) => {
      const total = fullText.length;
      let i = 0;
      const speed = 18; // ms per character (adjustable)

      const tick = () => {
        i += 1;
        const slice = fullText.slice(0, i);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: slice } : m)));
        if (i >= total) {
          resolve();
        } else {
          setTimeout(tick, speed);
        }
      };

      setTimeout(tick, speed);
    });
  };

  // Render single message bubble
  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";

    return (
      <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot, styles.container]}>
        {!isUser && (
          <Image
            source={{ uri: "https://placekitten.com/48/48" }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}

        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
          {/* Markdown rendering for assistant messages; user messages show plain text */}
          {item.role === "assistant" ? (
            <Markdown style={markdownStyles}>{item.content || " "}</Markdown>
          ) : (
            <Text style={[styles.text, isUser ? { color: "#fff" } : { color: "#000" }]}>{item.content}</Text>
          )}
        </View>

        {isUser && (
          <Image
            source={{ uri: "https://placehold.co/48x48/007bff/ffffff?text=U" }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id || genId()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 120)}
        />

        <View style={[styles.footer, isDark ? styles.footerDark : styles.footerLight]}>
          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholder="请输入消息..."
            placeholderTextColor={isDark ? "#999" : "#888"}
            value={input}
            onChangeText={setInput}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, (loading || streaming) ? styles.sendBtnDisabled : null]}
            onPress={sendMessage}
            disabled={loading || streaming}
          >
            {loading || streaming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendText}>发送</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------- Styles ----------------------
const baseStyles = {
  bubbleMaxWidth: "78%",
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  lightBg: { backgroundColor: "#F2F6FB" },
  darkBg: { backgroundColor: "#0B1220" },
  list: { padding: 12, paddingBottom: 6 },
  row: { flexDirection: "row", alignItems: "flex-end", marginVertical: 6 },
  rowUser: { justifyContent: "flex-end" },
  rowBot: { justifyContent: "flex-start" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 8 },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    maxWidth: baseStyles.bubbleMaxWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  bubbleUser: { backgroundColor: "#4A90E2", borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: "#ffffff", borderBottomLeftRadius: 4 },
  text: { fontSize: 15, lineHeight: 20 },
  footer: { flexDirection: "row", alignItems: "flex-end", padding: 10, borderTopWidth: 1 },
  footerLight: { backgroundColor: "#fff", borderColor: "#EEE" },
  footerDark: { backgroundColor: "#071024", borderColor: "#102033" },
  input: { flex: 1, minHeight: 40, maxHeight: 120, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  inputLight: { backgroundColor: "#F7F8FA", color: "#111" },
  inputDark: { backgroundColor: "#0B1726", color: "#E8F0FF" },
  sendBtn: { marginLeft: 8, backgroundColor: "#0B84FF", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sendBtnDisabled: { opacity: 0.6 },
  sendText: { color: "#fff", fontWeight: "600" },
});

// ---------------------- Markdown style overrides ----------------------
const markdownStyles: any = {
  body: { color: "#111", fontSize: 15 },
  paragraph: { marginVertical: 4 },
  code_inline: { backgroundColor: "rgba(27,31,35,0.05)", padding: 4, borderRadius: 4 },
  fence: { backgroundColor: "rgba(27,31,35,0.04)", padding: 8, borderRadius: 6 },
  heading1: { fontSize: 22, fontWeight: "700" },
  // adapt for dark mode at render-time via color scheme if you want more control
};

/*
Notes & next-steps / customization:

1) Markdown renderer: This example uses `react-native-markdown-display`. If you prefer another lib,
   replace the <Markdown> usage in renderItem accordingly.

2) Streaming: React Native's fetch streaming is unreliable on some platforms. For a robust streaming
   UI you'd need your server to support chunked SSE or websockets and then use a websocket client or
   an SSE polyfill. The above example reads the full response, then types it out character-by-character
   to simulate a streaming/typing experience.

3) Avatar images: replace placeholder URIs with your actual avatars or local images.

4) Persistence: messages are saved to AsyncStorage under key `CHAT_MESSAGES_V1`. To reset, clear that key.

5) Typing speed: change `speed` in `typeOutAssistantMessage` for slower/faster animation.

6) Markdown & long text: The Markdown renderer will render lists, bold, code blocks, etc. Long messages
   will be typed out — you can change the typing behavior to chunk-by-chunk instead of char-by-char
   if that feels more natural.

7) Styling & dark mode: the example reads the system color scheme. If you want an explicit toggle,
   add a switch and apply styles accordingly.

If你希望我把这个分成多个文件（例如把 MessageList、InputBar、storage utils、MarkdownBubble 拆开），
或者把流式/Socket版本实现给你，我可以继续分模块完善。
*/