import express from 'express';
import { getSnippets, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippet.controller.js';
import { authenticate } from '../middleware/authenticate.js';
const router = express.Router();
router.use(authenticate);
router.get('/', getSnippets);
router.post('/', createSnippet);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);
export default router;
//# sourceMappingURL=snippet.routes.js.map