const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');

class AuthService {
  async register(name, email, password) {
    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await userRepository.create({
      name,
      email,
      password
    });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async updateProfile(userId, name, email, notificationSound) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if (email && email !== user.email) {
      const emailExists = await userRepository.findByEmail(email);
      if (emailExists) throw new Error('Email already in use');
    }

    const updateData = { 
      name: name || user.name, 
      email: email || user.email 
    };
    
    if (notificationSound !== undefined) {
      updateData.notificationSound = notificationSound;
    }

    const updatedUser = await userRepository.update(userId, updateData);
    
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      notificationSound: updatedUser.notificationSound,
      token: generateToken(updatedUser._id) // Issue a new token just in case
    };
  }

  async deleteAccount(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    await userRepository.delete(userId);
    return true;
  }
}

module.exports = new AuthService();
