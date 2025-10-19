import {networkService} from '../../networking/index';


export async function getUserInfo(data: any, url: string): Promise<any> {
  return networkService.post<any>(url, {
    user_identify: data.userEmail,
    user_pwd: data.password,
  });
}

export function getUserAvatar(url: string) {
  return networkService.request<any>({
    maxBodyLength: Infinity,
    responseType:'blob',
    method: 'get',
    url: url,
  });
}
export async function UserSignIn(data: any, url: string): Promise<any> {
  return networkService.post<any>(url, {
    user_identify: data.user_identify,
    user_pwd: data.user_pwd,
  });
}

