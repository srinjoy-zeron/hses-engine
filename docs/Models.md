# Models & Scoring Logic

The HSES Engine uses a deterministic, rule-based model to calculate human exploitability. This approach ensures transparency and explainability, allowing security teams to understand exactly *why* a user is flagged as high-risk.

## The 7-Step Scoring Pipeline

The core logic is encapsulated in the `Session_Class` and executes in the following order:

### 1. Weight Calculation
The system maps incoming signals (e.g., heart rate > 100 bpm) to potential states (Stress, Fatigue, Focus, etc.). 
- **Mechanism**: Iterates through a mapping table.
- **Evidence**: Signals provide "Positive" or "Negative" evidence for a state.
- **Output**: A raw weight for each state.

### 2. Dominant State Determination
The system identifies the state with the highest accumulated weight.
- **Example**: If `Stress` has a weight of 85 and `Fatigue` has 40, the user is classified as being in a **Stress** state.

### 3. Contextual Multipliers
The base score is adjusted by environmental factors:
- **Time of Day**: Different times (morning vs. late night) carry different risk profiles.
- **Session Length**: Longer sessions increase fatigue and error rates.
- **Noise/Environment**: High background noise or chaotic environments increase distraction.
- **Formula**: `Multiplier = (TimeFactor * SessionLengthFactor * EnvironmentFactor) ^ (1/3)`

### 4. Exploit Modifiers
Refines the risk based on the user's role and privileges:
- **Access Level**: Admin vs. User.
- **Attacking Skill**: Perceived sophistication of potential attackers.
- **User Interaction**: Frequency of external communication.
- **Company Resources**: Sensitivity of data handled (Public vs. Private).

### 5. Final Score Calculation
Combines all factors into a single "Exploitability Score" (0-100).
- **Base Score**: Weighted sum of state modifiers.
- **Formula**: `Score = BaseScore * ScalingFactor * Multiplier * ExploitModifier`

### 6. Scenario Mapping
Matches the calculated score and state to specific real-world threat scenarios.
- **Example**: A "Fatigue" state with a "High" score might trigger the **"Business Email Compromise (BEC) Susceptibility"** scenario.

### 7. Exploit Band
Categorizes the final score into a qualitative band for easy reporting:
- **LOW**: < 15
- **MEDIUM**: 15 - 30
- **HIGH**: 30 - 60
- **VERY HIGH**: 60 - 80
- **CRITICAL**: > 80
