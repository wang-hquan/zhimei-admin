import crypto from 'crypto'
import http from '@/utils/http'

/**
 * 进行MD5加密
 * @param str
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function md5(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

export function httpRequest(url, params, method = 'post') {
    let res = [];
    if (method == 'post') {
        res = http.post(url, params);
    } else {
        res = http.get(url, params);
    }
    return res;
}

export function getDateTime(eday = 0) {
    let date = new Date();
    if (eday !== 0) {
        date.setTime(date.getTime() - 3600 * 1000 * 24 * eday);
    }
    return date;
}

export function datePicker() {
    return {
        disabledDate(time) {
            return time.getTime() > Date.now();
        },
        shortcuts: [{
            text: '今日',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }, {
            text: '昨日',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
        }, {
            text: '近7天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
            }
        }, {
            text: '近14天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 14);
                picker.$emit('pick', date);
            }
        }, {
            text: '近30天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', date);
            }
        }]
    };
}


export function loginStateFail(code) {
    if (code == '-999') {
        setTimeout(function () {
            sessionStorage.removeItem('user');
            location.reload();
        }, 2000);
    }
}
