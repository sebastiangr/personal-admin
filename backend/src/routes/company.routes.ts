import { Router } from 'express';
import { 
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  assignPersonToCompany,
  getPeopleInCompany
} from '../controllers/company.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createCompanySchema, updateCompanySchema, assignPersonSchema } from '../lib/schemas';
import { validate } from '../middlewares/validation.middleware';

const router = Router();
router.use(authenticateToken); 

router.route('/')
  .get(getAllCompanies)
  .post(validate(createCompanySchema),createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(validate(updateCompanySchema),updateCompany)
  .delete(deleteCompany);

router.route('/:companyId/people')
  .get(getPeopleInCompany)
  .post(validate(assignPersonSchema),assignPersonToCompany);

export default router;