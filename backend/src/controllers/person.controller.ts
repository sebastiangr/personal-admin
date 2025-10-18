import { Request, Response } from 'express';
import prisma from '../lib/db';

const getUserId = (req: Request) => req.user!.userId;

export const getAllPeople = async (req: Request, res: Response) => {
  const people = await prisma.person.findMany({
    where: { userId: getUserId(req) },
    orderBy: { name: 'asc' },
    
    include: {
      companies: {
        include: {
          company: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });
  res.json(people);
};

export const getPersonById = async (req: Request, res: Response) => {
  const person = await prisma.person.findFirst({
    where: { id: req.params.id, userId: getUserId(req) },
  });
  if (!person) return res.status(404).json({ error: 'Person not found' });
  res.json(person);
};

export const createPerson = async (req: Request, res: Response) => {
  const { name, email, linkedinUrl, notes } = req.body;  

  const newPerson = await prisma.person.create({
    data: {
      name,
      email,
      linkedinUrl,
      notes,
      userId: getUserId(req),
    }
  });
  res.status(201).json(newPerson);
};

export const updatePerson = async (req: Request, res: Response) => {
  try {
    const personId = req.params.id;
    const userId = getUserId(req);

    const oldPerson = await prisma.person.findFirst({
      where: { id: personId, userId }
    });
    if (!oldPerson) return res.status(404).json({ error: 'Person not found' });

    const updatedPerson = await prisma.person.update({
      where: { id: personId },
      data: req.body
    });

    res.json(updatedPerson);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Person not found or you do not have permission.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  try {
    await prisma.person.delete({
      where: { id: req.params.id, userId: getUserId(req) }
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Person not found or you do not have permission.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};