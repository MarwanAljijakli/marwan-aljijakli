import { Bilingual } from "@/components/Bilingual";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CloseIcon,
  DownloadIcon,
  MenuIcon,
} from "@/components/Icons";
import {
  ClientRuntime,
  CopyEmailButton,
  PreferenceControls,
} from "@/components/ClientRuntime";
import {
  contact,
  experience,
  hero,
  interfaceCopy,
  navItems,
  profile,
  recognition,
  site,
  toolkit,
  work,
} from "@/content/portfolio";
import type { LocalizedText, ProjectLink } from "@/content/portfolio";

type SectionHeadingProps = Readonly<{
  index: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro?: LocalizedText;
}>;

function SectionHeading({ index, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <header className="section-heading reveal" data-reveal>
      <div className="section-kicker">
        <span className="section-index" aria-hidden="true">
          {index}
        </span>
        <span className="section-eyebrow">
          <Bilingual text={eyebrow} />
        </span>
      </div>
      <h2>
        <Bilingual text={title} />
      </h2>
      {intro ? (
        <p className="section-intro">
          <Bilingual text={intro} />
        </p>
      ) : null}
    </header>
  );
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
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

function TechList({ items }: { items: readonly string[] }) {
  return (
    <ul className="tech-list" aria-label="Technologies / التقنيات">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ProjectLinks({ links }: { links: readonly ProjectLink[] }) {
  if (links.length === 0) {
    return (
      <span className="project-private">
        <span className="private-dot" aria-hidden="true" />
        <Bilingual text={interfaceCopy.privateWork} />
      </span>
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

export default function HomePage() {
  return (
    <>
      <ClientRuntime />

      <header className="site-header">
        <div className="site-header-inner shell">
          <a
            className="wordmark"
            href="#top"
            aria-label={`${site.name} — ${interfaceCopy.home.en} / ${interfaceCopy.home.ar}`}
          >
            <span className="wordmark-mark" aria-hidden="true">
              <span>M</span>
              <span>A</span>
            </span>
            <span className="wordmark-name">Marwan Aljijakli</span>
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

      <main
        id="main-content"
        aria-label="Marwan Aljijakli portfolio / ملف أعمال مروان الجيجكلي"
      >
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid shell">
            <div className="hero-copy">
              <p className="hero-eyebrow hero-enter hero-enter-1">
                <span className="eyebrow-line" aria-hidden="true" />
                <Bilingual text={hero.eyebrow} />
              </p>

              <h1 id="hero-title" className="hero-name hero-enter hero-enter-2">
                <span className="hero-first-name">Marwan</span>
                <span className="hero-last-name">Aljijakli</span>
              </h1>

              <p className="hero-lead hero-enter hero-enter-3">
                <Bilingual text={hero.lead} />
              </p>

              <p className="hero-summary hero-enter hero-enter-4">
                <Bilingual text={hero.summary} />
              </p>

              <p className="hero-status hero-enter hero-enter-4">
                <span className="status-line" aria-hidden="true" />
                <Bilingual text={hero.status} />
              </p>

              <div className="hero-actions hero-enter hero-enter-5">
                <a className="button button-primary" href="#work">
                  <Bilingual text={hero.primaryCta} />
                  <ArrowDownIcon />
                </a>
                <a className="button button-secondary" href={site.cv} download>
                  <Bilingual text={hero.secondaryCta} />
                  <DownloadIcon />
                </a>
              </div>
            </div>

            <div
              className="hero-visual hero-enter hero-enter-3"
              role="group"
              aria-label="Marwan Aljijakli portrait and working range / صورة مروان الجيجكلي ونطاق عمله"
            >
              <div className="portrait-grid" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <figure className="portrait-frame">
                {/* This is already a 10 KB WebP with explicit dimensions; no runtime optimizer is needed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/marwan-portrait.webp"
                  width="370"
                  height="373"
                  fetchPriority="high"
                  alt={`${hero.portraitAlt.en} / ${hero.portraitAlt.ar}`}
                />
                <figcaption>
                  <span>MARWAN ALJIJAKLI</span>
                  <span>JEDDAH / 2026</span>
                </figcaption>
              </figure>

              <div className="system-map">
                <p className="system-map-label">
                  <Bilingual text={hero.systemLabel} />
                </p>
                <ol>
                  {hero.systemSteps.map((step, index) => (
                    <li key={step.en}>
                      <span className="system-step-index">0{index + 1}</span>
                      <Bilingual text={step} />
                    </li>
                  ))}
                </ol>
              </div>
              <span className="visual-corner visual-corner-top" aria-hidden="true" />
              <span className="visual-corner visual-corner-bottom" aria-hidden="true" />
            </div>
          </div>

          <div
            className="proof-rail shell hero-enter hero-enter-5"
            role="group"
            aria-label="Verified highlights / أبرز المعلومات الموثقة"
          >
            {hero.proof.map((item, index) => (
              <div className="proof-item" key={item.value}>
                <span className="proof-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <strong>{item.value}</strong>
                <span className="proof-label">
                  <Bilingual text={item.label} />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="section profile-section" id="about" aria-labelledby="about-title">
          <div className="shell">
            <div id="about-title">
              <SectionHeading
                index={profile.index}
                eyebrow={profile.eyebrow}
                title={profile.title}
                intro={profile.intro}
              />
            </div>

            <div className="profile-layout">
              <p className="profile-closer reveal" data-reveal>
                <Bilingual text={profile.closer} />
              </p>

              <div className="profile-lanes">
                {profile.lanes.map((lane) => (
                  <article className="profile-lane reveal" data-reveal key={lane.number}>
                    <span className="lane-number">{lane.number}</span>
                    <div>
                      <h3>
                        <Bilingual text={lane.title} />
                      </h3>
                      <p>
                        <Bilingual text={lane.description} />
                      </p>
                    </div>
                    <ArrowUpRightIcon className="lane-arrow" />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="shell">
            <div id="experience-title">
              <SectionHeading
                index={experience.index}
                eyebrow={experience.eyebrow}
                title={experience.title}
                intro={experience.intro}
              />
            </div>

            <ol className="experience-list">
              {experience.roles.map((role, index) => (
                <li className="experience-role reveal" data-reveal key={role.company}>
                  <div className="experience-sequence" aria-hidden="true">
                    0{index + 1}
                  </div>
                  <div className="experience-identity">
                    <div className="experience-company-row">
                      <p className="experience-company">{role.company}</p>
                      {role.current ? (
                        <span className="current-badge">
                          <span aria-hidden="true" />
                          <Bilingual text={interfaceCopy.current} />
                        </span>
                      ) : null}
                    </div>
                    <h3>
                      <Bilingual text={role.role} />
                    </h3>
                    <p className="experience-date">
                      <Bilingual text={role.date} />
                    </p>
                  </div>
                  <div className="experience-detail">
                    <p className="experience-summary">
                      <Bilingual text={role.summary} />
                    </p>
                    <ul className="experience-bullets">
                      {role.bullets.map((bullet) => (
                        <li key={bullet.en}>
                          <Bilingual text={bullet} />
                        </li>
                      ))}
                    </ul>
                    <TechList items={role.stack} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="shell">
            <div id="work-title">
              <SectionHeading
                index={work.index}
                eyebrow={work.eyebrow}
                title={work.title}
                intro={work.intro}
              />
            </div>

            <div className="project-grid">
              {work.projects.map((project) => (
                <article
                  className={`project-card reveal${project.featured ? " project-card-featured" : ""}`}
                  data-reveal
                  key={project.title}
                >
                  <div className="project-card-top">
                    <span className="project-number">{project.number}</span>
                    <p className="project-kind">
                      <Bilingual text={project.kind} />
                    </p>
                  </div>
                  <div className="project-signal" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-description">
                    <Bilingual text={project.description} />
                  </p>
                  <TechList items={project.stack} />
                  <ProjectLinks links={project.links} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section toolkit-section" id="toolkit" aria-labelledby="toolkit-title">
          <div className="shell">
            <div id="toolkit-title">
              <SectionHeading
                index={toolkit.index}
                eyebrow={toolkit.eyebrow}
                title={toolkit.title}
                intro={toolkit.intro}
              />
            </div>

            <div className="toolkit-groups">
              {toolkit.groups.map((group) => (
                <article className="toolkit-group reveal" data-reveal key={group.number}>
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
            <div id="recognition-title">
              <SectionHeading
                index={recognition.index}
                eyebrow={recognition.eyebrow}
                title={recognition.title}
              />
            </div>

            <div className="recognition-grid">
              <div className="awards-column reveal" data-reveal>
                <p className="recognition-label">
                  <Bilingual text={recognition.awardsLabel} />
                </p>
                <ol className="awards-list">
                  {recognition.awards.map((award) => (
                    <li key={award.title.en}>
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
              </div>

              <aside className="education-card reveal" data-reveal>
                <p className="recognition-label">
                  <Bilingual text={recognition.education.eyebrow} />
                </p>
                <div className="education-gpa">
                  <span>GPA</span>
                  <strong>{recognition.education.gpa}</strong>
                </div>
                <h3>
                  <Bilingual text={recognition.education.degree} />
                </h3>
                <p className="education-specialization">
                  <Bilingual text={recognition.education.specialization} />
                </p>
                <p className="education-institution">
                  <Bilingual text={recognition.education.institution} />
                </p>
                <div className="education-divider" />
                <ul className="training-list">
                  {recognition.training.map((training) => (
                    <li key={training.en}>
                      <Bilingual text={training} />
                    </li>
                  ))}
                </ul>
                <p className="leadership-line">
                  <Bilingual text={recognition.leadership} />
                </p>
                <p className="sce-line">
                  <Bilingual text={recognition.sce} />
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-shell">
            <div className="section-kicker contact-kicker reveal" data-reveal>
              <span className="section-index" aria-hidden="true">
                {contact.index}
              </span>
              <span className="section-eyebrow">
                <Bilingual text={contact.eyebrow} />
              </span>
            </div>

            <h2 id="contact-title" className="reveal" data-reveal>
              <Bilingual text={contact.title} />
            </h2>
            <p className="contact-intro reveal" data-reveal>
              <Bilingual text={contact.body} />
            </p>

            <div className="contact-primary reveal" data-reveal>
              <a href={`mailto:${site.email}`}>
                <span>{site.email}</span>
                <ArrowUpRightIcon />
              </a>
            </div>

            <div className="contact-actions reveal" data-reveal>
              <a className="contact-action" href={`mailto:${site.email}`}>
                <Bilingual text={contact.emailLabel} />
                <ArrowUpRightIcon />
              </a>
              <CopyEmailButton />
              <a className="contact-action" href={site.phoneHref}>
                <span>{site.phoneDisplay}</span>
                <Bilingual text={contact.phoneLabel} />
              </a>
              <a className="contact-action" href={site.social.linkedin} target="_blank" rel="noreferrer">
                <Bilingual text={contact.linkedinLabel} />
                <ArrowUpRightIcon />
              </a>
              <a className="contact-action" href={site.social.github} target="_blank" rel="noreferrer">
                <Bilingual text={contact.githubLabel} />
                <ArrowUpRightIcon />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <a
            className="footer-mark"
            href="#top"
            aria-label={`MA — ${interfaceCopy.home.en} / ${interfaceCopy.home.ar}`}
          >
            MA
          </a>
          <p>
            <span>© {new Date().getFullYear()} Marwan Aljijakli.</span>
            <Bilingual text={interfaceCopy.footer} />
          </p>
          <a className="footer-top" href="#top">
            <Bilingual text={interfaceCopy.home} />
            <span className="footer-top-arrow" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
