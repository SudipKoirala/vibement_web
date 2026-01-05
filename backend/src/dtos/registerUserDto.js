const { z } = require('zod');

const registerUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

module.exports = { registerUserDto };