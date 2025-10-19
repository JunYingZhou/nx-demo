import {networkService} from '../../networking/index';

export function getAllList(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}

export function getEventPhotoFolder(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}

export function getEventPicture(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}


export function getThumbnails(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}