import PushNotification from "react-native-push-notification";
import { Platform, PermissionsAndroid } from "react-native";

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
      requestPermissions: Platform.OS === "ios", // iOS 自动请求
    });
  };

  // 创建默认渠道（Android 8+）
  createDefaultChannel = () => {
    if (Platform.OS === "android") {
      PushNotification.createChannel(
        {
          channelId: "default-channel-id",
          channelName: "默认通知",
          channelDescription: "默认通知渠道",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log("通知渠道创建:", created)
      );
    }
  };

  // 发送本地通知
  sendNotification = ({ title, message, playSound = true, soundName = "default" }) => {
    PushNotification.localNotification({
      channelId: "default-channel-id",
      title,
      message,
      playSound,
      soundName,
    });
  };

  // 定时通知
  scheduleNotification = ({ title, message, date, repeatType = null }) => {
    PushNotification.localNotificationSchedule({
      channelId: "default-channel-id",
      title,
      message,
      date,
      // repeatType, // 可选：minute, hour, day, week, month, year
    });
  };

  // 取消单条通知
  cancelNotification = (id: string) => {
    PushNotification.cancelLocalNotifications({ id });
  };

  // 取消全部通知
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };
}

export default new NotificationService();
