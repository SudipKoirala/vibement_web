import { Request, Response } from 'express';
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/login.dto';
import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const parsedResult = RegisterDTO.safeParse(req.body);

    if (!parsedResult.success) {
      // Use 'issues' instead of 'errors'
      const messages = parsedResult.error.issues.map((e) => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }

    const user = await AuthService.registerUser(parsedResult.data);
    res.status(201).json({ message: 'User registered', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsedResult = LoginDTO.safeParse(req.body);

    if (!parsedResult.success) {
      // Use 'issues' instead of 'errors'
      const messages = parsedResult.error.issues.map((e) => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }

    const result = await AuthService.loginUser(parsedResult.data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }
};
