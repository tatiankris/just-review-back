
class reviewsOperationsController {
    async like (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Like error"})
        }
    }
    async rating (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Rating error"})
        }
    }

    async addComment (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Add comment error"})
        }
    }
    async updateComment (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Update comment error"})
        }
    }
    async deleteComment (req, res) {
        try {

        }
        catch (err) {
            console.log(err)
            res.status(400).json({message: "Delete comment error"})
        }
    }
}

export default new reviewsOperationsController