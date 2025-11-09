import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // First check if the token is passed in cookies
  const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')
    ? req.headers['authorization'].split(' ')[1]  // Extract token after "Bearer"
    : null);

  if (!token) {
    return res.status(403).json({ error: 'Token is required for authentication.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach the userId from the token to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If token is invalid or expired
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export default verifyToken;
