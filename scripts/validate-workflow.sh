#!/bin/bash

# GitHub Actions Workflow Validation Script
# This script simulates the steps that would run in the GitHub Actions workflow

set -e  # Exit on any error

echo "🚀 Starting GitHub Actions Workflow Validation"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 Step: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Setup validation
print_step "Setup validation"
if [ ! -f "package.json" ]; then
    print_error "package.json not found"
    exit 1
fi
print_success "Package.json found"

if [ ! -f "bin/fakegen.js" ]; then
    print_error "bin/fakegen.js not found"
    exit 1
fi
print_success "FakeGen executable found"

# Step 2: Dependencies check
print_step "Dependencies check"
if [ ! -d "node_modules" ]; then
    print_warning "Node modules not found, installing dependencies..."
    npm install
fi
print_success "Dependencies available"

# Step 3: Clean previous test artifacts
print_step "Cleaning previous test artifacts"
if [ -d "fakegen" ]; then
    rm -rf fakegen/
    print_success "Cleaned previous artifacts"
else
    print_success "No previous artifacts to clean"
fi

# Step 4: Run basic functionality test
print_step "Running basic functionality test"
npm run start > /tmp/fakegen_test.log 2>&1
if [ $? -ne 0 ]; then
    print_error "FakeGen failed to run"
    cat /tmp/fakegen_test.log
    exit 1
fi
print_success "FakeGen ran successfully"

# Step 5: Validate code generator works
print_step "Validating code generator functionality"

# Check if programming-code directory exists
if [ ! -d "fakegen/programming-code" ]; then
    print_error "Programming code directory not found"
    ls -la fakegen/ || print_warning "No fakegen directory found"
    exit 1
fi
print_success "Programming code directory exists"

# Check for specific language files
for lang in js py java go rs; do
    if [ ! -f "fakegen/programming-code/hello_1.$lang" ]; then
        print_error "$lang code file not found"
        ls -la fakegen/programming-code/ | head -10
        exit 1
    fi
    print_success "$lang code file exists"
done

# Step 6: Validate generated file structure
print_step "Validating directory structure"

directories=("data" "images" "favicon" "audio" "video")
for dir in "${directories[@]}"; do
    if [ ! -d "fakegen/$dir" ]; then
        print_error "$dir directory not found"
        exit 1
    fi
    print_success "$dir directory exists"
done

# Step 7: Check file content is not empty
print_step "Validating file content"

test_files=("fakegen/programming-code/hello_1.js" "fakegen/programming-code/hello_1.py")
for file in "${test_files[@]}"; do
    if [ ! -s "$file" ]; then
        print_error "$file is empty"
        exit 1
    fi
    print_success "$(basename $file) has content"
done

# Step 8: Verify proper file extensions
print_step "Validating file extensions"
if ! ls fakegen/programming-code/ | grep -E '\.(js|py|java|go|rs|php|rb|cpp|c|cs|swift|kt|dart)$' > /dev/null; then
    print_error "Expected file extensions not found"
    ls fakegen/programming-code/ | head -10
    exit 1
fi
print_success "File extensions validation passed"

# Step 9: Extended tests
print_step "Running extended tests"

# Check file counts
js_count=$(ls fakegen/programming-code/*.js 2>/dev/null | wc -l)
py_count=$(ls fakegen/programming-code/*.py 2>/dev/null | wc -l)

if [ "$js_count" -lt 5 ]; then
    print_error "Expected at least 5 JavaScript files, found $js_count"
    exit 1
fi
print_success "JavaScript file count: $js_count"

if [ "$py_count" -lt 5 ]; then
    print_error "Expected at least 5 Python files, found $py_count"
    exit 1
fi
print_success "Python file count: $py_count"

# Step 10: Package validation
print_step "Package structure validation"
npm pack --dry-run > /tmp/npm_pack.log 2>&1
if [ $? -ne 0 ]; then
    print_error "Package validation failed"
    cat /tmp/npm_pack.log
    exit 1
fi
print_success "Package structure is valid"

# Step 11: Display statistics
print_step "Generated file statistics"
echo "📊 File counts:"
echo "  - Programming codes: $(ls fakegen/programming-code/ | wc -l) files"
echo "  - Data files: $(find fakegen/data -type f | wc -l) files"
echo "  - Images: $(find fakegen/images -type f | wc -l) files"
echo "  - Favicons: $(find fakegen/favicon -type f | wc -l) files"
echo "  - Audio files: $(find fakegen/audio -type f | wc -l) files"
echo "  - Video files: $(find fakegen/video -type f | wc -l) files"

# Step 12: Show sample generated content
print_step "Sample generated content"
echo "📝 Sample JavaScript code:"
echo "--- fakegen/programming-code/hello_1.js ---"
head -5 fakegen/programming-code/hello_1.js
echo "---"

echo "📝 Sample Python code:"
echo "--- fakegen/programming-code/hello_1.py ---"
head -5 fakegen/programming-code/hello_1.py
echo "---"

# Step 13: Cleanup
print_step "Cleaning test artifacts"
rm -rf fakegen/
rm -f /tmp/fakegen_test.log /tmp/npm_pack.log
print_success "Cleanup completed"

echo ""
echo "🎉 GitHub Actions Workflow Validation COMPLETED SUCCESSFULLY!"
echo "================================================"
echo ""
echo "Summary:"
echo "✅ All validation steps passed"
echo "✅ Code generator is working properly"  
echo "✅ File structure is correct"
echo "✅ Package structure is valid"
echo "✅ Ready for GitHub Actions deployment"
echo ""
echo "Next steps:"
echo "1. Commit and push the GitHub Actions workflows"
echo "2. Configure NPM_TOKEN secret in repository settings"
echo "3. Test the workflow by running it manually"
echo "4. Use the manual release workflow to publish packages"