# System Architecture

The HSES Engine is built as a modular system with a clear separation between data ingestion, core logic, and presentation.

## High-Level Overview

```mermaid
graph TD
    User([User / Data Source]) -->|Raw Signals| API[API Layer (FastAPI)]
    API -->|Validation| Parser[Parser & Normalizer]
    Parser -->|Normalized Data| Session[Session Class]
    
    subgraph Core Logic
        Session --> Weights[Calculate Weights]
        Weights --> State[Determine Dominant State]
        State --> Scoring[Calculate Base Score]
        Scoring --> Modifiers[Apply Multipliers & Modifiers]
        Modifiers --> FinalScore[Final Exploitability Score]
        FinalScore --> Scenarios[Map to Scenarios]
    end
    
    Session -->|JSON Response| API
    API -->|Risk Profile| UI[Frontend UI (React/Vite)]
```

## Components

### 1. Signal Ingestion (API Layer)
The entry point of the system is the FastAPI backend. It receives raw JSON data containing physiological (e.g., heart rate) and behavioral (e.g., typing speed, mouse jitter) signals.
- **File**: `api/app.py`
- **Role**: Validates input using Pydantic models and passes data to the core session.

### 2. Normalization & Parsing
Raw signals are rarely directly usable. This layer maps input keys to internal representations and normalizes values to a standard scale (typically 0-1 or percentage-based) for consistent scoring.
- **Files**: `utils/normalize.py`, `utils/parser.py`

### 3. Core Session Logic
The heart of the engine. The `Session_Class` orchestrates the entire scoring pipeline.
- **File**: `core/session.py`
- **Responsibilities**:
    - **Weight Calculation**: Iterates through defined mappings to assign weights to different states (Stress, Fatigue, Focus, etc.) based on signal evidence.
    - **State Determination**: Identifies the state with the highest accumulated weight.
    - **Scoring**: Computes the numerical risk score.
    - **Scenario Mapping**: Matches the final score and state to predefined exploit scenarios (e.g., "High likelihood of clicking phishing links").

### 4. Frontend UI
A React-based dashboard that visualizes the output.
- **Tech**: React, Vite, Tailwind (assumed based on `index.css` presence).
- **Features**: Real-time graphs, detailed metric views, and simulation controls.
