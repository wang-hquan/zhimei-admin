import {md5, httpRequest} from '@/utils/tools'

export function getData(data) {
  return httpRequest('/admin/news/getData',data);
}

export function getDataById(data) {
    return httpRequest('/admin/news/getDataById',data);
}
export function edit(data) {
  return httpRequest('/admin/news/edit',data);
}

export function add(data) {
  return httpRequest('/admin/news/add',data);
}
export function del(data) {
  return httpRequest('/admin/news/delete',data);
}
