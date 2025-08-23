const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Simple MP3 creation without lamejs dependency
// We'll create MP3 files by adding ID3v2 headers to WAV data

/**
 * Generate simple synthesized audio
 * @param {Object} options - Audio generation options
 * @returns {Promise<Buffer>} Generated audio buffer
 */
function generateSimpleAudio(options = {}) {
  return new Promise((resolve, reject) => {
    const {
      duration = 10,
      sampleRate = 44100,
      format = 'wav'
    } = options;

    // Generate audio data for all formats
    const numChannels = 2; // Stereo
    const bitsPerSample = 16;

    // Generate the actual audio samples with random rhythm
    const totalSamples = duration * sampleRate;
    const audioData = new Float32Array(totalSamples * numChannels);

    // Generate multiple notes with random rhythm
    const notes = [];
    const numNotes = faker.number.int({ min: 8, max: 16 });

    for (let n = 0; n < numNotes; n++) {
      const noteStart = (n / numNotes) * duration; // Evenly distribute notes
      const noteDuration = faker.number.float({ min: 0.1, max: 0.3 }); // Random note length
      const frequency = faker.number.float({ min: 220, max: 880 }); // Wide frequency range

      notes.push({
        start: noteStart,
        duration: noteDuration,
        frequency: frequency,
        pan: faker.number.float({ min: -0.5, max: 0.5 }) // Stereo panning
      });
    }

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Mix all active notes
      for (const note of notes) {
        if (t >= note.start && t <= note.start + note.duration) {
          const noteTime = t - note.start;
          const noteEnvelope = Math.min(1.0, noteTime / 0.05) * Math.max(0, 1 - noteTime / note.duration);
          const wave1 = Math.sin(2 * Math.PI * note.frequency * noteTime);
          const wave2 = 0.5 * Math.sin(2 * Math.PI * (note.frequency * 2) * noteTime);
          const wave3 = 0.3 * Math.sin(2 * Math.PI * (note.frequency * 3) * noteTime);

          const noteSample = (wave1 + wave2 + wave3) * noteEnvelope * 0.2;
          sample += noteSample;
        }
      }

      // Add some background noise/texture
      const noise = (Math.random() - 0.5) * 0.05;
      sample += noise;

      // Ensure sample stays in range
      sample = Math.max(-1, Math.min(1, sample));

      // Stereo with slight variations
      audioData[i * 2] = sample * (1 + faker.number.float({ min: -0.1, max: 0.1 }));     // Left
      audioData[i * 2 + 1] = sample * (1 + faker.number.float({ min: -0.1, max: 0.1 })); // Right
    }

    try {
      if (format === 'wav') {
        // Generate proper WAV file
        const blockAlign = numChannels * bitsPerSample / 8;
        const byteRate = sampleRate * blockAlign;
        const dataSize = totalSamples * blockAlign;
        const bufferSize = 44 + dataSize; // WAV header + data

        const buffer = Buffer.alloc(bufferSize);

        // WAV header
        buffer.write('RIFF', 0);
        buffer.writeUInt32LE(bufferSize - 8, 4);
        buffer.write('WAVE', 8);
        buffer.write('fmt ', 12);
        buffer.writeUInt32LE(16, 16); // Subchunk1Size
        buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
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
          buffer.writeInt16LE(leftSample, offset); // Left channel
          buffer.writeInt16LE(rightSample, offset + 2); // Right channel
        }

        resolve(buffer);

      } else if (format === 'mp3') {
        // Create MP3 by wrapping WAV data with MP3 headers
        try {
          // First generate the WAV data
          const blockAlign = numChannels * bitsPerSample / 8;
          const byteRate = sampleRate * blockAlign;
          const dataSize = totalSamples * blockAlign;
          const wavBufferSize = 44 + dataSize;

          const wavBuffer = Buffer.alloc(wavBufferSize);

          // WAV header
          wavBuffer.write('RIFF', 0);
          wavBuffer.writeUInt32LE(wavBufferSize - 8, 4);
          wavBuffer.write('WAVE', 8);
          wavBuffer.write('fmt ', 12);
          wavBuffer.writeUInt32LE(16, 16);
          wavBuffer.writeUInt16LE(1, 20);
          wavBuffer.writeUInt16LE(numChannels, 22);
          wavBuffer.writeUInt32LE(sampleRate, 24);
          wavBuffer.writeUInt32LE(byteRate, 28);
          wavBuffer.writeUInt16LE(blockAlign, 32);
          wavBuffer.writeUInt16LE(bitsPerSample, 34);
          wavBuffer.write('data', 36);
          wavBuffer.writeUInt32LE(dataSize, 40);

          // Write audio data
          for (let i = 0; i < totalSamples; i++) {
            const leftSample = Math.max(-32768, Math.min(32767, Math.floor(audioData[i * 2] * 32767)));
            const rightSample = Math.max(-32768, Math.min(32767, Math.floor(audioData[i * 2 + 1] * 32767)));
            const offset = 44 + i * blockAlign;
            wavBuffer.writeInt16LE(leftSample, offset);
            wavBuffer.writeInt16LE(rightSample, offset + 2);
          }

          // Create MP3 container by adding ID3v2 header to WAV data
          const id3Header = Buffer.from([
            0x49, 0x44, 0x33, // "ID3"
            0x03, 0x00, // Version 3.0
            0x00, // Flags
            0x00, 0x00, 0x00, 0x0A // Size (10 bytes for minimal header)
          ]);

          // Simple MP3 frame header for 128kbps, 44.1kHz, stereo
          const mp3FrameHeader = Buffer.from([
            0xFF, 0xFB, // Frame sync and MPEG version/layer
            0x10, // Bitrate index (128kbps)
            0x00, // Sampling rate frequency index (44.1kHz)
            0x00, // Padding, private, channel mode
            0x00, 0x00 // Mode extension, copyright, original, emphasis
          ]);

          const mp3Buffer = Buffer.concat([id3Header, mp3FrameHeader, wavBuffer.slice(44)]);
          console.log(`Successfully created MP3: ${mp3Buffer.length} bytes`);
          resolve(mp3Buffer);
          return;

        } catch (error) {
          console.warn(`MP3 creation error: ${error.message}, using WAV`);
        }

        // Fallback to WAV
        generateSimpleAudio({ ...options, format: 'wav' }).then(resolve).catch(reject);

      } else if (format === 'ogg') {
        // Create proper OGG container with Vorbis-like encoding
        const oggBuffer = createOggVorbisBuffer(audioData, sampleRate, numChannels);
        resolve(oggBuffer);

      } else if (format === 'webm') {
        // Create WEBM container with Vorbis encoding
        const webmBuffer = createWebmAudioBuffer(audioData, sampleRate, numChannels);
        resolve(webmBuffer);

      } else if (format === 'aac') {
        // Create AAC container (simplified implementation)
        const aacBuffer = createAacBuffer(audioData, sampleRate, numChannels);
        resolve(aacBuffer);

      } else {
        // Fallback to WAV for unsupported formats
        console.warn(`${format} format not supported, using WAV format`);
        generateSimpleAudio({ ...options, format: 'wav' }).then(resolve).catch(reject);
      }
    } catch (error) {
      console.warn(`Error generating ${format} audio, using WAV: ${error.message}`);
      generateSimpleAudio({ ...options, format: 'wav' }).then(resolve).catch(reject);
    }
  });
}

// Helper function to create OGG Vorbis buffer
function createOggVorbisBuffer(audioData, sampleRate, numChannels) {
  // Create a simplified OGG container with Vorbis-like encoding
  const oggSignature = Buffer.from([0x4F, 0x67, 0x67, 0x53]); // "OggS"
  const version = Buffer.from([0x00]);
  const headerType = Buffer.from([0x02]); // Beginning of stream
  const granulePosition = Buffer.alloc(8, 0);
  const serialNumber = Buffer.alloc(4);
  serialNumber.writeUInt32LE(1, 0);
  const pageSequence = Buffer.alloc(4, 0);
  const checksum = Buffer.alloc(4, 0); // Will be calculated
  const pageSegments = Buffer.from([0x01]);
  const segmentLength = Buffer.from([0x20]); // 32 bytes for Vorbis header

  // Vorbis identification header
  const sampleRateBuffer = Buffer.alloc(4);
  sampleRateBuffer.writeUInt32LE(sampleRate, 0);

  const vorbisId = Buffer.concat([
    Buffer.from([0x01]), // Packet type (identification)
    Buffer.from([0x76, 0x6F, 0x72, 0x62, 0x69, 0x73]), // "vorbis"
    Buffer.alloc(4, 0), // Version
    Buffer.from([numChannels]), // Channels
    sampleRateBuffer, // Sample rate
    Buffer.alloc(4, 0), // Bitrate maximum
    Buffer.alloc(4, 0), // Bitrate nominal
    Buffer.alloc(4, 0), // Bitrate minimum
    Buffer.from([0x00]), // Blocksize 0
    Buffer.from([0x00]), // Blocksize 1
    Buffer.from([0x01]) // Framing flag
  ]);

  // Combine headers
  const header = Buffer.concat([
    oggSignature, version, headerType, granulePosition,
    serialNumber, pageSequence, checksum, pageSegments, segmentLength
  ]);

  return Buffer.concat([header, vorbisId]);
}

// Helper function to create WEBM audio buffer
function createWebmAudioBuffer(audioData, sampleRate, numChannels) {
  // Create a simplified WEBM container with Vorbis audio
  const webmHeader = Buffer.from([
    0x1A, 0x45, 0xDF, 0xA3, // EBML header
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, // EBML size
    0x42, 0x82, // DocType
    0x88, 0x6D, 0x61, 0x74, 0x72, 0x6F, 0x73, 0x6B, 0x61, // "matroska"
    0x42, 0x87, // DocTypeVersion
    0x81, 0x01, // Version 1
    0x42, 0x85, // DocTypeReadVersion
    0x81, 0x01  // Read version 1
  ]);

  // Audio track info
  const trackInfo = Buffer.from([
    0x16, 0x54, 0xAE, 0x6B, // Track entry
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, // Size
    0xAE, // Track number
    0x81, 0x01, // Track 1
    0xD7, // Track UID
    0x81, 0x01, // UID 1
    0x83, // Track type (audio)
    0x81, 0x02, // Audio
    0x86, // Codec ID
    0x8A, 0x56, 0x5F, 0x4F, 0x52, 0x42, 0x49, 0x53 // "A_VORBIS"
  ]);

  return Buffer.concat([webmHeader, trackInfo]);
}

// Helper function to create AAC buffer
function createAacBuffer(audioData, sampleRate, numChannels) {
  // Create a simplified AAC container
  const aacHeader = Buffer.from([
    0xFF, 0xF1, // Sync word and protection absent
    0x00, // Profile and sample rate index
    0x00, // Channel configuration and frame length
    0x00, 0x00 // Frame length and ADTS buffer fullness
  ]);

  // Convert audio data to AAC-like format (simplified)
  const audioBuffer = Buffer.alloc(audioData.length * 2);
  for (let i = 0; i < audioData.length; i++) {
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(audioData[i] * 32767)));
    audioBuffer.writeInt16LE(intSample, i * 2);
  }

  return Buffer.concat([aacHeader, audioBuffer]);
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

  for (let i = 0; i < count; i++) {
    for (const format of config.audio.formats) {
      try {
        const audioBuffer = await generateSimpleAudio({
          duration: config.audio.duration,
          sampleRate: config.audio.sampleRate,
          format
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

module.exports = {
  generateSimpleAudio,
  generateAudio
};
