import { View, Text, Button, Platform, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';

/**
 * NotificationScreen 组件
 * 演示 Expo 本地通知功能，包括：
 * 立即通知、延迟通知、循环通知、日程通知、可操作通知、图片通知
 */
export function NotificationScreen() {
  const receivedListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // 注册推送通知权限
  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('获取通知权限失败！');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);
    return token;
  }

  useEffect(() => {
    // iOS & Android 通用：前台通知显示
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true, // 前台显示横幅
        shouldShowList: true,   // 通知中心显示
        shouldPlaySound: true,  // 播放声音
        shouldSetBadge: true,   // 角标
      }),
    });
    

    // iOS 可操作通知分类
    Notifications.setNotificationCategoryAsync('message', [
      { identifier: 'REPLY', buttonTitle: '回复', textInput: { submitButtonTitle: '发送', placeholder: '输入...' } },
      { identifier: 'MARK_READ', buttonTitle: '已读' },
    ]);

    // Android 通知频道
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: '默认',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    registerForPushNotificationsAsync();

    // 前台通知监听
    receivedListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Foreground Notification:', notification);
    });
    // 用户操作监听
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User Response:', response);
    });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // 立即通知
  async function sendImmediateNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '提醒 📢',
        body: '这是一条本地通知',
        data: { info: 'custom-data' },
        sound: 'default',
        badge: 1,
      },
      trigger: null,
      channelId: Platform.OS === 'android' ? 'default' : undefined,
    });
  }

  // 延迟通知
  async function sendDelayedNotification(seconds = 5) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `延时通知 ⏲️ (${seconds}s)`,
        body: `将在 ${seconds} 秒后触发`,
        data: { type: 'delayed', seconds },
        sound: 'default',
      },
      trigger: {
        seconds,
        repeats: false,
        channelId: Platform.OS === 'android' ? 'default' : undefined,
      },
    });
  }

  // 循环通知
  async function sendRepeatingNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '循环通知 🔁',
        body: Platform.OS === 'ios' ? '每 60 秒提醒一次（iOS 限制）' : '每 10 秒提醒一次',
        data: { type: 'repeating' },
        sound: 'default',
      },
      trigger: Platform.select({
        android: { seconds: 10, repeats: true, channelId: 'default' },
        ios: { seconds: 60, repeats: true },
      }) as Notifications.NotificationTriggerInput,
    });
  }

  // 日程通知：1分钟后触发
  async function sendCalendarNotificationIn1Minute() {
    const fireDate = new Date(Date.now() + 60 * 1000);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '日程通知 📅',
        body: fireDate.toLocaleTimeString(),
        data: { type: 'calendar' },
        sound: 'default',
      },
      trigger: Platform.select({
        android: { channelId: 'default', date: fireDate } as Notifications.AndroidNotificationTrigger,
        default: { date: fireDate },
      }) as Notifications.NotificationTriggerInput,
    });
  }

  // 可操作通知
  async function sendActionableNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '可操作通知 ✉️',
        body: '试试下方动作按钮',
        categoryIdentifier: 'message',
        data: { type: 'actionable' },
        sound: 'default',
      },
      trigger: null,
      channelId: Platform.OS === 'android' ? 'default' : undefined,
    });
  }

  // 图片通知
  async function sendImageNotification() {
    const remoteImageUrl = 'https://picsum.photos/800/450.jpg';
    if (Platform.OS === 'ios') {
      const localUri = `${FileSystem.cacheDirectory}notif.jpg`;
      try {
        await FileSystem.downloadAsync(remoteImageUrl, localUri);
      } catch (e) {
        console.warn('下载图片失败，回退纯文本通知', e);
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '图片通知 📷',
          body: 'iOS 附件展示',
          data: { type: 'image' },
          sound: 'default',
          attachments: [{ url: localUri }],
        },
        trigger: null,
      });
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '图片通知 📷',
          body: 'Android 大图展示',
          data: { type: 'image' },
          sound: 'default',
          imageUrl: remoteImageUrl,
        },
        trigger: { channelId: 'default' },
      });
    }
  }

  // 清除角标
  async function clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  // 取消所有通知
  async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // 获取已调度通知
  async function listScheduled() {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', all);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Notification Demo</Text>
      <Button title="Register for push notifications" onPress={registerForPushNotificationsAsync} />
      <Button title="Immediate (now)" onPress={sendImmediateNotification} />
      <Button title="Delayed 5s" onPress={() => sendDelayedNotification(5)} />
      <Button title="Repeating every 10s" onPress={sendRepeatingNotification} />
      <Button title="Calendar in 1 min" onPress={sendCalendarNotificationIn1Minute} />
      <Button title="Actionable (with buttons)" onPress={sendActionableNotification} />
      <Button title="Send image notification" onPress={sendImageNotification} />
      <Button title="Clear badge" onPress={clearBadge} />
      <Button title="List scheduled (log)" onPress={listScheduled} />
      <Button title="Cancel all scheduled" onPress={cancelAllNotifications} />
    </ScrollView>
  );
}
