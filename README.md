# FakeGen (Generate Dummy Files)

A powerful CLI tool to generate comprehensive fake data and beautiful abstract images using faker and canvas. Perfect for testing, prototyping, and development purposes.

### Quick Start

```npx @emircanerkul/fakegen``` or [Download sample archives from GitHub Releases](https://github.com/emircanerkul/fakegen/releases)

> **DISCLAIMER:** This project developed with roocode/sonic to solve our annoying problem and demonstrate how well AI models do with good prompting. All prompt history also included, %100 transparent and honest.
> 1. [Initial promt](history/roo_task_aug-22-2025_7-48-26-am.md)
> 2. [Initial promt](history/roo_task_aug-23-2025_7-59-27-am.md)
> 3. [Initial promt](history/roo_task_aug-23-2025_8-35-56-am.md)
> 4. [Initial promt](history/roo_task_aug-23-2025_8-40-46-am.md)

> **DISCLAIMER (UPDATE):** when sonic stuck at some audio generation task, switched to new [qoder](https://qoder.com/) ide used free trial plan.

> **My Opinions:** both tools are great and at the time of generating (or lets say developing..) this package both was free. Sonic as named, it is really fast but lack of advanced coding skills. When it stuck at some point qoder able to fix it. Qoder also fast and has good quality results but a bit more slow than sonic but handles tasks better, no need to do context engineering or prompt magic, it does it all for you in design phase then proceed as like taskmaster does.

## Features

- **6 Data Formats**: Generate data in JSON, CSV, TXT, YML, TOML, and XML formats
- **Multiple Data Types**: User profiles, product catalogs, order history, blog posts, and simple data sequences
- **Simple Data Types**: Numbers, hashes, UUIDs, and dates with clean, minimal formatting (values only)
- **Complex Data Types**: Full record structures with nested objects and arrays
- **Beautiful Abstract Art**: Generate stunning pastel abstract images with organic shapes and flowing patterns
- **Checkerboard Patterns**: Create colorful checkerboard images with alternating colors
- **3 Image Formats**: Support for JPG, PNG, and WebP formats
- **Standard Aspect Ratios**: Industry-standard ratios (1:1, 4:3, 16:9, 21:9, 9:16) with organized output
- **Favicon Generation**: Generate favicons in multiple sizes (16x16 to 512x512) with PNG and ICO formats
- **Programming Code Examples**: Generate example code files for 17+ programming languages
- **Kebab-Case Organization**: Clean, organized directory structure using kebab-case naming
- **Configuration-Driven**: Use `.fakegen.yml` configuration file for easy customization
- **CLI Interface**: Simple command-line interface with comprehensive options
- **npx Ready**: Can be run via `npx` without installation

### Directory Structure

Generated content is organized in a clean, predictable structure:

```
fake-data/
├── data/
│   ├── user-profiles/          # User data with nested profiles
│   ├── product-catalog/        # E-commerce product data
│   ├── order-history/          # Order transactions
│   ├── blog-posts/             # Blog content with SEO
│   ├── simple-numbers/         # Just numbers (11, 12, 13...)
│   ├── crypto-hashes/          # Hash values only
│   └── uuid-sequences/         # UUID values only
├── images/
│   ├── 1-1/                    # Square images (1:1)
│   │   ├── abstract/
│   │   └── checkerboard/
│   ├── 16-9/                   # Widescreen images (16:9)
│   │   ├── abstract/
│   │   └── checkerboard/
│   └── 21-9/                   # Ultra-wide images (21:9)
│       ├── abstract/
│       └── checkerboard/
├── favicons/
│   ├── png/
│   └── ico/
└── programming-examples/
    ├── hello_1.js
    ├── hello_2.py
    └── ...
```

## Installation

### Using npx (Recommended)
```bash
npx @emircanerkul/fakegen
```

### Local Installation
```bash
npm install -g .
```

**Note**: Video and audio generation features are disabled by default and require additional dependencies. The core functionality (data generation, images, favicons, programming codes) works out of the box.

## Usage

### Quick Start
```bash
# Initialize configuration file
npx @emircanerkul/fakegen init

# Generate everything with default configuration
npx @emircanerkul/fakegen

# Generate with custom options
npx @emircanerkul/fakegen -n 50 -o ./my-data

# Generate only data (skip images)
npx @emircanerkul/fakegen --no-images

# Generate only images (skip data)
npx @emircanerkul/fakegen --images-only
```

### CLI Options

- `-c, --config <path>`: Path to config file (default: `.fakegen.yml`)
- `-o, --output <directory>`: Output directory (default: `./fake-data`)
- `-n, --count <number>`: Number of records to generate (default: `10`)
- `--help`: Show help information
- `--version`: Show version number

### Commands

- `init`: Create a default `.fakegen.yml` configuration file
- (no command): Generate fake data and images based on configuration

## Configuration

The tool uses a `.fakegen.yml` configuration file to define what data to generate. Here's the structure with kebab-case naming:

```yaml
output:
  directory: ./fake-data
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
    user-profiles:
      enabled: true
      fields:
        - name: user-id
          type: number-ascending
        - name: first-name
          type: first-name
        - name: last-name
          type: last-name
        - name: email-address
          type: email
        - name: phone-number
          type: phone-number
        - name: street-address
          type: address
        - name: company-name
          type: company-name
        - name: user-profile
          type: nested
          fields:
            - name: bio-text
              type: paragraph
            - name: avatar-url
              type: text
            - name: social-links
              type: nested-array
              count: 3
              fields:
                - name: platform-name
                  type: text
                - name: profile-url
                  type: text
    product-catalog:
      enabled: true
      fields:
        - name: product-id
          type: number-ascending
        - name: product-name
          type: product-name
        - name: product-description
          type: product-description
        - name: unit-price
          type: price
        - name: product-category
          type: product-category
        - name: in-stock
          type: boolean
        - name: product-specifications
          type: nested
          fields:
            - name: item-weight
              type: number
            - name: item-dimensions
              type: nested
              fields:
                - name: width-cm
                  type: number
                - name: height-cm
                  type: number
                - name: depth-cm
                  type: number
            - name: material-list
              type: array
              count: 3
              itemType: text
        - name: customer-reviews
          type: nested-array
          count: 5
          fields:
            - name: reviewer-id
              type: number
            - name: star-rating
              type: number
            - name: review-comment
              type: text
            - name: review-date
              type: date
    simple-numbers:
      enabled: true
      fields:
        - name: number
          type: number-ascending
    crypto-hashes:
      enabled: true
      fields:
        - name: sha256-hash
          type: sha256
        - name: md5-hash
          type: md5

images:
  enabled: true
  count: 15
  formats:
    - jpg
    - png
    - webp
  aspect-ratios:
    - '1:1'
    - '4:3'
    - '16:9'
    - '21:9'
    - '9:16'
  base-sizes:
    - 320
    - 480
    - 640
    - 800
    - 1024
    - 1280
    - 1920
  generate-sizes: true

favicons:
  enabled: true
  sizes: [16, 32, 48, 64, 128, 180, 192, 256, 512]
  formats: ['png', 'ico']

programming-codes:
  enabled: true
  languages: ['js', 'ts', 'py', 'java', 'go', 'php', 'rb', 'cs', 'cpp', 'c', 'rs', 'swift']
  count: 5
```
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
- `first-name` / `firstName`: Random first name
- `last-name` / `lastName`: Random last name
- `full-name` / `fullName`: Random full name
- `email`: Random email address
- `phone-number` / `phoneNumber`: Random phone number
- `address`: Random street address
- `city`: Random city name
- `country`: Random country name
- `company-name` / `companyName`: Random company name
- `product-name` / `productName`: Random product name
- `product-description` / `productDescription`: Random product description
- `price`: Random price (10-1000)
- `product-category` / `productCategory`: Random product category
- `boolean`: Random boolean value
- `date`: Random recent date
- `text`: Random sentence
- `paragraph`: Random paragraph

#### Advanced Types
- `nested`: Creates a nested object with sub-fields
- `array`: Creates an array of items with specified count and itemType
- `nested-array` / `nestedArray`: Creates an array of nested objects with specified fields

#### Cryptographic & Number Types
- `number-ascending` / `numberAsc`: Ascending numbers (1, 2, 3, ...)
- `number-descending` / `numberDesc`: Descending numbers (1000, 999, 998, ...)
- `number-random` / `numberRandom`: Random numbers (1-10000)
- `sha1`: SHA-1 hash
- `sha256`: SHA-256 hash
- `md5`: MD5 hash
- `uuid`: UUID v4 string
- `uuid4`: Cryptographically secure UUID

#### Simple vs Complex Data Types

**Simple Types** (output values only):
- Numbers: `11\n12\n13\n...`
- Hashes: `a1b2c3...\nf4e5d6...\n...`
- UUIDs: `uuid1\nuuid2\nuuid3\n...`

**Complex Types** (full record structure):
```json
{
  "user-id": 1,
  "first-name": "John",
  "last-name": "Doe",
  "user-profile": {
    "bio-text": "Software developer...",
    "social-links": [
      {"platform-name": "Twitter", "profile-url": "..."}
    ]
  }
}
```

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

The generated files are organized in a clean, kebab-case directory structure:

```
fake-data/
├── data/
│   ├── user-profiles/
│   │   ├── json/
│   │   │   └── user-profiles.json
│   │   ├── csv/
│   │   │   └── user-profiles.csv
│   │   ├── txt/
│   │   │   └── user-profiles.txt
│   │   ├── yml/
│   │   │   └── user-profiles.yml
│   │   ├── toml/
│   │   │   └── user-profiles.toml
│   │   └── xml/
│   │       └── user-profiles.xml
│   ├── product-catalog/
│   │   ├── json/
│   │   │   └── product-catalog.json
│   │   └── ... (other formats)
│   ├── simple-numbers/
│   │   ├── txt/
│   │   │   └── simple-numbers.txt    # Contains: 1\n2\n3\n4\n5\n...
│   │   └── json/
│   │       └── simple-numbers.json   # Contains: [1, 2, 3, 4, 5, ...]
│   └── crypto-hashes/
│       ├── txt/
│       │   └── crypto-hashes.txt     # Contains: hash1\nhash2\nhash3\n...
│       └── json/
│           └── crypto-hashes.json    # Contains: ["hash1", "hash2", ...]
├── images/
│   ├── 1-1/                          # Square aspect ratio (1:1)
│   │   ├── abstract/
│   │   │   ├── jpg/
│   │   │   │   ├── 320x320.jpg
│   │   │   │   ├── 640x640.jpg
│   │   │   │   └── 1024x1024.jpg
│   │   │   ├── png/
│   │   │   └── webp/
│   │   └── checkerboard/
│   │       ├── jpg/
│   │       ├── png/
│   │       └── webp/
│   ├── 16-9/                         # Widescreen aspect ratio (16:9)
│   │   ├── abstract/
│   │   └── checkerboard/
│   └── 21-9/                         # Ultra-wide aspect ratio (21:9)
│       ├── abstract/
│       └── checkerboard/
├── favicons/
│   ├── png/
│   │   ├── favicon_16x16.png
│   │   ├── favicon_32x32.png
│   │   ├── favicon_64x64.png
│   │   └── ...
│   └── ico/
│       ├── favicon_16x16.ico
│       ├── favicon_32x32.ico
│       └── ...
└── programming-examples/
    ├── hello_1.js
    ├── hello_2.py
    ├── hello_3.java
    └── ...
```
```

### Image Organization

Images are organized by aspect ratio for better usability:
- **1-1/**: Square images (1:1 ratio) - perfect for avatars, thumbnails
- **16-9/**: Widescreen images (16:9 ratio) - modern displays, video thumbnails  
- **21-9/**: Ultra-wide images (21:9 ratio) - cinematic, banner content
- **4-3/**: Traditional images (4:3 ratio) - classic photography, presentations
- **9-16/**: Mobile portrait images (9:16 ratio) - mobile apps, stories

Each aspect ratio directory contains:
- `abstract/`: Procedurally generated abstract art
- `checkerboard/`: Colorful checkerboard patterns

### Simple Data Format Examples

**Simple Numbers (simple-numbers.txt):**
```
1
2
3
4
5
```

**Crypto Hashes (crypto-hashes.txt):**
```
a1b2c3d4e5f6789...
f4e5d6c7b8a9123...
789abc123def456...
```

### Complex Data Format Examples

**User Profiles (user-profiles.json):**
```json
[
  {
    "user-id": 1,
    "first-name": "John",
    "last-name": "Doe",
    "email-address": "john.doe@example.com",
    "user-profile": {
      "bio-text": "Software developer with 5+ years experience...",
      "avatar-url": "https://example.com/avatar.jpg",
      "social-links": [
        {"platform-name": "Twitter", "profile-url": "https://twitter.com/johndoe"},
        {"platform-name": "LinkedIn", "profile-url": "https://linkedin.com/in/johndoe"}
      ]
    }
  }
]
```

## Examples

### Basic Usage
```bash
# Generate everything with default settings
npx @emircanerkul/fakegen

# Generate with custom count
npx @emircanerkul/fakegen -n 50

# Generate to custom directory
npx @emircanerkul/fakegen -o ./my-test-data

# Use custom configuration file
npx @emircanerkul/fakegen -c ./custom-config.yml
```

### Configuration Examples
```bash
# Initialize default configuration
npx @emircanerkul/fakegen init

# Edit .fakegen.yml to customize:
# - Enable/disable specific data types
# - Change output directory
# - Modify aspect ratios and sizes
# - Adjust field configurations
```

**Product Catalog (product-catalog.json):**
```json
[
  {
    "product-id": 1,
    "product-name": "Wireless Headphones",
    "unit-price": 129.99,
    "product-specifications": {
      "item-weight": 250,
      "item-dimensions": {
        "width-cm": 18,
        "height-cm": 16,
        "depth-cm": 8
      },
      "material-list": ["Plastic", "Metal", "Silicone"]
    },
    "customer-reviews": [
      {
        "reviewer-id": 123,
        "star-rating": 5,
        "review-comment": "Excellent sound quality!",
        "review-date": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
]
```

## Dependencies

### Core Dependencies
- `@faker-js/faker`: For generating realistic fake data
- `sharp`: For high-quality image generation and processing
- `js-yaml`: For YAML configuration parsing and generation
- `fs-extra`: For enhanced file system operations
- `crypto`: For generating unique identifiers and hashes (Node.js built-in)

### Image Generation Dependencies
- `sharp`: High-performance image processing library
- Built-in Canvas API support for procedural image generation

### Configuration and CLI Dependencies
- `commander`: For CLI argument parsing and help generation
- `js-yaml`: For YAML configuration file support

**Note**: Video and audio generation features are disabled by default. The core functionality (data generation, images, favicons, programming codes) works out of the box with no additional setup required.

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

### Version 4.0 Major Refactor
- ✅ **Kebab-Case Organization**: Clean, consistent naming throughout the codebase
- ✅ **Simple Data Types**: Numbers, hashes, UUIDs output values only (no verbose formatting)
- ✅ **Standard Aspect Ratios**: Industry-standard image sizes (1:1, 4:3, 16:9, 21:9, 9:16)
- ✅ **Organized Directory Structure**: Logical grouping by data complexity and aspect ratio
- ✅ **Legacy Support**: Automatic conversion from old camelCase configurations
- ✅ **Enhanced Configuration**: Modular configuration system with clear separation of concerns

### Key Improvements
- 📁 **Better File Organization**: Data grouped in `/data/` subdirectory with kebab-case names
- 🖼️ **Smarter Image Organization**: Images organized by aspect ratio (`/images/16-9/`, `/images/1-1/`)
- 📝 **Simplified Simple Data**: Numbers files now contain just `1\n2\n3\n` instead of verbose records
- 🔧 **Cleaner Configuration**: New kebab-case field names (`first-name`, `user-id`, `aspect-ratios`)
- 🎯 **Industry Standards**: Standard aspect ratios and common image sizes built-in

### Previous Features Maintained
- ✅ **6 Data Formats**: JSON, CSV, TXT, YML, TOML, XML
- ✅ **Multiple Data Types**: User profiles, product catalogs, order history, blog posts
- ✅ **Beautiful Abstract Images**: Procedurally generated art with pastel colors
- ✅ **Complex Nested Structures**: Multi-level objects and arrays
- ✅ **Favicon Generation**: Multiple sizes with PNG and ICO formats
- ✅ **Programming Code Examples**: Multiple languages with example files
- ✅ **Robust Error Handling**: Fallback mechanisms for edge cases

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
