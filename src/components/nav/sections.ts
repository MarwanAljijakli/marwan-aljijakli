/**
 * The canonical list of navigable sections. Referenced by the desktop nav,
 * the mobile overlay, the right-side dot indicator column, and footer nav.
 * Order here defines display order everywhere.
 */
export interface NavSection {
  id: string;
  label: string;
}

export const SECTIONS: NavSection[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
