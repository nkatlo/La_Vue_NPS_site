// =======================
// COMPONENT LOADER
// =======================

async function loadComponent(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}`);
    const html = await res.text();

    const el = document.getElementById(id);
    if (el) el.innerHTML = html;

  } catch (err) {
    console.error(err);
  }
}

// =======================
// INIT (PARALLEL LOAD)
// =======================

async function init() {
  await Promise.all([
    loadComponent("nav", "./src/components/nav.html"),
    loadComponent("hero", "./src/components/hero.html"),
    loadComponent("about", "./src/components/about.html"),
    loadComponent("accommodation", "./src/components/accommodation.html"),
    loadComponent("gallery", "./src/components/gallery.html"),
    loadComponent("testimonials", "./src/components/testimonials.html"),
    loadComponent("contact", "./src/components/contact.html"),
    loadComponent("footer", "./src/components/footer.html"),
  ]);

  runApp();
}

document.addEventListener("DOMContentLoaded", init);

// =======================
// MAIN APP
// =======================

function runApp() {

  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  // =======================
  // CONFIG
  // =======================

  const defaultConfig = {
    hero_title: 'La Vue',
    hero_subtitle: 'Port Shepstone',
    hero_tagline: 'Where the ocean meets quiet luxury',
    about_heading: 'A Coastal Sanctuary',
    about_text: 'Perched along the KwaZulu-Natal South Coast...',
    accommodation_heading: 'The Experience',
    contact_heading: 'Begin Your Stay',
    contact_email: 'lavue.portshepstone@gmail.com',
    contact_phone: '+27 76 163 2064',
    background_color: '#FAF8F5',
    surface_color: '#FFFFFF',
    text_color: '#1A1A1A',
    primary_action_color: '#C9A96E',
    secondary_action_color: '#A89F94',
    font_family: 'Playfair Display',
    font_size: 16
  };

  // =======================
  // SDK INIT
  // =======================

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: (config) => {
        const c = { ...defaultConfig, ...config };

        const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };

        setText('hero-title', c.hero_title);
        setText('hero-subtitle', c.hero_subtitle);
        setText('hero-tagline', c.hero_tagline);
        setText('about-heading', c.about_heading);
        setText('about-text', c.about_text);
        setText('accommodation-heading', c.accommodation_heading);
        setText('contact-heading', c.contact_heading);
        setText('contact-email-display', c.contact_email);
        setText('contact-phone-display', c.contact_phone);

        const root = $('app-root');
        if (root) root.style.backgroundColor = c.background_color;

        $$('.feature-card').forEach(el => el.style.backgroundColor = c.surface_color);
        $$('.thin-divider').forEach(el => el.style.backgroundColor = c.primary_action_color);

        const serifStack = `${c.font_family}, Georgia, serif`;
        $$('.font-serif-display').forEach(el => el.style.fontFamily = serifStack);
      }
    });
  }

  // =======================
  // SCROLL ANIMATION
  // =======================

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  });

  $$('.reveal').forEach(el => observer.observe(el));

  // =======================
  // MOBILE NAV
  // =======================

  const menuToggle = $('menu-toggle');
  const menuClose = $('menu-close');
  const mobileNav = $('mobile-nav');

  menuToggle?.addEventListener('click', () => mobileNav?.classList.add('open'));
  menuClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));

  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => mobileNav?.classList.remove('open'));
  });

  // =======================
  // FORM
  // =======================

  const form = $('contact-form');
  const submitBtn = $('submit-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submitBtn) return;

    const textSpan = submitBtn.querySelector('span:first-child');
    const originalText = textSpan?.innerHTML;

    submitBtn.disabled = true;
    if (textSpan) textSpan.innerHTML = 'Sending...';

    const formData = {
      name: $('cf-name')?.value,
      email: $('cf-email')?.value,
      dates: $('cf-dates')?.value,
      message: $('cf-message')?.value
    };

    try {
      const res = await fetch('https://formspree.io/f/mdokqnpv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error();

      form.reset();
      alert("Message sent!");

    } catch {
      alert("Failed to send.");
    }

    submitBtn.disabled = false;
    if (textSpan) textSpan.innerHTML = originalText;
  });

  // =======================
  // BUTTON EFFECTS
  // =======================

  const animateButton = (btn, enter, leave) => {
    if (!btn) return;
    btn.addEventListener('mouseenter', () => enter(btn));
    btn.addEventListener('mouseleave', () => leave(btn));
  };

  animateButton($('submit-btn'),
    btn => btn.querySelector('span:last-child')?.style.setProperty('transform', 'scaleX(1)'),
    btn => btn.querySelector('span:last-child')?.style.setProperty('transform', 'scaleX(0)')
  );

  animateButton($('hero-cta'),
    btn => btn.querySelector('span:last-child')?.style.setProperty('transform', 'scaleX(1)'),
    btn => btn.querySelector('span:last-child')?.style.setProperty('transform', 'scaleX(0)')
  );

  // =======================
  // ICONS
  // =======================

  if (window.lucide) lucide.createIcons();

  //========================
  // LAZY IMAGES
  //========================
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });
}