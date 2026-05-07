// app/settings/page.tsx
// Settings — API keys, model preferences, and app configuration

"use client";

import { useState } from "react";
import {
  Key,
  Server,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { cn, AVAILABLE_MODELS } from "@/lib/utils";

// ─── Section wrapper ───────────────────────────────────────────────────────

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-gray-100 bg-white
                  shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
        <div
          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100
                      flex items-center justify-center shrink-0 mt-0.5"
        >
          <Icon size={15} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

// ─── API Key field ─────────────────────────────────────────────────────────

function ApiKeyField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200",
            "text-sm text-gray-900 placeholder:text-gray-400 bg-white",
            "focus:outline-none focus:border-gray-400 focus:ring-1",
            "focus:ring-gray-100 transition-all font-mono"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function SettingsPage() {
  // API keys state
  const [keys, setKeys] = useState({
    mistral: "",
    groq: "",
    google: "",
  });

  // Endpoint config
  const [apiBase, setApiBase] = useState("http://localhost:4000");
  const [timeout, setTimeout_] = useState("30");

  // Model defaults
  const [defaultModels, setDefaultModels] = useState<string[]>([
    "mistral",
    "groq-llama3",
  ]);

  // Save state
  const [saved, setSaved] = useState(false);

  const toggleDefaultModel = (id: string) => {
    setDefaultModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    // In production: persist to localStorage or send to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setKeys({ mistral: "", groq: "", google: "" });
    setApiBase("http://localhost:8000");
    setTimeout_("30");
    setDefaultModels(["mistral", "groq-llama3"]);
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure API keys, backend endpoints, and model defaults.
        </p>
      </div>

      {/* ── API Keys ── */}
      <SettingsSection
        title="API Keys"
        description="Keys are stored locally and never sent to our servers."
        icon={Key}
      >
        <div className="space-y-4">
          <ApiKeyField
            label="Mistral AI"
            placeholder="sk-mistral-…"
            value={keys.mistral}
            onChange={(v) => setKeys((p) => ({ ...p, mistral: v }))}
          />
          <ApiKeyField
            label="Groq"
            placeholder="gsk_…"
            value={keys.groq}
            onChange={(v) => setKeys((p) => ({ ...p, groq: v }))}
          />
          <ApiKeyField
            label="Google AI (Gemma)"
            placeholder="AIza…"
            value={keys.google}
            onChange={(v) => setKeys((p) => ({ ...p, google: v }))}
          />
          <p className="text-[11px] text-gray-400 pt-1">
            Keys are used only in your browser session and are not persisted
            unless you explicitly save them.
          </p>
        </div>
      </SettingsSection>

      {/* ── Backend config ── */}
      <SettingsSection
        title="Backend Configuration"
        description="Configure your evaluation API endpoint and timeouts."
        icon={Server}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              API Base URL
            </label>
            <input
              type="url"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="http://localhost:8000"
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border border-gray-200",
                "text-sm text-gray-900 placeholder:text-gray-400 bg-white",
                "focus:outline-none focus:border-gray-400 focus:ring-1",
                "focus:ring-gray-100 transition-all font-mono"
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              Request Timeout (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={timeout}
              onChange={(e) => setTimeout_(e.target.value)}
              className={cn(
                "w-32 px-3.5 py-2.5 rounded-xl border border-gray-200",
                "text-sm text-gray-900 bg-white",
                "focus:outline-none focus:border-gray-400 focus:ring-1",
                "focus:ring-gray-100 transition-all"
              )}
            />
          </div>
        </div>
      </SettingsSection>

      {/* ── Default models ── */}
      <SettingsSection
        title="Default Model Selection"
        description="Models pre-selected when you open a new Playground session."
        icon={Server}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = defaultModels.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggleDefaultModel(model.id)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl border",
                  "text-left transition-all duration-150",
                  isSelected
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
                aria-pressed={isSelected}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: model.color }}
                />
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium truncate",
                      isSelected ? "text-white" : "text-gray-900"
                    )}
                  >
                    {model.name}
                  </p>
                  <p
                    className={cn(
                      "text-[10px]",
                      isSelected ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {model.provider}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* ── Action buttons ── */}
      <div className="flex items-center gap-3 pb-6">
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl",
            "text-sm font-semibold text-white shadow-sm",
            "transition-all duration-200",
            saved ? "bg-emerald-600" : "bg-gray-900 hover:bg-gray-700"
          )}
        >
          {saved ? (
            <>
              <CheckCircle size={14} />
              Saved!
            </>
          ) : (
            <>
              <Save size={14} />
              Save Settings
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                     border border-gray-200 bg-white text-sm font-medium
                     text-gray-600 hover:bg-gray-50 hover:border-gray-300
                     transition-all"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </div>
  );
}