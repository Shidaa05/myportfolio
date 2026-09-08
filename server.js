require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

require('./db/database'); // ensures schema exists before anything else runs
require('./db/seed');     // idempotent — only inserts if tables are empty

const crudRouter = require('./routes/crudFactory');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------
// API routes — every resource below supports GET (list/single) and
// POST/PUT/DELETE. There is no authentication on this app at all: anyone
// who can reach these routes (or /admin) can edit or delete content.
// See the README's "Keeping /admin private" section before deploying.
// ---------------------------------------------------------------------
app.use('/api/profile', profileRoutes);
app.use('/api/stats', crudRouter('stats', ['value', 'label', 'sort_order']));
app.use('/api/skills', crudRouter('skills', ['name', 'category', 'proficiency', 'sort_order']));
app.use('/api/services', crudRouter('services', ['title', 'description', 'detail_1', 'detail_2', 'detail_3', 'detail_4', 'sort_order']));
app.use('/api/projects', crudRouter('projects', ['title', 'category', 'description', 'year', 'link', 'accent_color', 'featured', 'sort_order']));
app.use('/api/blog', crudRouter('blog_posts', ['title', 'slug', 'excerpt', 'content', 'read_time', 'published_date', 'is_published', 'sort_order'], { publicReadOnlyPublished: true }));
app.use('/api/references', require('./routes/references'));
app.use('/api/faqs', crudRouter('faqs', ['question', 'answer', 'sort_order']));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ---------------------------------------------------------------------
// Static frontend (public site + admin dashboard)
// ---------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  console.log(`Admin dashboard at         http://localhost:${PORT}/admin`);
});
