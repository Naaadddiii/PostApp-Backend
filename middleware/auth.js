import jwt from 'jsonwebtoken';


export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "2222222")
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token, "1111111")

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, 'your_secret_key_here');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization failed' });
  }
};

  


