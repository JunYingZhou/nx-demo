import * as KeyChain from 'react-native-keychain'


export const saveToken = async (token: string) => {
    console.log("saveToken", token);
  await KeyChain.setGenericPassword('token', token);
}

export const saveTokenByAuthentication = async (token: string) => {
    console.log("saveTokenByAuthentication", token);
    await KeyChain.setGenericPassword('user', 'pass123', {
        accessControl: KeyChain.ACCESS_CONTROL.BIOMETRY_ANY,
        authenticationPrompt: {
            title: '验证身份以访问凭证',
            subtitle: '需要验证以继续',
            description: '请使用 Face ID 或 Touch ID',
            cancel: '取消',
        },
    })
}

export const getToken = async () => {
    console.log("getToken");
  const credentials = await KeyChain.getGenericPassword();
  if (credentials) {
    return credentials.password;
  }
  return null;
}

export const clearToken = async () => {
    console.log("clearToken");
  await KeyChain.resetGenericPassword();
};