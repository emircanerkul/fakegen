const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');
const sharp = require('sharp');

// Try to load optional dependencies
let ffmpeg;
let ffmpegPath;
try {
  ffmpeg = require('fluent-ffmpeg');
  ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  ffmpeg.setFfmpegPath(ffmpegPath);
} catch (error) {
  ffmpeg = null;
}

/**
 * Generate a simple video with moving pastel balls
 * @param {Object} options - Video generation options
 * @returns {Promise<Buffer>} Generated video buffer
 */
async function generateSimpleVideo(options = {}) {
  if (!ffmpeg) {
    console.warn('FFmpeg not available. Install optional dependencies: npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg');
    console.warn('For npx usage, you may need to install dependencies globally or use a different approach');

    // Create a placeholder video file for now
    const placeholder = `FFmpeg video generation placeholder: ${JSON.stringify(options)}`;
    return Buffer.from(placeholder);
  }

  const {
    width = 640,
    height = 480,
    duration = 3,
    fps = 30,
    format = 'mp4'
  } = options;

  // Generate pastel colors for balls
  const pastelColors = [
    '#FFB3D9', '#FFE6B3', '#D9FFB3', '#B3FFE6', '#B3D9FF',
    '#E6B3FF', '#FFB3E6', '#FFD9B3', '#E6FFB3', '#B3FFCC'
  ];

  // Create ball objects
  const ballCount = faker.number.int({ min: 3, max: 8 });
  const balls = [];
  for (let i = 0; i < ballCount; i++) {
    balls.push({
      x: faker.number.int({ min: 50, max: width - 50 }),
      y: faker.number.int({ min: 50, max: height - 50 }),
      radius: faker.number.int({ min: 20, max: 50 }),
      color: faker.helpers.arrayElement(pastelColors),
      vx: faker.number.float({ min: -3, max: 3 }),
      vy: faker.number.float({ min: -3, max: 3 })
    });
  }

  // Create temporary directory for frames
  const tempDir = require('os').tmpdir();
  const frameDir = path.join(tempDir, `fakegen_video_${Date.now()}`);

  // Ensure directory exists using fs-extra
  await fs.ensureDir(frameDir);

  // Generate frames as PNG images
  const totalFrames = duration * fps;
  let completedFrames = 0;

  // Generate all frames synchronously to avoid race conditions
  for (let frame = 0; frame < totalFrames; frame++) {
    // Update ball positions with bouncing
    balls.forEach(ball => {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Bounce off walls
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.vx = -ball.vx;
      }
      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.vy = -ball.vy;
      }
    });

    // Generate frame as SVG using Sharp
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    // White background
    svgContent += `<rect width="100%" height="100%" fill="#FFFFFF" />`;

    // Draw balls
    balls.forEach(ball => {
      svgContent += `<circle cx="${ball.x}" cy="${ball.y}" r="${ball.radius}" fill="${ball.color}" opacity="0.8" />`;
    });

    svgContent += '</svg>';

    try {
      // Convert SVG to PNG using Sharp synchronously
      const framePath = path.join(frameDir, `frame_${frame.toString().padStart(4, '0')}.png`);
      const buffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();

      await fs.writeFile(framePath, buffer);
      completedFrames++;
    } catch (err) {
      console.error('Error generating frame:', err);
      throw err; // Re-throw to stop generation on critical errors
    }
  }

  // Use FFmpeg to create video from frames
  const outputPath = path.join(tempDir, `output_${Date.now()}.${format}`);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(frameDir, 'frame_%04d.png'))
      .inputFPS(fps)
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-preset ultrafast',
        '-crf 18',
        '-vf scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:(ow-iw)/2:(oh-ih)/2',
        '-movflags +faststart'
      ])
      .outputFPS(fps)
      .duration(duration)
      .save(outputPath)
      .on('end', () => {
        try {
          // Read the generated video file
          const videoBuffer = fs.readFileSync(outputPath);
          resolve(videoBuffer);
        } catch (readErr) {
          reject(readErr);
        } finally {
          // Clean up temporary files
          try {
            fs.rmSync(frameDir, { recursive: true, force: true });
            fs.unlinkSync(outputPath);
          } catch (err) {
            console.warn('Could not clean up temporary files:', err.message);
          }
        }
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err.message);

        // Clean up temporary files
        try {
          fs.rmSync(frameDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.warn('Could not clean up temporary files:', cleanupErr.message);
        }

        reject(err);
      });
  });
}

/**
 * Generate videos for all specified formats
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateVideos(config, outputDir) {
  if (!config.videos || !config.videos.enabled) {
    return;
  }

  if (!ffmpeg) {
    console.warn('Video generation skipped: FFmpeg dependencies not installed. Run: npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg');
    return;
  }

  console.log('Generating videos...');
  const videoDir = path.join(outputDir, 'video');
  await fs.ensureDir(videoDir);

  const count = config.videos.count || 5;

  for (let i = 0; i < count; i++) {
    for (const format of config.videos.formats) {
      try {
        const videoBuffer = await generateSimpleVideo({
          width: config.videos.width,
          height: config.videos.height,
          duration: config.videos.duration,
          fps: config.videos.fps,
          format
        });

        const filename = `animation_${i + 1}`;
        const filepath = path.join(videoDir, `${filename}.${format}`);

        // Save the actual video file
        await fs.writeFile(filepath, videoBuffer);

        console.log(`Generated video: ${filepath}`);

      } catch (error) {
        console.error(`Error generating video ${format}:`, error.message);
      }
    }
  }

  console.log('Video generation completed!');
}

module.exports = {
  generateSimpleVideo,
  generateVideos
};
