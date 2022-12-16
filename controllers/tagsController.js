import Tag from "../models/Tag.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";

class tagsController {
    async getTags (req, res) {
        try {
            const tags = await Tag.find()
            return res.json({tags});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Get tags error"})
        }
    }
    async createTag (req, res) {
        try {
            const {newTags} = req.body
            Tag.insertMany(newTags, function(err) {
                if (err) {
                    res.status(400).json({message: "Create error"})
                }
            })

            const tags = await Tag.find()
            return res.json({tags});

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Create tag error"})
        }
    }

    async deleteTag (req, res) {
        try {
            const tagId = req.params.id
            const tag = await Tag.findOne({_id: tagId})
            if (!tag) {
                return res.status(400).json({message: 'Tag not found'})
            }
            await Tag.findOneAndDelete({_id: tagId})

            const tags = await Tag.find()
            return res.json({tags});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete tag error"})
        }
    }
    async getCategories (req, res) {
        try {
            const categories = await Category.find()
            return res.json({categories});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Get categories error"})
        }
    }
    async createCategory (req, res) {
        try {
            const {newCategories} = req.body
            Category.insertMany(newCategories, function(err) {
                if (err) {
                    res.status(400).json({message: "Create error"})
                }
            })

            const categories = await Category.find()
            return res.json({categories});

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Create category error"})
        }
    }
    async deleteCategory (req, res) {
        try {
            const categoryId = req.params.id
            const category = await Category.findOne({_id: categoryId})
            if (!category) {
                return res.status(400).json({message: 'Tag not found'})
            }
            await Category.findOneAndDelete({_id: categoryId})

            const categories = await Category.find()
            return res.json({categories});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete category error"})
        }
    }
}

export default new tagsController