import { Request, Response } from 'express';
import Snippet from '../models/Snippet.model.js';

export const getSnippets = async (req: Request, res: Response) => {
  try {
    const campus = (req as any).user.campus;
    const snippets = await Snippet.find({ campus }).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching snippets' });
  }
};

export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { title, code, language, color } = req.body;
    const campus = (req as any).user.campus;
    const moderatorId = (req as any).user.userId;

    const snippet = new Snippet({
      title,
      code,
      language,
      color,
      campus,
      moderatorId
    });

    await snippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    console.error('SERVER ERROR (createSnippet):', error);
    res.status(500).json({ message: 'Error creating snippet', error: (error as any).message });
  }
};

export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, code, language, color } = req.body;
    
    const snippet = await Snippet.findByIdAndUpdate(
      id,
      { title, code, language, color },
      { new: true }
    );

    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating snippet' });
  }
};

export const deleteSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Snippet.findByIdAndDelete(id);
    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting snippet' });
  }
};
