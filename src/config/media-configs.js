/**
 * Media generation configurations
 * Covers images, favicons, programming codes, videos, and audio
 */

const { getDefaultAspectRatios } = require('./aspect-ratios');
const { getBaseSizes, getFaviconSizes } = require('./image-sizes');
const { getFavoriteSizesConfig } = require('./favorite-sizes');

/**
 * Image generation configuration
 */
const IMAGE_CONFIG = {
  enabled: true,
  count: 20, // Increased to accommodate favorites
  formats: ['jpg', 'png', 'webp', 'svg'], // All supported formats
  'aspect-ratios': getDefaultAspectRatios(),
  'base-sizes': getBaseSizes('medium'), // [320, 400, 480, 512, 600, 640]
  'generate-sizes': true,
  ...getFavoriteSizesConfig(), // Integrate favorite sizes configuration
  'quality-settings': {
    jpg: { quality: 90, progressive: true, description: 'High quality JPEG with progressive encoding' },
    png: { compressionLevel: 6, description: 'Balanced PNG compression' },
    webp: { quality: 90, effort: 4, description: 'High quality WebP with good compression' },
    avif: { quality: 80, effort: 4, description: 'Modern AVIF format with excellent compression' },
    svg: { precision: 2, description: 'Scalable vector graphics with 2 decimal precision' }
  },
  'image-types': {
    abstract: {
      enabled: true,
      description: 'Procedurally generated abstract art images'
    },
    checkerboard: {
      enabled: true,
      description: 'Colorful checkerboard pattern images'
    },
    gradient: {
      enabled: true,
      description: 'Smooth gradient background images'
    },
    geometric: {
      enabled: true,
      description: 'Geometric pattern-based images'
    }
  },
  presets: {
    square: {
      enabled: true,
      sizes: {
        thumbnails: [[150, 150], [200, 200], [250, 250]],
        medium: [[512, 512], [800, 800]],
        large: [[1024, 1024], [2048, 2048]]
      }
    },
    traditional: {
      enabled: true,
      sizes: {
        small: [[320, 240], [640, 480]],
        medium: [[800, 600], [1024, 768]],
        large: [[1600, 1200], [2048, 1536]]
      }
    },
    widescreen: {
      enabled: true,
      sizes: {
        hd: [[1280, 720], [1920, 1080]],
        '4k': [[3840, 2160]],
        mobile: [[854, 480]]
      }
    },
    'ultra-wide': {
      enabled: true,
      sizes: {
        standard: [[2560, 1080], [3440, 1440]],
        '4k': [[5120, 2160]]
      }
    },
    'mobile-portrait': {
      enabled: true,
      sizes: {
        standard: [[375, 667], [414, 896], [390, 844]]
      }
    }
  }
};

/**
 * Favicon generation configuration
 */
const FAVICON_CONFIG = {
  enabled: true,
  'preset-groups': {
    'standard-sizes': [16, 32, 48],
    'high-res': [128, 256, 512],
    'apple-touch': [180, 192],
    'android-chrome': [192, 512],
    'ms-tile': [144, 270, 558]
  },
  formats: ['png', 'ico', 'svg'], // All supported favicon formats
  sizes: getFaviconSizes().map(size => size.width), // [16, 32, 48, 64, 128, 180, 192, 256, 512]
  'format-specific': {
    ico: { sizes: [16, 32, 48], description: 'Classic ICO format for browser compatibility' },
    png: { sizes: [32, 96, 192, 512], description: 'PNG format for modern browsers and devices' },
    svg: { vectorized: true, description: 'Scalable vector format for any resolution' }
  }
};

/**
 * Programming code generation configuration
 */
const PROGRAMMING_CONFIG = {
  enabled: true,
  count: 5,
  'language-groups': {
    'web-languages': ['js', 'ts', 'html', 'css', 'scss', 'vue', 'react'],
    backend: ['py', 'java', 'go', 'php', 'rb', 'cs', 'scala'],
    mobile: ['swift', 'kt', 'dart', 'java'],
    systems: ['c', 'cpp', 'rs', 'go', 'asm'],
    scripting: ['sh', 'ps1', 'py', 'rb', 'pl'],
    data: ['sql', 'r', 'py', 'scala', 'julia'],
    config: ['json', 'yml', 'toml', 'xml', 'ini']
  },
  languages: [
    'js', 'ts', 'py', 'java', 'go', 'php', 'rb', 'cs', 'cpp', 'c',
    'rs', 'swift', 'kt', 'dart', 'html', 'css', 'sql', 'sh'
  ]
};

/**
 * Video generation configuration
 */
const VIDEO_CONFIG = {
  enabled: true, // Enable by default
  count: 2, // Reduce count to manage file size
  duration: 5, // Slightly longer for better demos
  width: 1280,
  height: 720,
  formats: ['mp4', 'mov', 'mkv', 'avi', 'webm', 'mpg', 'mpeg', 'flv'], // All supported formats
  fps: 30,
  'quality-profiles': {
    low: { width: 640, height: 360, fps: 24, bitrate: '500k', description: 'Low quality for testing' },
    standard: { width: 1280, height: 720, fps: 30, bitrate: '2000k', description: 'Standard HD quality' },
    high: { width: 1920, height: 1080, fps: 30, bitrate: '5000k', description: 'High definition quality' },
    '4k': { width: 3840, height: 2160, fps: 30, bitrate: '15000k', description: 'Ultra high definition' }
  },
  'codec-options': {
    h264: { profile: 'high', level: '4.0', description: 'H.264 for maximum compatibility' },
    h265: { profile: 'main', level: '5.0', description: 'H.265 for better compression' },
    vp9: { profile: '0', description: 'VP9 for web streaming' }
  }
};

/**
 * Audio generation configuration
 */
const AUDIO_CONFIG = {
  enabled: true, // Enable by default
  count: 3, // Reasonable count
  duration: 8, // Good length for testing
  'sample-rate': 44100,
  formats: ['wav', 'mp3', 'ogg', 'aac', 'flac', 'webm'], // All supported formats
  'quality-profiles': {
    low: { 'sample-rate': 22050, bitrate: '96k', vorbisQuality: 2, description: 'Low quality for testing' },
    standard: { 'sample-rate': 44100, bitrate: '128k', vorbisQuality: 4, description: 'Standard quality (default)' },
    high: { 'sample-rate': 48000, bitrate: '192k', vorbisQuality: 6, description: 'High quality for production' },
    premium: { 'sample-rate': 96000, bitrate: '320k', vorbisQuality: 8, description: 'Premium quality for mastering' }
  },
  'musical-styles': {
    electronic: { tempo: 120, waveforms: ['square', 'sawtooth'], description: 'Electronic dance music style' },
    ambient: { tempo: 80, waveforms: ['sine', 'triangle'], description: 'Atmospheric ambient soundscapes' },
    organic: { tempo: 100, waveforms: ['sine', 'triangle'], description: 'Natural organic sounds' },
    percussive: { tempo: 140, waveforms: ['noise', 'square'], description: 'Rhythmic percussive patterns' },
    classical: { tempo: 90, waveforms: ['sine', 'triangle'], description: 'Classical orchestral style' },
    jazz: { tempo: 110, waveforms: ['sine', 'sawtooth'], description: 'Jazz improvisation style' }
  }
};

/**
 * Get default media configuration
 * @returns {Object} Complete media configuration
 */
function getDefaultMediaConfig() {
  return {
    images: IMAGE_CONFIG,
    favicons: FAVICON_CONFIG,
    'programming-codes': PROGRAMMING_CONFIG,
    videos: VIDEO_CONFIG,
    audio: AUDIO_CONFIG
  };
}

/**
 * Get image configuration with preset support
 * @returns {Object} Image configuration
 */
function getImageConfig() {
  return IMAGE_CONFIG;
}

/**
 * Get favicon configuration
 * @returns {Object} Favicon configuration
 */
function getFaviconConfig() {
  return FAVICON_CONFIG;
}

/**
 * Get programming code configuration
 * @returns {Object} Programming code configuration
 */
function getProgrammingConfig() {
  return PROGRAMMING_CONFIG;
}

/**
 * Get video configuration
 * @returns {Object} Video configuration
 */
function getVideoConfig() {
  return VIDEO_CONFIG;
}

/**
 * Get audio configuration
 * @returns {Object} Audio configuration
 */
function getAudioConfig() {
  return AUDIO_CONFIG;
}



module.exports = {
  IMAGE_CONFIG,
  FAVICON_CONFIG,
  PROGRAMMING_CONFIG,
  VIDEO_CONFIG,
  AUDIO_CONFIG,
  getDefaultMediaConfig,
  getImageConfig,
  getFaviconConfig,
  getProgrammingConfig,
  getVideoConfig,
  getAudioConfig
};
