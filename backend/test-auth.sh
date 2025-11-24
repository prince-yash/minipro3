#!/bin/bash


echo "================================"
echo "Testing EduCanvas Live Auth API"
echo "================================"
echo ""

BASE_URL="http://localhost:5000"

# Test 1: Register a student
echo "1. Registering a student user..."
STUDENT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "username": "teststudent",
    "password": "password123",
    "role": "student"
  }')

echo "$STUDENT_RESPONSE" | jq '.'
STUDENT_TOKEN=$(echo "$STUDENT_RESPONSE" | jq -r '.token')
echo ""

# Test 2: Register an admin with wrong code (should fail)
echo "2. Trying to register admin with wrong code (should fail)..."
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "username": "testadmin",
    "password": "password123",
    "role": "admin",
    "adminCode": "wrongcode"
  }' | jq '.'
echo ""

# Test 3: Register an admin with correct code
echo "3. Registering an admin user with correct code..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "username": "testadmin",
    "password": "password123",
    "role": "admin",
    "adminCode": "teach123"
  }')

echo "$ADMIN_RESPONSE" | jq '.'
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.token')
echo ""

echo "4. Logging in as student..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "teststudent",
    "password": "password123"
  }' | jq '.'
echo ""

echo "5. Getting student profile..."
curl -s -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $STUDENT_TOKEN" | jq '.'
echo ""
student
echo "6. Getting admin profile..."
curl -s -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

echo "================================"
echo "All tests completed!"
echo "================================"
