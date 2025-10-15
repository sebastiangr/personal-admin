import { Request, Response } from 'express';
import prisma from '../lib/db';

const getUserId = (req: Request) => req.user!.userId;

export const getAllCompanies = async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany({
    where: { userId: getUserId(req) },
    orderBy: { createdAt: 'desc' }
  });
  res.json(companies);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const company = await prisma.company.findFirst({
    where: { id: req.params.id, userId: getUserId(req) }
  });
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
};

export const createCompany = async (req: Request, res: Response) => {
  const newCompany = await prisma.company.create({
    data: { ...req.body, userId: getUserId(req) }
  });
  await prisma.activityLog.create({
    data: { eventDescription: `Compañía '${newCompany.name}' creada.`, companyId: newCompany.id }
  });
  res.status(201).json(newCompany);
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const userId = getUserId(req);

    const oldCompany = await prisma.company.findFirst({
      where: { id: companyId, userId }
    });
    if (!oldCompany) return res.status(404).json({ error: 'Company not found' });

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: req.body
    });

    if (req.body.status && oldCompany.status !== req.body.status) {
      await prisma.activityLog.create({
        data: { eventDescription: `Estado cambiado de ${oldCompany.status} a ${req.body.status}.`, companyId }
      });
    }
    res.json(updatedCompany);
  } catch (error) {
    res.status(404).json({ error: 'Update failed. Company not found.' });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    // La cláusula where con userId asegura que un usuario no pueda borrar la compañía de otro
    await prisma.company.delete({
      where: { id: req.params.id, userId: getUserId(req) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Delete failed. Company not found.' });
  }
};