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

const router = Router();

// Aplica el middleware a TODAS las rutas de este archivo
router.use(authenticateToken); 

router.route('/')
  .get(getAllCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

router.route('/:companyId/people')
  .get(getPeopleInCompany)
  .post(assignPersonToCompany);

export default router;