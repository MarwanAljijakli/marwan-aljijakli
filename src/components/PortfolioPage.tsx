import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CloseIcon,
  DownloadIcon,
  MenuIcon,
} from "@/components/Icons";
import { ClientRuntime } from "@/components/ClientRuntime";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { EngineeringFlow } from "@/components/EngineeringFlow";
import { LoopVideo } from "@/components/LoopVideo";
import { PreferenceControls } from "@/components/PreferenceControls";
import { ProjectVisual } from "@/components/ProjectVisual";
import {
  approach,
  contact,
  credential,
  experience,
  expertise,
  hero,
  interfaceCopy,
  localize,
  media,
  navItems,
  recognition,
  site,
  work,
} from "@/content/portfolio";
import type { Locale, LocalizedText, ProjectLink } from "@/content/portfolio";

type SectionIntroProps = Readonly<{
  index: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro?: LocalizedText;
  id: string;
  locale: Locale;
}>;

function SectionIntro({ index, eyebrow, title, intro, id, locale }: SectionIntroProps) {
  return (
    <header className="section-intro reveal" data-reveal>
      <p className="section-kicker">
        <span aria-hidden="true">{index}</span>
        {localize(eyebrow, locale)}
      </p>
      <div className="section-heading-copy">
        <h2 id={id}>{localize(title, locale)}</h2>
        {intro ? <p>{localize(intro, locale)}</p> : null}
      </div>
    </header>
  );
}

function NavLinks({ locale, mobile = false }: Readonly<{ locale: Locale; mobile?: boolean }>) {
  return (
    <nav
      className={mobile ? "mobile-nav" : "desktop-nav"}
      aria-label={localize(interfaceCopy.menuLabel, locale)}
    >
      {navItems.map((item) => (
        <a href={item.href} key={item.href}>
          {localize(item.label, locale)}
        </a>
      ))}
    </nav>
  );
}

function TagList({ items, locale }: Readonly<{ items: readonly string[]; locale: Locale }>) {
  return (
    <ul className="tag-list" aria-label={locale === "ar" ? "التقنيات" : "Technologies"}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ProjectLinks({ links, locale }: Readonly<{ links: readonly ProjectLink[]; locale: Locale }>) {
  if (links.length === 0) {
    return (
      <p className="private-work">
        <span aria-hidden="true" />
        {localize(interfaceCopy.privateWork, locale)}
      </p>
    );
  }

  return (
    <div className="project-links">
      {links.map((link) => {
        const href = typeof link.href === "string" ? link.href : localize(link.href, locale);
        return (
          <a
            href={href}
            key={href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
          >
            {localize(link.label, locale)}
            <ArrowUpRightIcon />
            {link.external ? (
              <span className="sr-only"> — {localize(interfaceCopy.external, locale)}</span>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}

export function PortfolioPage({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner shell">
          <a className="wordmark" href="#top" aria-label={`MA — ${localize(interfaceCopy.home, locale)}`}>
            <span className="wordmark-monogram" aria-hidden="true">
              MA
            </span>
            <span className="wordmark-copy">
              <strong>{locale === "ar" ? site.nameArabic : site.name}</strong>
              <small>{locale === "ar" ? "ذكاء اصطناعي · بيانات · منتجات" : "AI · DATA · PRODUCTS"}</small>
            </span>
          </a>

          <NavLinks locale={locale} />

          <div className="header-actions">
            <PreferenceControls locale={locale} />
            <details className="mobile-menu">
              <summary
                aria-label={localize(interfaceCopy.menu, locale)}
                data-menu-summary
                data-menu-open-label={localize(interfaceCopy.menu, locale)}
                data-menu-close-label={localize(interfaceCopy.closeMenu, locale)}
              >
                <MenuIcon className="menu-icon menu-icon-open" />
                <CloseIcon className="menu-icon menu-icon-close" />
              </summary>
              <div className="mobile-menu-panel">
                <NavLinks locale={locale} mobile />
                <a className="mobile-cv" href={site.cv} download>
                  {localize(hero.secondaryCta, locale)}
                  <DownloadIcon />
                </a>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <LoopVideo
            asset={media.introduction}
            locale={locale}
            eager
            background
            className="hero-background-media"
          />
          <div className="hero-grid shell">
            <div className="hero-copy">
              <p className="hero-kicker hero-enter hero-enter-1">
                <span aria-hidden="true" />
                {localize(hero.eyebrow, locale)}
              </p>
              <aside className="hero-inline-credential" aria-label={localize(credential.short, locale)}>
                <span className="credential-mark" aria-hidden="true">
                  SCE
                </span>
                <span>
                  <strong>{localize(credential.short, locale)}</strong>
                  <small>
                    {localize(credential.numberLabel, locale)} {credential.number} · {localize(credential.valid, locale)}
                  </small>
                </span>
              </aside>
              <h1 id="hero-title" className="hero-enter hero-enter-2">
                {localize(hero.title, locale)}
              </h1>
              <p className="hero-lead hero-enter hero-enter-3">{localize(hero.lead, locale)}</p>
              <div className="hero-actions hero-enter hero-enter-4">
                <a className="button button-primary" href="#work">
                  {localize(hero.primaryCta, locale)}
                  <ArrowDownIcon />
                </a>
                <a className="button button-secondary" href={site.cv} download>
                  {localize(hero.secondaryCta, locale)}
                  <DownloadIcon />
                </a>
              </div>
            </div>

            <aside
              className="hero-profile-card hero-enter hero-enter-3"
              aria-label={localize(credential.short, locale)}
            >
              <Image
                src="/marwan-portrait.webp"
                width={88}
                height={88}
                priority
                alt={localize(hero.portraitAlt, locale)}
              />
              <div>
                <p>
                  <span className="credential-mark" aria-hidden="true">
                    SCE
                  </span>
                  {localize(credential.activeTag, locale)}
                </p>
                <strong>{localize(credential.short, locale)}</strong>
                <small>
                  {localize(credential.numberLabel, locale)} {credential.number} · {localize(credential.valid, locale)}
                </small>
              </div>
            </aside>
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
              locale={locale}
            />

            <div className="project-list">
              {work.cases.map((project, index) => (
                <article
                  className={`project-story reveal ${index % 2 === 1 ? "project-story-reverse" : ""}`}
                  data-reveal
                  key={project.number}
                >
                  <div className="project-visual-wrap">
                    <ProjectVisual visual={project.visual} locale={locale} />
                  </div>
                  <div className="project-copy">
                    <p className="project-meta">
                      <span>{project.number}</span>
                      {localize(project.kind, locale)}
                    </p>
                    <p className="project-company">{project.company}</p>
                    <h3>{localize(project.title, locale)}</h3>
                    <p className="project-description">{localize(project.description, locale)}</p>
                    <ul className="project-facts">
                      {project.facts.map((fact) => (
                        <li key={fact.en}>
                          <span aria-hidden="true" />
                          {localize(fact, locale)}
                        </li>
                      ))}
                    </ul>
                    <TagList items={project.stack} locale={locale} />
                    <ProjectLinks links={project.links} locale={locale} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section approach-section" id="approach" aria-labelledby="approach-title">
          <div className="shell">
            <SectionIntro
              index="02"
              eyebrow={approach.eyebrow}
              title={approach.title}
              intro={approach.intro}
              id="approach-title"
              locale={locale}
            />
            <EngineeringFlow locale={locale} />
          </div>
        </section>

        <section className="section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="shell">
            <SectionIntro
              index="03"
              eyebrow={experience.eyebrow}
              title={experience.title}
              intro={experience.intro}
              id="experience-title"
              locale={locale}
            />

            <ol className="role-list">
              {experience.roles.map((role, index) => (
                <li className="role-row reveal" data-reveal key={role.company}>
                  <span className="role-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div className="role-identity">
                    <p>{role.company}</p>
                    <h3>{localize(role.role, locale)}</h3>
                  </div>
                  <div className="role-detail">
                    <p className="role-date">
                      {localize(role.date, locale)}
                      {role.current ? (
                        <span className="current-role">
                          <span aria-hidden="true" />
                          {localize(interfaceCopy.current, locale)}
                        </span>
                      ) : null}
                    </p>
                    <p>{localize(role.summary, locale)}</p>
                    <TagList items={role.stack} locale={locale} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section expertise-section" id="expertise" aria-labelledby="expertise-title">
          <div className="shell">
            <SectionIntro
              index="04"
              eyebrow={expertise.eyebrow}
              title={expertise.title}
              intro={expertise.intro}
              id="expertise-title"
              locale={locale}
            />

            <div className="expertise-grid">
              {expertise.groups.map((group) => (
                <article className="expertise-card reveal" data-reveal key={group.number}>
                  <span className="expertise-index" aria-hidden="true">
                    {group.number}
                  </span>
                  <h3>{localize(group.title, locale)}</h3>
                  <p>{localize(group.detail, locale)}</p>
                  <TagList items={group.items} locale={locale} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section recognition-section" id="recognition" aria-labelledby="recognition-title">
          <div className="shell">
            <SectionIntro
              index="05"
              eyebrow={recognition.eyebrow}
              title={recognition.title}
              intro={recognition.intro}
              id="recognition-title"
              locale={locale}
            />

            <LoopVideo asset={media.awards} locale={locale} className="recognition-film" />

            <div className="recognition-layout">
              <ol className="award-list">
                {recognition.awards.map((award, index) => (
                  <li className="award-row reveal" data-reveal key={award.title.en}>
                    <span className="award-index" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <strong>{localize(award.place, locale)}</strong>
                    <div>
                      <h3>{localize(award.title, locale)}</h3>
                      <p>{localize(award.meta, locale)}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <aside className="sce-card reveal" data-reveal>
                <div className="sce-card-head">
                  <span className="credential-mark" aria-hidden="true">
                    SCE
                  </span>
                  <span>{localize(credential.activeTag, locale)}</span>
                </div>
                <p>{localize(credential.short, locale)}</p>
                <strong>{credential.number}</strong>
                <small>{localize(credential.valid, locale)}</small>
              </aside>
            </div>

            <div className="education-layout">
              <LoopVideo asset={media.certifications} locale={locale} className="education-film" />
              <article className="education-copy reveal" data-reveal>
                <div className="education-gpa">
                  <span>{localize(recognition.education.gpaLabel, locale)}</span>
                  <strong>{recognition.education.gpa}</strong>
                </div>
                <p className="education-label">{localize(recognition.education.label, locale)}</p>
                <h3>{localize(recognition.education.degree, locale)}</h3>
                <p className="education-specialization">
                  {localize(recognition.education.specialization, locale)}
                </p>
                <p className="education-institution">
                  {localize(recognition.education.institution, locale)}
                </p>
                <ul className="training-list">
                  {recognition.training.map((item) => (
                    <li key={item.en}>{localize(item, locale)}</li>
                  ))}
                </ul>
                <p className="leadership-line">{localize(recognition.leadership, locale)}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <LoopVideo asset={media.contact} locale={locale} className="contact-film" />
          <div className="contact-overlay" aria-hidden="true" />
          <div className="contact-shell shell">
            <div className="contact-copy-panel reveal" data-reveal>
              <p className="contact-kicker">
                <span aria-hidden="true">06</span>
                {localize(contact.eyebrow, locale)}
              </p>
              <h2 id="contact-title">{localize(contact.title, locale)}</h2>
              <p className="contact-body">{localize(contact.body, locale)}</p>
            </div>

            <div className="contact-panel reveal" data-reveal>
              <a className="contact-email" href={`mailto:${site.email}`}>
                <span>{site.email}</span>
                <ArrowUpRightIcon />
              </a>
              <div className="contact-actions">
                <CopyEmailButton locale={locale} />
                <a href={site.phoneHref}>
                  <span>{localize(contact.phoneLabel, locale)}</span>
                  <span>{site.phoneDisplay}</span>
                </a>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer">
                  {localize(contact.linkedinLabel, locale)}
                  <ArrowUpRightIcon />
                </a>
                <a href={site.social.github} target="_blank" rel="noreferrer">
                  {localize(contact.githubLabel, locale)}
                  <ArrowUpRightIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner shell">
          <a className="footer-mark" href="#top" aria-label={`MA — ${localize(interfaceCopy.home, locale)}`}>
            MA
          </a>
          <p>
            <span>© {new Date().getFullYear()} {locale === "ar" ? site.nameArabic : site.name}.</span>
            <span>{localize(interfaceCopy.footer, locale)}</span>
          </p>
          <a className="footer-top" href="#top">
            {localize(interfaceCopy.home, locale)}
            <span aria-hidden="true" />
          </a>
        </div>
      </footer>
      <ClientRuntime />
    </>
  );
}
