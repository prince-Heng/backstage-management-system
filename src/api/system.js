import request from '@/utils/request'

export function systemdata(datatype) {
  let data = { table_name: "system", req: { 'type': datatype } }
  console.log(data)
  return request({
    url: '/db/req',
    method: 'post',
    data
  })
}

export function SaveData(name,data) {
  return request({
    url: '/db/save',
    method: 'post',
    data: {table_name:name,obj:data}
  })
}
export function ReqData(name,req) {
  return request({
    url: '/db/req',
    method: 'post',
    data: {table_name:name,req}
  })
}