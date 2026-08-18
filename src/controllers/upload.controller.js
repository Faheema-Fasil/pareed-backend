/**
 * @desc    Upload single image
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export const uploadImage = (req, res, next) => {
  try {
    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (!file) {
      res.status(400);
      throw new Error('Please select an image file to upload');
    }

    const imageUrl = `/uploads/${file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: file.filename,
    });
  } catch (error) {
    next(error);
  }
};
