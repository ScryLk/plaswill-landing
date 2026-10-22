import { about } from "@/content/site";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function About() {
  return (
    <section className="section" id="sobre">
      <div className="wrap">
        <SectionHeader
          number={about.eyebrow}
          label={about.eyebrowLabel}
          title={about.title}
        />

        <div className="about-grid">
          <Reveal className="about-text">
            <div className="stack">
              {about.paragraphs.map((paragraph) => (
                <p className="t-body c-muted" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ol className="capability-list">
              {about.capabilities.map((capability) => (
                <li className="capability" key={capability.code}>
                  <span className="t-code c-petrol capability-code">
                    {capability.code}
                  </span>
                  <div className="stack-sm">
                    <h3 className="t-subhead">{capability.title}</h3>
                    <p className="t-small c-muted">{capability.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
