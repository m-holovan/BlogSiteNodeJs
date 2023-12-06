import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something go wrong!',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
        ).exec();

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Cant find post',
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error finding or updating post',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await PostModel.findOneAndDelete({
            _id: postId,
        }).exec();

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Cant delete post',
            });
        }

        res.json({
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot remove post!',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot create post!',
        });
    }
}