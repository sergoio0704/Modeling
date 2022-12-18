const gameRepository = require('../repositiories/gameRepository')
const accountRepository = require('../repositiories/accountRepository')
const authenticator = require('./authenticator')
const gameValidator = require('../services/gameValidator')

const { ADMIN } = require("../models/role")

async function getGames(req, res) {
    try {
        const games = await gameRepository.getGames()
        res.status(200).json(games)
    } catch (e) {
        res.status(501).json({msg: 'internal_error'})
    }
}

async function getAccentGameContainer(req, res) {   
    try {
        let id_game_type = req.query.id
        if (!id_game_type) {
            return res.status(400).json({msg: 'bad_request'})
        }
        else {
            id_game_type = parseInt(id_game_type)
        }

        const gameContainer = await gameRepository.getAccentGameContainer(id_game_type)
        res.status(200).json(gameContainer)
    } catch(e) {
        res.status(501).json({msg: 'internal_error'})
    }
}

async function saveGameResult(req, res) {
    try {
        const accountId = req.account.id
        const gameResult = req.body

        const validationResult = gameValidator.gameResultValidation(gameResult)
        if (!validationResult.isValid) {
            return res.status(400).json({
                errors: validationResult.errors,
                msg: 'Некорректные данные!'})
        }

        await gameRepository.saveGameResult(accountId, gameResult)
        res.status(200).json({msg: 'success'})
    } catch (e) {
        console.log(e)
        res.status(501).json({msg: 'internal_error'})
    }
}

async function getGameResults(req, res) {
    try {
        const filterType = parseInt(req.query.filter_type)
        const orderType = parseInt(req.query.order_type)
        const gameResults = await gameRepository.getGameResults(filterType, orderType)
        return res.status(200).json(gameResults)
    } catch(e) {
        console.log(e)
        res.status(501).json({msg: 'internal_error'})
    }
}

async function editGame(req, res) {
    try {
        const accountId = req.account.id
        const role = await accountRepository.getAccountRoleById(accountId)
        if ( role.name !== ADMIN ) {
            return res.status(403).json({msg: 'forbidden'})
        }

        const editGameRequest = req.body
        const validationResult = gameValidator.gameEditValidation(editGameRequest)
        if (!validationResult.isValid) {
            return res.status(400).json({
                errors: validationResult.errors,
                msg: 'Некорректные данные!'})
        }

        await gameRepository.editGameType(editGameRequest)
        res.status(200).json({msg: 'success'})
    } catch(e) {
        console.log(e)
        res.status(501).json({msg: 'internal_error'})
    }
}

module.exports = function(app) {
    app.get('/api/v1/games', getGames)
    app.get('/api/v1/game/accent', getAccentGameContainer)
    app.get('/api/v1/game/results', getGameResults)
    app.post('/api/v1/game/accent/save', authenticator.apiAuthenticateJWT, saveGameResult)
    app.post('/api/v1/game/edit', authenticator.apiAuthenticateJWT, editGame)
}