import { clients } from "@/content/site";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Clients() {
  return (
    <section className="section" id="clientes">
      <div className="wrap">
        <SectionHeader
          number={clients.eyebrow}
          label={clients.eyebrowLabel}
          title={clients.title}
          lead={clients.lead}
        />

        <div className="client-list">
          {clients.groups.map((group, index) => (
            <Reveal key={group.area} delay={index * 40}>
              <div className="client-group">
                <p className="t-eyebrow c-tertiary">{group.area}</p>
                <ul className="stack-sm client-names">
                  {group.clients.map((client) => (
                    <li className="client-name" key={client}>
                      {client}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
