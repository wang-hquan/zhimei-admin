import {md5, httpRequest} from '@/utils/tools'

// const base_url = process.env.VUE_APP_BASE_API;

export function login(username, password) {
    let pwd = md5(md5(password));
    const data = {uname: username, pwd: pwd};
    return httpRequest('/admin/Login/doit', data);
}

export function checkLoginState() {
    return httpRequest('/admin/Login/checkLoginState');
}

export function logout() {
  return httpRequest('/admin/Login/logout');
}
