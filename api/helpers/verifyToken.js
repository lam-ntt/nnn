const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token')
  if(!token) return res.status(401).json('Token not found!')

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if(!decoded.userId) return res.status(401).json("Token invalid!")
    else {
      req.userId = decoded.userId 
      next()
    }
  } catch(err) {
    return res.status(500).json(err)
  }
}

module.exports = verifyToken