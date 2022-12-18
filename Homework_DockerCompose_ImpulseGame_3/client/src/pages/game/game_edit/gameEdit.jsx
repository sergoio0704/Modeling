import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAccount } from "../../../context/accountContext"
import { useAuth } from "../../../context/authContext"
import { getGames, editGame } from "../../../services/gameService"

export const EditGame = () => {
    const [games, setGames] = useState([])
    const {account} = useAccount()
    const navigate = useNavigate()

    const {token} = useAuth()

    const [form, setForm] = useState({
        description: ""
    })

    const changeFormHandler = (key, value) => {
        setForm({...form, [key]: value})
    }

    const saveFormHandler = (e, id_game_type) => {
        const request = {...form, id_game_type: id_game_type}
        editGame(request, token)
          .then( res => alert('Изменения успешно сохранены'))
          .catch( err => alert('Произошла ошибка'))
    }

    useEffect(() => {
        if (!account.isAdmin) {
            navigate('/')
        }

        getGames()
            .then( res => setGames(res))
            .catch( err => alert(err.response))
    }, [])

    return (
        <div className="edit-game">
            <table>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Действие</th>
                </tr>
                { games.map((g, i) => {
                    return <tr key={i}>
                                <td>{g.id_game_type}</td>
                                <td>{g.name}</td>
                                <td><textarea className="edit-game-description" onChange={e => changeFormHandler(e.target.name, e.target.value)} name="description" id="" cols="30" rows="5" defaultValue={g.description}></textarea></td>
                                <td><button className="btn" onClick={e => saveFormHandler(e, g.id_game_type)}>Сохранить</button></td>
                           </tr>
                })}  
            </table>
        </div>
    )
}