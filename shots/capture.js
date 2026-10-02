async (page) => {
  const prefix = (await page.viewportSize()).width < 768 ? 'm' : 'd';
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForTimeout(4200);
  // Puntos: [nombre, selector, fracción de scroll dentro de la sección]
  const stops = [
    ['01-hero', '.hero', 0], ['02-hero-travel', '.hero', 0.45], ['03-idea', '.idea', 0.35], ['04-idea-verbs', '.idea', 0.62],
    ['05-closing', '.idea__after', 0], ['06-worlds', '.worlds', 0.18], ['07-touch', '.touch', 0.2], ['08-milan-open', '.milan__open', 0.12],
    ['09-milan-full', '.milan__open', 0.55], ['10-chapters', '.chapters', 0.02], ['11-chapters-mid', '.chapters', 0.5],
    ['12-pending', '.milan__close', 0.15], ['13-late', '.late', 0.3], ['14-late-answer', '.late', 0.6], ['15-formation', '.formation', 0.1],
    ['16-formation-2', '.formation', 0.5], ['17-community', '.community', 0.05], ['18-community-sheet', '.community', 0.55],
    ['19-pb', '.pb', 0.1], ['20-pb-steps', '.pb', 0.5], ['21-founders', '.founders', 0.05], ['22-founders-2', '.founders', 0.5],
    ['23-archive', '.archive', 0.1], ['24-contact', '.contact', 0.1], ['25-footer', '.footer', 0.0],
  ];
  const out = [];
  for (const [name, sel, f] of stops) {
    const y = await page.evaluate(([sel, f]) => {
      const el = document.querySelector(sel); if (!el) return -1;
      const top = el.getBoundingClientRect().top + scrollY;
      const y = top + Math.max(0, el.offsetHeight - innerHeight) * f + (f === 0 ? 0 : 0);
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
      return y;
    }, [sel, f]);
    if (y < 0) { out.push(name + ' missing'); continue; }
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `shots/${prefix}-${name}.png`, scale: 'css' });
    out.push(name);
  }
  // overflow horizontal
  const ov = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.chapters__track,.community__marquee,.plate,.milan__city,.worlds__panels'); }).slice(0, 10).map(e => e.className.toString().slice(0, 40))]);
  out.push(JSON.stringify(ov));
  return out;
}
