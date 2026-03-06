from app.utils.rate_limiter import RateLimiter
from fastapi import HTTPException
import time

# Create test instance
limiter = RateLimiter()

print("🧪 Testing Rate Limiter...")
print("─" * 50)

# Test 1: Normal usage
print("\nTest 1: Normal Usage (should succeed)")
user_id = 1

for i in range(5):
    try:
        limiter.check_limit(user_id)
        print(f"   Request {i+1}: ✅ Allowed")
    except HTTPException as e:
        print(f"   Request {i+1}: ❌ Blocked - {e.detail}")

# Check remaining
status = limiter.get_remaining(user_id)
print(f"\n   Status: Used {status['used']}/{status['limit']}, Remaining: {status['remaining']}")

# Test 2: Exceed daily limit
print("\n" + "─" * 50)
print("\nTest 2: Exceed Daily Limit (should block after 10)")

limiter.reset_user(user_id)  # Reset for clean test

for i in range(12):
    try:
        limiter.check_limit(user_id, daily_limit=10)
        print(f"   Request {i+1}: ✅ Allowed")
    except HTTPException as e:
        print(f"   Request {i+1}: ❌ BLOCKED - {e.detail}")

# Test 3: Per-minute limit
print("\n" + "─" * 50)
print("\nTest 3: Per-Minute Limit (should block 3rd request)")

limiter.reset_user(user_id)

for i in range(4):
    try:
        limiter.check_limit(user_id, minute_limit=2)
        print(f"   Request {i+1}: ✅ Allowed")
    except HTTPException as e:
        print(f"   Request {i+1}: ❌ BLOCKED - {e.detail}")

print("\n   Waiting 61 seconds...")
time.sleep(61)

try:
    limiter.check_limit(user_id, minute_limit=2)
    print(f"   After wait: ✅ Allowed (limit reset)")
except HTTPException as e:
    print(f"   After wait: ❌ Still blocked")

print("\n" + "─" * 50)
print("✅ All tests completed!")