# API Reference

The HSES API is built with **FastAPI**. It exposes a single primary endpoint for scoring.

## Base URL
`http://localhost:8000` (default local)

## Endpoints

### `POST /score`

Calculates the exploitability score for a given user session.

#### Request Body

Content-Type: `application/json`

```json
{
  "signals": {
    "heart_rate": 85,
    "typing_speed": 40,
    "mouse_movement_jitter": 0.5,
    "screen_focus_time": 120,
    "error_rate": 0.02,
    "time_of_day": "Afternoon",
    "session_length": 60,
    "Noise_State": 2
  },
  "time_of_day": "Afternoon",
  "session_length": 60,
  "noise": 2,
  "environmental_factor": "Office",
  "access_level": "Admin",
  "attacking_skill": "Intermediate",
  "user_interaction": "High",
  "company_resources_stake": "Private",
  "company_resources_public": false
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `signals` | Dictionary | Raw physiological and behavioral metrics. |
| `time_of_day` | String | e.g., "Morning", "Afternoon", "Night". |
| `session_length` | Integer | Duration of the session in minutes. |
| `noise` | Integer | Environmental noise level (1-10). |
| `environmental_factor` | String | Description of environment (e.g., "Office", "Remote"). |
| `access_level` | String | User's privilege level. |
| `attacking_skill` | String | Simulated attacker skill level. |
| `company_resources_stake` | String | Sensitivity of resources ("Public" or "Private"). |

#### Response

Content-Type: `application/json`

```json
{
  "success": true,
  "state_weights": {
    "Stress": 45.5,
    "Fatigue": 20.0
  },
  "signal_weights": {
    "heart_rate": 10.5
  },
  "state": "Stress",
  "base_score": 45.5,
  "total_score": 62.3,
  "multiplier": 1.2,
  "exploit_modifier": 1.1,
  "exploit_scenarios": [
    "Phishing Susceptibility"
  ],
  "exploit_band": "VERY_HIGH"
}
```
