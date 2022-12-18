import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      'Content-Type': 'application/json'
    }
})
  
export function getGames() {
    return instance.get(`/api/v1/games`)
      .then(res => {return res.data})
}

export function getAccentGameContainer(id) {
    return instance.get(`/api/v1/game/accent?id=${id}`)
      .then(res => {return res.data})
}

export function saveGameResult(token, gameResult) {
    return instance.post(`/api/v1/game/accent/save?token=${token}`, {...gameResult})
      .then(res => {return res.data})
}

export function getGameResults(filter_type, order_type) {
    return instance.get(`/api/v1/game/results?filter_type=${filter_type}&order_type=${order_type}`)
      .then(res => {return res.data})
}

export function editGame(request, token) {
    return instance.post(`/api/v1/game/edit?token=${token}`, {...request})
      .then(res => {return res.data})
}