import { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Missing required fields");
      return;
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      res.status(403).send("Invalid credentials");
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('EKO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    res.status(200).json(user);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(500);
  }
};


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).send('Missing required fields');
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).send('User already exists');
      return;
    }


    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

