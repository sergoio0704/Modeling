const database = require('../db/database')
const fs = require('fs')
const config = require('config')

const { NUMBER_GAMES, NUMBER_TRUE_ANSWERS, WIN_RATE } = require('../models/filterTypes')
const { ASC, DESC } = require('../models/orderTypes')

async function getGames() {
    try {
        return await database.db.manyOrNone(`SELECT * FROM game_type`)     
    } catch(e) {
        console.log('DATABASE GetGames ERROR: ' + e)
        throw e
    }
}

async function getGameTypeById(id) {
    try {
        return await database.db.oneOrNone(`SELECT * FROM game_type WHERE id_game_type = $1`, [id])      
    } catch(e) {
        console.log('DATABASE GetGameTypeById ERROR: ' + e)
        throw e
    }
}

async function getGamesByGameTypeId(id) {
    try {
        return await database.db.manyOrNone(`
            SELECT 
                g.id_game,
                g.id_game_type,
                c.complexity_kind,
                f.id_file,
                f.name AS file_name
            FROM game g
            INNER JOIN complexity c ON g.id_complexity = c.id_complexity
            LEFT JOIN file f ON g.id_file = f.id_file
            WHERE g.id_game_type = $1 AND f.id_file IS NOT NULL`, [id])   
    } catch(e) {
        console.log('DATABASE GetGamesByGameTypeId ERROR: ' + e)
        throw e
    }
}

async function getAccentGameContainer(id) {
    try {
        const gameType = await getGameTypeById(id)
        const games =  await getGamesByGameTypeId(id)

        const gameContainer = {...gameType, games: []}
        
        for (let game of games) {
           if (!game.id_file || !game.file_name) continue

           const words = createAccentWords(game)
           const gameInfo = {
               id_game: game.id_game,
               id_file: game.id_file,
               complexity_kind: game.complexity_kind,
               words: words
           }

           gameContainer.games.push(gameInfo)
        }
        
        return gameContainer
    }
    catch(e) {
        console.log('DATABASE GetAccentGameContainer ERROR: ' + e)
        throw e
    }
}

async function saveGameResult(id_account, gameResult) {
    try {
        return await database.db.none(`
            INSERT INTO game_result (id_account, id_game, quantity_tasks, quantity_true_answers)
            VALUES($1,$2,$3,$4)`, [id_account, gameResult.id_game, gameResult.quantity_tasks, gameResult.quantity_true_answers ])
    } catch(e) {
        console.log('DATABASE SaveGameResult ERROR: ' + e)
        throw e
    }
}

async function getGameResults(filterType, orderType) {
    try {
        let sql = `SELECT 
            a.id_account, 
            a.name, 
            a.email, 
            res.number_true_answers, 
            res.number_games, 
            (res.number_true_answers/res.number_games) as win_rate
        FROM account a 
        INNER JOIN (
            SELECT 
                gr.id_account, 
                SUM(gr.quantity_true_answers) AS number_true_answers, 
                COUNT(gr.id_game_result) AS number_games
            FROM game_result gr
            GROUP BY gr.id_account 
        ) AS res ON res.id_account = a.id_account
        ORDER BY`
        
        if (filterType === NUMBER_TRUE_ANSWERS) {
            sql += ' res.number_true_answers'
        }

        if (filterType === NUMBER_GAMES) {
            sql += ' res.number_games'
        }

        if (filterType === WIN_RATE) {
            sql += ' win_rate'
        }

        if (orderType === ASC) {
            sql += ' ASC'
        }

        if (orderType === DESC) {
            sql += ' DESC'
        }

        const data =  await database.db.manyOrNone(sql)

        return data
    } catch(e) {
        console.log('DATABASE getGameResults ERROR: ' + e)
        throw e
    }
}

async function editGameType(gameType) {
    try {
        return await database.db.none(`
            UPDATE game_type
            SET description = $1
            WHERE id_game_type = $2`, [gameType.description, gameType.id_game_type])
    } catch(e) {
        console.log('DATABASE editGameType ERROR: ' + e)
        throw e
    }
}

function createAccentWords(game) {
    const wordsInfo = []
    const lines = fs.readFileSync(`${config.fileStoragePath}/${game.file_name}`, 'utf8').split('\r\n');
    for (const line of lines) {
        const wordInfo = { word: line.toLowerCase() }
        for (let i = 0; i < line.length - 1; i++) {
            if (isUpper(line[i])) {
                wordInfo.answerPosition = i
                break
            }
        }
        wordsInfo.push(wordInfo)
    }

    return wordsInfo
}

function isUpper(ch) {
    if (ch === ch.toUpperCase()) {
        return true
    }

    return false
}

module.exports = {
    getGames,
    getGameTypeById,
    getGamesByGameTypeId,
    getAccentGameContainer,
    getGameResults,
    saveGameResult,
    editGameType
}


// {
//     id_game_type: 1,
//     name: "Ударения",
//     description: "...",
//     games: [
//         {
//             id_game: 1,
//             id_file: 2,
//             kind: 1,
//             words: [
//                 {
//                     word: "привет",
//                     answerPosition: 4
//                 }
//             ]
//         },
//         {
//             id_game: 2,
//             id_file: 1,
//             kind: 2,
//             words: [
//                 {
//                     word: "привет",
//                     answerPosition: 4
//                 }
//             ]
//         },
//     ]
// }