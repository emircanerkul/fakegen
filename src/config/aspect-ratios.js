/**
 * Standard aspect ratios configuration
 * Following industry standards for common use cases
 */

const ASPECT_RATIOS = {
  '1:1': {
    ratio: [1, 1],
    name: 'square',
    description: 'Perfect for avatars, thumbnails, and social media profile images',
    commonUses: ['avatars', 'thumbnails', 'social-media-profiles', 'app-icons']
  },
  '4:3': {
    ratio: [4, 3],
    name: 'traditional',
    description: 'Classic photography and presentation format',
    commonUses: ['presentations', 'classic-photography', 'older-monitors']
  },
  '3:2': {
    ratio: [3, 2],
    name: 'classic-photo',
    description: 'Traditional photo print format',
    commonUses: ['photo-prints', 'dslr-photography', 'classic-frames']
  },
  '16:10': {
    ratio: [16, 10],
    name: 'widescreen',
    description: 'Computer monitor and laptop screen format',
    commonUses: ['computer-monitors', 'laptops', 'tablets']
  },
  '16:9': {
    ratio: [16, 9],
    name: 'modern-widescreen',
    description: 'Modern display standard for HD content',
    commonUses: ['hd-video', 'modern-monitors', 'tv-screens', 'youtube-thumbnails']
  },
  '21:9': {
    ratio: [21, 9],
    name: 'ultra-wide',
    description: 'Ultra-wide monitor and cinematic format',
    commonUses: ['ultra-wide-monitors', 'cinematic-content', 'banners']
  },
  '9:16': {
    ratio: [9, 16],
    name: 'mobile-portrait',
    description: 'Mobile phone portrait orientation',
    commonUses: ['mobile-apps', 'instagram-stories', 'tiktok-videos', 'phone-wallpapers']
  }
};

/**
 * Get all available aspect ratios
 * @returns {Object} All aspect ratios with metadata
 */
function getAllAspectRatios() {
  return ASPECT_RATIOS;
}

/**
 * Get aspect ratio by key
 * @param {string} key - Aspect ratio key (e.g., '16:9')
 * @returns {Object|null} Aspect ratio object or null if not found
 */
function getAspectRatio(key) {
  return ASPECT_RATIOS[key] || null;
}

/**
 * Get aspect ratios by name
 * @param {string} name - Aspect ratio name (e.g., 'square')
 * @returns {Object|null} Aspect ratio object or null if not found
 */
function getAspectRatioByName(name) {
  const entry = Object.entries(ASPECT_RATIOS).find(([, config]) => config.name === name);
  return entry ? { key: entry[0], ...entry[1] } : null;
}

/**
 * Calculate dimensions for a given aspect ratio and base width
 * @param {string} aspectRatioKey - Aspect ratio key (e.g., '16:9')
 * @param {number} width - Base width
 * @returns {Object} Object with width and height
 */
function calculateDimensions(aspectRatioKey, width) {
  const aspectRatio = getAspectRatio(aspectRatioKey);
  if (!aspectRatio) {
    throw new Error(`Unknown aspect ratio: ${aspectRatioKey}`);
  }

  const [ratioWidth, ratioHeight] = aspectRatio.ratio;
  const height = Math.round((width * ratioHeight) / ratioWidth);
  
  return { width, height };
}

/**
 * Get default aspect ratios for general use
 * @returns {Array<string>} Array of recommended aspect ratio keys
 */
function getDefaultAspectRatios() {
  return ['1:1', '4:3', '16:9', '21:9', '9:16'];
}

module.exports = {
  ASPECT_RATIOS,
  getAllAspectRatios,
  getAspectRatio,
  getAspectRatioByName,
  calculateDimensions,
  getDefaultAspectRatios
};