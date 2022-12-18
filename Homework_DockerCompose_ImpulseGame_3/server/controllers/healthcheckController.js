async function ping(req, res) {
    try {
        res.status(200).json({msg: 'OK'})
    } catch (e) {
        res.status(501).json({msg: 'internal_error'})
    }
}

module.exports = function(app) {
    app.get('/healthcheck/ping', ping)
}