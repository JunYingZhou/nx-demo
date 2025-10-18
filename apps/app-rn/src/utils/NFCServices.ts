import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
class NFCService {

    static async init() {
        try {
            const isSupported = await NfcManager.isSupported();
            const isEnabled = await NfcManager.isEnabled();
            return {isSupported, isEnabled};            
        } catch (error) {
            console.warn('NFC init error', error);
            return {isSupported: false, isEnabled: false};
        }
    }

    // 读取 NDEF（前台监听一次性读取）
  static async readNdefOnce() {
    try {
      // 请求 Ndef 技术
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: '将NFC靠近设备读取',
      });
      const tag = await NfcManager.getTag();
      // tag.ndefMessage -> NDEF records
      // 解析文本示例
      if (tag && tag.ndefMessage) {
        const ndefRecords = tag.ndefMessage;
        const text = ndefRecords
          .map((rec: any) => Ndef.text.decodePayload(rec.payload))
          .join(', ');
        return {tag, text};
      }
      return {tag, text: null};
    } catch (e) {
      console.warn('readNdefOnce error', e);
      throw e;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }


  // 持续监听（订阅式）
  static async startListening(onTag: any) {
    // 推荐在组件 mount 时启用，在 unmount 时停止
    NfcManager.setEventListener(NfcManager.EVENTS.DiscoverTag, tag => {
      onTag && onTag(tag);
      // 如果想自动取消一次性扫描：
      // NfcManager.setEventListener(NfcManager.EVENTS.DiscoverTag, null);
    });

    try {
      await NfcManager.registerTagEvent(); // 默认 foreground dispatch
    } catch (e) {
      console.warn('registerTagEvent error', e);
    }
  }

    static async stopListening() {
        try {
        await NfcManager.unregisterTagEvent();
        NfcManager.setEventListener(NfcManager.EVENTS.DiscoverTag, null);
        } catch (e) {
        console.warn('unregisterTagEvent error', e);
        }
    }

    // 写入 NDEF（写入一个文本记录）
  static async writeText(text: string) {
    try {
      // 请求 Ndef 技术
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: '将NFC靠近写入',
      });

      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
      if (bytes) {
        await NfcManager.writeNdefMessage(bytes);
      }
      return true;
    } catch (e) {
      console.warn('writeText error', e);
      throw e;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }
}

export default NFCService;