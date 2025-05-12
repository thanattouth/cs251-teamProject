const jwt = require('jsonwebtoken')

function adminAuth(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied' })
        }
        req.admin = decoded.adminId
        next()
    } catch {
        res.status(401).json({ message: 'Token is not valid' })
    }
}

module.exports = adminAuth