/**
 * Favorite Image Sizes Configuration
 * Research-based favorite sizes for modern web development
 */

/**
 * Favorite image sizes based on usage patterns and modern web development needs
 */
const FAVORITE_IMAGE_SIZES = {
  'most-used': {
    description: 'Most frequently used sizes in web development',
    enabled: true,
    priority: 'high',
    sizes: [
      { width: 320, height: 240, name: 'web-small', usage: 'mobile-first' },
      { width: 640, height: 480, name: 'web-medium', usage: 'responsive' },
      { width: 1920, height: 1080, name: 'web-large', usage: 'desktop' },
      { width: 1080, height: 1080, name: 'social-square', usage: 'social-media' },
      { width: 1200, height: 630, name: 'social-landscape', usage: 'og-image' }
    ]
  },
  'developer-favorites': {
    description: 'Commonly requested sizes for prototyping',
    enabled: true,
    priority: 'medium',
    sizes: [
      { width: 400, height: 300, name: 'prototype-small', usage: 'wireframes' },
      { width: 800, height: 600, name: 'prototype-medium', usage: 'mockups' },
      { width: 1024, height: 768, name: 'prototype-large', usage: 'desktop-prototype' },
      { width: 375, height: 667, name: 'mobile-iphone', usage: 'mobile-testing' },
      { width: 414, height: 896, name: 'mobile-plus', usage: 'large-mobile' }
    ]
  },
  'modern-standards': {
    description: 'Modern display standards and high-DPI screens',
    enabled: true,
    priority: 'medium',
    sizes: [
      { width: 1280, height: 720, name: 'hd-standard', usage: 'hd-displays' },
      { width: 2560, height: 1440, name: 'qhd-standard', usage: 'high-dpi' },
      { width: 3840, height: 2160, name: 'uhd-4k', usage: '4k-displays' }
    ]
  },
  'social-media-optimized': {
    description: 'Optimized sizes for social media platforms',
    enabled: false, // Disabled by default, can be enabled by users
    priority: 'low',
    sizes: [
      { width: 1080, height: 1920, name: 'instagram-story', usage: 'vertical-story' },
      { width: 1024, height: 512, name: 'twitter-header', usage: 'cover-image' },
      { width: 828, height: 1792, name: 'mobile-story', usage: 'mobile-vertical' },
      { width: 1200, height: 675, name: 'youtube-thumbnail', usage: 'video-preview' }
    ]
  }
};

/**
 * Usage categories for organizing favorite sizes
 */
const USAGE_CATEGORIES = {
  'mobile-first': 'Mobile-first responsive design',
  'responsive': 'Responsive web design breakpoints',
  'desktop': 'Desktop and large screen displays',
  'social-media': 'Social media platform requirements',
  'og-image': 'Open Graph social sharing images',
  'wireframes': 'Wireframe and early prototype work',
  'mockups': 'Design mockups and presentations',
  'desktop-prototype': 'Desktop application prototyping',
  'mobile-testing': 'Mobile device testing scenarios',
  'large-mobile': 'Large mobile device screens',
  'hd-displays': 'High definition display standards',
  'high-dpi': 'High DPI and retina displays',
  '4k-displays': '4K and ultra-high resolution',
  'vertical-story': 'Vertical story format content',
  'cover-image': 'Cover and header images',
  'mobile-vertical': 'Mobile vertical content',
  'video-preview': 'Video thumbnail and preview'
};

/**
 * Get all favorite size collections
 * @returns {Object} All favorite size collections
 */
function getFavoriteSizes() {
  return FAVORITE_IMAGE_SIZES;
}

/**
 * Get enabled favorite size collections
 * @returns {Object} Enabled favorite size collections
 */
function getEnabledFavoriteSizes() {
  const enabled = {};
  Object.entries(FAVORITE_IMAGE_SIZES).forEach(([key, collection]) => {
    if (collection.enabled) {
      enabled[key] = collection;
    }
  });
  return enabled;
}

/**
 * Get favorite sizes by priority level
 * @param {string} priority - Priority level ('high', 'medium', 'low')
 * @returns {Object} Favorite size collections matching priority
 */
function getFavoritesByPriority(priority) {
  const filtered = {};
  Object.entries(FAVORITE_IMAGE_SIZES).forEach(([key, collection]) => {
    if (collection.priority === priority && collection.enabled) {
      filtered[key] = collection;
    }
  });
  return filtered;
}

/**
 * Get all favorite sizes as a flat array
 * @param {boolean} enabledOnly - Only return enabled collections
 * @returns {Array<Object>} Flat array of all favorite sizes
 */
function getFlatFavoriteSizes(enabledOnly = true) {
  const collections = enabledOnly ? getEnabledFavoriteSizes() : FAVORITE_IMAGE_SIZES;
  const flatSizes = [];
  
  Object.values(collections).forEach(collection => {
    flatSizes.push(...collection.sizes);
  });
  
  return flatSizes;
}

/**
 * Get favorite sizes by usage category
 * @param {string} usage - Usage category
 * @returns {Array<Object>} Sizes matching the usage category
 */
function getFavoritesByUsage(usage) {
  const matching = [];
  
  Object.values(getEnabledFavoriteSizes()).forEach(collection => {
    collection.sizes.forEach(size => {
      if (size.usage === usage) {
        matching.push(size);
      }
    });
  });
  
  return matching;
}

/**
 * Get high priority favorite sizes (most commonly used)
 * @returns {Array<Object>} High priority favorite sizes
 */
function getHighPriorityFavorites() {
  return getFlatFavoriteSizes().filter(size => {
    // Find the collection this size belongs to
    for (const collection of Object.values(getEnabledFavoriteSizes())) {
      if (collection.sizes.includes(size) && collection.priority === 'high') {
        return true;
      }
    }
    return false;
  });
}

/**
 * Get usage categories reference
 * @returns {Object} Usage categories with descriptions
 */
function getUsageCategories() {
  return USAGE_CATEGORIES;
}

/**
 * Check if a size matches any favorite size
 * @param {number} width - Width to check
 * @param {number} height - Height to check
 * @returns {Object|null} Matching favorite size or null
 */
function findMatchingFavorite(width, height) {
  const allFavorites = getFlatFavoriteSizes();
  return allFavorites.find(size => size.width === width && size.height === height) || null;
}

/**
 * Get favorite sizes configuration for integration with image config
 * @returns {Object} Configuration object for image generation
 */
function getFavoriteSizesConfig() {
  return {
    'favorite-sizes': getFavoriteSizes(),
    'use-favorites-first': true,
    'priority-order': ['high', 'medium', 'low'],
    'max-favorites-per-generation': 10,
    'usage-categories': getUsageCategories()
  };
}

module.exports = {
  FAVORITE_IMAGE_SIZES,
  USAGE_CATEGORIES,
  getFavoriteSizes,
  getEnabledFavoriteSizes,
  getFavoritesByPriority,
  getFlatFavoriteSizes,
  getFavoritesByUsage,
  getHighPriorityFavorites,
  getUsageCategories,
  findMatchingFavorite,
  getFavoriteSizesConfig
};