import request from '@/utils/request'

export function listuser(data) {
    return request({
        url: '/user/list',
        method: 'post',
        data
    })
}



export function login(data) {
    return request({
        url: '/user/admin/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'post',
        data: { token }
    })
}

export function logout() {
    return new Promise((resolve, reject) => {
        resolve('ok')
    })
    // return request({
    //   url: '/user/logout',
    //   method: 'post'
    // })
}

export function save(data) {
    return request({
        url: '/user/save',
        method: 'post',
        data
    })
}