import Inquiry from '../models/inquiry.model.js';

/**
 * @desc    Submit a new contact inquiry (Public contact form)
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res, next) => {
  try {
    const { name, company, phone, email, business, requirement, message } = req.body;

    if (!name || !company || !phone || !email || !business || !requirement) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const inquiry = await Inquiry.create({
      name,
      company,
      phone,
      email,
      business,
      requirement,
      message: message || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries / leads
 * @route   GET /api/inquiries
 * @access  Private/Admin
 */
export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single inquiry details
 * @route   GET /api/inquiries/:id
 * @access  Private/Admin
 */
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }
    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update inquiry status or notes
 * @route   PUT /api/inquiries/:id
 * @access  Private/Admin
 */
export const updateInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { returnDocument: 'after', runValidators: true }
    );

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private/Admin
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
