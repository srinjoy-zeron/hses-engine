import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Activity,
  Info,
  Shield,
  Zap,
  Target,
  BarChart3,
  MousePointer2,
  Lock,
  Wifi,
  Users
} from "lucide-react";
import Navbar from "../components/navbar.jsx";
import InfoDialog from "../components/info.jsx";

/* ---------- OPTIONS ---------- */

const ACCESS_LEVEL = {
  PI: "Physical Intervention by Attacker needed",
  SS: "Access to the Shell/System needed",
  SN: "Secured LAN/WiFi network access needed",
  PN: "Public Network access needed",
  OS: "Open sourced resources available"
};

const ATTACKING_SKILL = {
  EASY: "Low technical skill (Phishing, Spam)",
  INTERMEDIATE: "Technical understanding needed (SQLi)",
  COMPLEX: "Complex exploitation steps (Firmware)"
};

const USER_INTERACTION = {
  NO: "Automatic system operation",
  YES: "User action required (Click/Accept)"
};

const COMPANY_RESOURCES = {
  NONE: "No significant assets at stake",
  LOW: "< 1% company value",
  MID: "~ 5% company value",
  HIGH: "> 5% company value"
};

const ENVIRONMENT = {
  SOL: "Complete Solitude",
  SMG: "Small Group",
  OFE: "Office Environment",
  HSE: "Highly Stimulus Environment"
};

/* ---------- COMPONENTS ---------- */

const OptionCard = ({ title, options, value, onChange, icon: Icon }) => (
  <div className="space-y-3 mb-6">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon size={16} className="text-blue-600" />}
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(options).map(([key, desc]) => {
        const selected = value === key;
        return (
          <motion.div
            key={key}
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.01, backgroundColor: selected ? "rgba(239, 246, 255, 0.7)" : "rgba(255, 255, 255, 0.9)" }}
            whileTap={{ scale: 0.99 }}
            className={`
              relative cursor-pointer rounded-xl p-3 border transition-all duration-200
              ${selected
                ? "bg-blue-50/80 border-blue-500 shadow-[0_0_0_1px_rgba(37,99,235,0.5)]"
                : "bg-white/60 border-slate-200 hover:border-blue-300"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors
                ${selected ? "border-blue-500 bg-white" : "border-slate-300 bg-slate-50"}
              `}>
                {selected && <motion.div layoutId={`radio-${title}`} className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${selected ? "text-blue-900" : "text-slate-800"}`}>
                    {key}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{desc}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const PieChart = ({ data }) => {
  const entries = Object.entries(data)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 7);
  const total = entries.reduce((a, [, v]) => a + Math.abs(v), 0);

  let acc = 0;
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#06b6d4", "#84cc16"
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full py-4">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 drop-shadow-lg">
          {entries.map(([key, value], i) => {
            const start = acc / total;
            const slice = Math.abs(value) / total;
            acc += Math.abs(value);

            const x1 = 100 + 100 * Math.cos(2 * Math.PI * start);
            const y1 = 100 + 100 * Math.sin(2 * Math.PI * start);
            const x2 = 100 + 100 * Math.cos(2 * Math.PI * (start + slice));
            const y2 = 100 + 100 * Math.sin(2 * Math.PI * (start + slice));
            const large = slice > 0.5 ? 1 : 0;

            return (
              <motion.path
                key={key}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                d={`M100 100 L${x1} ${y1} A100 100 0 ${large} 1 ${x2} ${y2} Z`}
                fill={colors[i % colors.length]}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-90 transition-opacity cursor-pointer"
              >
                <title>{`${key}: ${value.toFixed(3)}`}</title>
              </motion.path>
            );
          })}
        </svg>
        <div className="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Dominant</span>
          <span className="text-sm font-bold text-slate-800 px-2 line-clamp-1">{entries[0]?.[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-sm">
        {entries.map(([key, value], i) => (
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            key={key}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="font-medium text-slate-600 truncate max-w-[80px]" title={key}>{key}</span>
            </div>
            <span className="font-bold text-slate-900">{value.toFixed(2)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SignalEqualizer = ({ data }) => {
  // Take top 12 contributors for a clean "equalizer" look
  const topSignals = Object.entries(data)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 12);

  const max = Math.max(...topSignals.map(([, v]) => Math.abs(v)));

  return (
    <div className="w-full">
      <div className="h-64 flex items-end justify-between gap-1 pt-8 relative border-b border-slate-200">
        {topSignals.map(([key, value], index) => {
          const heightPercent = max > 0 ? (Math.abs(value) / max) * 100 : 0;
          return (
            <div key={key} className="relative flex-1 h-full flex flex-col justify-end group px-0.5">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-max max-w-[180px]">
                <div className="bg-slate-800 text-white text-xs rounded-md py-1.5 px-2.5 shadow-xl border border-slate-700 text-center backdrop-blur-md bg-slate-800/90">
                  <p className="font-bold mb-0.5 text-[10px] uppercase tracking-wider text-slate-300">Signal</p>
                  <p className="font-medium mb-1">{key.replace(/_/g, ' ')}</p>
                  <div className="h-px bg-slate-600 w-full my-1" />
                  <p className="font-mono text-blue-300 text-sm">{value.toFixed(4)}</p>
                </div>
                {/* Arrow */}
                <div className="w-2 h-2 bg-slate-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700"></div>
              </div>

              {/* Peak Line */}
              <motion.div
                initial={{ bottom: 0, opacity: 0 }}
                animate={{ bottom: `${heightPercent}%`, opacity: 0.5 }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.4, ease: "circOut" }}
                className="absolute w-full left-0 mx-0.5 h-[2px] bg-blue-400 mb-1 z-10"
              />

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: "backOut" }}
                className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 opacity-85 group-hover:opacity-100 transition-opacity relative overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
              </motion.div>
            </div>
          )
        })}
      </div>
      {/* Footer Labels - Rotated for fit */}
      <div className="flex justify-between mt-2 px-1">
        {topSignals.map(([key], i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate transform -rotate-45 origin-top-left mt-1 ml-2 w-16">
              {key.split('_')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- ADVANCED VISUALIZATIONS ---------- */

const RiskGauge = ({ score }) => {
  // Score 0-100 -> Angle -90 to 90
  const angle = (score / 100) * 180 - 90;

  const getColor = (s) => {
    if (s < 30) return "#22c55e"; // Green
    if (s < 60) return "#eab308"; // Yellow
    if (s < 80) return "#f97316"; // Orange
    return "#ef4444";             // Red
  };

  const color = getColor(score);

  return (
    <div className="relative w-48 h-24 sm:w-64 sm:h-32 flex justify-center overflow-hidden">
      {/* Background Arc */}
      <div className="absolute w-full h-full bg-slate-100 rounded-t-full border-t-[20px] sm:border-t-[30px] border-slate-100 box-border" />

      {/* Colored Arc */}
      <svg viewBox="0 0 200 100" className="w-full h-full absolute top-0 left-0">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
        />
      </svg>

      {/* Needle */}
      <motion.div
        initial={{ rotate: -90 }}
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        className="absolute bottom-0 left-1/2 w-1 h-[calc(100%-10px)] bg-slate-800 origin-bottom"
        style={{ transformOrigin: "bottom center", marginLeft: "-2px" }}
      >
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute -bottom-1.5 -left-1" />
      </motion.div>

      {/* Value Text */}
      <div className="absolute bottom-0 text-center">
        <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter" style={{ color }}>{score.toFixed(0)}</span>
      </div>
    </div>
  )
}

const StateRadar = ({ data }) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const max = Math.max(...values, 0.1);
  const count = keys.length;
  const radius = 80;
  const center = 100;

  // Calculate polygon points
  const points = values.map((val, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const r = (val / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  // Calculate axis lines
  const axes = keys.map((key, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return (
      <g key={key}>
        <line x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
        <text
          x={center + (radius + 20) * Math.cos(angle)}
          y={center + (radius + 20) * Math.sin(angle)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[8px] fill-slate-500 uppercase font-bold"
          style={{ fontSize: "8px" }}
        >
          {key}
        </text>
      </g>
    );
  });

  return (
    <div className="w-full flex justify-center py-4">
      <svg viewBox="0 0 250 250" className="w-64 h-64 overflow-visible">
        <g transform="translate(25, 25)">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
          <circle cx={center} cy={center} r={radius * 0.6} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
          {axes}
          <motion.polygon
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            points={points}
            fill="rgba(37, 99, 235, 0.2)"
            stroke="#2563eb"
            strokeWidth="2"
            className="drop-shadow-md"
          />
        </g>
      </svg>
    </div>
  );
}

const ThreatFeed = ({ scenarios }) => {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Shield size={48} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm font-medium">No active exploit scenarios detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {scenarios.map((scenario, i) => (
        <motion.div
          key={i}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-4 hover:shadow-sm transition-shadow"
        >
          <div className="bg-red-100 p-2 rounded-lg text-red-600 mt-0.5 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900 leading-tight mb-1">{scenario}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold bg-red-200 text-red-700 px-1.5 py-0.5 rounded tracking-wider">Critical</span>
              <span className="text-xs text-red-400">Potential Exploit Path</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


/* ---------- MAIN LAYOUT ---------- */

export default function Dashboard() {
  const [signals, setSignals] = useState(null);
  const [accessLevel, setAccessLevel] = useState("PI");
  const [attackingSkill, setAttackingSkill] = useState("EASY");
  const [userInteraction, setUserInteraction] = useState("NO");
  const [companyResources, setCompanyResources] = useState("NONE");
  const [environment, setEnvironment] = useState("SOL");
  const [companyPublic, setCompanyPublic] = useState(false);

  // State for parsed JSON data
  const [timeOfDay, setTimeOfDay] = useState("");
  const [sessionLength, setSessionLength] = useState(0);
  const [noise, setNoise] = useState(0);

  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState("");
  const [fileValid, setFileValid] = useState(false);
  const fileInputRef = useRef(null);
  const [openInfo, setOpenInfo] = useState(false);

  /* ---------- HANDLERS ---------- */

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      setError("Only JSON files are allowed");
      setFileValid(false);
      setFileName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const { time_of_day, session_length, Noise_State, ...signalsOnly } = parsed;

        setTimeOfDay(time_of_day);
        setSessionLength(session_length);
        setNoise(Noise_State);
        setSignals(signalsOnly);

        setFileName(file.name);
        setFileValid(true);
        setError("");
      } catch {
        setError("Invalid JSON structure");
        setFileValid(false);
        setFileName("");
      }
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setSignals(null);
    setFileName("");
    setFileValid(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      const body = {
        signals,
        time_of_day: timeOfDay,
        session_length: sessionLength,
        noise,
        environmental_factor: environment,
        access_level: accessLevel,
        attacking_skill: attackingSkill,
        user_interaction: userInteraction,
        company_resources_stake: companyResources,
        company_resources_public: companyPublic
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("API request failed");

      // Artificial delay for smooth UX
      await new Promise(r => setTimeout(r, 800));
      setResponse(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] pt-16">
      <Navbar />
      <InfoDialog open={openInfo} closeFn={setOpenInfo} />

      <main className="flex-1 p-6 md:p-8 overflow-hidden h-full flex flex-col md:flex-row gap-6">

        {/* ---------- CONFIGURATION PANEL (LEFT) ---------- */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto h-[calc(100vh-100px)] pr-2 pb-20 scrollbar-hide"
        >

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shield className="text-blue-600" size={20} />
              Simulation Config
            </h2>
            <button
              onClick={() => setOpenInfo(true)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <Info size={18} />
            </button>
          </div>

          {/* UPLOAD SECTION */}
          <div className={`p-5 rounded-2xl border-2 border-dashed transition-all duration-300 relative group
            ${fileValid
              ? "border-green-400 bg-green-50/50"
              : "border-slate-300 hover:border-blue-400 hover:bg-white"
            }
          `}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFile}
            />
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                    ${fileValid ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"}
                `}>
                {fileValid ? <CheckCircle size={24} /> : <Upload size={24} />}
              </div>
              <div>
                <p className="font-semibold text-slate-700">
                  {fileValid ? "Signal Data Loaded" : "Upload Signals JSON"}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">
                  {fileName || "Drag & drop or click to browse"}
                </p>
              </div>
            </div>

            {fileValid && (
              <button onClick={(e) => { e.stopPropagation(); removeFile(); }} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:text-red-500 z-20">
                <AlertCircle size={14} />
              </button>
            )}
          </div>

          {/* OPTIONS SCROLL */}
          <div className="space-y-1">
            <OptionCard title="Access Level" options={ACCESS_LEVEL} value={accessLevel} onChange={setAccessLevel} icon={Lock} />
            <OptionCard title="Attacking Skill" options={ATTACKING_SKILL} value={attackingSkill} onChange={setAttackingSkill} icon={Zap} />
            <OptionCard title="User Interaction" options={USER_INTERACTION} value={userInteraction} onChange={setUserInteraction} icon={MousePointer2} />
            <OptionCard title="Company Resources" options={COMPANY_RESOURCES} value={companyResources} onChange={setCompanyResources} icon={Target} />
            <OptionCard title="Environment" options={ENVIRONMENT} value={environment} onChange={setEnvironment} icon={Wifi} />

            {/* Toggle */}
            <div className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Public Resources</h3>
                <p className="text-xs text-slate-500">Is data publicly accessible?</p>
              </div>
              <button
                onClick={() => setCompanyPublic(!companyPublic)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${companyPublic ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${companyPublic ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* CALCULATE BUTTON */}
          <button
            onClick={submit}
            disabled={!fileValid || loading}
            className={`
                sticky bottom-0 w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fileValid && !loading
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:scale-[1.02]"
                : "bg-slate-200 text-slate-400"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Activity className="animate-spin" /> Processing...
              </span>
            ) : "Run Simulation"}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-enter">
              <AlertCircle size={16} /> {error}
            </div>
          )}

        </motion.div>


        {/* ---------- COMMAND CENTER (RIGHT) ---------- */}
        <div className="flex-1 h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">

          {!response ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 gap-4 border-2 border-dashed border-slate-200 rounded-3xl m-2">
              <BarChart3 size={64} strokeWidth={1} />
              <p className="text-lg font-medium">Awaiting Simulation Data</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2 pb-20 space-y-6">

              {/* TOP STATUS BAR - UPDATED LAYOUT */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* 1. MAIN SCORE GAUGE */}
                <div className="glass-card p-6 rounded-3xl col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Overall Risk Score</h3>
                  <RiskGauge score={response.total_score} />
                  <div className="flex gap-4 mt-6 text-center">
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Multiplier</p>
                      <p className="text-lg font-bold text-slate-700">{response.multiplier.toFixed(2)}x</p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Band</p>
                      <p className={`text-lg font-bold ${response.exploit_band === "LOW" ? "text-green-600" : "text-red-500"}`}>
                        {response.exploit_band}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. RADAR CHART */}
                <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-2 tracking-wider">Profile Shape</h3>
                  <StateRadar data={response.state_weights} />
                </div>

                {/* 3. THREAT FEED */}
                <div className="glass-card p-6 rounded-3xl flex flex-col">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider flex items-center gap-2">
                    <AlertTriangle size={16} /> Detected Scenarios
                  </h3>
                  <ThreatFeed scenarios={response.exploit_scenarios} />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: SIGNAL IMPACT */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6 rounded-3xl"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" />
                    Top Signal Contributors
                  </h3>
                  <SignalEqualizer data={response.signal_weights} />
                </motion.div>

                {/* RIGHT: STATE DISTRIBUTION (PIE) */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-3xl"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    Distribution Analysis
                  </h3>
                  <PieChart data={response.state_weights} />
                </motion.div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
