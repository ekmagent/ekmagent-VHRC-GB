#!/bin/bash
# Pre-deployment validation script
# Run: ./scripts/pre-deploy-check.sh

echo "🔍 Running pre-deployment checks..."

# 1. Check for dev mode bypasses in code
echo "Checking for dev mode protection..."
if grep -r "!devMode" src/ | grep -E "(fetch|sendBeacon)" | grep -v "if.*!devMode"; then
    echo "❌ CRITICAL: Found potential dev mode bypass!"
    exit 1
fi

# 2. Test dev mode actually works
echo "Testing dev mode functionality..."
npm test -- --testNamePattern="Dev Mode"

# 3. Check for console.log statements that might indicate debug code
echo "Checking for debug code..."
if grep -r "console\.log.*webhook" src/ | grep -v "DEV MODE"; then
    echo "⚠️  WARNING: Found webhook debug logs"
fi

# 4. Validate webhook URLs are correct
echo "Validating webhook URLs..."
if grep -r "hook.us1.make.com" src/ | grep -v -E "(r1kbh1gkk5j31prdnhcn1dq8hsk2gyd9|sdv55xk1d8iacpxbhnagymcgrkuf6ju5)"; then
    echo "❌ CRITICAL: Unknown webhook URL found!"
    exit 1
fi

# 5. Check for proper error handling
echo "Checking error handling..."
if ! grep -r "catch.*error" src/; then
    echo "⚠️  WARNING: Missing error handling"
fi

echo "✅ Pre-deployment checks complete!"
