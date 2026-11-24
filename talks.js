// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// Initialize theme on page load
(function() {
    const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

// Look switcher (temporary, until a favorite look is chosen)
// Use talks.html?look=timeline or talks.html?look=cards to link to a specific look.
const looks = ['timeline', 'cards'];

function switchLook(look) {
    looks.forEach(name => document.body.classList.toggle(`talks-${name}`, name === look));
    document.querySelectorAll('.look-switcher button').forEach(btn => {
        const active = btn.dataset.look === look;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
    });
    localStorage.setItem('talksLook', look);
}

(function() {
    const requested = new URLSearchParams(window.location.search).get('look') ||
        localStorage.getItem('talksLook');
    switchLook(looks.includes(requested) ? requested : looks[0]);

    document.querySelectorAll('.look-switcher button').forEach(btn => {
        btn.addEventListener('click', () => switchLook(btn.dataset.look));
    });
})();

// Today's date as YYYY-MM-DD in the visitor's time zone
function getToday() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

// A date must be YYYY-MM-DD and exist on the calendar (no April 31st)
function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

// Lowercase and remove accents, so "quebec" finds "Québec"
function normalize(text) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function createTalkElement(talk) {
    const item = createElement('li', 'talk');

    const date = createElement('time', 'talk-date',
        new Date(`${talk.date}T00:00:00`).toLocaleDateString('en-CA', {
            year: 'numeric', month: 'short', day: 'numeric'
        }));
    date.dateTime = talk.date;

    const title = createElement('h4', 'talk-title');
    if (talk.url && /^https?:\/\//i.test(talk.url)) {
        const link = createElement('a', '', talk.title);
        link.href = talk.url;
        link.target = '_blank';
        link.rel = 'noopener';
        title.appendChild(link);
    } else {
        title.textContent = talk.title;
    }

    const body = createElement('div', 'talk-body');
    body.append(title, createElement('p', 'talk-event', talk.event));
    item.append(date, body);
    return item;
}

function createTalkList(talks) {
    const list = createElement('ul', 'talk-list');
    list.append(...talks.map(createTalkElement));
    return list;
}

function renderTalks(talks) {
    const query = normalize(document.getElementById('talks-search').value.trim());
    const year = document.getElementById('talks-year').value;
    const filtering = Boolean(query || year);
    const today = getToday();

    const matches = talks.filter(talk =>
        (!year || talk.date.startsWith(year)) &&
        (!query || normalize(talk.title).includes(query) || normalize(talk.event).includes(query)));

    // Upcoming: soonest first. Past: newest first.
    const upcoming = matches.filter(talk => talk.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date));
    const past = matches.filter(talk => talk.date < today)
        .sort((a, b) => b.date.localeCompare(a.date));

    const upcomingContainer = document.getElementById('upcoming-talks');
    upcomingContainer.replaceChildren(upcoming.length
        ? createTalkList(upcoming)
        : createElement('p', 'talks-empty', 'No upcoming talks announced yet. Check back soon!'));
    // While filtering, hide the section instead of showing the empty message
    document.getElementById('upcoming-section').hidden = filtering && !upcoming.length;

    const byYear = new Map();
    past.forEach(talk => {
        const talkYear = talk.date.slice(0, 4);
        if (!byYear.has(talkYear)) byYear.set(talkYear, []);
        byYear.get(talkYear).push(talk);
    });
    document.getElementById('past-talks').replaceChildren(...[...byYear].map(([talkYear, items]) => {
        const group = createElement('div', 'talk-year');
        group.append(createElement('h3', '', talkYear), createTalkList(items));
        return group;
    }));
    document.getElementById('past-section').hidden = !past.length;

    const status = document.getElementById('talks-status');
    if (!matches.length) {
        status.textContent = 'No talks match your search.';
    } else if (filtering) {
        status.textContent = `${matches.length} ${matches.length === 1 ? 'talk' : 'talks'} found`;
    } else {
        status.textContent = '';
    }
}

async function loadTalks() {
    try {
        // no-cache: revalidate so newly added talks show up right away
        const response = await fetch('talks.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const talks = (await response.json()).filter(talk => {
            const valid = talk && isValidDate(talk.date) && talk.title && talk.event;
            if (!valid) console.warn('Skipping invalid entry in talks.json:', talk);
            return valid;
        });

        const yearSelect = document.getElementById('talks-year');
        [...new Set(talks.map(talk => talk.date.slice(0, 4)))].sort().reverse()
            .forEach(year => yearSelect.add(new Option(year, year)));

        document.getElementById('talks-search').addEventListener('input', () => renderTalks(talks));
        yearSelect.addEventListener('change', () => renderTalks(talks));
        renderTalks(talks);
    } catch (error) {
        console.error('Unable to load talks.json:', error);
        const status = document.getElementById('talks-status');
        status.textContent = 'Unable to load the talks right now. Please try again later, or see ';
        const link = createElement('a', '', 'my talks on Franky\'s Notes');
        link.href = 'https://www.frankysnotes.com/p/blog-page.html';
        link.target = '_blank';
        link.rel = 'noopener';
        status.append(link, '.');
    }
}

loadTalks();
