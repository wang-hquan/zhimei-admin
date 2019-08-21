import {md5, httpRequest} from '@/utils/tools'

export function getData(data) {
  return httpRequest('/admin/doctor/getData',data);
}

export function getDataById(data) {
  return httpRequest('/admin/doctor/getDataById',data);
}
export function edit(data) {
  return httpRequest('/admin/doctor/edit',data);
}

export function add(data) {
  return httpRequest('/admin/doctor/add',data);
}
export function del(data) {
  return httpRequest('/admin/doctor/delete',data);
}
