import { Router } from 'express';
import { getAllPeople, createPerson, getPersonById, deletePerson, updatePerson } from '../controllers/person.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createPersonSchema, updatePersonSchema } from '../lib/schemas';
import { validate } from '../middlewares/validation.middleware';

const router = Router();
router.use(authenticateToken);

router.route('/')
  .get(getAllPeople)
  .post(validate(createPersonSchema),createPerson);

router.route('/:id')
  .get(getPersonById)
  .put(validate(updatePersonSchema),updatePerson)
  .delete(deletePerson);

export default router;