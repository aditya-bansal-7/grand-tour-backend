const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

class AuthService {
  async registerUser(userData) {
    const { email, password, firstName, lastName, role } = userData;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'STUDENT'
      }
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user.id)
    };
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user.id)
      };
    } else {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
  }

  async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

module.exports = new AuthService();
