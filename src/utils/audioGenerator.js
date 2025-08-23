const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Load optional audio dependencies
let lamejs = null;
let wavEncoder = null;
let ffmpeg = null;
let ffmpegPath = null;

try {
  lamejs = require('lamejs');
} catch (e) {
  console.warn('LameJS not available - MP3 encoding disabled');
}

try {
  wavEncoder = require('wav-encoder');
} catch (e) {
  console.warn('WAV encoder not available - using fallback');
}

try {
  ffmpeg = require('fluent-ffmpeg');
  ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  ffmpeg.setFfmpegPath(ffmpegPath);
} catch (e) {
  console.warn('FFmpeg not available - some formats disabled');
}

/**
 * Audio quality profiles for different use cases
 */
const AUDIO_QUALITY_PROFILES = {
  low: {
    sampleRate: 22050,
    bitrate: '96k',
    vorbisQuality: 2,
    description: 'Low quality for testing'
  },
  standard: {
    sampleRate: 44100,
    bitrate: '128k',
    vorbisQuality: 4,
    description: 'Standard quality (default)'
  },
  high: {
    sampleRate: 48000,
    bitrate: '192k',
    vorbisQuality: 6,
    description: 'High quality for production'
  },
  premium: {
    sampleRate: 96000,
    bitrate: '320k',
    vorbisQuality: 8,
    description: 'Premium quality for mastering'
  }
};

/**
 * Get quality profile settings
 * @param {string} profileName - Profile name (low, standard, high, premium)
 * @returns {Object} Quality settings
 */
function getQualityProfile(profileName = 'standard') {
  return AUDIO_QUALITY_PROFILES[profileName] || AUDIO_QUALITY_PROFILES.standard;
}

/**
 * Get musical style configuration
 * @param {string} style - Musical style (electronic, organic, ambient, percussive)
 * @returns {Object} Style parameters
 */
function getMusicalStyle(style = null) {
  const styles = {
    electronic: {
      tempo: 128,
      scale: [1, 9/8, 5/4, 3/2, 7/4, 2], // Electronic-friendly intervals
      rhythmPattern: [1, 0, 1, 0, 1, 0, 1, 1], // Strong electronic beat
      waveShape: 'square',
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.3 }
    },
    organic: {
      tempo: 100,
      scale: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2], // Natural major scale
      rhythmPattern: [1, 0, 0.5, 0, 1, 0, 0.7, 0], // More natural rhythm
      waveShape: 'sine',
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.4 }
    },
    ambient: {
      tempo: 60,
      scale: [1, 6/5, 4/3, 3/2, 8/5, 2], // Minor pentatonic
      rhythmPattern: [1, 0, 0, 0, 0.6, 0, 0, 0], // Sparse, atmospheric
      waveShape: 'sine',
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 1.0 }
    },
    percussive: {
      tempo: 140,
      scale: [1, 1.1, 1.2, 1.3, 1.4, 1.5], // Percussive frequency ratios
      rhythmPattern: [1, 1, 0, 1, 1, 0, 1, 0], // Strong percussive pattern
      waveShape: 'noise',
      envelope: { attack: 0.001, decay: 0.05, sustain: 0.1, release: 0.1 }
    }
  };
  
  // If no style specified, randomly choose one
  if (!style) {
    const styleNames = Object.keys(styles);
    style = styleNames[Math.floor(Math.random() * styleNames.length)];
  }
  
  return { name: style, ...styles[style] };
}
/**
 * Generate raw audio samples with enhanced synthesis
 * @param {Object} options - Audio generation options
 * @returns {Object} Audio data and metadata
 */
function generateAudioSamples(options = {}) {
  const {
    duration = 10,
    sampleRate = 44100,
    style = null
  } = options;

  const numChannels = 2;
  const totalSamples = duration * sampleRate;
  const audioData = new Float32Array(totalSamples * numChannels);

  // Get musical style configuration
  const musicStyle = getMusicalStyle(style);
  console.log(`🎵 Generating ${musicStyle.name} style audio...`);
  
  const tempo = musicStyle.tempo;
  const beatsPerSecond = tempo / 60;
  const samplesPerBeat = sampleRate / beatsPerSecond;
  
  // Generate scale frequencies
  const baseFreq = 220; // A3
  const scaleFreqs = musicStyle.scale.map(ratio => baseFreq * ratio);
  
  // Fill with silence initially
  audioData.fill(0);
  
  // Create rhythmic pattern based on style
  const rhythmPattern = musicStyle.rhythmPattern;
  const patternLength = rhythmPattern.length;
  
  for (let beat = 0; beat < duration * beatsPerSecond; beat++) {
    const beatStart = beat * samplesPerBeat;
    const beatEnd = Math.min(totalSamples, (beat + 1) * samplesPerBeat);
    
    // Determine if this beat should play based on pattern
    const patternIndex = beat % patternLength;
    const beatIntensity = rhythmPattern[patternIndex];
    
    if (beatIntensity > 0) {
      // Choose note from scale
      const noteIndex = Math.floor(Math.random() * scaleFreqs.length);
      let frequency = scaleFreqs[noteIndex];
      
      // Add some variation for different octaves
      if (Math.random() > 0.7) {
        frequency *= (Math.random() > 0.5 ? 2 : 0.5); // Octave up or down
      }
      
      // Note duration varies by style and pattern
      const baseDuration = 0.8;
      const noteDuration = baseDuration * beatIntensity;
      const noteSamples = Math.floor(noteDuration * samplesPerBeat);
      const noteEnd = Math.min(beatEnd, beatStart + noteSamples);
      
      // Generate the note with style-specific characteristics
      for (let i = beatStart; i < noteEnd; i++) {
        const noteTime = (i - beatStart) / sampleRate;
        const totalNoteTime = noteSamples / sampleRate;
        
        // Apply ADSR envelope from style
        const env = musicStyle.envelope;
        let envelope = 1.0;
        
        if (noteTime < env.attack) {
          envelope = noteTime / env.attack;
        } else if (noteTime < env.attack + env.decay) {
          const decayProgress = (noteTime - env.attack) / env.decay;
          envelope = 1.0 - (1.0 - env.sustain) * decayProgress;
        } else if (noteTime < totalNoteTime - env.release) {
          envelope = env.sustain;
        } else {
          const releaseProgress = (noteTime - (totalNoteTime - env.release)) / env.release;
          envelope = env.sustain * (1.0 - releaseProgress);
        }
        
        // Generate waveform based on style
        let sample = 0;
        
        if (musicStyle.waveShape === 'sine') {
          const fundamental = Math.sin(2 * Math.PI * frequency * noteTime);
          const harmonic2 = 0.4 * Math.sin(2 * Math.PI * frequency * 2 * noteTime);
          const harmonic3 = 0.2 * Math.sin(2 * Math.PI * frequency * 3 * noteTime);
          sample = fundamental + harmonic2 + harmonic3;
        } else if (musicStyle.waveShape === 'square') {
          // Square wave with harmonics
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * noteTime));
          sample += 0.3 * Math.sign(Math.sin(2 * Math.PI * frequency * 3 * noteTime));
          sample += 0.2 * Math.sign(Math.sin(2 * Math.PI * frequency * 5 * noteTime));
        } else if (musicStyle.waveShape === 'noise') {
          // Filtered noise for percussive sounds
          const noise = (Math.random() - 0.5) * 2;
          const filter = Math.sin(2 * Math.PI * frequency * noteTime);
          sample = noise * filter * 0.5;
        }
        
        // Add subtle vibrato for organic styles
        if (musicStyle.name === 'organic') {
          const vibrato = 1 + 0.03 * Math.sin(2 * Math.PI * 4.5 * noteTime);
          sample *= vibrato;
        }
        
        // Apply envelope and intensity
        sample = sample * envelope * beatIntensity * 0.7; // Good volume level
        
        // Stereo effects based on style
        let pan = 0;
        if (musicStyle.name === 'electronic') {
          pan = 0.4 * Math.sin(2 * Math.PI * 0.3 * noteTime); // Electronic stereo movement
        } else if (musicStyle.name === 'ambient') {
          pan = 0.2 * Math.sin(2 * Math.PI * 0.1 * noteTime); // Slow ambient drift
        }
        
        const leftGain = (1 - pan) * 0.7;
        const rightGain = (1 + pan) * 0.7;
        
        const sampleIndex = Math.floor(i);
        if (sampleIndex < totalSamples) {
          audioData[sampleIndex * 2] += sample * leftGain;
          audioData[sampleIndex * 2 + 1] += sample * rightGain;
        }
      }
    }
  }
  
  // Add style-specific background elements
  if (musicStyle.name === 'ambient') {
    // Ambient pad
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const pad = 0.08 * Math.sin(2 * Math.PI * baseFreq * 0.5 * t) * 
                 Math.sin(2 * Math.PI * 0.08 * t);
      audioData[i * 2] += pad;
      audioData[i * 2 + 1] += pad * 0.7;
    }
  } else if (musicStyle.name === 'electronic') {
    // Subtle bass line
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const bass = 0.15 * Math.sin(2 * Math.PI * baseFreq * 0.5 * t);
      if (Math.floor(t * beatsPerSecond) % 4 < 2) { // Play on beats 1-2 of each measure
        audioData[i * 2] += bass;
        audioData[i * 2 + 1] += bass;
      }
    }
  }
  
  // Final limiting to prevent clipping
  let maxValue = 0;
  for (let i = 0; i < audioData.length; i++) {
    maxValue = Math.max(maxValue, Math.abs(audioData[i]));
  }
  
  if (maxValue > 0.95) {
    const limitRatio = 0.95 / maxValue;
    for (let i = 0; i < audioData.length; i++) {
      audioData[i] *= limitRatio;
    }
  }

  return {
    audioData,
    sampleRate,
    numChannels,
    totalSamples,
    musicStyle: musicStyle.name
  };
}

/**
 * Generate WAV format audio buffer
 * @param {Float32Array} audioData - Raw audio samples
 * @param {number} sampleRate - Sample rate
 * @param {number} numChannels - Number of channels
 * @param {number} totalSamples - Total number of samples
 * @returns {Buffer} WAV format buffer
 */
function generateWavBuffer(audioData, sampleRate, numChannels, totalSamples) {
  const bitsPerSample = 16;
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = Buffer.alloc(bufferSize);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(bufferSize - 8, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write audio data
  for (let i = 0; i < totalSamples; i++) {
    const leftSample = Math.max(-32768, Math.min(32767, Math.floor(audioData[i * 2] * 32767)));
    const rightSample = Math.max(-32768, Math.min(32767, Math.floor(audioData[i * 2 + 1] * 32767)));
    const offset = 44 + i * blockAlign;
    buffer.writeInt16LE(leftSample, offset);
    buffer.writeInt16LE(rightSample, offset + 2);
  }

  return buffer;
}

/**
 * Generate MP3 format audio buffer using LameJS
 * @param {Float32Array} audioData - Raw audio samples
 * @param {number} sampleRate - Sample rate
 * @param {number} numChannels - Number of channels
 * @param {number} totalSamples - Total number of samples
 * @returns {Promise<Buffer>} MP3 format buffer
 */
async function generateMp3Buffer(audioData, sampleRate, numChannels, totalSamples) {
  if (!lamejs) {
    throw new Error('LameJS not available for MP3 encoding');
  }

  return new Promise((resolve, reject) => {
    try {
      // Create MP3 encoder - LameJS expects (channels, sampleRate, bitrate)
      const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, 128);
      const mp3Data = [];

      // Convert Float32Array to separate Int16 channel arrays
      const leftSamples = [];
      const rightSamples = [];
      
      for (let i = 0; i < totalSamples; i++) {
        leftSamples.push(Math.floor(audioData[i * 2] * 32767));
        rightSamples.push(Math.floor(audioData[i * 2 + 1] * 32767));
      }

      // Encode in chunks for better performance
      const chunkSize = 1152; // Standard MP3 frame size
      for (let i = 0; i < totalSamples; i += chunkSize) {
        const end = Math.min(i + chunkSize, totalSamples);
        const leftChunk = leftSamples.slice(i, end);
        const rightChunk = rightSamples.slice(i, end);

        const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(Buffer.from(mp3buf));
        }
      }

      // Flush any remaining data
      const finalBuffer = mp3encoder.flush();
      if (finalBuffer.length > 0) {
        mp3Data.push(Buffer.from(finalBuffer));
      }

      const result = Buffer.concat(mp3Data);
      if (result.length === 0) {
        throw new Error('MP3 encoding produced empty buffer');
      }
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate audio using FFmpeg for various formats
 * @param {Float32Array} audioData - Raw audio samples
 * @param {number} sampleRate - Sample rate
 * @param {number} numChannels - Number of channels
 * @param {number} totalSamples - Total number of samples
 * @param {string} format - Output format (mp3, ogg, webm, aac, flac)
 * @param {Object} options - Additional options including quality profile
 * @returns {Promise<Buffer>} Encoded audio buffer
 */
async function generateWithFFmpeg(audioData, sampleRate, numChannels, totalSamples, format, options = {}) {
  if (!ffmpeg) {
    throw new Error('FFmpeg not available for ' + format + ' encoding');
  }

  const quality = getQualityProfile(options.quality || 'standard');
  const targetSampleRate = options.sampleRate || quality.sampleRate;
  const bitrate = options.bitrate || quality.bitrate;

  return new Promise((resolve, reject) => {
    try {
      // First create a temporary WAV file
      const wavBuffer = generateWavBuffer(audioData, sampleRate, numChannels, totalSamples);
      const tempWavPath = path.join(__dirname, `temp_${Date.now()}.wav`);
      const tempOutputPath = path.join(__dirname, `temp_${Date.now()}.${format}`);

      fs.writeFileSync(tempWavPath, wavBuffer);

      // Configure FFmpeg command based on format
      let ffmpegCommand = ffmpeg(tempWavPath);
      
      switch (format) {
        case 'mp3':
          ffmpegCommand
            .audioCodec('libmp3lame')
            .audioBitrate(bitrate)
            .audioChannels(numChannels)
            .audioFrequency(targetSampleRate);
          break;
          
        case 'ogg':
          ffmpegCommand
            .audioCodec('libvorbis')
            .audioQuality(quality.vorbisQuality)
            .audioChannels(numChannels)
            .audioFrequency(targetSampleRate)
            .format('ogg');
          break;
          
        case 'webm':
          ffmpegCommand
            .audioCodec('libopus')
            .audioBitrate(bitrate)
            .audioChannels(numChannels)
            .audioFrequency(targetSampleRate)
            .format('webm');
          break;
          
        case 'aac':
          ffmpegCommand
            .audioCodec('aac')
            .audioBitrate(bitrate)
            .audioChannels(numChannels)
            .audioFrequency(targetSampleRate)
            .format('mp4'); // Use MP4 container for better AAC compatibility
          break;
          
        case 'flac':
          ffmpegCommand
            .audioCodec('flac')
            .audioChannels(numChannels)
            .audioFrequency(targetSampleRate)
            .format('flac');
          break;
          
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      ffmpegCommand
        .output(tempOutputPath)
        .on('start', (commandLine) => {
          console.log(`FFmpeg ${format.toUpperCase()} (${quality.description}):`, commandLine);
        })
        .on('end', () => {
          try {
            const outputBuffer = fs.readFileSync(tempOutputPath);
            // Clean up temp files
            fs.unlinkSync(tempWavPath);
            fs.unlinkSync(tempOutputPath);
            resolve(outputBuffer);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error(`FFmpeg error for ${format}:`, error.message);
          // Clean up temp files on error
          try {
            if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);
            if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
          } catch (cleanupError) {
            console.warn('Cleanup error:', cleanupError.message);
          }
          reject(error);
        })
        .run();
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * Main audio generation function with proper codec support
 * @param {Object} options - Audio generation options
 * @returns {Promise<Buffer>} Generated audio buffer
 */
async function generateSimpleAudio(options = {}) {
  const {
    duration = 10,
    sampleRate = 44100,
    format = 'wav'
  } = options;

  try {
    // Generate raw audio samples
    const audioInfo = generateAudioSamples({ duration, sampleRate });
    const { audioData, numChannels, totalSamples } = audioInfo;

    // Generate audio based on format
    switch (format) {
      case 'wav':
        return generateWavBuffer(audioData, sampleRate, numChannels, totalSamples);
      
      case 'mp3':
      case 'ogg':
      case 'webm':
      case 'aac':
      case 'flac':
        try {
          return await generateWithFFmpeg(audioData, sampleRate, numChannels, totalSamples, format, options);
        } catch (error) {
          console.warn(`${format.toUpperCase()} encoding failed: ${error.message}, falling back to WAV`);
          return generateWavBuffer(audioData, sampleRate, numChannels, totalSamples);
        }
      
      default:
        console.warn(`Unsupported format: ${format}, using WAV`);
        return generateWavBuffer(audioData, sampleRate, numChannels, totalSamples);
    }
  } catch (error) {
    console.error(`Audio generation error: ${error.message}`);
    throw error;
  }
}

/**
 * Generate audio files for all specified formats
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateAudio(config, outputDir) {
  if (!config.audio || !config.audio.enabled) {
    return;
  }

  console.log('Generating audio files...');
  const audioDir = path.join(outputDir, 'audio');
  await fs.ensureDir(audioDir);

  const count = config.audio.count || 5;
  const duration = config.audio.duration || 10;
  const sampleRate = config.audio.sampleRate || 44100;
  const formats = config.audio.formats || ['wav'];
  const quality = config.audio.quality || 'standard';
  const bitrate = config.audio.bitrate;

  console.log(`Audio Quality Profile: ${quality}`);
  if (quality !== 'standard') {
    const profile = getQualityProfile(quality);
    console.log(`  - Sample Rate: ${profile.sampleRate}Hz`);
    console.log(`  - Bitrate: ${profile.bitrate}`);
    console.log(`  - Description: ${profile.description}`);
  }

  for (let i = 0; i < count; i++) {
    for (const format of formats) {
      try {
        const audioBuffer = await generateSimpleAudio({
          duration,
          sampleRate,
          format,
          quality,
          bitrate
        });

        const filename = `synthesized_${i + 1}`;
        const filepath = path.join(audioDir, `${filename}.${format}`);

        await fs.writeFile(filepath, audioBuffer);
        console.log(`Generated audio: ${filepath}`);

      } catch (error) {
        console.error(`Error generating audio ${format}:`, error.message);
      }
    }
  }

  console.log('Audio generation completed!');
}

/**
 * Validate audio buffer format by checking magic bytes
 * @param {Buffer} buffer - Audio buffer to validate
 * @param {string} format - Expected format
 * @returns {boolean} Whether the buffer matches the expected format
 */
function validateAudioFormat(buffer, format) {
  if (!buffer || buffer.length === 0) {
    return false;
  }

  const firstBytes = buffer.slice(0, 12);
  
  switch (format) {
    case 'wav':
      return firstBytes.toString('ascii', 0, 4) === 'RIFF' && 
             firstBytes.toString('ascii', 8, 12) === 'WAVE';
    
    case 'mp3':
      // Check for ID3 tag or MP3 frame sync
      return firstBytes.toString('ascii', 0, 3) === 'ID3' || 
             (firstBytes[0] === 0xFF && (firstBytes[1] & 0xE0) === 0xE0);
    
    case 'ogg':
      return firstBytes.toString('ascii', 0, 4) === 'OggS';
    
    case 'webm':
      return firstBytes[0] === 0x1A && firstBytes[1] === 0x45 && 
             firstBytes[2] === 0xDF && firstBytes[3] === 0xA3;
    
    case 'aac':
    case 'mp4':
      // Check for ftyp box in MP4
      return firstBytes.toString('ascii', 4, 8) === 'ftyp';
    
    case 'flac':
      return firstBytes.toString('ascii', 0, 4) === 'fLaC';
    
    default:
      return true; // Unknown format, assume valid
  }
}

/**
 * Test all supported audio formats
 * @param {Object} options - Test options
 * @returns {Promise<Object>} Test results
 */
async function testAllFormats(options = {}) {
  const formats = ['wav', 'mp3', 'ogg', 'webm', 'aac', 'flac'];
  const testDuration = options.duration || 1;
  const quality = options.quality || 'standard';
  
  console.log(`\n🎵 Testing Audio Format Support (${quality} quality)...`);
  console.log('=' .repeat(60));
  
  const results = {
    passed: [],
    failed: [],
    summary: {}
  };
  
  for (const format of formats) {
    try {
      console.log(`Testing ${format.toUpperCase()}...`);
      const buffer = await generateSimpleAudio({ 
        duration: testDuration, 
        format, 
        quality 
      });
      
      const isValid = validateAudioFormat(buffer, format);
      const size = buffer.length;
      
      if (isValid && size > 0) {
        results.passed.push(format);
        console.log(`  ✅ ${format.toUpperCase()}: ${size} bytes`);
      } else {
        results.failed.push(format);
        console.log(`  ❌ ${format.toUpperCase()}: Invalid format or empty file`);
      }
      
      results.summary[format] = {
        success: isValid && size > 0,
        size,
        valid: isValid
      };
      
    } catch (error) {
      results.failed.push(format);
      results.summary[format] = {
        success: false,
        error: error.message
      };
      console.log(`  ❌ ${format.toUpperCase()}: ${error.message}`);
    }
  }
  
  console.log('=' .repeat(60));
  console.log(`✅ Working formats: ${results.passed.join(', ') || 'none'}`);
  console.log(`❌ Failed formats: ${results.failed.join(', ') || 'none'}`);
  console.log(`📊 Success rate: ${results.passed.length}/${formats.length} (${Math.round(results.passed.length/formats.length*100)}%)`);
  
  return results;
}

module.exports = {
  generateSimpleAudio,
  generateAudio,
  testAllFormats,
  validateAudioFormat,
  getQualityProfile,
  getMusicalStyle,
  AUDIO_QUALITY_PROFILES
};
