import { Request, Response } from 'express';
import { deleteUserById, getUserByID, getUsers } from '../db/users';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();

    res.status(200).json(users);
  } catch (error: unknown) {
    console.error('Error fetching users: ', error);
    if (error instanceof Error) {
      res.sendStatus(400).json({ message: error.message });
    } else {
      res.status(400).json({ messsage: 'An unecpected error occured' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    res.status(200).json(deleteUser);
  } catch (error: unknown) {
    console.error('Error delete users: ', error);
    if (error instanceof Error) {
      res.sendStatus(400).json({ message: error.message });
    } else {
      res.status(400).json({ messsage: 'An unecpected error occured' });
    }
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      res.sendStatus(400);
      return;
    }

    const user = await getUserByID(id);
    user.username = username;
    await user.save();

    res.status(200).json(user);
  } catch (error: unknown) {
    console.error('Error delete users: ', error);
    if (error instanceof Error) {
      res.sendStatus(400).json({ message: error.message });
    } else {
      res.status(400).json({ messsage: 'An unecpected error occured' });
    }
  }
};