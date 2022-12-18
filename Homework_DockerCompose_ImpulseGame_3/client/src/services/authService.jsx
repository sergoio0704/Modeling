import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      'Content-Type': 'application/json'
    }
})
  
export function register(form) {
    return instance.post(`api/v1/register`, {...form})
      .then(res => {return res.data})
}

export function login(form) {
    return instance.post(`api/v1/login`, {...form})
      .then(res => {return res.data})
}