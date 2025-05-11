import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key'; // Match with the secret key used in the controller

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract the token from the header

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = decoded; // Add user data to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};
