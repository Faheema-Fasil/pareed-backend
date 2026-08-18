import WhyChooseUs from '../models/whyChooseUs.model.js';

/**
 * @desc    Get all Why Choose Us items
 * @route   GET /api/why-choose-us
 * @access  Public
 */
export const getWhyChooseUs = async (req, res, next) => {
  try {
    const items = await WhyChooseUs.find({}).sort({ order: 1, number: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk save Why Choose Us items
 * @route   PUT /api/why-choose-us/bulk
 * @access  Private/Admin
 */
export const bulkSaveWhyChooseUs = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400);
      throw new Error('Items must be an array');
    }

    await WhyChooseUs.deleteMany({});

    const formatted = items.map((it, idx) => ({
      number: it.number || String(idx + 1).padStart(2, '0'),
      title: it.title || it.header || `Reason #${idx + 1}`,
      description: it.description || it.desc || '',
      order: idx,
    }));

    const savedItems = await WhyChooseUs.insertMany(formatted);

    res.status(200).json({
      success: true,
      message: 'Why Choose Us section updated successfully',
      data: savedItems,
    });
  } catch (error) {
    next(error);
  }
};
