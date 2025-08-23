# GitHub Actions Workflows

This repository includes GitHub Actions workflows for automated testing, manual package releases, and content archive generation.

## Workflows

### 1. Test FakeGen (`test.yml`)

Automatically tests the FakeGen functionality on:
- Push to main branch
- Pull requests to main branch
- Manual trigger

**What it tests:**
- ✅ Dependencies installation
- ✅ Basic FakeGen functionality
- ✅ Code generator functionality
- ✅ Generated file structure
- ✅ File count statistics

### 2. Manual Package Release (`release.yml`)

Allows manual triggering of package releases with comprehensive testing and NPM publishing.

### 3. Generate FakeGen Archive (`generate-archive.yml`)

Generates complete archives of FakeGen output with comprehensive metadata and statistics.

**Triggers:**
- **Manual**: Can be triggered manually with custom parameters
- **Scheduled**: Runs daily at 2 AM UTC to create fresh samples
- **Automatic**: Runs on push to main branch when source code changes

**Features:**
- 📦 Creates ZIP and/or TAR.GZ archives
- 📊 Generates detailed content statistics
- 📝 Includes generation metadata and file listings
- 🎨 Creates sample showcase for quick preview
- 💾 Uploads artifacts with configurable retention
- 🏷️ Creates GitHub releases for main branch pushes

#### Archive Generation Usage

1. **Navigate to Actions tab** in GitHub repository
2. **Select "Generate FakeGen Archive"** workflow
3. **Click "Run workflow"**
4. **Configure parameters:**
   - **Archive name**: Custom name for the archive (optional)
   - **Include metadata**: Whether to include generation info and statistics
   - **Compression level**: Archive compression level (1-9, 9=max compression)
   - **Archive format**: Choose ZIP, TAR.GZ, or both

#### Archive Parameters

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `archive_name` | ❌ | string | `fakegen-samples` | Custom archive name (without extension) |
| `include_metadata` | ❌ | boolean | `true` | Include generation metadata and statistics |
| `compression_level` | ❌ | choice | `6` | Archive compression level (1-9) |
| `archive_format` | ❌ | choice | `zip` | Archive format: zip, tar.gz, or both |

#### What the Archive Contains

1. **📁 Complete FakeGen Output**
   - All generated data files (JSON, CSV, XML, YAML, TOML, TXT)
   - Images organized by aspect ratio (JPG, PNG, WebP, SVG)
   - Favicons in multiple sizes and formats
   - Programming code examples (18+ languages)
   - Audio files in various formats and styles
   - Video files in multiple formats

2. **📊 Metadata and Documentation**
   - `GENERATION_INFO.md`: Complete generation statistics and info
   - `FILE_LISTING.txt`: Comprehensive file listing
   - `samples/`: Quick preview samples directory

3. **🎯 Archive Benefits**
   - Ready-to-use test data for projects
   - Demonstration of FakeGen capabilities
   - Reference implementation examples
   - Comprehensive content for testing scenarios

#### Parameters

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `version` | ✅ | string | - | Release version (e.g., 1.2.0) |
| `publish` | ✅ | boolean | `true` | Publish to NPM registry |
| `test_coverage` | ❌ | boolean | `true` | Run extended validation tests |

#### What it does

1. **🧪 Testing Phase**
   - Installs dependencies
   - Runs FakeGen to generate test data
   - Validates code generator functionality
   - Checks file structure and content
   - Verifies file extensions and counts

2. **📦 Build Phase**
   - Updates package version
   - Validates package structure
   - Dry-run package build

3. **🚀 Release Phase** (if publish=true)
   - Publishes to NPM registry
   - Creates Git tag
   - Pushes version bump commit
   - Creates GitHub release with changelog

#### Required Secrets

To use the release workflow, configure these repository secrets:

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | NPM authentication token for publishing |
| `GITHUB_TOKEN` | Automatically provided by GitHub |

#### Setting up NPM Token

1. **Create NPM Token:**
   ```bash
   npm login
   npm token create --type=automation
   ```

2. **Add to GitHub Secrets:**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM automation token

## Example Usage

### Testing Only
```yaml
# Trigger test workflow manually
version: "1.2.0"
publish: false
test_coverage: true
```

### Full Release
```yaml
# Trigger full release workflow
version: "1.2.0"
publish: true
test_coverage: true
```

### Archive Generation Examples

#### Quick Archive Generation
```yaml
# Generate default archive with ZIP format
archive_name: "my-samples"
include_metadata: true
compression_level: "6"
archive_format: "zip"
```

#### High Compression Archive
```yaml
# Generate highly compressed archive in both formats
archive_name: "compressed-samples"
include_metadata: true
compression_level: "9"
archive_format: "both"
```

#### Minimal Archive
```yaml
# Generate minimal archive without metadata
archive_name: "minimal-samples"
include_metadata: false
compression_level: "1"
archive_format: "tar.gz"
```

## Validation Checks

The workflows perform comprehensive validation:

### Code Generator Validation
- ✅ Programming code directory exists
- ✅ Expected language files are generated
- ✅ Files contain valid content
- ✅ Proper file extensions are used
- ✅ Multiple files per language (extended tests)

### Structure Validation
- ✅ Data directory and files
- ✅ Images directory and files  
- ✅ Favicon directory and files
- ✅ Audio directory and files
- ✅ Video directory and files

### Archive Validation
- ✅ Archive creation and compression
- ✅ Content integrity verification
- ✅ Metadata generation and inclusion
- ✅ Sample showcase creation
- ✅ File listing accuracy

### Quality Checks
- ✅ Non-empty file content
- ✅ Proper file naming conventions
- ✅ Package structure validation
- ✅ Version consistency

## Troubleshooting

### Common Issues

1. **NPM_TOKEN not configured**
   ```
   Error: npm publish failed
   ```
   **Solution:** Configure NPM_TOKEN secret in repository settings

2. **Version already exists**
   ```
   Error: Version 1.2.0 already exists
   ```
   **Solution:** Use a new version number that hasn't been published

3. **Test failures**
   ```
   Error: Code generator test failed
   ```
   **Solution:** Check that code generator configuration is properly set up

4. **Archive generation fails**
   ```
   Error: Archive creation failed
   ```
   **Solution:** Check disk space and compression settings

5. **Missing content in archive**
   ```
   Warning: Some directories not found
   ```
   **Solution:** Ensure FakeGen runs successfully before archive creation

### Debug Steps

1. **Check test workflow first:**
   - Run "Test FakeGen" workflow manually
   - Review test output and file generation

2. **Test archive generation locally:**
   - Use `scripts/test-archive-generation.sh` for local testing
   - Verify content generation and archive creation

3. **Use dry-run mode:**
   - Set `publish: false` in release workflow to test without publishing
   - Review all validation steps

4. **Check workflow logs:**
   - Navigate to Actions tab
   - Select failed workflow run
   - Review individual step logs

5. **Verify archive contents:**
   - Download generated artifacts
   - Extract and inspect archive contents
   - Check metadata files and statistics

## Local Testing

### Test Archive Generation Locally

Before running the GitHub Actions workflow, you can test archive generation locally:

```bash
# Make script executable
chmod +x scripts/test-archive-generation.sh

# Run with default settings
./scripts/test-archive-generation.sh

# Run with custom archive name
./scripts/test-archive-generation.sh "my-custom-archive"
```

### Test Release Workflow Locally

To test the release workflow validation:

```bash
# Make script executable
chmod +x scripts/validate-workflow.sh

# Run validation
./scripts/validate-workflow.sh
```

## Security Considerations

- NPM_TOKEN has automation scope (limited permissions)
- GitHub Actions uses least-privilege access
- Secrets are properly masked in logs
- Release workflow requires manual trigger (no automatic publishing)

---

For more information about GitHub Actions, see [GitHub Actions Documentation](https://docs.github.com/en/actions).