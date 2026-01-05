import { Request, Response } from 'express';
// auth.controller.ts
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/login.dto';


import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = RegisterDTO.parse(req.body);
    const user = await AuthService.registerUser(parsed);
    res.status(201).json({ message: 'User registered', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = LoginDTO.parse(req.body);
    const result = await AuthService.loginUser(parsed);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
