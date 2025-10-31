import {networkService} from '../../networking/index';

export async function getPrompt(url: string, params: any): Promise<any> {
    return networkService.get<any>(url, params);
  }