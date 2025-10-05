// HERO animacija + mouse + touch
(function(){
  const hero = document.getElementById('ch030Hero');
  if(!hero) return;
  const title = hero.querySelector('.ch030-hero-title');

  function setCoordsFromPoint(clientX, clientY){
    const rect = hero.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    title.style.setProperty('--mx', x + '%');
    title.style.setProperty('--my', y + '%');
  }

  function onMouseMove(e){ setCoordsFromPoint(e.clientX, e.clientY); }

  function onTouchMove(e){
    if(!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    setCoordsFromPoint(t.clientX, t.clientY);
  }
  function onTouchStart(){ cancelAnimationFrame(raf); }
  function onTouchEnd(){ cancelAnimationFrame(raf); idle(); }

  hero.addEventListener('mousemove', onMouseMove, {passive:true});
  hero.addEventListener('touchstart', onTouchStart, {passive:true});
  hero.addEventListener('touchmove', onTouchMove, {passive:true});
  hero.addEventListener('touchend', onTouchEnd, {passive:true});
  hero.addEventListener('touchcancel', onTouchEnd, {passive:true});

  let t = 0, raf;
  function idle() {
    t += 0.005;
    const x = 50 + Math.sin(t) * 20;
    const y = 50 + Math.cos(t * 0.8) * 12;
    title.style.setProperty('--mx', x + '%');
    title.style.setProperty('--my', y + '%');
    raf = requestAnimationFrame(idle);
  }
  idle();

  hero.addEventListener('mouseenter', () => cancelAnimationFrame(raf));
  hero.addEventListener('mouseleave', () => { cancelAnimationFrame(raf); idle(); });
})();

// SLIDER (kao kod tebe)
(function () {
  const stage = document.getElementById('menu030Stage');
  if (!stage) return;

  const slides = [
    'img/Meni1.jpg',
    'img/Meni2.jpg',
    'img/Meni3.jpg',
    'img/Meni4.jpg',
    'img/Meni5.jpg',
    'img/Meni6.jpg',
    'img/Meni7.jpg',
    'img/Meni8.png',
  ];

  const mod = (n, m) => ((n % m) + m) % m;

  const cards = slides.map((src, i) => {
    const c = document.createElement('div');
    c.className = 'menu030-card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Meni ${i + 1}`;
    c.appendChild(img);
    stage.appendChild(c);
    return c;
  });

  let active = 0;

  function render() {
    const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menu030-gap'), 10);

    cards.forEach((card, i) => {
      let d = i - active;
      const N = cards.length;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;

      const clamped = Math.max(-3, Math.min(3, d));
      card.dataset.pos = String(clamped);

      const hidden = Math.abs(clamped) >= 2;
      card.style.display = hidden ? 'none' : 'block';
      card.setAttribute('aria-hidden', hidden ? 'true' : 'false');

      if (hidden) {
        card.classList.remove('is-center');
        return;
      }

      const x = clamped * gap;
      const scale = clamped === 0 ? 1.2 : 0.92;

      card.style.transform = `translateX(calc(-50% + ${x}px)) scale(${scale})`;
      card.classList.toggle('is-center', clamped === 0);
    });
  }

  function next(){ active = mod(active + 1, cards.length); render(); }
  function prev(){ active = mod(active - 1, cards.length); render(); }

  render();
  document.querySelector('.menu030-next')?.addEventListener('click', next);
  document.querySelector('.menu030-prev')?.addEventListener('click', prev);
  window.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); });
  stage.addEventListener('click', (e) => {
    const card = e.target.closest('.menu030-card'); if (!card) return;
    const pos = parseInt(card.dataset.pos || '0', 10);
    if (pos === 0) return;
    if (pos > 0) { for (let i = 0; i < pos; i++) next(); }
    else { for (let i = 0; i < -pos; i++) prev(); }
  });
  window.addEventListener('resize', render);
})();
