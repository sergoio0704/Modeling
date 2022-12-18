import { useEffect, useRef, useState } from "react"
import { useGame } from "../../../context/gameContext"
import { getAccentGameContainer, saveGameResult } from "../../../services/gameService"
import { Complexity } from "../../../models/complexity"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/authContext"

export const GameAccent = () => {
    const [gameContainer, setGameContainer] = useState(null)
    const [isStartGame, setIsStartGame] = useState(false)
    const [isFinalGame, setIsFinalGame] = useState(false)
    const [gameResult, setGameResult] = useState({successAnswersIds: [], failedAnswersIds: []})
    const [gameInfo, setGameInfo] = useState({})
    const {currentIdGameType} = useGame()
    const {token} = useAuth()

    const navigate = useNavigate()

    useEffect( () => {
        if (currentIdGameType) {
            getAccentGameContainer(currentIdGameType)
            .then(res => setGameContainer(res))
            .catch(err => alert(err.msg))
        } else {
            navigate('/')
        }  
    }, [])

    const getGameInfoByComplexityKind = (complexityKind) => {
        switch(complexityKind) {
            case Complexity.easy:
                return gameContainer.games.filter( g => g.complexity_kind === Complexity.easy)
            case Complexity.hard:
                return gameContainer.games.filter( g => g.complexity_kind === Complexity.hard)
        }
    }

    const getNameByComplexityKind = (complexityKind) => {
        switch(complexityKind) {
            case Complexity.easy:
                return 'Легкий'
            case Complexity.hard:
                return 'Сложный'
        }
    }

    const optionClickHandler = (complexity_kind) => {
        const gameInfo = getGameInfoByComplexityKind(complexity_kind)[0]
        const wordsCount = gameInfo.words.length
        let isValidCount = false 
        while(!isValidCount) {
            let result = prompt(`Введите количество слов из (${wordsCount})`)
            result = parseInt(result)
            if (result > 0 && result <= wordsCount) {
                isValidCount = true
                setIsStartGame(true)
                setGameInfo({
                    data: gameInfo, 
                    selectedWordsCount: result, 
                    indexShowWord: 0, 
                    currentWord: gameInfo.words[0]
                })
            }
        }
    }

    const letterClickHandler = (e, position) => {
        const trueAnswerPosition = gameInfo.currentWord.answerPosition

        const wrapper = document.querySelector('.active-game-wrapper')
        wrapper.classList.add('disabled')

        if (trueAnswerPosition === position) {
            e.target.classList.add('active-word-char-success')
            setGameResult(prev => { return {...prev, successAnswersIds: prev.successAnswersIds.concat([gameInfo.indexShowWord])}})
        }
        else {
            e.target.classList.add('active-word-char-failed')
            const trueEl = document.getElementById(`${trueAnswerPosition}`)
            trueEl.classList.add('active-word-char-success')
            setGameResult(prev => { return {...prev, failedAnswersIds: prev.failedAnswersIds.concat([gameInfo.indexShowWord])}})
        }

        if ( gameInfo.indexShowWord + 1 === gameInfo.selectedWordsCount) {
            setIsFinalGame(true)
            return
        }

        setTimeout(() => { 
            setGameInfo(
                {
                    ...gameInfo,
                    indexShowWord: gameInfo.indexShowWord + 1, 
                    currentWord: gameInfo.data.words[gameInfo.indexShowWord + 1] 
                }
            )
            
            wrapper.classList.remove('disabled')
            document.querySelectorAll('.active-word-char-wrapper').forEach( el => {
                el.classList.remove('active-word-char-failed')
                el.classList.remove('active-word-char-success')
            })
        }, 1000)
       
    }

    useEffect(() => {
        if (!isFinalGame) return 
        const form = {
            id_game: gameInfo.data.id_game,
            quantity_tasks: gameInfo.selectedWordsCount,
            quantity_true_answers: gameResult.successAnswersIds.length
        }

        saveGameResult(token, form)
            .then( res => {
                alert('Результат игры сохранен')
            })
            .catch( err => {
                alert(err.msg)
                navigate('/')
            }) 
    }, [isFinalGame])

    const tryAgainHandler = () => {
        setGameResult({successAnswersIds: [], failedAnswersIds: []})
        setIsFinalGame(false)
        setIsStartGame(false)
        setGameInfo({})
    }

    if (isFinalGame) {
        return (
            <div className="game-accent-content">
                <div className="game-accent-title">
                    {`Ваш результат: ${gameResult.successAnswersIds.length} из ${gameInfo.selectedWordsCount} (${Math.ceil((gameResult.successAnswersIds.length/gameInfo.selectedWordsCount)*100)}%)`}
                </div>
                <div className="game-accent-try-again btn" onClick={e => tryAgainHandler()}>Попробовать еще раз</div>
                <div className="game-accent-try-again btn" onClick={e => navigate('/')}>На главную</div>
            </div>
        )
    }

    if(isStartGame) {
        console.log(gameResult)
        return (
            <div className="game-accent-content">
                 <div className="active-game-description">
                     Нажмите на букву для выбора позиции ударения
                 </div>
                 <div className="active-game-counter">
                     {`Слово №${gameInfo.indexShowWord + 1}`}
                     <br />
                     {`Правильных ответов: ${gameResult.successAnswersIds.length} из ${gameInfo.selectedWordsCount}`}
                 </div>
                 <div className="game-accent-content active-game-wrapper">
                    { gameInfo.currentWord.word.split('').map((letter, i) => {
                            return <div 
                                        className="active-word-char-wrapper"
                                        id={i}
                                        onClick={ e => letterClickHandler(e, i)}
                                    >
                                        {letter}
                                    </div>
                    })} 
                 </div>
            </div>
        )
    }

    if (!gameContainer && !isStartGame) {
        return <div className="game-accent-content">Идет загрузка...</div>
    }

    if (!isStartGame) {
        return (
            <div className="game-accent-content">
                <div className="game-accent-title">
                    {`Игра: "${gameContainer.name}"`}
                </div>
                <div className="game-accent-description">
                    {gameContainer.description}
                </div>
                <div className="game-accent-options">
                    <div className="game-accent-options-title">Выберите уровень сложности:</div>
                    <div className="game-accent-options-list">
                        { gameContainer.games.map((game, i) => {
                            return <div className="game-accent-options-item" onClick={e => optionClickHandler(game.complexity_kind)}>{getNameByComplexityKind(game.complexity_kind)}</div>
                        })} 
                    </div>
                </div>
            </div>
        )
    }
}
