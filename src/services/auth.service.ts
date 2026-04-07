import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

class AuthService {
  async registerUser(userData: any) {
    const { email, password, firstName, lastName, profileImage, role } = userData;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      const error: any = new Error('User already exists');
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
        profileImage: profileImage || null,
        password: hashedPassword,
        role: (role as Role) || 'STUDENT'
      }
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      role: user.role,
      token: generateToken(user.id)
    };
  }

  async loginUser(credentials: any) {
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
        profileImage: user.profileImage,
        role: user.role,
        token: generateToken(user.id)
      };
    } else {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async googleLoginUser(userData: any) {
    const { email, firstName, lastName, profileImage } = userData;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create user without password
      user = await prisma.user.create({
        data: {
          firstName: firstName || 'User',
          lastName: lastName || '',
          profileImage: profileImage || null,
          email,
          role: 'STUDENT'
        }
      });
    } else if (profileImage && !user.profileImage) {
      // Opt: update the user with image if missing
      user = await prisma.user.update({
        where: { email },
        data: { profileImage }
      });
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      role: user.role,
      token: generateToken(user.id)
    };
  }
}

export default new AuthService();
