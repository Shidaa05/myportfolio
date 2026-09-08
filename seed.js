// Seeds the database with starter content pulled from Timothy's CV.
// Safe to re-run: it only inserts when tables are empty, so it will never
// wipe out edits made later through the admin dashboard.
const db = require('./database');
require('dotenv').config();

function empty(table) {
  return db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c === 0;
}

// ---- profile ---------------------------------------------------------
if (empty('profile')) {
  db.prepare(`
    INSERT INTO profile (id, name, role, tagline, bio, location, email, phone, linkedin_url, github_url, resume_url, availability)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Timothy Joshua Ago-Larsey',
    'Full-Stack Developer & Backend Lead',
    "I build backend systems and full-stack products that hold up under real use.",
    "I'm a third-year Computer Engineering undergraduate at KNUST, currently serving as Backend Lead on the National Student Information Management System (NSIMS) — a government platform used to monitor schools and teachers nationwide. I work across the stack with Python, JavaScript, React/Next.js, and PostgreSQL/MySQL, and I picked up real production habits during an internship at Ghana's National Information Technology Agency. Outside of code, I chair my department's audit committee, where I rebuilt how we track and report departmental finances.",
    'Kumasi, Ghana',
    'thimjosh1710@gmail.com',
    '0552766454',
    'https://linkedin.com/in/timothy-joshua-b978952bb/',
    '',
    '/assets/Timothy_Joshua_Ago-Larsey_CV.pdf',
    'Open to internships, contract work & full-time roles'
  );
}

// ---- stats -------------------------------------------------------------
if (empty('stats')) {
  const stats = [
    ['3rd Year', 'Computer Engineering at KNUST', 1],
    ['1', 'National platform led as Backend Lead', 2],
    ['8+', 'Core languages & frameworks in daily use', 3],
    ['2024', 'Writing production code since', 4],
  ];
  const stmt = db.prepare('INSERT INTO stats (value, label, sort_order) VALUES (?, ?, ?)');
  stats.forEach(s => stmt.run(...s));
}

// ---- skills --------------------------------------------------------------
if (empty('skills')) {
  const skills = [
    ['Python', 'Programming', 85, 1],
    ['JavaScript / Node.js', 'Programming', 82, 2],
    ['React / Next.js', 'Web Development', 75, 3],
    ['PostgreSQL / MySQL', 'Database', 78, 4],
    ['HTML5, CSS3 & Tailwind', 'Web Development', 85, 5],
    ['Git & GitHub', 'Tools', 80, 6],
    ['REST APIs', 'Programming', 80, 7],
    ['Figma & UI/UX Design', 'Design', 65, 8],
  ];
  const stmt = db.prepare('INSERT INTO skills (name, category, proficiency, sort_order) VALUES (?, ?, ?, ?)');
  skills.forEach(s => stmt.run(...s));
}

// ---- services --------------------------------------------------------------
if (empty('services')) {
  const services = [
    [
      'Backend Development', 'Robust, scalable server-side systems and APIs, built to run in production.',
      'API Design', 'Server Architecture', 'Authentication', 'Performance Tuning', 1,
    ],
    [
      'Database Design & Management', 'Schemas and queries that stay fast and sane as data grows.',
      'Schema Design', 'Query Optimization', 'Data Modeling', 'Migrations', 2,
    ],
    [
      'Full-Stack Web Development', 'React/Next.js interfaces wired to real backends, end to end.',
      'React & Next.js', 'Responsive UI', 'API Integration', 'Deployment', 3,
    ],
  ];
  const stmt = db.prepare(`
    INSERT INTO services (title, description, detail_1, detail_2, detail_3, detail_4, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  services.forEach(s => stmt.run(...s));
}

// ---- projects --------------------------------------------------------------
if (empty('projects')) {
  const projects = [
    [
      'NSIMS — National Student Information Management System',
      'Government Platform · Full-Stack',
      "Backend Lead on a nationwide platform built to standardize and digitize basic education administration under the Ghana Education Service. Headteachers monitor their schools; teachers manage classrooms and courses.",
      '2026', '', '#D4FF3D', 1, 1,
    ],
    [
      'IoT Sensors in the Mitigation of Water Retention in Urban Areas',
      'IoT · Research',
      'Team lead on a departmental investigation into the causes and effects of urban water retention, using IoT sensors to gather field data.',
      'Academic Project', '', '#FF6B35', 0, 2,
    ],
    [
      'This Portfolio Site',
      'Full-Stack · Personal',
      'The site you\'re looking at right now: an Express + SQLite API with full CRUD, an admin dashboard, and a dynamic vanilla-JS frontend.',
      '2026', '', '#7209B7', 0, 3,
    ],
  ];
  const stmt = db.prepare(`
    INSERT INTO projects (title, category, description, year, link, accent_color, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  projects.forEach(p => stmt.run(...p));
}

// ---- blog (onboarding post only — replace via the admin dashboard) --------
if (empty('blog_posts')) {
  db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, read_time, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Welcome to your blog',
    'welcome-to-your-blog',
    'This is a starter post so the blog section has something to render. Edit or delete it from /admin.',
    "This post exists so the blog list isn't empty on first load. Log into /admin, open the Blog tab, and replace this with your own writing — build notes on NSIMS, what you're learning, whatever you want future employers to see.",
    '2 min read', 1, 1
  );
}

// ---- references (contact hidden by default — flip contact_visible in admin to publish) --
if (empty('references_list')) {
  const refs = [
    ['Prof. Daniel Adjei-Boateng', 'Dean, Quality Assurance and Planning Office', 'KNUST', 0, 'daboateng.frnr@knust.edu.gh', '', 1],
    ['Mr. Reginald Darko', 'Assistant Supervisor', 'NITA Ghana', 0, '', '+233 24 965 5595', 2],
    ['Mr. Cyril Torgbor', 'Assistant Director', 'Office of the Head of the Local Government Service (OHLGS)', 0, 'cyril.torgbor@lgs.gov.gh', '+233 546 850 461', 3],
  ];
  const stmt = db.prepare(`
    INSERT INTO references_list (name, title, organization, contact_visible, email, phone, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  refs.forEach(r => stmt.run(...r));
}

// ---- faqs --------------------------------------------------------------
if (empty('faqs')) {
  const faqs = [
    ['Are you available for internships or full-time roles?', "Yes — I'm a current student open to internships, contract/freelance backend work, and full-time roles after graduation.", 1],
    ["What's your tech stack?", 'Python, JavaScript/Node.js, React & Next.js, PostgreSQL/MySQL, Tailwind CSS, and Git — plus WordPress and basic networking from my NITA internship.', 2],
    ['Do you work on frontend, backend, or both?', "Both. I lean backend and databases, but I ship full-stack — this site's frontend and API are both mine.", 3],
    ['How can I reach you?', 'Email or LinkedIn are best — both are in the footer below.', 4],
  ];
  const stmt = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
  faqs.forEach(f => stmt.run(...f));
}

console.log('Database seeded.');
