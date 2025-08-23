/**
 * Common image sizes configuration
 * Organized by categories and use cases
 */

const IMAGE_SIZES = {
  thumbnails: {
    description: 'Small preview images',
    sizes: [
      { width: 150, height: 150, name: 'thumbnail-small' },
      { width: 200, height: 200, name: 'thumbnail-medium' },
      { width: 250, height: 250, name: 'thumbnail-large' }
    ]
  },
  avatars: {
    description: 'User profile images',
    sizes: [
      { width: 32, height: 32, name: 'avatar-tiny' },
      { width: 64, height: 64, name: 'avatar-small' },
      { width: 128, height: 128, name: 'avatar-medium' },
      { width: 256, height: 256, name: 'avatar-large' }
    ]
  },
  'web-content': {
    description: 'Images for web content',
    sizes: [
      { width: 320, height: 240, name: 'web-small' },
      { width: 640, height: 480, name: 'web-medium' },
      { width: 800, height: 600, name: 'web-large' },
      { width: 1024, height: 768, name: 'web-xl' }
    ]
  },
  'hd-displays': {
    description: 'High definition displays',
    sizes: [
      { width: 1280, height: 720, name: 'hd-720p' },
      { width: 1920, height: 1080, name: 'hd-1080p' },
      { width: 2560, height: 1440, name: 'hd-1440p' },
      { width: 3840, height: 2160, name: 'hd-4k' }
    ]
  },
  'ultra-wide': {
    description: 'Ultra-wide display formats',
    sizes: [
      { width: 2560, height: 1080, name: 'ultrawide-1080p' },
      { width: 3440, height: 1440, name: 'ultrawide-1440p' },
      { width: 5120, height: 2160, name: 'ultrawide-4k' }
    ]
  },
  mobile: {
    description: 'Mobile device screens',
    sizes: [
      { width: 375, height: 667, name: 'mobile-iphone-se' },
      { width: 414, height: 896, name: 'mobile-iphone-11' },
      { width: 390, height: 844, name: 'mobile-iphone-12' },
      { width: 360, height: 640, name: 'mobile-android-small' },
      { width: 412, height: 915, name: 'mobile-android-large' }
    ]
  },
  'social-media': {
    description: 'Social media platform optimized sizes',
    sizes: [
      { width: 1080, height: 1080, name: 'instagram-square' },
      { width: 1080, height: 1920, name: 'instagram-story' },
      { width: 1200, height: 630, name: 'facebook-post' },
      { width: 1024, height: 512, name: 'twitter-header' },
      { width: 1280, height: 720, name: 'youtube-thumbnail' }
    ]
  }
};

/**
 * Base sizes for generating custom dimensions
 * Commonly used widths that work well with aspect ratios
 */
const BASE_SIZES = {
  tiny: [16, 32, 48, 64],
  small: [128, 150, 200, 256],
  medium: [320, 400, 480, 512, 600, 640],
  large: [800, 900, 1024, 1200, 1280],
  xlarge: [1440, 1600, 1920, 2048],
  ultra: [2560, 3200, 3840, 4096, 5120]
};

/**
 * Get all image size categories
 * @returns {Object} All image size categories
 */
function getAllImageSizes() {
  return IMAGE_SIZES;
}

/**
 * Get sizes by category
 * @param {string} category - Category name (e.g., 'thumbnails')
 * @returns {Array|null} Array of size objects or null if not found
 */
function getSizesByCategory(category) {
  return IMAGE_SIZES[category]?.sizes || null;
}

/**
 * Get all categories
 * @returns {Array<string>} Array of category names
 */
function getCategories() {
  return Object.keys(IMAGE_SIZES);
}

/**
 * Get base sizes by group
 * @param {string} group - Size group (e.g., 'small', 'medium')
 * @returns {Array<number>} Array of base sizes
 */
function getBaseSizes(group = 'medium') {
  return BASE_SIZES[group] || BASE_SIZES.medium;
}

/**
 * Get all base sizes flattened
 * @returns {Array<number>} Array of all base sizes
 */
function getAllBaseSizes() {
  return Object.values(BASE_SIZES).flat().sort((a, b) => a - b);
}

/**
 * Get recommended sizes for web development
 * @returns {Array<Object>} Array of recommended size objects
 */
function getRecommendedWebSizes() {
  return [
    ...getSizesByCategory('thumbnails'),
    ...getSizesByCategory('web-content'),
    ...getSizesByCategory('hd-displays').slice(0, 2) // Only include 720p and 1080p
  ];
}

/**
 * Get favicon standard sizes
 * @returns {Array<Object>} Array of favicon size objects
 */
function getFaviconSizes() {
  return [
    { width: 16, height: 16, name: 'favicon-16' },
    { width: 32, height: 32, name: 'favicon-32' },
    { width: 48, height: 48, name: 'favicon-48' },
    { width: 64, height: 64, name: 'favicon-64' },
    { width: 128, height: 128, name: 'favicon-128' },
    { width: 180, height: 180, name: 'apple-touch-icon' },
    { width: 192, height: 192, name: 'android-icon' },
    { width: 256, height: 256, name: 'favicon-256' },
    { width: 512, height: 512, name: 'favicon-512' }
  ];
}

module.exports = {
  IMAGE_SIZES,
  BASE_SIZES,
  getAllImageSizes,
  getSizesByCategory,
  getCategories,
  getBaseSizes,
  getAllBaseSizes,
  getRecommendedWebSizes,
  getFaviconSizes
};