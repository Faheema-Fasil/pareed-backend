import Product from '../models/product.model.js';
import Service from '../models/service.model.js';
import TeamMember from '../models/team.model.js';
import Inquiry from '../models/inquiry.model.js';

/**
 * @desc    Get dashboard metrics & recent inquiries
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [productsCount, servicesCount, teamCount, inquiriesCount, newLeadsCount, recentInquiries] =
      await Promise.all([
        Product.countDocuments(),
        Service.countDocuments(),
        TeamMember.countDocuments(),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: 'New' }),
        Inquiry.find({}).sort({ createdAt: -1 }).limit(5),
      ]);

    const stats = [
      {
        title: 'Products Listed',
        value: `${productsCount} Items`,
        to: '/admin/dashboard/products',
        color: 'border-blue-500',
      },
      {
        title: 'Active Services',
        value: `${servicesCount} Services`,
        to: '/admin/dashboard/services',
        color: 'border-gold',
      },
      {
        title: 'Team Members',
        value: `${teamCount} People`,
        to: '/admin/dashboard/team',
        color: 'border-emerald-500',
      },
      {
        title: 'New Enquiries',
        value: `${newLeadsCount} Leads`,
        to: '/admin/dashboard/inquiries',
        color: 'border-purple-500',
        highlight: true,
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalInquiries: inquiriesCount,
        recentInquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};
