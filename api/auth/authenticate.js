const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access Denied');
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).send('User not found');
  
      req.user = user;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };

module.exports = authenticateToken