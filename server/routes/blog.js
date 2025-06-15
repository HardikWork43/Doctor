import express from 'express';
import { BlogPost, User } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, published = true } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    if (published === 'true') {
      whereClause.isPublished = true;
    }

    const posts = await BlogPost.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName'],
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        posts: posts.rows,
        pagination: {
          total: posts.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(posts.count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog posts',
      error: error.message,
    });
  }
});

// Get blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({
      where: { slug },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName'],
      }],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Increment views
    await post.increment('views');

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog post',
      error: error.message,
    });
  }
});

// Create blog post (admin/doctor only)
router.post('/', authenticateToken, authorizeRoles('admin', 'doctor'), async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      isPublished,
    } = req.body;

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      authorId: req.user.id,
      category,
      tags,
      featuredImage,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });

    const postWithAuthor = await BlogPost.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { post: postWithAuthor },
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message,
    });
  }
});

export default router;