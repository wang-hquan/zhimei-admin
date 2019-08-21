import {md5, httpRequest} from '@/utils/tools'

export function getData(data) {
  return httpRequest('/admin/tj_goods/getData',data);
}

export function getDataById(data) {
  return httpRequest('/admin/tj_goods/getDataById',data);
}
export function edit(data) {
  return httpRequest('/admin/tj_goods/edit',data);
}

export function add(data) {
  return httpRequest('/admin/tj_goods/add',data);
}
export function del(data) {
  return httpRequest('/admin/tj_goods/delete',data);
}
export function getCategory(data) {
  return httpRequest('/api/tigoods/category',data);
}
