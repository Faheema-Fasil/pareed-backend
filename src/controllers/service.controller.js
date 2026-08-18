import Service from '../models/service.model.js';
import ServiceCategory from '../models/serviceCategory.model.js';

/**
 * @desc    Get all available service categories/tags
 * @route   GET /api/services/categories, GET /api/services/tags
 * @access  Public
 */
export const getServiceCategories = async (req, res, next) => {
  try {
    // 1. Fetch persistent categories from database
    const savedCategories = await ServiceCategory.find({}).sort({ name: 1 });
    const categorySet = new Set();

    savedCategories.forEach((c) => {
      if (c.name && c.name.trim()) categorySet.add(c.name.trim().toUpperCase());
    });

    // 2. Also harvest any categories currently used in Service documents
    const distinctServiceCats = await Service.distinct('category');
    const distinctServiceTags = await Service.distinct('tag');

    [...distinctServiceCats, ...distinctServiceTags].forEach((cat) => {
      if (cat && typeof cat === 'string' && cat.trim()) {
        categorySet.add(cat.trim().toUpperCase());
      }
    });

    const categoryList = Array.from(categorySet);

    res.status(200).json({
      success: true,
      count: categoryList.length,
      data: categoryList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new service category/tag option
 * @route   POST /api/services/categories, POST /api/services/tags
 * @access  Private/Admin
 */
export const addServiceCategory = async (req, res, next) => {
  try {
    const rawName = req.body.name || req.body.category || req.body.tag;

    if (!rawName || !rawName.toString().trim()) {
      res.status(400);
      throw new Error('Please provide a category/tag name');
    }

    const name = rawName.toString().trim().toUpperCase();

    // Check or upsert
    let category = await ServiceCategory.findOne({ name });
    if (!category) {
      category = await ServiceCategory.create({ name });
    }

    // Return the updated full list of options
    const allSaved = await ServiceCategory.find({}).sort({ name: 1 });
    const categorySet = new Set();
    allSaved.forEach((c) => categorySet.add(c.name.trim().toUpperCase()));

    const distinctServiceCats = await Service.distinct('category');
    const distinctServiceTags = await Service.distinct('tag');
    [...distinctServiceCats, ...distinctServiceTags].forEach((cat) => {
      if (cat && typeof cat === 'string' && cat.trim()) {
        categorySet.add(cat.trim().toUpperCase());
      }
    });

    res.status(201).json({
      success: true,
      message: `Category "${name}" added successfully`,
      data: Array.from(categorySet),
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a custom service category/tag
 * @route   DELETE /api/services/categories/:name
 * @access  Private/Admin
 */
export const deleteServiceCategory = async (req, res, next) => {
  try {
    const name = decodeURIComponent(req.params.name).trim().toUpperCase();
    await ServiceCategory.deleteOne({ name });

    res.status(200).json({
      success: true,
      message: `Category "${name}" removed from options`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, number: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private/Admin
 */
export const createService = async (req, res, next) => {
  try {
    const { number, category, tag, title, description, image, order } = req.body;
    const resolvedCategory = (category || tag || '').toString().trim().toUpperCase();

    const service = await Service.create({
      number: number || '01',
      category: resolvedCategory,
      tag: resolvedCategory,
      title: title || 'New Service',
      description: description || '',
      image: image || '',
      order: order !== undefined ? order : 0,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update single service
 * @route   PUT /api/services/:id
 * @access  Private/Admin
 */
export const updateService = async (req, res, next) => {
  try {
    if (req.body.category !== undefined || req.body.tag !== undefined) {
      const cat = (req.body.category || req.body.tag || '').toString().trim().toUpperCase();
      req.body.category = cat;
      req.body.tag = cat;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk replace / update entire services list
 * @route   PUT /api/services/bulk
 * @access  Private/Admin
 */
export const bulkSaveServices = async (req, res, next) => {
  try {
    const { services } = req.body;

    if (!Array.isArray(services)) {
      res.status(400);
      throw new Error('Services must be an array');
    }

    await Service.deleteMany({});

    const formatted = services.map((s, idx) => {
      const cat = (s.category || s.tag || '').toString().trim().toUpperCase();
      return {
        number: s.number || String(idx + 1).padStart(2, '0'),
        category: cat,
        tag: cat,
        title: s.title || `Service #${idx + 1}`,
        description: s.description || '',
        image: s.image || '',
        order: s.order !== undefined ? s.order : idx,
      };
    });

    const savedServices = await Service.insertMany(formatted);

    res.status(200).json({
      success: true,
      message: 'Services updated successfully',
      data: savedServices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private/Admin
 */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
