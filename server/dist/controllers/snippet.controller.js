import Snippet from '../models/Snippet.model.js';
export const getSnippets = async (req, res) => {
    try {
        const campus = req.user.campus;
        const snippets = await Snippet.find({ campus }).sort({ createdAt: -1 });
        res.json(snippets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching snippets' });
    }
};
export const createSnippet = async (req, res) => {
    try {
        const { title, code, language, color } = req.body;
        const campus = req.user.campus;
        const moderatorId = req.user.userId;
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
    }
    catch (error) {
        console.error('SERVER ERROR (createSnippet):', error);
        res.status(500).json({ message: 'Error creating snippet', error: error.message });
    }
};
export const updateSnippet = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, code, language, color } = req.body;
        const snippet = await Snippet.findByIdAndUpdate(id, { title, code, language, color }, { new: true });
        if (!snippet)
            return res.status(404).json({ message: 'Snippet not found' });
        res.json(snippet);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating snippet' });
    }
};
export const deleteSnippet = async (req, res) => {
    try {
        const { id } = req.params;
        await Snippet.findByIdAndDelete(id);
        res.json({ message: 'Snippet deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting snippet' });
    }
};
//# sourceMappingURL=snippet.controller.js.map