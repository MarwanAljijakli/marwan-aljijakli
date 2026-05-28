"use client";

import About from "@/components/about/About";
import Contact from "@/components/contact/Contact";
import EducationSection from "@/components/education/EducationSection";
import Experience from "@/components/experience/Experience";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Projects from "@/components/projects/Projects";
import Skills from "@/components/skills/Skills";

export default function HomePage() {
  return (
    <main
      id="main-content"
      role="main"
      aria-label="Marwan Aljijakli — portfolio"
      className="relative min-h-dvh bg-bg-primary"
    >
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <EducationSection />
      <Contact />
      <Footer />
    </main>
  );
}
