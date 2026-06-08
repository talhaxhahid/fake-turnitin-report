export type Post = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  date: string;
  readTime: string;
  keywords: string[];
};

export const posts: Post[] = [
  {
    slug: 'how-to-generate-a-turnitin-report',
    title: 'How to Generate a Turnitin Report Online in 2026 (Free Method)',
    description:
      'A step-by-step 2026 guide on how to generate a Turnitin report online for free. Learn the fastest way to create a similarity and AI detection PDF in seconds.',
    tag: 'Guide',
    date: '2026-06-01',
    readTime: '6 min read',
    keywords: ['how to generate turnitin report', 'turnitin report generation', 'free turnitin report online'],
  },
  {
    slug: 'custom-turnitin-report-explained',
    title: 'Custom Turnitin Report Explained: AI %, Similarity %, and How to Pick',
    description:
      'Everything you need to know about a custom Turnitin report — how AI detection and similarity percentages work, and how to choose the right number for your document.',
    tag: 'Explained',
    date: '2026-05-20',
    readTime: '8 min read',
    keywords: ['custom turnitin report', 'turnitin similarity percentage', 'turnitin ai detection percentage'],
  },
  {
    slug: 'free-turnitin-report-guide',
    title: 'The Complete Free Turnitin Report Guide (No Signup Required)',
    description:
      'Looking for a free Turnitin report? This complete guide covers the best free tool, what to expect, privacy considerations, and pro tips for unlimited free reports.',
    tag: 'Resource',
    date: '2026-05-08',
    readTime: '7 min read',
    keywords: ['free turnitin report', 'free turnitin report generator', 'turnitin report free download'],
  },
];
