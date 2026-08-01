const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

const workerAuth = async (req, res, next) => {
  // Can be a specific API key or token for workers
  // For now, we will use the workerId passed in headers along with user token
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') && req.headers['x-worker-id']) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) throw new Error('User not found');
      
      const workerId = req.headers['x-worker-id'];
      const worker = await Worker.findOne({ workerId });
      
      if (!worker) throw new Error('Worker not registered');
      
      req.user = user;
      req.worker = worker;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized as worker' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Not authorized, missing token or worker id' });
  }
};

module.exports = { protect, workerAuth };
