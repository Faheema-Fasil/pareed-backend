import TeamMember from '../models/team.model.js';

/**
 * @desc    Get all team members
 * @route   GET /api/team
 * @access  Public
 */
export const getTeamMembers = async (req, res, next) => {
  try {
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single team member by ID
 * @route   GET /api/team/:id
 * @access  Public
 */
export const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404);
      throw new Error('Team member not found');
    }
    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new team member
 * @route   POST /api/team
 * @access  Private/Admin
 */
export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, initials, photo, order } = req.body;

    const member = await TeamMember.create({
      name,
      role,
      initials: initials || (name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : ''),
      photo: photo || '',
      order: order !== undefined ? order : 0,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update single team member
 * @route   PUT /api/team/:id
 * @access  Private/Admin
 */
export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!member) {
      res.status(404);
      throw new Error('Team member not found');
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk replace / update entire team list
 * @route   PUT /api/team/bulk
 * @access  Private/Admin
 */
export const bulkSaveTeam = async (req, res, next) => {
  try {
    const { team } = req.body;

    if (!Array.isArray(team)) {
      res.status(400);
      throw new Error('Team must be an array');
    }

    await TeamMember.deleteMany({});

    const formatted = team.map((m, idx) => ({
      name: m.name || `Team Member #${idx + 1}`,
      role: m.role || 'Member',
      initials: m.initials || (m.name ? m.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'PK'),
      photo: m.photo || '',
      order: idx,
    }));

    const savedTeam = await TeamMember.insertMany(formatted);

    res.status(200).json({
      success: true,
      message: 'Team members updated successfully',
      data: savedTeam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete team member
 * @route   DELETE /api/team/:id
 * @access  Private/Admin
 */
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404);
      throw new Error('Team member not found');
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
