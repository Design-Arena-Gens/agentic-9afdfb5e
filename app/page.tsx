"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AnalysisResult,
  CompanyProfile,
  generateAnalysis,
  industryOptions,
  IndustryKey
} from "@/lib/generateAnalysis";

type FormState = {
  name: string;
  industry: IndustryKey;
  headquarters: string;
  targetAudience: string;
  differentiator: string;
  notes: string;
};

const defaultFormState: FormState = {
  name: "Amazon",
  industry: "ecommerce",
  headquarters: "Global",
  targetAudience: "digital-first consumers and marketplace sellers",
  differentiator: "end-to-end customer experience and fulfillment velocity",
  notes:
    "Leverages scale, logistics network, and ecosystem partnerships to dominate online retail and cloud infrastructure."
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      form.headquarters.trim().length > 1 &&
      form.targetAudience.trim().length > 5 &&
      form.differentiator.trim().length > 5
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsGenerating(true);
    window.requestAnimationFrame(() => {
      const profile: CompanyProfile = {
        name: form.name.trim(),
        industry: form.industry,
        headquarters: form.headquarters.trim(),
        targetAudience: form.targetAudience.trim(),
        differentiator: form.differentiator.trim(),
        notes: form.notes.trim()
      };

      const result = generateAnalysis(profile);
      setAnalysis(result);
      setIsGenerating(false);
    });
  };

  const handleReset = () => {
    setForm(defaultFormState);
    setAnalysis(null);
  };

  return (
    <main>
      <div className="app-shell">
        <div className="app-shell__inner">
          <header className="app-header">
            <h1 className="app-title">AI Business Decision Support Tool</h1>
            <p className="app-subtitle">
              Select any company and instantly generate strategic intelligence: SWOT, PESTLE,
              competitor landscape, pricing & marketing playbooks, plus a growth roadmap.
            </p>
          </header>

          <div className="app-grid">
            <aside className="panel panel--form">
              <h2 className="panel__title">Company Profile</h2>
              <form onSubmit={handleSubmit} className="panel__form">
                <div className="field-group">
                  <label htmlFor="name">Company Name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="e.g. Amazon"
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="industry">Industry Focus</label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, industry: event.target.value as IndustryKey }))
                    }
                  >
                    {industryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="hq">Primary Market / Headquarters</label>
                  <input
                    id="hq"
                    value={form.headquarters}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, headquarters: event.target.value }))
                    }
                    placeholder="e.g. North America, India, Global"
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="audience">Target Audience</label>
                  <input
                    id="audience"
                    value={form.targetAudience}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, targetAudience: event.target.value }))
                    }
                    placeholder="e.g. SMB retailers, urban millennials"
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="edge">Signature Differentiator</label>
                  <input
                    id="edge"
                    value={form.differentiator}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, differentiator: event.target.value }))
                    }
                    placeholder="e.g. AI-driven personalization"
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="notes">Strategic Context</label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    placeholder="What milestones, ambitions, or challenges matter most right now?"
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={!isFormValid || isGenerating}
                  >
                    {isGenerating ? "Generating…" : "Generate Playbook"}
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    style={{
                      background: "rgba(15, 23, 42, 0.75)",
                      border: "1px solid rgba(96, 165, 250, 0.4)",
                      color: "#bfdbfe"
                    }}
                    onClick={handleReset}
                    disabled={isGenerating}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </aside>

            <section className="analysis-grid">
              {analysis ? (
                <>
                  <article className="analysis-card">
                    <div className="badge">Snapshot Metrics</div>
                    <div className="metrics-row">
                      <div className="metric">
                        <div className="metric__label">Differentiation</div>
                        <div className="metric__value">{analysis.metrics.differentiationScore}</div>
                      </div>
                      <div className="metric">
                        <div className="metric__label">Pricing Power</div>
                        <div className="metric__value">{analysis.metrics.pricingPower}</div>
                      </div>
                      <div className="metric">
                        <div className="metric__label">Expansion Readiness</div>
                        <div className="metric__value">{analysis.metrics.expansionReadiness}</div>
                      </div>
                    </div>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">SWOT Analysis</div>
                    <div className="analysis-card__grid analysis-card__grid--two">
                      <div>
                        <h3>Strengths</h3>
                        <ul className="list">
                          {analysis.swot.strengths.map((item, index) => (
                            <li key={`strength-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Weaknesses</h3>
                        <ul className="list">
                          {analysis.swot.weaknesses.map((item, index) => (
                            <li key={`weakness-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Opportunities</h3>
                        <ul className="list">
                          {analysis.swot.opportunities.map((item, index) => (
                            <li key={`opportunity-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Threats</h3>
                        <ul className="list">
                          {analysis.swot.threats.map((item, index) => (
                            <li key={`threat-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">PESTLE Analysis</div>
                    <div className="analysis-card__grid analysis-card__grid--two">
                      <div>
                        <h3>Political</h3>
                        <ul className="list">
                          {analysis.pestle.political.map((item, index) => (
                            <li key={`political-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Economic</h3>
                        <ul className="list">
                          {analysis.pestle.economic.map((item, index) => (
                            <li key={`economic-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Social</h3>
                        <ul className="list">
                          {analysis.pestle.social.map((item, index) => (
                            <li key={`social-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Technological</h3>
                        <ul className="list">
                          {analysis.pestle.technological.map((item, index) => (
                            <li key={`technological-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Legal</h3>
                        <ul className="list">
                          {analysis.pestle.legal.map((item, index) => (
                            <li key={`legal-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Environmental</h3>
                        <ul className="list">
                          {analysis.pestle.environmental.map((item, index) => (
                            <li key={`environmental-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">Competitor Landscape</div>
                    <div className="competitors">
                      {analysis.competitors.map((competitor, index) => (
                        <div className="competitor-item" key={competitor.name + index}>
                          <div className="competitor-item__title">{competitor.name}</div>
                          <div className="competitor-item__summary">{competitor.summary}</div>
                          <div className="competitor-item__edge">{competitor.edge}</div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">Pricing Strategy</div>
                    <h3>{analysis.pricing.headline}</h3>
                    <ul className="list">
                      {analysis.pricing.pillars.map((pillar, index) => (
                        <li key={`price-${index}`}>{pillar}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">Marketing Strategy</div>
                    <h3>{analysis.marketing.positioning}</h3>
                    <div className="analysis-card__grid analysis-card__grid--two">
                      <div>
                        <h3>Priority Channels</h3>
                        <ul className="list">
                          {analysis.marketing.channels.map((channel, index) => (
                            <li key={`channel-${index}`}>{channel}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>Campaign Concepts</h3>
                        <ul className="list">
                          {analysis.marketing.campaigns.map((campaign, index) => (
                            <li key={`campaign-${index}`}>{campaign}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>

                  <article className="analysis-card">
                    <div className="badge">Growth Plan</div>
                    <div className="plan-blocks">
                      {analysis.growth.map((plan) => (
                        <div className="plan-block" key={plan.horizon}>
                          <div className="plan-block__title">
                            {plan.horizon === "short-term" && "0-6 Months"}
                            {plan.horizon === "mid-term" && "6-18 Months"}
                            {plan.horizon === "long-term" && "18+ Months"}
                          </div>
                          <div className="plan-block__description">{plan.focus}</div>
                          <ul className="list" style={{ marginTop: "12px" }}>
                            {plan.actions.map((action, index) => (
                              <li key={`${plan.horizon}-${index}`}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </article>
                </>
              ) : (
                <div className="empty-state">
                  <strong>No analysis yet.</strong>
                  <span>
                    Populate the company profile and hit “Generate Playbook” to unlock a full strategic
                    snapshot in seconds.
                  </span>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
