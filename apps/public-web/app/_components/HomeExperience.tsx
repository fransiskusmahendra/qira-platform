"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { trackConversion } from "./ConversionTracker";
import { HeroArtwork, SolutionArtwork } from "./CrispVisuals";
import { useLanguage } from "../../lib/i18n";

export function HeroExplainer() {
  const { t } = useLanguage();
  const steps = t.hero.flowSteps;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % steps.length), 2200);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="heroExplainer" aria-label={t.hero.flowAria}>
      <figure className="visualStoryCard heroExplainerImage">
        <HeroArtwork />
      </figure>
      <ol className="heroSteps">
        {steps.map((step, index) => (
          <li className={active === index ? "active" : ""} key={step.label}>
            <button
              type="button"
              onClick={() => {
                setActive(index);
                void trackConversion("hero_explainer_interact");
              }}
              aria-pressed={active === index}
            >
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SolutionExplorer() {
  const { t } = useLanguage();
  const items = t.solutions.items;
  const [active, setActive] = useState(0);
  const selected = items[active] || items[0];

  return (
    <div className="solutionExplorer">
      <div className="solutionTabs" role="tablist" aria-label={t.solutions.heading}>
        {items.map((item, index) => (
          <button
            aria-controls="solution-panel"
            aria-selected={active === index}
            className={active === index ? "active" : ""}
            id={`solution-tab-${index}`}
            key={item.number}
            onClick={() => {
              setActive(index);
              void trackConversion("solution_explore");
            }}
            role="tab"
            type="button"
          >
            <span>{item.number}</span>
            {item.problem}
          </button>
        ))}
      </div>
      <div className="solutionPanel" id="solution-panel" role="tabpanel" aria-labelledby={`solution-tab-${active}`}>
        <div className="solutionCopy" key={selected.problem}>
          <p className="solutionProblem">{t.solutions.problemLabel}</p>
          <h3>{selected.question}</h3>
          <div
            className="solutionFlow"
            aria-label={`${selected.problem}, ditangani dengan ${selected.solution}, menghasilkan ${selected.result}`}
          >
            <span>
              <small>{t.solutions.qiraMakes}</small>
              <strong>{selected.solution}</strong>
            </span>
            <i aria-hidden="true">â†’</i>
            <span>
              <small>{t.solutions.resultLabel}</small>
              <strong>{selected.result}</strong>
            </span>
          </div>
          <Link href="/coba-masalah" data-conversion="homepage_cta_click">
            {t.solutions.cta} â†’
          </Link>
        </div>
        <figure className={`solutionVisual crop-${selected.imagePosition}`} key={`${selected.problem}-image`}>
          <SolutionArtwork kind={selected.problem} />
        </figure>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const { t } = useLanguage();
  const [position, setPosition] = useState(50);

  return (
    <div className="beforeAfter">
      <div className="beforeAfterStage">
        <div className="beforeAfterImages" role="img" aria-label={t.beforeAfter.imageAria}>
          <Image
            className="afterImage"
            src="/illustrations/premium/qira-after-workflow.webp"
            alt="Alur kerja digital QIRA yang rapi, terhubung, dan mudah dipantau"
            fill
            quality={90}
            sizes="(max-width: 760px) 100vw, 1160px"
          />
          <Image
            aria-hidden="true"
            className="beforeImage"
            src="/illustrations/premium/qira-before-workflow.webp"
            alt=""
            fill
            quality={90}
            sizes="(max-width: 760px) 100vw, 1160px"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          />
        </div>
        <div className="beforeAfterDivider" style={{ left: `${position}%` }} aria-hidden="true">
          <span>â†”</span>
        </div>
        <span className="stateLabel beforeLabel">{t.beforeAfter.beforeLabel}</span>
        <span className="stateLabel afterLabel">{t.beforeAfter.afterLabel}</span>
      </div>
      <label className="beforeAfterControl">
        <span>{t.beforeAfter.sliderLabel}</span>
        <input
          aria-label={t.beforeAfter.sliderAria}
          type="range"
          min="8"
          max="92"
          value={position}
          onChange={(event) => {
            setPosition(Number(event.target.value));
            void trackConversion("before_after_interact");
          }}
        />
      </label>
      <div className="outcomeStrip">
        {t.beforeAfter.outcomes.map((outcome) => (
          <span key={outcome}>{outcome}</span>
        ))}
      </div>
    </div>
  );
}

export function ApplicationShowcase() {
  const { t } = useLanguage();
  const examples = t.applications.examples;
  const [active, setActive] = useState(0);
  const selected = examples[active] || examples[0];

  return (
    <div className="applicationShowcase">
      <div className="applicationTabs" role="tablist" aria-label={t.applications.heading}>
        {examples.map((item, index) => (
          <button
            className={active === index ? "active" : ""}
            aria-selected={active === index}
            key={item.label}
            onClick={() => {
              setActive(index);
              void trackConversion("application_example_interact");
            }}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="applicationCard" role="tabpanel" key={selected.label}>
        <div>
          <p className="kicker">{selected.label}</p>
          <h3>{selected.title}</h3>
          <p>{selected.result}</p>
          <Link href="/contoh-penerapan" data-conversion="homepage_cta_click">
            {t.applications.viewMore} â†’
          </Link>
        </div>
        <ol>
          {selected.items.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}