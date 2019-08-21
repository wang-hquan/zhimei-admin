import {md5, httpRequest} from '@/utils/tools'

export function getData(data) {
  return httpRequest('/admin/tj_category/getData',data);
}

export function getDataById(data) {
  return httpRequest('/admin/tj_category/getDataById',data);
}

export function edit(data) {
  return httpRequest('/admin/tj_category/edit',data);
}

export function add(data) {
  return httpRequest('/admin/tj_category/add',data);
}

export function del(data) {
  return httpRequest('/admin/tj_category/delete',data);
}
