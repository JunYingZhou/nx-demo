import {networkService} from '../../networking/index';

export function getAllList(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}

export function getAgendaList(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}


export function getAgendaListItem(url: string) {
  return networkService.request<any>({
    method: 'GET',
    url: url,
  });
}
