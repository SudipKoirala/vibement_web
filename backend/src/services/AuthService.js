const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register(userData) {
    const { email, password, role } = userData;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await UserRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    return { id: user._id, email: user.email, role: user.role };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    return { token, user: { id: user._id, email: user.email, role: user.role } };
  }
}

module.exports = new AuthService();