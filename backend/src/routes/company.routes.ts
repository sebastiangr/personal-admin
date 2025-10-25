import { Router } from 'express';
import { 
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  assignPersonToCompany,
  getPeopleInCompany,
  unassignPersonFromCompany
} from '../controllers/company.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createCompanySchema, updateCompanySchema, assignPersonSchema, idParamSchema } from '../lib/schemas';
import { validate } from '../middlewares/validation.middleware';

const router = Router();
router.use(authenticateToken); 

router.route('/')
  .get(getAllCompanies)
  .post(validate(createCompanySchema),createCompany);

router.route('/:companyId')
  .get(validate(idParamSchema, 'params'),getCompanyById)
  .put(validate(idParamSchema, 'params'),validate(updateCompanySchema),updateCompany)
  .delete(validate(idParamSchema, 'params'),deleteCompany);

router.route('/:companyId/people')
  .get(getPeopleInCompany)
  .post(validate(assignPersonSchema),assignPersonToCompany);

router.delete('/:companyId/people/:personId', unassignPersonFromCompany);  

export default router;