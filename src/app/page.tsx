import { Bilingual } from "@/components/Bilingual";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CloseIcon,
  DownloadIcon,
  MenuIcon,
} from "@/components/Icons";
import { ClientRuntime } from "@/components/ClientRuntime";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { PreferenceControls } from "@/components/PreferenceControls";
import { LoopVideo } from "@/components/LoopVideo";
import { SystemAtlas } from "@/components/SystemAtlas";
import {
  capabilities,
  contact,
  credential,
  experience,
  hero,
  interfaceCopy,
  media,
  navItems,
  recognition,
  site,
  systemAtlas,
  work,
} from "@/content/portfolio";
import type { LocalizedText, ProjectLink } from "@/content/portfolio";

type SectionIntroProps = Readonly<{
  index: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro?: LocalizedText;
  id?: string;
}>;

function SectionIntro({ index, eyebrow, title, intro, id }: SectionIntroProps) {
  return (
    <header className="section-intro reveal" data-reveal>
      <div className="section-meta">
        <span className="section-number" aria-hidden="true">
          {index}
        </span>
        <p className="section-eyebrow">
          <Bilingual text={eyebrow} />
        </p>
      </div>
      <div className="section-intro-copy">
        <h2 id={id}>
          <Bilingual text={title} />
        </h2>
        {intro ? (
          <p>
            <Bilingual text={intro} />
          </p>
        ) : null}
      </div>
    </header>
  );
}

function NavLinks({ mobile = false }: Readonly<{ mobile?: boolean }>) {
  return (
    <nav
      className={mobile ? "mobile-nav" : "desktop-nav"}
      aria-label={`${interfaceCopy.menuLabel.en} / ${interfaceCopy.menuLabel.ar}`}
    >
      {navItems.map((item) => (
        <a href={item.href} key={item.href}>
          <Bilingual text={item.label} />
        </a>
      ))}
    </nav>
  );
}

function TagList({ items }: Readonly<{ items: readonly string[] }>) {
  return (
    <ul className="tag-list" aria-label="Technologies / التقنيات">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ProjectLinks({ links }: Readonly<{ links: readonly ProjectLink[] }>) {
  if (links.length === 0) {
    return (
      <p className="private-work">
        <span aria-hidden="true" />
        <Bilingual text={interfaceCopy.privateWork} />
      </p>
    );
  }

  return (
    <div className="project-links">
      {links.map((link) => (
        <a
          href={link.href}
          key={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
        >
          <Bilingual text={link.label} />
          <ArrowUpRightIcon />
          {link.external ? (
            <span className="sr-only">
              {` — ${interfaceCopy.external.en} / ${interfaceCopy.external.ar}`}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}

function CaseBlueprint({ number, company }: Readonly<{ number: string; company: string }>) {
  return (
    <div className="case-blueprint" aria-hidden="true">
      <span className="blueprint-grid" />
      <span className="blueprint-orbit blueprint-orbit-one" />
      <span className="blueprint-orbit blueprint-orbit-two" />
      <span className="blueprint-axis" />
      <strong>{company}</strong>
      <span className="blueprint-number">{number}</span>
      <div className="blueprint-flow">
        <span>INPUT</span>
        <ArrowRightIcon />
        <span>LOGIC</span>
        <ArrowRightIcon />
        <span>PRODUCT</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <aside className="credential-rail" aria-label={`${credential.full.en} / ${credential.full.ar}`}>
        <div className="credential-rail-inner shell">
          <span className="credential-seal" aria-hidden="true">
            SCE
          </span>
          <p>
            <Bilingual text={credential.full} />
          </p>
          <span className="credential-validity">
            <Bilingual text={credential.valid} />
          </span>
        </div>
      </aside>

      <header className="site-header">
        <div className="site-header-inner shell">
          <a
            className="wordmark"
            href="#top"
          >
            <span className="wordmark-monogram" aria-hidden="true">
              MA
            </span>
            <span className="wordmark-copy">
              <strong>Marwan Aljijakli</strong>
              <small>AI / DATA / PRODUCT</small>
            </span>
            <span className="sr-only">
              {`— ${interfaceCopy.home.en} / ${interfaceCopy.home.ar}`}
            </span>
          </a>

          <NavLinks />

          <div className="header-actions">
            <PreferenceControls />
            <details className="mobile-menu">
              <summary aria-label={`${interfaceCopy.menu.en} / ${interfaceCopy.menu.ar}`}>
                <MenuIcon className="menu-icon menu-icon-open" />
                <CloseIcon className="menu-icon menu-icon-close" />
              </summary>
              <div className="mobile-menu-panel">
                <NavLinks mobile />
                <a className="mobile-cv" href={site.cv} download>
                  <Bilingual text={hero.secondaryCta} />
                  <DownloadIcon />
                </a>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-media-wrap">
            <LoopVideo asset={media.introduction} eager compactCaption className="hero-media" />
          </div>
          <div className="hero-vignette" aria-hidden="true" />

          <div className="hero-layout shell">
            <div className="hero-copy">
              <p className="hero-eyebrow hero-enter hero-enter-1">
                <span aria-hidden="true" />
                <Bilingual text={hero.eyebrow} />
              </p>

              <h1 id="hero-title" className="hero-enter hero-enter-2">
                <span className="hero-name">Marwan Aljijakli</span>
                {hero.titleLines.en.map((line) => (
                  <span className="hero-thesis-line copy-en" key={line}>
                    {line}
                  </span>
                ))}
                {hero.titleLines.ar.map((line) => (
                  <span className="hero-thesis-line copy-ar" lang="ar" key={line}>
                    {line}
                  </span>
                ))}
              </h1>

              <p className="hero-lead hero-enter hero-enter-3">
                <Bilingual text={hero.lead} />
              </p>

              <div className="hero-actions hero-enter hero-enter-4">
                <a className="button button-primary" href="#work">
                  <Bilingual text={hero.primaryCta} />
                  <ArrowDownIcon />
                </a>
                <a className="button button-quiet" href={site.cv} download>
                  <Bilingual text={hero.secondaryCta} />
                  <DownloadIcon />
                </a>
              </div>
            </div>

            <aside className="hero-credential hero-enter hero-enter-4">
              <div className="hero-portrait">
                {/* The supplied portrait is already a lightweight 10 KB WebP. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/marwan-portrait.webp"
                  width="370"
                  height="373"
                  fetchPriority="high"
                  alt={`${hero.portraitAlt.en} / ${hero.portraitAlt.ar}`}
                />
              </div>
              <div className="hero-credential-copy">
                <span className="credential-seal">SCE</span>
                <p>
                  <Bilingual text={credential.short} />
                </p>
                <strong>
                  <Bilingual text={credential.numberLabel} /> {credential.number}
                </strong>
                <small>
                  <Bilingual text={credential.valid} />
                </small>
              </div>
            </aside>
          </div>

          <div className="hero-proof shell hero-enter hero-enter-5">
            {hero.proof.map((item) => (
              <div className="hero-proof-item" key={item.value}>
                <span>{item.value}</span>
                <p>
                  <Bilingual text={item.label} />
                </p>
              </div>
            ))}
            <p className="hero-location">
              <span className="location-dot" aria-hidden="true" />
              <Bilingual text={site.location} />
            </p>
          </div>
        </section>

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="shell">
            <SectionIntro
              index="01"
              eyebrow={work.eyebrow}
              title={work.title}
              intro={work.intro}
              id="work-title"
            />

            <div className="case-list">
              {work.cases.map((project, index) => (
                <article
                  className={`case-study reveal ${index % 2 === 1 ? "case-study-reverse" : ""}`}
                  data-reveal
                  key={project.number}
                >
                  <div className="case-visual">
                    {project.media ? (
                      <LoopVideo asset={project.media} className="case-video" />
                    ) : (
                      <CaseBlueprint number={project.number} company={project.company} />
                    )}
                  </div>

                  <div className="case-copy">
                    <div className="case-meta">
                      <span>{project.number}</span>
                      <p>
                        <Bilingual text={project.kind} />
                      </p>
                    </div>
                    <p className="case-company">{project.company}</p>
                    <h3>
                      <Bilingual text={project.title} />
                    </h3>
                    <p className="case-description">
                      <Bilingual text={project.description} />
                    </p>
                    <ul className="case-facts">
                      {project.facts.map((fact) => (
                        <li key={fact.en}>
                          <span aria-hidden="true" />
                          <Bilingual text={fact} />
                        </li>
                      ))}
                    </ul>
                    <TagList items={project.stack} />
                    <ProjectLinks links={project.links} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section systems-section" id="systems" aria-labelledby="systems-title">
          <div className="shell">
            <SectionIntro
              index="02"
              eyebrow={systemAtlas.eyebrow}
              title={systemAtlas.title}
              intro={systemAtlas.intro}
              id="systems-title"
            />

            <div className="systems-layout">
              <SystemAtlas />
              <ol className="system-layer-list">
                {systemAtlas.layers.map((layer) => (
                  <li className="reveal" data-reveal key={layer.number}>
                    <span>{layer.number}</span>
                    <div>
                      <h3>
                        <Bilingual text={layer.title} />
                      </h3>
                      <p>
                        <Bilingual text={layer.detail} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="shell">
            <SectionIntro
              index="03"
              eyebrow={experience.eyebrow}
              title={experience.title}
              id="experience-title"
            />

            <ol className="role-list">
              {experience.roles.map((role, index) => (
                <li className="role-row reveal" data-reveal key={role.company}>
                  <span className="role-index">0{index + 1}</span>
                  <div className="role-identity">
                    <p>{role.company}</p>
                    <h3>
                      <Bilingual text={role.role} />
                    </h3>
                  </div>
                  <div className="role-detail">
                    <p className="role-date">
                      <Bilingual text={role.date} />
                      {role.current ? (
                        <span className="current-role">
                          <span aria-hidden="true" />
                          <Bilingual text={interfaceCopy.current} />
                        </span>
                      ) : null}
                    </p>
                    <p>
                      <Bilingual text={role.summary} />
                    </p>
                    <TagList items={role.stack} />
                  </div>
                </li>
              ))}
            </ol>

            <div className="capabilities-heading reveal" data-reveal>
              <p>
                <Bilingual text={capabilities.eyebrow} />
              </p>
              <h2>
                <Bilingual text={capabilities.title} />
              </h2>
            </div>

            <div className="capability-grid">
              {capabilities.groups.map((group) => (
                <article className="capability-group reveal" data-reveal key={group.number}>
                  <header>
                    <span>{group.number}</span>
                    <h3>
                      <Bilingual text={group.title} />
                    </h3>
                  </header>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section recognition-section" id="recognition" aria-labelledby="recognition-title">
          <div className="shell">
            <SectionIntro
              index="04"
              eyebrow={recognition.eyebrow}
              title={recognition.title}
              id="recognition-title"
            />

            <LoopVideo asset={media.awards} className="recognition-film" />

            <div className="recognition-layout">
              <ol className="award-list">
                {recognition.awards.map((award, index) => (
                  <li className="award-row reveal" data-reveal key={award.title.en}>
                    <span className="award-index">0{index + 1}</span>
                    <strong>
                      <Bilingual text={award.place} />
                    </strong>
                    <div>
                      <h3>
                        <Bilingual text={award.title} />
                      </h3>
                      <p>
                        <Bilingual text={award.meta} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <aside className="sce-card reveal" data-reveal>
                <div className="sce-card-head">
                  <span className="credential-seal">SCE</span>
                  <span>
                    <Bilingual text={credential.activeTag} />
                  </span>
                </div>
                <p>
                  <Bilingual text={credential.short} />
                </p>
                <strong>{credential.number}</strong>
                <small>
                  <Bilingual text={credential.valid} />
                </small>
              </aside>
            </div>

            <div className="education-layout">
              <LoopVideo asset={media.certifications} className="education-film" />
              <article className="education-copy reveal" data-reveal>
                <div className="education-gpa">
                  <span>
                    <Bilingual text={recognition.education.gpaLabel} />
                  </span>
                  <strong>{recognition.education.gpa}</strong>
                </div>
                <p className="education-label">
                  <Bilingual text={recognition.education.label} />
                </p>
                <h3>
                  <Bilingual text={recognition.education.degree} />
                </h3>
                <p className="education-specialization">
                  <Bilingual text={recognition.education.specialization} />
                </p>
                <p className="education-institution">
                  <Bilingual text={recognition.education.institution} />
                </p>
                <ul className="training-list">
                  {recognition.training.map((item) => (
                    <li key={item.en}>
                      <Bilingual text={item} />
                    </li>
                  ))}
                </ul>
                <p className="leadership-line">
                  <Bilingual text={recognition.leadership} />
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <LoopVideo asset={media.contact} className="contact-film" />
          <div className="contact-overlay" aria-hidden="true" />
          <div className="contact-shell shell">
            <div className="contact-copy reveal" data-reveal>
              <p className="contact-eyebrow">
                <span>05</span>
                <Bilingual text={contact.eyebrow} />
              </p>
              <h2 id="contact-title">
                <Bilingual text={contact.title} />
              </h2>
              <p className="contact-body">
                <Bilingual text={contact.body} />
              </p>
            </div>

            <div className="contact-panel reveal" data-reveal>
              <a className="contact-email" href={`mailto:${site.email}`}>
                <span>{site.email}</span>
                <ArrowUpRightIcon />
              </a>
              <div className="contact-actions">
                <CopyEmailButton />
                <a href={site.phoneHref}>
                  <Bilingual text={contact.phoneLabel} />
                  <span>{site.phoneDisplay}</span>
                </a>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer">
                  <Bilingual text={contact.linkedinLabel} />
                  <ArrowUpRightIcon />
                </a>
                <a href={site.social.github} target="_blank" rel="noreferrer">
                  <Bilingual text={contact.githubLabel} />
                  <ArrowUpRightIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner shell">
          <a className="footer-mark" href="#top">
            MA
            <span className="sr-only">
              {`${interfaceCopy.home.en} / ${interfaceCopy.home.ar}`}
            </span>
          </a>
          <p>
            <span>© {new Date().getFullYear()} Marwan Aljijakli.</span>
            <Bilingual text={interfaceCopy.footer} />
          </p>
          <a className="footer-top" href="#top">
            <Bilingual text={interfaceCopy.home} />
            <span aria-hidden="true" />
          </a>
        </div>
      </footer>
      <ClientRuntime />
    </>
  );
}
