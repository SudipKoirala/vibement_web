const { z } = require('zod');

const loginUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { loginUserDto };