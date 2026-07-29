  // Menu mobile
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
// Carrossel de fotos (seção Sobre)
function initCarousel(root){
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const dotsWrap = root.querySelector('.carousel-dots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  root.querySelector('.prev').addEventListener('click', () => goTo(index - 1));
  root.querySelector('.next').addEventListener('click', () => goTo(index + 1));

  let auto = setInterval(() => goTo(index + 1), 3000);
  root.addEventListener('mouseenter', () => clearInterval(auto));
  root.addEventListener('mouseleave', () => {
  auto = setInterval(() => goTo(index + 1), 3000);
  });
}

document.querySelectorAll('.carousel').forEach(initCarousel);
// Carrossel infinito (usado na Galeria, no Studio e nos Depoimentos)
function initGalleryCarousel(root){
  const track = root.querySelector('.gallery-track, .testi-track');
  const originalItems = Array.from(track.children);
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');

  function visibleCount(){
    if (window.innerWidth <= 720) return 1;
    if (window.innerWidth <= 980) return 2;
    return 4;
  }

  let cloneCount = visibleCount();
  let index = cloneCount; // começa após os clones do início

  function buildClones(){
    // remove clones antigos, se houver
    track.querySelectorAll('.clone').forEach(el => el.remove());

    cloneCount = visibleCount();

    const startClones = originalItems.slice(0, cloneCount).map(el => {
      const c = el.cloneNode(true);
      c.classList.add('clone');
      return c;
    });
    const endClones = originalItems.slice(-cloneCount).map(el => {
      const c = el.cloneNode(true);
      c.classList.add('clone');
      return c;
    });

    endClones.forEach(c => track.insertBefore(c, track.firstChild));
    startClones.forEach(c => track.appendChild(c));

    index = cloneCount;
    moveTo(index, false);
  }

  function moveTo(i, animate = true){
    const items = Array.from(track.children);
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 14;
    track.style.transition = animate ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${i * (itemWidth + gap)}px)`;
  }

  function goTo(i){
    index = i;
    moveTo(index);
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  let auto = setInterval(() => goTo(index + 1), 3000);
  root.addEventListener('mouseenter', () => clearInterval(auto));
  root.addEventListener('mouseleave', () => {
    auto = setInterval(() => goTo(index + 1), 3000);
  });

  track.addEventListener('transitionend', () => {
    const items = Array.from(track.children);
    const total = items.length;
    const realCount = originalItems.length;

    if (index >= total - cloneCount){
      index = index - realCount;
      moveTo(index, false);
    } else if (index < cloneCount){
      index = index + realCount;
      moveTo(index, false);
    }
  });

  window.addEventListener('resize', buildClones);

  window.addEventListener('resize', buildClones);

  const imgs = Array.from(track.querySelectorAll('img'));
  let loadedCount = 0;

  function checkAllLoaded(){
    loadedCount++;
    if (loadedCount === imgs.length){
      buildClones();
    }
  }

  if (imgs.length === 0){
    buildClones();
  } else {
    imgs.forEach(img => {
      if (img.complete){
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });
  }
}


document.querySelectorAll('.gallery-carousel').forEach(initGalleryCarousel);
document.querySelectorAll('.testi-carousel').forEach(initGalleryCarousel);