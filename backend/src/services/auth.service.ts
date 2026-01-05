import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// auth.controller.ts
// auth.service.ts
import { RegisterDTOType } from '../dtos/register.dto';
import { LoginDTOType } from '../dtos/login.dto';


// auth.service.ts
import * as UserRepo from '../repositories/auth.repository';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const registerUser = async (data: RegisterDTOType) => {
  // Check unique email
  const existingUser = await UserRepo.findUserByEmail(data.email);
  if (existingUser) throw new Error('Email already exists');

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await UserRepo.createUser({
    email: data.email,
    password: hashedPassword,
    role: data.role || 'user',
  });

  return user;
};

export const loginUser = async (data: LoginDTOType) => {
  const user = await UserRepo.findUserByEmail(data.email);
  if (!user) throw new Error('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { user, token };
};
