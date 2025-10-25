import { Request, Response } from 'express';
import prisma from '../lib/db';
import type { Prisma } from '@prisma/client';

const getUserId = (req: Request) => req.user!.userId;

export const getAllCompanies = async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany({
    where: { userId: getUserId(req) },
    orderBy: { createdAt: 'desc' }
  });
  res.json(companies);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const company = await prisma.company.findFirst({
    where: { id: companyId, userId: getUserId(req) }
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
  const { companyId } = req.params;
  const userId = getUserId(req);
  const dataToUpdate = req.body;

  try {
    
    const updatedCompany = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      const oldCompany = await tx.company.findFirst({
        where: { id: companyId, userId },
        select: { status: true }
      });
      
      if (!oldCompany) {        
        throw new Error('COMPANY_NOT_FOUND');
      }
      
      const company = await tx.company.update({
        where: { id: companyId },
        data: dataToUpdate,
      });
      
      if (dataToUpdate.status && oldCompany.status !== dataToUpdate.status) {
        await tx.activityLog.create({
          data: {
            eventDescription: `Estado cambiado de ${oldCompany.status} a ${dataToUpdate.status}.`,
            companyId: companyId,
          }
        });
      }
      
      return company;
    });

    res.json(updatedCompany);    
  } catch (error: any) {    
    if (error.message === 'COMPANY_NOT_FOUND') {
      return res.status(404).json({ error: 'Company not found or you do not have permission' });
    }                    
    if (error.code === 'P2025') {      
      return res.status(404).json({ error: 'Company not found or you do not have permission' });
    }    
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const userId = getUserId(req);
  
  try {
    await prisma.company.delete({
      where: { id: companyId, userId: userId }
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Company not found or you do not have permission' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignPersonToCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { personId, role } = req.body;
  const userId = getUserId(req);

  if (!personId) {
    return res.status(400).json({ error: 'personId is required' });
  }

  try {    
    const [company, person] = await Promise.all([
      prisma.company.findFirst({ where: { id: companyId, userId } }),
      prisma.person.findFirst({ where: { id: personId, userId } })
    ]);

    if (!company || !person) {
      return res.status(404).json({ error: 'Company or Person not found, or you do not have permission.' });
    }

    const assignment = await prisma.personOnCompany.create({
      data: { companyId, personId, role }
    });
    await prisma.activityLog.create({
      data: {
        eventDescription: `Se asignó a '${person.name}' a la compañía con el rol '${assignment.role || 'sin rol'}'.`,
        companyId: companyId,
      }
    });

    res.status(201).json(assignment);      
  } catch (error: any) {    
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'This person is already assigned to this company.' });
    }    
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unassignPersonFromCompany = async (req: Request, res: Response) => {
  const { companyId, personId } = req.params;
  const userId = getUserId(req);

  try {    
    const company = await prisma.company.findFirst({ where: { id: companyId, userId } });
    const personToUnassign = await prisma.person.findUnique({ where: { id: personId } });

    if (!company) {
      return res.status(404).json({ error: 'Company not found or you do not have permission.' });
    }
    
    await prisma.personOnCompany.delete({
      where: {
        personId_companyId: {
          personId: personId,
          companyId: companyId,
        }
      }
    });

    if (personToUnassign) {
      await prisma.activityLog.create({
        data: {
          eventDescription: `Se desasignó a '${personToUnassign.name}' de la compañía.`,
          companyId: companyId,
        }
      });
    }    

    res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Assignment not found.' });
    }
    console.error('Unassignment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPeopleInCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const userId = getUserId(req);
    
  const company = await prisma.company.findFirst({ where: { id: companyId, userId } });
  if (!company) {
    return res.status(404).json({ error: 'Company not found or you do not have permission.' });
  }

  const people = await prisma.personOnCompany.findMany({
    where: { companyId },
    include: {
      person: true
    }
  });

  res.json(people.map((p: { person: any; role: string | null }) => ({ 
    ...p.person, 
    role: p.role 
  })));
};