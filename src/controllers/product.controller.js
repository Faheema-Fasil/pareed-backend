import Product from '../models/product.model.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ order: 1, number: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products for Admin (including inactive)
 * @route   GET /api/products/admin
 * @access  Private/Admin
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ order: 1, number: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const { number, name, sub, description, image, order } = req.body;

    const product = await Product.create({
      number: number || '01',
      name: name || 'New Product',
      sub: sub || '',
      description: description || '',
      image: image || '',
      order: order !== undefined ? order : 0,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update single product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk replace / update entire products list (for ProductsManager save button)
 * @route   PUT /api/products/bulk
 * @access  Private/Admin
 */
export const bulkSaveProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      res.status(400);
      throw new Error('Products must be an array');
    }

    // Delete existing products and insert new set
    await Product.deleteMany({});

    const formatted = products.map((p, idx) => ({
      number: p.number || String(idx + 1).padStart(2, '0'),
      name: p.name || `Product #${idx + 1}`,
      sub: p.sub || '',
      description: p.description || '',
      image: p.image || '',
      order: idx,
    }));

    const savedProducts = await Product.insertMany(formatted);

    res.status(200).json({
      success: true,
      message: 'Products catalog updated successfully',
      data: savedProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
