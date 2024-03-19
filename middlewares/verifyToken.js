const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if(!token) {
        console.log('No token provided!');
        return res.status(403).redirect('/login');
    }

    jwt.verify(token, 'secret', (err) => {
        if(err) {
            console.log('Unauthorized!');
            return res.status(401).redirect('/login');
        }

        next();
    })
}

module.exports = verifyToken;