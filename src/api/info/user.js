import {md5, httpRequest} from '@/utils/tools'

export function getData(data) {
  return httpRequest('/admin/user/getData',data);
}

export function getDataById(data) {
  return httpRequest('/admin/user/getDataById',data);
}
export function edit(data) {
  return httpRequest('/admin/user/edit',data);
}

export function add(data) {
  return httpRequest('/admin/user/add',data);
}
export function del(data) {
  return httpRequest('/admin/user/delete',data);
}
