import {networkService} from '../../networking/index';

export async function getMyEvent(url: string): Promise<any> {
    return networkService.get<any>(url);
  }