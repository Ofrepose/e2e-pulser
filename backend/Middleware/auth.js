const jwt = require('jsonwebtoken');
const config = require('config');

/*
* Get token from header.
* If can't find token return 401.
* Verify token and secret.
* Take the request object and assign value to user variable.
* Next() continues application.  
*/
/**
 * Middleware to verify the authenticity of a JSON Web Token (JWT) in the request header.
 * If the token is valid, it decodes it and attaches the user information to the request object.
 * If the token is missing or invalid, it sends an appropriate error response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function in the request-response cycle.
 * @returns {void}
 */
module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if( !token ){
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  };
  try{
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.body.user = decoded.user;
    next();
  }catch( err ){
    console.log(err);
    res.status(401).json({ msg: 'Token is not valid' });
  };
};
