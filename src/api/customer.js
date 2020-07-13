import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/customer/list',
        method: 'post',
        data
    })
}

