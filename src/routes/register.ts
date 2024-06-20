import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { addUser, findUserById, findUserByUsername } from '../models/user';
import { isAdmin } from '../middleware/authenticateAdmin'; 

const router = express.Router();

router.post('/register', isAdmin, async (req: Request, res: Response) => {
  const { id, firstName, lastName, email, username, phone, password } = req.body;

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).send('Username already exists');
    }

    const userWithId = await findUserById(id);
    if (userWithId) {
      return res.status(409).send('User with this ID already exists');
    }

    // יצירת סיסמה מוצפנת
    const passwordHash = await bcrypt.hash(password, 10);

    // יצירת המשתמש החדש
    const newUser = { id, firstName, lastName, email, username, phone, passwordHash };

    // הוספת המשתמש למערכת
    await addUser(newUser);
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

export default router;