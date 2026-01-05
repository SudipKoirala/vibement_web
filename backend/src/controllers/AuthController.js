const AuthService = require('../services/AuthService');
const { registerUserDto } = require('../dtos/registerUserDto');
const { loginUserDto } = require('../dtos/loginUserDto');

class AuthController {
  async register(req, res) {
    try {
      // Validate request body
      const validatedData = registerUserDto.parse(req.body);

      const user = await AuthService.register(validatedData);

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors,
        });
      }
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      // Validate request body
      const validatedData = loginUserDto.parse(req.body);

      const result = await AuthService.login(validatedData);

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors,
        });
      }
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();