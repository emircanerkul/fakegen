# FakeGen

A powerful CLI tool to generate comprehensive fake data and beautiful abstract images using faker and canvas. Perfect for testing, prototyping, and development purposes.

> **DISCLAIMER:** This project developed with roocode/sonic to solve our annoying problem and demonstrate how well AI models do with good prompting. All prompt history also included, %100 transparent and honest.
> 1. [Initial promt](history/roo_task_aug-22-2025_7-48-26-am.md)
> 2. [Initial promt](history/roo_task_aug-23-2025_7-59-27-am.md)
> 3. [Initial promt](history/roo_task_aug-23-2025_8-35-56-am.md)
> 4. [Initial promt](history/roo_task_aug-23-2025_8-40-46-am.md)

## Features

- **6 Data Formats**: Generate data in JSON, CSV, TXT, YML, TOML, and XML formats
- **5 Data Types**: Users, Products, Orders, BlogPosts, and Numbers with complex nested structures
- **Beautiful Abstract Art**: Generate stunning pastel abstract images with organic shapes and flowing patterns
- **Checkerboard Patterns**: Create colorful checkerboard images with alternating pastel colors
- **4 Image Formats**: Support for JPG, PNG, WebP, and ICO formats
- **15+ Image Sizes**: From 1x1 to 2560x2560 pixels with 7 aspect ratios
- **Favicon Generation**: Generate favicons in multiple sizes (16x16 to 4096x4096) with PNG and ICO formats
- **Programming Code Examples**: Generate example code files for 17+ programming languages
- **Video Generation**: Create 3-second videos with moving pastel balls in 6 formats (mp4, mov, mkv, mpg, mpeg, flv)
- **Audio Generation**: Generate 10-second synthesized audio files in 5 formats (mp3, ogg, wav, webm, aac)
- **Advanced Data Types**: Numbers (ascending/descending), random numbers, SHA keys, UUIDs, and more
- **Advanced Data Structures**: Support for nested objects, arrays, and nested arrays
- **Configuration-Driven**: Use `.fakegen.yml` configuration file for easy customization
- **CLI Interface**: Simple command-line interface with comprehensive options
- **npx Ready**: Can be run via `npx` without installation

## Installation

### Using npx (Recommended)
```bash
npx fakegen
```

### Local Installation
```bash
npm install -g .
```

### Optional Dependencies (for Video & Audio Generation)

To enable video and audio generation features, install the optional dependencies:

```bash
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg audiobuffer-to-wav node-lame wav-encoder ogg
```

These dependencies are large and only needed if you want to generate videos and audio files.

#### For npx Usage

When using `npx fakegen`, the optional dependencies are not available by default. To use video/audio features:

1. **Install globally**: `npm install -g fluent-ffmpeg @ffmpeg-installer/ffmpeg`
2. **Or use local installation**: Install dependencies in your project directory
3. **Or enable in config**: Set `videos.enabled: true` or `audio.enabled: true` and the tool will show installation instructions

The tool will gracefully skip video/audio generation if dependencies are not available.

## Usage

### Quick Start
```bash
# Initialize configuration file
npx fakegen init

# Generate everything with default configuration
npx fakegen

# Generate with custom options
npx fakegen -n 50 -o ./my-data

# Generate only data (skip images)
npx fakegen --no-images

# Generate only images (skip data)
npx fakegen --images-only
```

### CLI Options

- `-c, --config <path>`: Path to config file (default: `.fakegen.yml`)
- `-o, --output <directory>`: Output directory (default: `./fakegen`)
- `-n, --count <number>`: Number of records to generate (default: `10`)
- `--help`: Show help information
- `--version`: Show version number

### Commands

- `init`: Create a default `.fakegen.yml` configuration file
- (no command): Generate fake data and images based on configuration

## Configuration

The tool uses a `.fakegen.yml` configuration file to define what data to generate. Here's the full structure with all features:

```yaml
output:
  directory: ./fakegen
  formats:
    - json
    - csv
    - txt
    - yml
    - toml
    - xml

data:
  count: 10
  types:
    users:
      enabled: true
      fields:
        - name: id
          type: number
        - name: firstName
          type: firstName
        - name: lastName
          type: lastName
        - name: email
          type: email
        - name: phone
          type: phoneNumber
        - name: address
          type: address
        - name: company
          type: companyName
        - name: profile
          type: nested
          fields:
            - name: bio
              type: paragraph
            - name: avatar
              type: text
            - name: socialLinks
              type: nestedArray
              count: 3
              fields:
                - name: platform
                  type: text
                - name: url
                  type: text
    products:
      enabled: true
      fields:
        - name: id
          type: number
        - name: name
          type: productName
        - name: description
          type: productDescription
        - name: price
          type: price
        - name: category
          type: productCategory
        - name: inStock
          type: boolean
        - name: specifications
          type: nested
          fields:
            - name: weight
              type: number
            - name: dimensions
              type: nested
              fields:
                - name: width
                  type: number
                - name: height
                  type: number
                - name: depth
                  type: number
            - name: materials
              type: array
              count: 3
              itemType: text
        - name: reviews
          type: nestedArray
          count: 5
          fields:
            - name: userId
              type: number
            - name: rating
              type: number
            - name: comment
              type: text
            - name: date
              type: date
    orders:
      enabled: true
      fields:
        - name: id
          type: number
        - name: userId
          type: number
        - name: orderDate
          type: date
        - name: status
          type: text
        - name: totalAmount
          type: price
        - name: shippingAddress
          type: nested
          fields:
            - name: street
              type: address
            - name: city
              type: city
            - name: country
              type: country
            - name: postalCode
              type: text
        - name: items
          type: nestedArray
          count: 3
          fields:
            - name: productId
              type: number
            - name: quantity
              type: number
            - name: unitPrice
              type: price
            - name: subtotal
              type: price
    blogPosts:
      enabled: true
      fields:
        - name: id
          type: number
        - name: title
          type: text
        - name: slug
          type: text
        - name: content
          type: paragraph
        - name: excerpt
          type: text
        - name: authorId
          type: number
        - name: publishedAt
          type: date
        - name: status
          type: text
        - name: seo
          type: nested
          fields:
            - name: metaTitle
              type: text
            - name: metaDescription
              type: text
            - name: keywords
              type: array
              count: 5
              itemType: text
        - name: tags
          type: array
          count: 4
          itemType: text
      numbers:
        enabled: true
        fields:
          - name: id
            type: numberAsc
          - name: randomNumber
            type: numberRandom
          - name: descendingNumber
            type: numberDesc
          - name: sha1
            type: sha1
          - name: sha256
            type: sha256
          - name: md5
            type: md5
          - name: uuid
            type: uuid
          - name: uuid4
            type: uuid4

images:
  enabled: true
  count: 15
  formats:
    - jpg
    - png
  aspectRatios:
    - '16:9'
    - '4:3'
    - '1:1'
    - '3:2'
    - '21:9'
    - '2:1'
    - '5:4'
  baseSizes:
    - 1
    - 16
    - 32
    - 64
    - 128
    - 256
    - 400
    - 512
    - 600
    - 800
    - 1024
    - 1200
    - 1600
    - 1920
    - 2048
    - 2560
  generateSizes: true
  },
  favicons: {
    enabled: true
    sizes: [16, 32, 48, 64, 128, 256, 512, 1024, 2048, 4096]
    formats: ['png', 'ico']
  },
  programmingCodes: {
    enabled: true
    languages: ['cs', 'ps', 'php', 'js', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'dart']
    count: 5
  },
  videos: {
    enabled: false
    count: 5
    duration: 3
    width: 640
    height: 480
    formats: ['mp4', 'mov', 'mkv', 'mpg', 'mpeg', 'flv']
    fps: 30
  },
  audio: {
    enabled: false
    count: 5
    duration: 10
    sampleRate: 44100
    formats: ['mp3', 'ogg', 'wav', 'webm', 'aac']
  }
```

### Supported Field Types

#### Basic Types
- `number`: Random integer (1-1000)
- `firstName`: Random first name
- `lastName`: Random last name
- `fullName`: Random full name
- `email`: Random email address
- `phoneNumber`: Random phone number
- `address`: Random street address
- `city`: Random city name
- `country`: Random country name
- `companyName`: Random company name
- `productName`: Random product name
- `productDescription`: Random product description
- `price`: Random price (10-1000)
- `productCategory`: Random product category
- `boolean`: Random boolean value
- `date`: Random recent date
- `text`: Random sentence
- `paragraph`: Random paragraph

#### Advanced Types
- `nested`: Creates a nested object with sub-fields
- `array`: Creates an array of items with specified count and itemType
- `nestedArray`: Creates an array of nested objects with specified fields

#### Cryptographic & Number Types
- `numberAsc`: Ascending numbers (1, 2, 3, ...)
- `numberDesc`: Descending numbers (1000, 999, 998, ...)
- `numberRandom`: Random numbers (1-10000)
- `sha1`: SHA-1 hash
- `sha256`: SHA-256 hash
- `md5`: MD5 hash
- `uuid`: UUID v4 string
- `uuid4`: Cryptographically secure UUID

#### Nested Structure Examples
```yaml
# Nested object
- name: profile
  type: nested
  fields:
    - name: bio
      type: paragraph
    - name: avatar
      type: text

# Simple array
- name: tags
  type: array
  count: 5
  itemType: text

# Array of nested objects
- name: reviews
  type: nestedArray
  count: 3
  fields:
    - name: rating
      type: number
    - name: comment
      type: text
```

## Output Structure

The generated files are organized in the following structure:

```
fakegen/
├── users/
│   ├── json/
│   │   └── users.json
│   ├── csv/
│   │   └── users.csv
│   ├── txt/
│   │   └── users.txt
│   ├── yml/
│   │   └── users.yml
│   ├── toml/
│   │   └── users.toml
│   └── xml/
│       └── users.xml
├── products/
│   ├── json/
│   │   └── products.json
│   ├── csv/
│   │   └── products.csv
│   ├── txt/
│   │   └── products.txt
│   ├── yml/
│   │   └── products.yml
│   ├── toml/
│   │   └── products.toml
│   └── xml/
│       └── products.xml
├── orders/
│   ├── json/
│   │   └── orders.json
│   ├── csv/
│   │   └── orders.csv
│   ├── txt/
│   │   └── orders.txt
│   ├── yml/
│   │   └── orders.yml
│   ├── toml/
│   │   └── orders.toml
│   └── xml/
│       └── orders.xml
├── blogPosts/
│   ├── json/
│   │   └── blogPosts.json
│   ├── csv/
│   │   └── blogPosts.csv
│   ├── txt/
│   │   └── blogPosts.txt
│   ├── yml/
│   │   └── blogPosts.yml
│   ├── toml/
│   │   └── blogPosts.toml
│   └── xml/
│       └── blogPosts.xml
└── images/
    ├── jpg/
    │   ├── abstract_1_2560x2560_1:1.jpg
    │   ├── abstract_2_1920x1080_16:9.jpg
    │   ├── abstract_3_800x400_2:1.jpg
    │   └── ...
    ├── png/
    │   ├── abstract_1_2560x2560_1:1.png
    │   ├── abstract_2_1920x1080_16:9.png
    │   ├── abstract_3_800x400_2:1.png
    │   └── ...
    └── webp/
        ├── abstract_1_2560x2560_1:1.webp
        ├── abstract_2_1920x1080_16:9.webp
        └── ...
├── favicons/
│   ├── png/
│   │   ├── favicon_16x16.png
│   │   ├── favicon_32x32.png
│   │   ├── favicon_64x64.png
│   │   └── ...
│   └── ico/
│       ├── favicon_16x16.ico
│       ├── favicon_32x32.ico
│       ├── favicon_64x64.ico
│       └── ...
├── programming-code/
│   ├── hello_1.js
│   ├── hello_2.py
│   ├── hello_3.java
│   ├── hello_1.cs
│   ├── hello_2.php
│   └── ...
├── video/ (optional - requires FFmpeg dependencies)
│   ├── animation_1.mp4
│   ├── animation_1.mov
│   ├── animation_1.mkv
│   └── ...
└── audio/ (optional - requires audio dependencies)
    ├── synthesized_1.wav
    ├── synthesized_1.mp3
    ├── synthesized_1.ogg
    └── ...
```

### Image Naming Convention

Images are named using the format: `abstract_{number}_{width}x{height}_{aspectRatio}.{format}`

**Examples:**
- `abstract_1_2560x2560_1:1.jpg` - Square image
- `abstract_2_1920x1080_16:9.png` - Widescreen image
- `abstract_3_800x400_2:1.jpg` - Ultra-wide image

### Generated Content

- **42 Data Files**: 5 data types × 6 formats = 30 files + 15 images
- **Beautiful Abstract Images**: Pastel colors, organic shapes, flowing patterns
- **Favicon Set**: 10 different sizes in PNG and ICO formats
- **Programming Code Examples**: 17+ languages with example "Hello World" files
- **Video Generation**: 3-second animations with moving pastel balls (optional)
- **Audio Generation**: 10-second synthesized audio files (optional)
- **Complex Nested Data**: Multi-level structures with realistic relationships
- **Multiple Image Formats**: JPG, PNG, WebP, and ICO support
- **Multiple Video Formats**: mp4, mov, mkv, mpg, mpeg, flv support
- **Multiple Audio Formats**: mp3, ogg, wav, webm, aac support
- **Advanced Data Types**: Numbers, hashes, UUIDs, and cryptographic functions

## Examples

### Basic Usage
```bash
# Generate everything with default settings
npx fakegen

# Generate with custom count
npx fakegen -n 50

# Generate to custom directory
npx fakegen -o ./my-test-data

# Use custom configuration file
npx fakegen -c ./custom-config.yml
```

### Advanced Usage
```bash
# Generate only data files (skip images)
npx fakegen --no-images

# Generate only images (skip data)
npx fakegen --images-only

# Generate large dataset for performance testing
npx fakegen -n 1000 -o ./performance-test

# Generate minimal dataset for quick prototyping
npx fakegen -n 5 -o ./prototype-data
```

### Configuration Examples
```bash
# Initialize default configuration
npx fakegen init

# Generate with specific data types only
# Edit .fakegen.yml to disable unwanted data types:
# users:
#   enabled: true
# products:
#   enabled: false
# orders:
#   enabled: false
# blogPosts:
#   enabled: false
```

### Generated Data Examples

**Users with nested profile:**
```json
{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "profile": {
    "bio": "Software developer with 5+ years experience...",
    "avatar": "https://example.com/avatar.jpg",
    "socialLinks": [
      {"platform": "Twitter", "url": "https://twitter.com/johndoe"},
      {"platform": "LinkedIn", "url": "https://linkedin.com/in/johndoe"}
    ]
  }
}
```

**Products with specifications and reviews:**
```json
{
  "id": 456,
  "name": "Wireless Headphones",
  "specifications": {
    "weight": 250,
    "dimensions": {
      "width": 180,
      "height": 160,
      "depth": 80
    },
    "materials": ["Plastic", "Metal", "Silicone"]
  },
  "reviews": [
    {
      "userId": 123,
      "rating": 5,
      "comment": "Excellent sound quality!",
      "date": "2024-01-15"
    }
  ]
}
```

## Dependencies

- `@faker-js/faker`: For generating realistic fake data
- `canvas`: For high-quality image generation with graphics API
- `js-yaml`: For YAML configuration parsing and generation
- `toml`: For TOML format support
- `xmlbuilder2`: For XML generation with proper structure
- `commander`: For CLI argument parsing and help generation
- `fs-extra`: For enhanced file system operations
- `crypto`: For generating unique identifiers and hashes

### Optional Dependencies (for Video & Audio)

- `fluent-ffmpeg`: For video generation and processing
- `@ffmpeg-installer/ffmpeg`: FFmpeg binary for video operations
- `audiobuffer-to-wav`: For WAV audio file generation
- `node-lame`: For MP3 audio encoding
- `wav-encoder`: For WAV file encoding
- `ogg`: For OGG audio format support

## Development

The project uses a modular architecture with the following structure:

```
src/
├── config/
│   └── index.js          # Configuration management
├── data/
│   ├── generators.js     # Fake data generation logic
│   └── formatters.js     # Multi-format serialization
├── image/
│   ├── generator.js      # Abstract image generation
│   ├── saver.js          # Image export and format handling
│   ├── index.js          # Image module exports
│   └── faviconGenerator.js # Favicon generation
├── utils/
│   ├── codeGenerator.js  # Programming code examples generation
│   └── index.js          # Utils module exports
└── generator.js          # Main orchestration logic

bin/
└── fakegen.js            # CLI entry point
```

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes to the source files
4. Test your changes: `node src/generator.js`

### Adding New Features

- **New Data Types**: Add to `src/data/generators.js` and update config
- **New Formats**: Extend `src/data/formatters.js`
- **New Image Features**: Modify `src/image/generator.js`
- **Configuration Options**: Update `src/config/index.js`

### Testing

```bash
# Test the complete tool
npm start

# Test specific modules
node src/data/generators.js
node src/image/generator.js
```

## What's New

### Version 2.0 Enhancements
- ✅ **6 Data Formats**: JSON, CSV, TXT, YML, TOML, XML
- ✅ **4 Data Types**: Users, Products, Orders, BlogPosts
- ✅ **Beautiful Abstract Images**: Pastel colors, organic shapes, flowing patterns
- ✅ **Complex Nested Structures**: Multi-level objects and arrays
- ✅ **15+ Image Sizes**: Dynamic aspect ratio generation
- ✅ **Robust Error Handling**: Fallback mechanisms for edge cases
- ✅ **Modular Architecture**: Clean separation of concerns

### Recent Fixes
- ✅ **Size Calculation**: Fixed "Max < Min" errors in image generation
- ✅ **WebP Compatibility**: Added WebP format support with quality optimization
- ✅ **Nested Data**: Proper serialization across all formats
- ✅ **Small Images**: Support for 1x1 pixel and tiny dimensions

### Version 3.0 New Features
- ✅ **5 Data Types**: Added Numbers type with cryptographic functions
- ✅ **Advanced Data Types**: SHA keys, UUIDs, ascending/descending numbers
- ✅ **Favicon Generation**: 10 different sizes with PNG and ICO formats
- ✅ **Programming Code Examples**: 17+ languages with example files
- ✅ **Enhanced Image Support**: WebP format with quality optimization
- ✅ **Modular Architecture**: New favicon and code generation modules

## License

[License](GPL v3.0 LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, and pull requests.

### Development Guidelines
- Follow the existing modular architecture
- Add comprehensive error handling
- Include tests for new features
- Update documentation for any changes

## Author

Created with ❤️ for developers who need comprehensive fake data and beautiful images for testing and prototyping.
