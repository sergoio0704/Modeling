import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useGame } from "../../../context/gameContext"
import { getGames } from "../../../services/gameService"

export const GameCatalog = () => {

    const [games, setGames] = useState([])

    useEffect(() => {
        getGames()
            .then( res => setGames(res))
            .catch( err => alert(err.response))
    }, [])

    return (
        <div className="game-catalog-list">
           { games.map((game, i) => {
               return <GameCard  key={i} game={game}/>
           })}  
        </div>
    )   
}

const GameCard = ({game}) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false)
    const navigate = useNavigate()
    const {setCurrentIdGameType} = useGame()

    const clickHandler = () => {
        setCurrentIdGameType(game.id_game_type)
        navigate(game.url)
    }

    return (
        <div className="game-card" onMouseOver={e => setTooltipVisible(true)} onMouseLeave={e => setTooltipVisible(false)} onClick={clickHandler}>
            <div className="game-card-title">
                <span>{game.name}</span>
            </div>
            <div className="game-card-description">
                <p>{game.description}</p>
            </div>
            <div className={`game-card-tooltip ${isTooltipVisible && 'game-card-tooltip-visible'}`}>
                Начать
            </div>
        </div>
    )
}
