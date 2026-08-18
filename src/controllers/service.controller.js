import Service from '../models/service.model.js';

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
    const { number, title, description, image, order } = req.body;

    const service = await Service.create({
      number: number || '01',
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

    const formatted = services.map((s, idx) => ({
      number: s.number || String(idx + 1).padStart(2, '0'),
      title: s.title || `Service #${idx + 1}`,
      description: s.description || '',
      image: s.image || '',
      order: idx,
    }));

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
