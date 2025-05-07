const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.header('x-auth-token')
    if(!token) res.status(401).json({ message: 'No token, authorization denied' })
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.userId
        next()
    } catch {
        res.status(401).json({ message: 'Token is not valid' })
    }
}

module.exports = auth