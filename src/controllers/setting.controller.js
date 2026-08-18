import Setting from '../models/setting.model.js';

// Default initial settings data if not yet in DB
const DEFAULT_SETTINGS = {
  general: {
    logoImageUrl: '/PAREED FISH TRADING L.L.C 2026.png',
    phone1: '+971 50 181 1875',
    phone2: '+971 50 602 7334',
    email: 'info@pareedfishtrading.com',
    location: 'Waterfront Market',
    cityCountry: 'Dubai, United Arab Emirates',
  },
  hero: {
    preheading: 'DUBAI SEAFOOD WHOLESALE ? EST. 1990',
    headingLine1: 'Fresh seafood,',
    headingLine2: 'reliably delivered.',
    description:
      'Connecting commercial kitchens, restaurants and bulk buyers with quality fresh fish across the UAE.',
    yearsBadge: '35+',
    yearsText: 'Years of Market Experience in the UAE',
    primaryCtaText: 'ENQUIRE FOR SUPPLY +??',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'VIEW PRODUCTS',
    secondaryCtaLink: '#products',
    bgImageUrl: '',
  },
  about: {
    preheading: 'ABOUT PAREED FISH TRADING',
    headingLine1: 'Over three decades of trusted',
    headingLine2: 'seafood supply in the UAE.',
    description1:
      'Established in the United Arab Emirates, Pareed Fish Trading LLC has grown from a dedicated market presence into a trusted wholesale partner for food businesses across the region.',
    description2:
      'Built on personal relationships, deep market knowledge and a commitment to daily freshness, we take pride in connecting customers with the finest catch every single morning.',
    experienceYears: '35+',
    experienceText: 'Years in Seafood Trade',
    establishedYear: '1990',
    imageUrl: '',
  },
  'mission-vision': {
    eyebrow: 'Our Direction',
    title: 'Mission & Vision',
    missionTitle: 'Fresh seafood. Reliable service.',
    missionDescription:
      'To provide fresh and premium seafood with reliable service and competitive wholesale pricing across the UAE.',
    visionTitle: 'A trusted seafood supplier in the UAE.',
    visionDescription:
      'To become a leading and trusted seafood wholesale supplier in the UAE, known for quality, reliability and customer satisfaction.',
  },
};

// Normalize section aliases (e.g. missionVision -> mission-vision)
const normalizeSectionKey = (key = '') => {
  const clean = key.toLowerCase().replace(/_/g, '-');
  if (clean === 'mission' || clean === 'missionvision' || clean === 'mission-vision') {
    return 'mission-vision';
  }
  return clean;
};

/**
 * @desc    Get all website settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getAllSettings = async (req, res, next) => {
  try {
    const settingsDocs = await Setting.find({});
    const response = { ...DEFAULT_SETTINGS };

    settingsDocs.forEach((doc) => {
      response[doc.key] = doc.data;
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific section setting (general, hero, about)
 * @route   GET /api/settings/:section
 * @access  Public
 */
export const getSectionSetting = async (req, res, next) => {
  try {
    const rawSection = req.params.section;
    const section = normalizeSectionKey(rawSection);
    const doc = await Setting.findOne({ key: section });

    const data = doc ? doc.data : DEFAULT_SETTINGS[section] || {};

    res.status(200).json({
      success: true,
      section,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update specific section setting
 * @route   PUT /api/settings/:section
 * @access  Private/Admin
 */
export const updateSectionSetting = async (req, res, next) => {
  try {
    const rawSection = req.params.section;
    const section = normalizeSectionKey(rawSection);
    const incomingData = req.body;

    const doc = await Setting.findOneAndUpdate(
      { key: section },
      { data: incomingData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`,
      data: doc.data,
    });
  } catch (error) {
    next(error);
  }
};
