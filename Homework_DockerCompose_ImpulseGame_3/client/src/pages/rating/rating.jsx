import { useEffect, useState } from "react"
import { getGameResults } from "../../services/gameService"
import { FilterTypes } from "../../models/filterTypes"
import { OrderTypes } from "../../models/orderTypes"

export const Rating = () => {
    const [gameResults, setGameResults] = useState([])
    const [order, setOrder] = useState(OrderTypes.desc)
    const [filter, setFilter] = useState(FilterTypes.numberTrueAnswers)

    useEffect(() => {
        getGameResults(filter, order)
            .then( res => setGameResults(res))
            .catch( err => alert(err.msg))
    }, [filter, order])

    const filterClickHandler = (e, filterType) => {
        if (e.target.classList.contains('active-filter')) {
            return
        }
        
        setFilter(filterType)

        document.querySelectorAll('.rating-filters-item').forEach( el => {
            el.classList.remove('active-filter')
        })
        e.target.classList.add('active-filter')
    }

    const orderChangeHandler = (e) => {
        if (e.target.value == OrderTypes.asc) {
            setOrder(OrderTypes.asc)
        }

        if (e.target.value == OrderTypes.desc) {
            setOrder(OrderTypes.desc)
        }
    }


    if (gameResults.length == 0) {
        return <div className="game-accent-content">Идет загрузка...</div>
    }

    return (
        <div className="rating">
            <div className="rating-filters">
                <span className="rating-filters-tip">Фильтровать по: </span>
                <div className="rating-filters-item btn active-filter" onClick={e => filterClickHandler(e, FilterTypes.numberTrueAnswers)}>Кол-во правильных ответов</div>
                <div className="rating-filters-item btn" onClick={e => filterClickHandler(e, FilterTypes.numberGames)}>Кол-во игр</div>
                <div className="rating-filters-item btn" onClick={e => filterClickHandler(e, FilterTypes.winRate)}>Средний коэфф.</div>
                <select name="order" id="order" className="order" onChange={e => orderChangeHandler(e)}>
                    <option value="1">По возрастанию</option>
                    <option value="2" selected>По убыванию</option>
                </select>
            </div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Всего правильных ответов</th>
                    <th>Всего сыгранных игр</th>
                    <th>Средний коэфф. правильных ответов</th>
                </tr>
                { gameResults.map((gr, i) => {
                    return <tr key={i}>
                                <td>{gr.id_account}</td>
                                <td>{gr.name}</td>
                                <td>{gr.email}</td>
                                <td>{gr.number_true_answers}</td>
                                <td>{gr.number_games}</td>
                                <td>{gr.win_rate}</td>
                           </tr>
                })}  
            </table>
        </div>
    )
}