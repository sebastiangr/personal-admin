import { Router } from 'express';
import { getAllPeople, createPerson, getPersonById, deletePerson, updatePerson } from '../controllers/person.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.route('/')
  .get(getAllPeople)
  .post(createPerson);

router.route('/:id')
  .get(getPersonById)
  .put(updatePerson)
  .delete(deletePerson);

export default router;