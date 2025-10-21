import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useEffect, useRef, useState } from "react";
import AnimatedButton from "../components/AnimatedButton";
const SignInScreen = () => {
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isShowIntroduce, setIsShowIntroduce] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  const scale = useRef(new Animated.Value(1)).current; // 创建一个Animated.Value对象，初始值为1
  const slideAnim = useRef(new Animated.Value(200)).current; // 创建一个Animated.Value对象，初始值为200
  const slideAnimLeft = useRef(new Animated.Value(-200)).current; // 创建一个Animated.Value对象，初始值为200
  const [currentIntroduce, setCurrentIntroduce] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;

  const introduces: any[] = [
    {
      id: 0,
      image: require("../assets/image/intro0.jpg"),
      text: "匹配对方并打开[时实定位],在地图实时查看对方的位置信息",
    },
    {
      id: 1,
      image: require("../assets/image/intro1.jpg"),
      text: "24小时轨迹路线详细报告, 随时回看对方去了哪里",
    },
    {
      id: 2,
      image: require("../assets/image/intro2.jpg"),
      text: "多维度详细手机使用报告,随时随地查看记录数据",
    },
    {
      id: 3,
      image: require("../assets/image/intro4.jpg"),
      text: "离开到达,手机使用信息自动报备",
    },
  ];
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
    Animated.timing(slideAnimLeft, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const privacyPolicy = `
  隐私政策
  欢迎您使用本应用（以下简称“本应用”）。本隐私政策旨在帮助您了解我们如何收集、使用、存储和保护您的个人信息。请您在使用本应用前仔细阅读本政策内容。
  1. 信息的收集
  我们可能会收集您在使用本应用时提供的个人信息，包括但不限于：姓名、联系方式、账户信息以及您主动提供的其他信息。同时，我们可能自动收集设备信息、日志信息、位置信息、使用行为等数据，以便为您提供更优质的服务。
  2. 信息的使用
  收集到的信息可能用于以下目的：
  - 提供、维护、改进和个性化本应用及其服务；
  - 与您沟通，包括发送重要通知、更新信息和营销信息（如您同意）；
  - 保护用户、应用及其他第三方的合法权益，防止欺诈、滥用及安全问题；
  - 进行数据分析、研究及统计，优化用户体验。
  3. 信息的共享与披露
  除非获得您的明确同意，或法律法规另有规定，我们不会向无关第三方共享您的个人信息。我们可能在以下情况下共享信息：
  - 与服务提供商合作，帮助我们提供服务，但仅限于为服务目的所需；
  - 根据法律法规要求，或行政、司法机构的合法请求；
  - 保护本应用、用户及公众的权利、财产或安全。
  4. 信息的存储与安全
  我们采取合理的技术手段和管理措施保护您的个人信息安全，防止信息泄露、丢失、被篡改或非法访问。请您妥善保管账户信息，不与他人共享登录凭证。
  5. 儿童隐私
  本应用不面向 13 岁以下儿童提供服务，我们不会故意收集此类人群的个人信息。如发现无意中收集了儿童信息，将会及时删除。
  6. 隐私政策的更新
  我们可能根据法律法规变化或服务调整更新本隐私政策。更新后将通过应用内公告、提示等方式告知您，建议您定期查阅以了解最新信息。
  7. 联系我们
  如您对本隐私政策有任何疑问或建议，可通过应用内联系方式与我们取得联系。
  本隐私政策自发布之日起生效。使用本应用，即表示您已阅读并同意本政策内容。
  `;

  const options = ["阅读并同意《隐私政策》与《用户协议》"];
  return (
    <>
      {isFirst ? (
        <ImageBackground
          style={styles.container}
          source={require("../assets/image/backg2.png")}
          resizeMode="cover" // cover, contain, stretch, repeat, center
        >
          <View style={styles.welcome}>
            <Animatable.View animation="zoomIn" duration={1500}>
              <Text style={styles.animationText}>Hello Animation!</Text>
            </Animatable.View>
          </View>
          {/* <ImageBackground
            source={require("../assets/image/backg1.jpg")}  // 本地图片
            style={styles.background}
            resizeMode="cover"  // cover, contain, stretch, repeat, center
      >
        </ImageBackground>         */}
          <View style={{ width: "100%", height: 150 }}></View>
          <View style={styles.btns}>
            <AnimatedButton
              text="微信登录"
              color="#1aad19"
              borderColor=""
              from="right"
              onPress={() => console.log("")}
            />
            <AnimatedButton
              text="QQ登录"
              color="#00acee"
              from="left"
              borderColor=""
              delay={200}
              onPress={() => console.log("")}
            />
            <AnimatedButton
              text="手机登录"
              color="#fff"
              textColor="#000"
              from="right"
              borderColor="black"
              delay={400}
              onPress={() => setIsFirst(false)}
            />
          </View>

          <View style={{ padding: 20, width: screenWidth, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setSelected(!selected)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#007AFF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  {selected ? (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: "#007AFF",
                      }}
                    />
                  ) : <></>}
                </View>
                <Text>{`阅读并同意《隐私政策》与《用户协议》`}</Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : !isShowIntroduce ? (
        <ImageBackground
          style={styles.container}
          source={require("../assets/image/backg0.jpg")}
          resizeMode="cover" // cover, contain, stretch, repeat, center
        >
          <Modal visible={!isFirst} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>隐私政策</Text>
                <ScrollView style={styles.scrollContainer}>
                  <Text style={styles.text}>{privacyPolicy}</Text>
                </ScrollView>
                <Animated.View
                  style={{ transform: [{ translateX: slideAnimLeft }] }}
                >
                  <AnimatedButton
                    text="同意"
                    color="black"
                    textColor="#fff"
                    borderColor=""
                    width="320"
                    height="50"
                    borderRadius={20}
                    delay={400}
                    onPress={() => setIsShowIntroduce(true)}
                  />
                  <AnimatedButton
                    text="不同意"
                    color="#fff"
                    textColor="#000"
                    from="left"
                    borderColor="black"
                    width="320"
                    height="50"
                    borderRadius={20}
                    delay={400}
                    onPress={() => setIsFirst(false)}
                  />
                </Animated.View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      ) : (
        <ImageBackground
          style={styles.container}
          source={require("../assets/image/backg0.jpg")}
          resizeMode="cover"
        >
          <View
            style={{
              width: screenWidth,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {/* 横向可滑动 ScrollView */}
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                console.log(event.nativeEvent.contentOffset.x, screenWidth);
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / screenWidth
                );
                setCurrentIntroduce(index);
              }}
              style={{ flexGrow: 0 }}
            >
              {introduces.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    width: screenWidth,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={styles.introduceItem}>
                    <View style={styles.introduceImage}>
                      <ImageBackground
                        source={item.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 20,
                          overflow: "hidden",
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.introduceText}>{item.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Next / 开始使用 按钮 */}
            {currentIntroduce < introduces.length - 1 ? (
              <Animated.View
                style={{ transform: [{ translateX: slideAnimLeft }] }}
              >
                <AnimatedButton
                  text="Next"
                  color="black"
                  textColor="#fff"
                  width="80"
                  borderColor=""
                  height="30"
                  borderRadius={50}
                  delay={400}
                  onPress={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        x: (currentIntroduce + 1) * screenWidth,
                        animated: true,
                      });
                    }
                    setCurrentIntroduce((prev) => prev + 1);
                  }}
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={{ transform: [{ translateX: slideAnimLeft }] }}
              >
                <AnimatedButton
                  text="开始使用"
                  color="black"
                  textColor="#fff"
                  borderColor=""
                  width="120"
                  height="40"
                  borderRadius={20}
                  delay={400}
                  onPress={() => setIsFirst(true)}
                />
              </Animated.View>
            )}

            {/* 分页指示器 */}
            <View style={styles.indicatorContainer}>
              {introduces.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    currentIntroduce === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  bottom: {},
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#333",
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)", // 半透明背景
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
  },
  introduceItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    height: "60%",
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
    padding: 10,
    // backgroundColor: 'red',
  },
  introduceImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "80%",
    height: "50%",
    borderRadius: 15,
    marginBottom: 10,
  },
  introduceText: {
    // backgroundColor: 'red',
    // width: '80%',
    fontSize: 18,
    fontFamily: "Anton",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 50,
    padding: 10,
  },
  modalContent: {
    height: 500,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  background: {
    height: 300,
    width: "100%",
  },
  welcome: {},
  welcomeText: {
    width: "100%",
    paddingTop: 50,
    paddingLeft: 20,
  },
  animationText: {
    paddingTop: 80,
    paddingLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  btns: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
  },

  btnText: {
    color: "white",
    textAlign: "center",
    lineHeight: 60,
    letterSpacing: 5,
    fontFamily: "Anton",
    fontWeight: "bold",
    fontSize: 15,
  },

  PhoneText: {
    color: "black",
    textAlign: "center",
    lineHeight: 60,
    letterSpacing: 5,
    fontFamily: "Anton",
    fontWeight: "bold",
    fontSize: 15,
  },

  wxBtn: {
    backgroundColor: "#1aad19",
    borderRadius: 15,
    width: 350,
    height: 60,
    textAlign: "center",
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
  },
  qqBtn: {
    backgroundColor: "#00acee",
    borderRadius: 15,
    width: 350,
    height: 60,
    textAlign: "center",
    marginBottom: 20,
    elevation: 20,
    shadowColor: "#000",
  },
  phoneBtn: {
    borderWidth: 3,
    borderColor: "black",
    borderBlockColor: "#fffff",
    borderRadius: 15,
    width: 350,
    height: 60,
    textAlign: "center",
    marginBottom: 20,
  },
});
export default SignInScreen;
