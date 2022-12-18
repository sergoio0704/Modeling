import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      'Content-Type': 'application/json'
    }
})

export function getAccount(token) {
    return instance.get(`api/v1/account?token=${token}`)
        .then(res => {return res})
}

export function getAvatar(token) {
  return  axios({
              method: 'GET',
              url: process.env.REACT_APP_SERVER_URL + `api/v1/account/avatar?token=${token}`,
              responseType: 'arraybuffer'
          })
          .then(res => { 
            if (!res.data.byteLength)
              return null
            const blob = new Blob([res.data], {type: 'image/jpeg' || 'image/png'})
            const url = URL.createObjectURL(blob)
            return url 
          })
}

export function saveAccount(form, token) {
  let body = new FormData()
  body.append('token', token)
  body.append('name', form.name)
  body.append('avatar', form.avatar)
  return axios({
            method: 'POST',
            url: process.env.REACT_APP_SERVER_URL + 'api/v1/account/save',
            data: body,
            headers:  { "Content-Type": "multipart/form-data" }
         })
         .then(res => { return res })
}