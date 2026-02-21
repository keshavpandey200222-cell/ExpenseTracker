const db = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query(
            'SELECT * FROM categories WHERE user_id = ? OR is_default = 1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        const userId = req.user.userId;

        const result = await db.run(
            'INSERT INTO categories (name, type, user_id, is_default) VALUES (?, ?, ?, 0)',
            [name, type, userId]
        );

        const category = await db.query('SELECT * FROM categories WHERE id = ?', [result.lastID]);
        res.status(201).json(category.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = checkResult.rows[0];

        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (category.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.run(
            'UPDATE categories SET name = ? WHERE id = ?',
            [name, id]
        );

        const updatedCategory = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        res.json(updatedCategory.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = checkResult.rows[0];

        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (category.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });
        if (category.is_default === 1) return res.status(400).json({ message: 'Cannot delete default categories' });

        await db.run('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
