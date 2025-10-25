import PushNotification from "react-native-push-notification";
import { Platform, PermissionsAndroid } from "react-native";
import { Vibration } from "react-native";

class NotificationService {
  constructor() {
    this.init();
    // this.createDefaultChannel();
  }

  /**
   * Android 13+ 通知权限请求
   */
  async requestAndroidPermission() {
    // if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        
      );
      console.log('[NotificationService] 通知权限:', result);
    // }
  }
  // 初始化配置
  init = async() => {
    
    if (Platform.OS === 'android') {
      await this.requestAndroidPermission();
      this.createDefaultChannel();
    }
    PushNotification.configure({
    //   onRegister: function (token) {
    //     console.log("通知注册 token:", token);
    //   },
      onNotification: function (notification) {
        console.log("收到通知:", notification);
        // 必须调用 finish()（iOS）
        if (Platform.OS === "ios") {
          notification.finish(PushNotification.FetchResult.NoData);
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
      // ✅ 前台也显示通知
      onForeground: true,
      requestPermissions: Platform.OS === "ios", // iOS 自动请求
    });
  };

  // 创建默认渠道（Android 8+）
  createDefaultChannel = () => {
    if (Platform.OS === "android") {
      PushNotification.createChannel(
        {
          channelId: "super-default-channel5",
          channelName: "高优先级通知",
          channelDescription: "测试通知",
          importance: 5,
          vibrate: true,
          playSound: true,
          soundName: "default",
          
        },
        (created) => console.log("通知渠道创建:", created)
      );
    }
  };

  // 发送本地通知
  sendNotification = ({ title, message, playSound = true, soundName = "default" }) => {
    // Vibration.vibrate(1000); // 震动1秒

    PushNotification.localNotification({
      channelId: "super-default-channel5",
      title,
      message,
      playSound: true,
      soundName: "default",
      vibrate: true,
      vibration: 1000,
      // importance: 5,
    });
  };

  // 定时通知
  scheduleNotification = ({ title, message, seconds = 5, repeatType = null }) => {
    const date = new Date(Date.now() + seconds * 1000);

    PushNotification.localNotificationSchedule({
      channelId: 'super-default-channel5',
      title: '测试定时通知',
      message: '5秒后显示的通知',
      date: new Date(Date.now() + 5 * 1000),
      allowWhileIdle: true, // ✅ 必须
      playSound: true,
      soundName: 'default',
      vibrate: true,
    });
  };

    /**
   * 🔁 重复通知（minute, hour, day, week）
   */
  repeat(title: string, message: string, repeatType: 'minute' | 'hour' | 'day' | 'week') {
    const date = new Date(Date.now() + 5 * 1000);
    PushNotification.localNotificationSchedule({
      channelId: 'super-default-channel5',
      title,
      message,
      date,
      repeatType,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
    });
  }

  /**
   * 📝 大文本通知
   */
  bigText(title: string, message: string, bigText: string) {
    PushNotification.localNotification({
      channelId: 'super-default-channel5',
      title,
      message,
      bigText,
      largeIcon: 'ic_launcher', // app 图标
      playSound: true,
      soundName: 'default',
    });
  }

  /**
   * 🖼️ 大图通知
   */
  bigPicture(title: string, message: string, imageUrl: string) {
    PushNotification.localNotification({
      channelId: 'super-default-channel5',
      title,
      message,
      bigPictureUrl: imageUrl,
      largeIcon: 'ic_launcher',
      playSound: true,
      soundName: 'default',
    });
  }

  /**
   * 🔕 静默通知（无声音、无震动）
   */
  silent(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'super-default-channel5',
      title,
      message,
      playSound: false,
      vibrate: false,
    });
  }

  // 取消单条通知
  cancelNotification = (id: string) => {
    PushNotification.cancelLocalNotifications({ id });
  };

  // 取消全部通知
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
  };
}

export default new NotificationService();
