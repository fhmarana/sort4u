from datetime import timedelta, datetime
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException



class RateLimiter:

    def __init__ (self):
        self.requests: Dict[int, List[datetime]] = defaultdict(list)

    def check_limit(
        self,
        user_id: int,
        daily_limit: int = 10,
        minute_limit: int = 2
    ):

        now = datetime.now()
        today = now.date()

        # Clean old requests (keep only today's)
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if req_time.date() == today
        ]

        #Check Daily Limit

        if len(self.requests[user_id]) >= daily_limit:
            raise HTTPException(
                status_code=429,
                detail=f"You have reached your daily limit ({daily_limit} food lookups per day). Try again tomorrow!"
            )

        one_minute_ago = now - timedelta(minutes=1)
        recent_request = [
            req for req in self.requests[user_id]
            if req > one_minute_ago
        ]

        if len(recent_request) >= minute_limit:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a minute before trying again."
            )

        self.requests[user_id].append(now)


    def get_remaining(self, user_id: int, daily_limit: int = 10) -> dict:
        now = datetime.now()
        today = now.date()

        # Count today's requests
        today_requests = [
            req for req in self.requests[user_id]
            if req.date() == today
        ]

        used = len(today_requests)
        remaining = max(0, daily_limit - used)

        return {
            "used": used,
            "remaining": remaining,
            "limit": daily_limit
        }

    def reset_user(self, user_id: int):
        if user_id in self.requests:
            del self.requests[user_id]

rate_limiter = RateLimiter()
