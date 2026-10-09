"""Refresh public LeetCode stats; preserve the previous snapshot on failure."""
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

QUERY = """
query {
  allQuestionsCount { difficulty count }
  matchedUser(username: "PongLee") {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  recentAcSubmissionList(username: "PongLee", limit: 1) { timestamp }
}
"""

def main():
    request = Request("https://leetcode.com/graphql/",
        data=json.dumps({"query": QUERY}).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "PongLee-Portfolio/1.0",
                 "Referer": "https://leetcode.com/u/PongLee/"})
    with urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if payload.get("errors"):
        raise RuntimeError("LeetCode returned query errors")
    data = payload["data"]
    solved = {row["difficulty"]: row["count"] for row in
              data["matchedUser"]["submitStatsGlobal"]["acSubmissionNum"]}
    totals = {row["difficulty"]: row["count"] for row in data["allQuestionsCount"]}
    for difficulty in ("All", "Easy", "Medium", "Hard"):
        if not isinstance(solved[difficulty], int) or not isinstance(totals[difficulty], int):
            raise ValueError("Invalid problem counts")
    recent = data["recentAcSubmissionList"]
    snapshot = {"username": "PongLee", "solved": solved, "totals": totals,
                "lastSolved": datetime.fromtimestamp(int(recent[0]["timestamp"]), timezone.utc).isoformat() if recent else None,
                "updatedAt": datetime.now(timezone.utc).isoformat()}
    target = Path(__file__).resolve().parents[1] / "leetcode-stats.json"
    target.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
