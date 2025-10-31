import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import {
  MapView,
  Marker,
  Polyline,
  AMapSdk,
  MapType,
} from "react-native-amap3d";
import Geolocation from "@react-native-community/geolocation";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Clipboard from "@react-native-clipboard/clipboard";
import { getPrompt } from '../api/home/index'
interface LatLng {
  latitude: number;
  longitude: number;
}

const HomeScreen = () => {
  const mapViewRef = useRef<any>(null);
  const navigation = useNavigation();
  const isMounted = useRef(true);
  const { height } = Dimensions.get("window");
  const [code, setCode] = useState<string>("21075454");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>("暂无");
  const [fetching, setFetching] = useState(false);
  const [path, setPath] = useState<LatLng[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);
  const [mapType, setMapType] = useState<MapType>(MapType.Standard);
  const [name, setName] = useState("");
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;
  const translateY = useRef(new Animated.Value(height)).current; // 初始在屏幕外

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>({
    latitude: 30.543024962216446,
    longitude: 104.06439575294166,
  });

  const [searchText, setSearchText] = useState(""); // 输入框内容
  const [searchMarker, setSearchMarker] = useState<LatLng | null>(null); // 搜索结果 Marker
  const [visible, setVisible] = useState(true);
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    AMapSdk.init("e10d14fadb21e1cfdfa2d6a73041a81c");
    requestLocationPermission();




    return () => {
      isMounted.current = false;
      mapViewRef.current = null;
    };
  }, []);

  useEffect(()=> {

    getPrompt1();
  },[])


  const getPrompt1 = async() => {
    try {
      
    console.log("asdasdaadasda")
        const res = await getPrompt("/prompt", '你好')
        console.log("asdasda",res)
    } catch (error) {
      console.error(error)
      throw error
    }
    }

  const open = () => {
    console.log("open");
    setVisible(true);
  };
  const close = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  const getAddressFromLatLng = async (latitude: number, longitude: number) => {
    try {
      const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${"e10d14fadb21e1cfdfa2d6a73041a81c"}&radius=1000&extensions=all`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "1") {
        const addr = data.regeocode?.formatted_address || "未找到地址";
        console.log("🗺️ 地址信息:", addr);
        setAddress(addr);
        return addr;
      } else {
        console.warn("高德API返回错误:", data.info);
        return null;
      }
    } catch (error) {
      console.error("❌ 获取地名失败:", error);
      return null;
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("定位权限被拒绝");
        setLoading(false);
        return;
      }
    }
    getLocation();
  };

  const getLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      ({ coords }) => handleLocationSuccess(coords),
      (error) => {
        console.warn("高精度定位失败，尝试低精度", error);
        Geolocation.getCurrentPosition(
          ({ coords }) => handleLocationSuccess(coords),
          (err) => {
            console.error("低精度定位也失败", err);
            if (isMounted.current) {
              Alert.alert("定位失败", "请检查定位权限或网络/GPS设置");
              setLoading(false);
            }
          },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
        );
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
    );
  };

  const handleLocationSuccess = (coords: GeolocationCoordinates) => {
    if (!isMounted.current) return;
    setStart({ latitude: coords.latitude, longitude: coords.longitude });
  };

  useEffect(() => {
    if (start) getAddressFromLatLng(start.latitude, start.longitude);
    if (start && end) fetchPath(start, end);
  }, [start, end]);

  const fetchPath = async (origin: LatLng, destination: LatLng) => {
    if (fetching) return;
    setFetching(true);
    setLoading(true);
    try {
      const res = await fetch(
        `https://restapi.amap.com/v3/direction/driving?key=e10d14fadb21e1cfdfa2d6a73041a81c&origin=${origin.longitude},${origin.latitude}&destination=${destination.longitude},${destination.latitude}`
      );
      const data = await res.json();
      const steps = data.route?.paths?.[0]?.steps || [];
      const route: LatLng[] = steps.flatMap((s: any) =>
        s.polyline
          ? s.polyline.split(";").map((p: string) => {
              const [lon, lat] = p.split(",");
              return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
            })
          : []
      );
      if (isMounted.current) setPath(route);
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setFetching(false);
      }
    }
  };

  const getLatLngFromAmMap = async (address: string) => {
    setSearchList([]);
    try {
      const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
        address
      )}&key=${"e10d14fadb21e1cfdfa2d6a73041a81c"}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("dadada", data);

      if (data.status === "1" && data.geocodes.length > 0) {
        setSearchList(data.geocodes);
        return data.geocodes;
      } else {
        console.warn("高德返回错误:", data.info);
        return null;
      }
    } catch (error) {
      console.error("❌ 获取经纬度失败:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("请输入地名");
      return;
    }
    const result = await getLatLngFromAmMap(searchText);
    if (result.length > 0) {
      // setSearchMarker(result);
      // mapViewRef.current?.animateCamera({
      //   target: result,
      //   zoom: 16,
      // });
    } else {
      Alert.alert("未找到该地名");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const refreshPath = () => {
    if (start) getAddressFromLatLng(start.latitude, start.longitude);
    if (start && end) fetchPath(start, end);
  };

  const handleSelectSearchItem = (item: any) => {
    const [longitude, latitude] = item.location.split(",").map(Number);
    const latLng = { latitude, longitude };
    setEnd(latLng);
    setSearchMarker(latLng);
    setSearchList([]); // 选中后隐藏下拉
    // mapViewRef.current?.animateCamera({ target: latLng, zoom: 16 });
  };

  // 点击关闭
  const handleOutsidePress = () => {
    if (searchList.length > 0) {
      setSearchList([]);
    }
  };

  const showInput = () => {

    setIsShowInput(true);
    close()
    inputRef.current?.focus();
  }

  const copy = () => {
    Clipboard.setString(code)
    Alert.alert('copy code successfully')
  }

  return (
    <TouchableWithoutFeedback onPress={open}>
      <View style={styles.container}>
        {/* 顶部导航栏 */}
        {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Image
            source={require('../assets/image/user.png')}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerAddress}>
          <Text style={styles.headerText}>当前位置</Text>
          <Text style={{ marginTop: 10, textAlign: 'center', color: '#fff', fontSize: 12 }}>
            {address}
          </Text>
        </View>
      </View> */}

        {/* 搜索框 */}
        {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="输入地名搜索"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={{ color: '#fff' }}>搜索</Text>
        </TouchableOpacity>
      </View> */}
        {/* 
      {searchList.length > 0 && (
        <View style={styles.searchResultContainer}
        // onStartShouldSetResponder={() => true}
        >
          {searchList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchResultItem}
              onPress={() => handleSelectSearchItem(item)}
            >
              <Text>{item.formatted_address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}

        {/* 地图 */}
        <View style={styles.map} onStartShouldSetResponder={() => false}>
          {loading || !start || !end ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#d31145" />
              <Text style={{ color: "#666", marginTop: 10 }}>
                正在加载地图...
              </Text>
            </View>
          ) : (
            <MapView
              ref={mapViewRef}
              style={StyleSheet.absoluteFill}
              mapType={mapType}
              initialCameraPosition={{ target: start, zoom: 15 }}
              showsTraffic
              showsCompass
              showsScale
            >
              <Marker position={start} title="我的位置" />
              <Marker position={end} title="目的地" color="red" />
              {searchMarker && (
                <Marker position={searchMarker} title="搜索结果" color="blue" />
              )}
              {
              // path.length > 0 
              // && (
                // <Polyline
                  // width={10}
                  // color="rgba(211,17,69,0.8)"
                  // points={path}
                // />
              // )
              }
            </MapView>
          )}

          {/* <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>地图类型：</Text>
          <Picker
            selectedValue={mapType}
            onValueChange={(value) => setMapType(value)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="标准" value={MapType.Standard} />
            <Picker.Item label="卫星" value={MapType.Satellite} />
            <Picker.Item label="夜间" value={MapType.Night} />
            <Picker.Item label="导航" value={MapType.Navi} />
            <Picker.Item label="交通" value={MapType.Bus} />
          </Picker>
        </View>*/}
        </View>

        {/* 刷新按钮 */}
        {/* <TouchableOpacity
        style={[styles.refreshBtn, fetching && { opacity: 0.6 }]}
        onPress={refreshPath}
        disabled={fetching}
      >
        <Text style={styles.refreshText}>{fetching ? '刷新中…' : '刷新路线'}</Text>
      </TouchableOpacity> */}

        <Modal
          transparent
          visible={visible}
          animationType="none"
          onRequestClose={close}
        >
          <TouchableWithoutFeedback onPress={close}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.panel, { transform: [{ translateY }] }]}
          >
            <ImageBackground
              style={{
                height: "100%", width: "100%",
              }}
              source={require("../assets/image/backg0.jpg")}
              resizeMode="cover" // cover, contain, stretch, repeat, center
            >
              {/* <Text style={styles.panelText}>这里是弹出的内容！</Text> */}
              <View style={{ width: "100%", height: 50, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                      Alert.alert('loading')
                    }}
                    style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center'}}
                  >
                  <Text style={{color: '#82CB4C', fontSize: 15, fontWeight: 'bold', marginLeft: 20}}>刷新匹配状态</Text>
                  
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => close()}
                >

                <ImageBackground
                    style={{width: 20, height: 20, marginRight: 20}}
                    source={require("../assets/image/close1.png")}
                    resizeMode="cover" // cover, contain, stretch, repeat, center
                    
                  >
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <Text style={{textAlign: 'center',width: "100%", height: 50, lineHeight: 50, color: '#000', fontSize: 20, fontWeight: 'bold'}}>立即添加另一半</Text>
              <View style={{display: 'flex', padding: 20, flexDirection: 'column', width: '100%', flex: 1, justifyContent: 'flex-start'}}>
                <View style={styles.input}>
                  <View
                    style={styles.inputField}
                  >
                    <TouchableOpacity
                      onPress={() => showInput()}
                    >
                      <Text style={{width: '100%',color: '#82CB4C', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>点击输入对方匹配码</Text>

                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={{height: 80, lineHeight: 80, color: '#000', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>我的匹配码</Text>
                <View style={styles.myCode}>
                  <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: '#000'}}>{code}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      copy()
                    }}
                    >
                    <Text style={{marginLeft: 10, color: '#82CB4C', fontSize: 15, fontWeight: 'bold'}}>复制</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.icon1}>
                <View
                  style={{width: 80, height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                >
                  <ImageBackground
                    style={{width: 40, height: 40}}
                    source={require("../assets/image/QQ.png")}
                  >
                  </ImageBackground>
                </View>
                <View
                  style={{width: 80, height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                >
                  <ImageBackground
                    style={{width: 40, height: 40}}
                    source={require("../assets/image/weixin_mw.png")}
                  >
                  </ImageBackground>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        </Modal>
        {isShowInput && (
          <Modal transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setIsShowInput(false)}>
              <View style={styles.inputOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View style={[styles.codeInputBox]}>
                    <Text style={styles.inputTitle}>输入对方匹配码</Text>
                    <TextInput
                      ref={inputRef}
                      placeholder="请输入匹配码"
                      placeholderTextColor="#999"
                      style={styles.inputText}
                      autoFocus
                      onSubmitEditing={() => setIsShowInput(false)}
                    />
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={() => setIsShowInput(false)}
                    >
                      <Text style={styles.confirmText}>确认</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

      </View>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inputOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
icon1: {
  height: 80,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
},
codeInputBox: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 20,
  paddingHorizontal: 20,
  elevation: 6, // 安卓阴影
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},
inputTitle: {
  fontSize: 16,
  color: '#333',
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 12,
},
inputText: {
  borderWidth: 1,
  borderColor: '#82CB4C',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  fontSize: 16,
  color: '#000',
  textAlign: 'center',
  marginBottom: 16,
},
confirmBtn: {
  backgroundColor: '#82CB4C',
  paddingVertical: 10,
  borderRadius: 10,
},
confirmText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
  codeInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 100,
  },
  myCode: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#82CB4C', // ✅ 正确属性
    borderRadius: 50,
    overflow: 'hidden'
    
  },
  inputField:{
    width: '90%',
    height: 60,
    lineHeight: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#d31145",
    paddingHorizontal: 16,
  },
  backBtn: { position: "absolute", left: 16 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerAddress: { flexDirection: "column", alignItems: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: "#d31145",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },

  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  pickerContainer: {
    position: "absolute",
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 100,
  },
  pickerLabel: { color: "#fff", marginRight: 8 },
  picker: { flex: 1, color: "#fff", width: 130 },

  refreshBtn: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: "#d31145",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#d31145",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  refreshText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  searchResultContainer: {
    position: "absolute",
    top: 100,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: "auto",
    zIndex: 999,
    elevation: 5,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  //   map: { flex: 1 },
  openBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  btnText: { color: "#fff" },
  backdrop: {
    flex: 1,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    height: 400,
    width: "100%",
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    // padding: 20,
  },
  panelText: { fontSize: 18, textAlign: "center" },
  closeBtn: {
    marginTop: 10,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default HomeScreen;
