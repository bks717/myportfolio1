/**
 * PROJECT THEATER
 * Immersive 3D void environment - pure black infinite space
 * with floating, breathing project panels.
 * Pure CSS 3D transforms - no Three.js dependency.
 */
(function () {
  'use strict';

  var PROJECTS = [
    {
      id: 'puddy',
      title: 'Placement Buddy',
      desc: 'Production-grade RAG placement assistant.',
      img: './images/puddy.png',
      link: 'https://puddy.krupakara.space/',
      linkLabel: 'Check Site',
      icons: ['./react.svg','./fastapi.svg','./python.svg','./gemini.svg','./chromadb.svg'],
      iconAlts: ['React','FastAPI','Python','Gemini','ChromaDB'],
      color: '#00ff99',
    },
    {
      id: 'axios',
      title: 'Axios: Land Registry on Blockchain',
      desc: 'A Land Registry System Based on Blockchain Principles.',
      img: './images/axios.png',
      link: 'https://axios.bhuvans.in/',
      linkLabel: 'Check Site',
      icons: ['./react.svg','./nodejs.svg','./express.svg','./mongodb.svg','./javascript.svg'],
      iconAlts: ['React','Node.js','Express','MongoDB','JavaScript'],
      color: '#38bdf8',
    },
    {
      id: 'blockseat',
      title: 'BlockSeat',
      desc: 'Anti-fraud ticket booking system for RCB fans.',
      img: './images/origblockseat.png',
      link: 'https://www.blockseat.app/',
      linkLabel: 'Check Site',
      icons: ['./react.svg','./nodejs.svg','./express.svg','./mongodb.svg','./python.svg'],
      iconAlts: ['React','Node.js','Express','MongoDB','Python'],
      color: '#f97316',
    },
    {
      id: 'flood',
      title: 'Flood Prediction System',
      desc: 'Deep learning-based flood prediction system that forecasts flood risk.',
      img: './images/flood.jpeg',
      link: 'https://github.com/bks717/mp-latest',
      linkLabel: 'GitHub',
      icons: ['./python.svg','./tensorflow.svg','./flask.svg','./pandas.svg','./numpy.svg'],
      iconAlts: ['Python','TensorFlow','Flask','Pandas','NumPy'],
      color: '#a78bfa',
    },
  ];

  /* Card spread positions in 3D space */
  var CARD_LAYOUT = [
    { x: -420, y: -60, z: -80, rx: 4,  ry: 12 },
    { x: -100, y:  40, z:  60, rx: -3, ry:  4 },
    { x:  220, y: -50, z: -40, rx:  2, ry: -8 },
    { x:  510, y:  50, z:  20, rx: -4, ry:-14 },
  ];

  /* State */
  var overlay = null;
  var animFrame = null;
  var cards = [];
  var time = 0;
  var targetCamX = 0, targetCamY = 0, camX = 0, camY = 0;
  var hoveredCard = -1;
  var theaterOpen = false;
  var scrollOffset = 0, targetScrollOffset = 0;
  var isDragging = false, dragStartX = 0, dragStartScroll = 0;
  var touchStartX = 0, touchStartScroll = 0;

  /* ── Open ── */
  function openTheater() {
    if (theaterOpen) return;
    theaterOpen = true;
    injectCSS();
    overlay = document.createElement('div');
    overlay.id = 'project-theater-overlay';
    overlay.innerHTML = buildHTML();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
      var scene = overlay.querySelector('.theater-scene');
      if (scene) scene.style.transform = 'scale(1)';
    });
    cards = Array.from(overlay.querySelectorAll('.theater-card'));
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { hoveredCard = i; });
      card.addEventListener('mouseleave', function () { hoveredCard = -1; });
    });
    overlay.addEventListener('mousemove', onMouseMove);
    overlay.addEventListener('wheel', onWheel, { passive: false });
    overlay.addEventListener('mousedown', onMouseDown);
    overlay.addEventListener('mouseup', onMouseUp);
    overlay.addEventListener('mouseleave', function () { isDragging = false; });
    overlay.addEventListener('touchstart', onTouchStart, { passive: false });
    overlay.addEventListener('touchmove', onTouchMove, { passive: false });
    overlay.addEventListener('touchend', onTouchEnd);
    var closeBtn = overlay.querySelector('#theater-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeTheater);
    /* Wire nav dots */
    var dotEls = overlay.querySelectorAll('.theater-nav-dot');
    dotEls.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-idx'), 10);
        window.__theaterScrollTo(idx);
      });
    });
    document.addEventListener('keydown', onKeyDown);
    /* Start centered on card 1 (index 1) */
    scrollOffset = CARD_LAYOUT[1].x;
    targetScrollOffset = CARD_LAYOUT[1].x;
    time = 0;
    tick();
  }

  function buildHTML() {
    var cardsHTML = PROJECTS.map(function (p, i) { return buildCardHTML(p, i); }).join('');
    var dotsHTML = PROJECTS.map(function (p, i) {
      var active = i === 1 ? ' active' : '';
      return '<button class="theater-nav-dot' + active + '" data-idx="' + i + '" aria-label="Project ' + (i+1) + '"></button>';
    }).join('');
    return (
      '<div class="theater-scene">' +
        '<div class="theater-world" id="theater-world">' +
          '<div class="theater-cards-container" id="theater-cards-container">' + cardsHTML + '</div>' +
        '</div>' +
        '<div class="theater-hud">' +
          '<div class="theater-hud-title"><span class="theater-hud-icon">&#9672;</span>\u00a0PROJECT THEATER</div>' +
          '<div class="theater-hud-sub">Drag \u00b7 Scroll to explore \u00b7 ESC to exit</div>' +
        '</div>' +
        '<button id="theater-close-btn" aria-label="Exit Project Theater">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>' +
          '</svg>' +
          '<span>EXIT THEATER</span>' +
        '</button>' +
        '<div class="theater-nav-dots" id="theater-nav-dots">' + dotsHTML + '</div>' +
        '<div class="theater-fog theater-fog-left"></div>' +
        '<div class="theater-fog theater-fog-right"></div>' +
      '</div>'
    );
  }

  function buildCardHTML(p, i) {
    var iconsHTML = p.icons.map(function (src, j) {
      return '<div class="t-icon-ring" title="' + p.iconAlts[j] + '"><img src="' + src + '" alt="' + p.iconAlts[j] + '" /></div>';
    }).join('');
    var num = i < 9 ? '0' + (i + 1) : '' + (i + 1);
    return (
      '<div class="theater-card" data-index="' + i + '" style="--card-color:' + p.color + '">' +
        '<div class="t-card-inner">' +
          '<div class="t-img-wrap">' +
            '<div class="t-img-bg"></div>' +
            '<img class="t-img" src="' + p.img + '" alt="' + p.title + '" loading="lazy" />' +
            '<div class="t-img-overlay"></div>' +
            '<div class="t-num">' + num + '</div>' +
          '</div>' +
          '<div class="t-content">' +
            '<h2 class="t-title">' + p.title + '</h2>' +
            '<p class="t-desc">' + p.desc + '</p>' +
            '<div class="t-icons">' + iconsHTML + '</div>' +
            '<a class="t-cta" href="' + p.link + '" target="_blank" rel="noopener noreferrer">' +
              p.linkLabel +
              '<svg viewBox="0 0 448 512" fill="currentColor" width="11" height="11">' +
                '<path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8l176 0 0 176c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"/>' +
              '</svg>' +
            '</a>' +
          '</div>' +
          '<div class="t-glow-ring"></div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ── Animation loop ── */
  function tick() {
    if (!theaterOpen) return;
    time += 0.008;
    camX += (targetCamX - camX) * 0.04;
    camY += (targetCamY - camY) * 0.04;
    scrollOffset += (targetScrollOffset - scrollOffset) * 0.06;
    var world = document.getElementById('theater-world');
    if (!world) return;
    world.style.transform = 'rotateX(' + (camY * 0.5) + 'deg) rotateY(' + (camX * -0.25) + 'deg)';
    cards.forEach(function (card, i) {
      var layout = CARD_LAYOUT[i] || { x: i * 300, y: 0, z: 0, rx: 0, ry: 0 };
      var isHov = hoveredCard === i;
      var breathY = Math.sin(time * 0.7 + i * 2.2) * (isHov ? 0 : 5);
      var breathZ = Math.sin(time * 0.5 + i * 1.8) * 8;
      var hoverScale = isHov ? 1.05 : 1.0;
      var hoverZ = isHov ? 70 : 0;
      var ry = isHov ? 0 : layout.ry;
      var rx = isHov ? 0 : layout.rx;
      var tx = layout.x - scrollOffset;
      var ty = layout.y + breathY;
      var tz = layout.z + breathZ + hoverZ;
      card.style.transform =
        'translate3d(' + tx + 'px,' + ty + 'px,' + tz + 'px)' +
        ' rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)' +
        ' scale(' + hoverScale + ')';
      var ring = card.querySelector('.t-glow-ring');
      if (ring) {
        var g = isHov ? 1 : 0.25 + 0.15 * Math.sin(time * 1.2 + i);
        ring.style.opacity = g;
      }
    });
    updateNavDots();
    animFrame = requestAnimationFrame(tick);
  }

  function updateNavDots() {
    if (!overlay) return;
    var dots = overlay.querySelectorAll('.theater-nav-dot');
    var closest = 0, minDist = Infinity;
    CARD_LAYOUT.forEach(function (l, i) {
      var d = Math.abs(l.x - scrollOffset);
      if (d < minDist) { minDist = d; closest = i; }
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === closest);
    });
  }

  window.__theaterScrollTo = function (idx) {
    if (!theaterOpen) return;
    var layout = CARD_LAYOUT[idx];
    if (!layout) return;
    targetScrollOffset = layout.x;
  };

  /* ── Events ── */
  function onMouseMove(e) {
    if (!overlay) return;
    var rect = overlay.getBoundingClientRect();
    targetCamX = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
    targetCamY = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 5;
    if (isDragging) {
      var dx = e.clientX - dragStartX;
      targetScrollOffset = dragStartScroll - dx * 1.4;
      clampScroll();
    }
  }

  function onMouseDown(e) {
    if (e.target.closest) {
      if (e.target.closest('#theater-close-btn') || e.target.closest('.t-cta') || e.target.closest('.theater-nav-dots')) return;
    }
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = targetScrollOffset;
    if (overlay) overlay.style.cursor = 'grabbing';
  }

  function onMouseUp() {
    isDragging = false;
    if (overlay) overlay.style.cursor = '';
    snapToNearest();
  }

  function onWheel(e) {
    e.preventDefault();
    targetScrollOffset += (e.deltaY + e.deltaX) * 0.9;
    clampScroll();
  }

  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = targetScrollOffset;
  }

  function onTouchMove(e) {
    e.preventDefault();
    var dx = touchStartX - e.touches[0].clientX;
    targetScrollOffset = touchStartScroll + dx * 1.2;
    clampScroll();
  }

  function onTouchEnd() { snapToNearest(); }

  function clampScroll() {
    var minX = CARD_LAYOUT[0].x - 180;
    var maxX = CARD_LAYOUT[CARD_LAYOUT.length - 1].x + 180;
    targetScrollOffset = Math.max(minX, Math.min(maxX, targetScrollOffset));
  }

  function snapToNearest() {
    var closest = 0, minDist = Infinity;
    CARD_LAYOUT.forEach(function (l, i) {
      var d = Math.abs(l.x - targetScrollOffset);
      if (d < minDist) { minDist = d; closest = i; }
    });
    targetScrollOffset = CARD_LAYOUT[closest].x;
  }

  function onKeyDown(e) {
    if (!theaterOpen) return;
    if (e.key === 'Escape') { closeTheater(); return; }
    if (e.key === 'ArrowLeft') navigateCards(-1);
    if (e.key === 'ArrowRight') navigateCards(1);
  }

  function navigateCards(dir) {
    var current = 0, minDist = Infinity;
    CARD_LAYOUT.forEach(function (l, i) {
      var d = Math.abs(l.x - targetScrollOffset);
      if (d < minDist) { minDist = d; current = i; }
    });
    var next = Math.max(0, Math.min(PROJECTS.length - 1, current + dir));
    window.__theaterScrollTo(next);
  }

  /* ── Close ── */
  function closeTheater() {
    if (!theaterOpen) return;
    theaterOpen = false;
    cancelAnimationFrame(animFrame);
    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = '';
    if (overlay) {
      overlay.style.opacity = '0';
      var scene = overlay.querySelector('.theater-scene');
      if (scene) scene.style.transform = 'scale(0.96)';
      var ol = overlay;
      setTimeout(function () {
        if (ol && ol.parentNode) ol.parentNode.removeChild(ol);
      }, 420);
      overlay = null;
    }
    hoveredCard = -1; cards = [];
    scrollOffset = 0; targetScrollOffset = 0;
    camX = 0; camY = 0; targetCamX = 0; targetCamY = 0;
  }

  /* ── CSS (all injected inline) ── */
  function injectCSS() {
    if (document.getElementById('project-theater-styles')) return;
    var el = document.createElement('style');
    el.id = 'project-theater-styles';
    el.textContent =
      '#project-theater-overlay{position:fixed;inset:0;z-index:99999;background:#000;opacity:0;transition:opacity .45s cubic-bezier(.16,1,.3,1);overflow:hidden;cursor:grab;user-select:none;}' +
      '#project-theater-overlay:active{cursor:grabbing;}' +
      '.theater-scene{width:100%;height:100%;position:relative;transform:scale(.96);transition:transform .5s cubic-bezier(.16,1,.3,1);}' +
      '.theater-world{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:1200px;transform-style:preserve-3d;}' +
      '.theater-cards-container{position:relative;transform-style:preserve-3d;width:0;height:0;}' +
      '.theater-card{position:absolute;width:330px;border-radius:20px;transform-style:preserve-3d;pointer-events:all;top:-210px;left:-165px;cursor:default;}' +
      '.t-card-inner{position:relative;width:100%;border-radius:20px;background:rgba(8,8,14,.93);border:1px solid rgba(255,255,255,.07);overflow:hidden;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:border-color .3s,box-shadow .3s;}' +
      '.theater-card:hover .t-card-inner{border-color:rgba(255,255,255,.18);box-shadow:0 30px 80px rgba(0,0,0,.9),0 0 50px rgba(255,255,255,.05);}' +
      '.t-img-wrap{position:relative;width:100%;height:175px;overflow:hidden;border-radius:18px 18px 0 0;}' +
      '.t-img-bg{position:absolute;inset:0;background:rgb(13,15,35);}' +
      '.t-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform .5s ease;}' +
      '.theater-card:hover .t-img{transform:scale(1.05);}' +
      '.t-img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(8,8,14,.95) 100%);}' +
      '.t-num{position:absolute;top:12px;right:14px;font-size:.6rem;font-weight:800;letter-spacing:.2em;color:var(--card-color,#00ff99);background:rgba(0,0,0,.65);padding:3px 8px;border-radius:4px;font-family:monospace;text-shadow:0 0 8px var(--card-color,#00ff99);}' +
      '.t-content{padding:18px 20px 20px;}' +
      '.t-title{font-size:1rem;font-weight:700;color:rgba(255,255,255,.95);line-height:1.3;margin:0 0 7px;letter-spacing:-.01em;}' +
      '.t-desc{font-size:.76rem;color:rgba(190,193,221,.8);line-height:1.6;margin:0 0 13px;}' +
      '.t-icons{display:flex;gap:0;margin-bottom:16px;}' +
      '.t-icon-ring{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:#000;display:flex;align-items:center;justify-content:center;margin-left:-4px;transition:transform .2s;position:relative;z-index:1;}' +
      '.t-icon-ring:first-child{margin-left:0;}' +
      '.t-icon-ring:hover{transform:translateY(-4px) scale(1.15);z-index:10;}' +
      '.t-icon-ring img{width:15px;height:15px;object-fit:contain;}' +
      '.t-cta{display:inline-flex;align-items:center;gap:6px;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--card-color,#00ff99);text-decoration:none;padding:7px 15px;border:1px solid rgba(255,255,255,.15);border-radius:6px;background:rgba(255,255,255,.04);transition:all .2s;pointer-events:all;position:relative;z-index:10;}' +
      '.t-cta:hover{background:var(--card-color,#00ff99);color:#000;box-shadow:0 0 20px var(--card-color,#00ff99);transform:translateY(-1px);}' +
      '.t-glow-ring{position:absolute;inset:-1px;border-radius:21px;border:1px solid var(--card-color,#00ff99);pointer-events:none;box-shadow:0 0 18px var(--card-color,#00ff99),inset 0 0 10px rgba(255,255,255,.02);}' +
      '.theater-hud{position:absolute;top:26px;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;z-index:100;}' +
      '.theater-hud-title{font-size:.62rem;font-weight:800;letter-spacing:.35em;text-transform:uppercase;color:rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;gap:8px;font-family:monospace;}' +
      '.theater-hud-icon{font-size:.8rem;color:rgba(255,255,255,.18);}' +
      '.theater-hud-sub{font-size:.52rem;letter-spacing:.18em;color:rgba(255,255,255,.16);margin-top:4px;font-family:monospace;text-transform:uppercase;}' +
      '#theater-close-btn{position:absolute;top:20px;right:22px;z-index:200;display:flex;align-items:center;gap:7px;background:rgba(6,6,10,.7);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.4);font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:8px 14px;cursor:pointer;backdrop-filter:blur(12px);transition:all .2s;font-family:monospace;}' +
      '#theater-close-btn:hover{background:rgba(14,14,22,.9);border-color:rgba(255,255,255,.25);color:rgba(255,255,255,.85);box-shadow:0 4px 20px rgba(0,0,0,.6);}' +
      '.theater-nav-dots{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:100;}' +
      '.theater-nav-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.18);border:none;cursor:pointer;transition:all .3s;padding:0;}' +
      '.theater-nav-dot.active{background:rgba(255,255,255,.7);transform:scale(1.5);}' +
      '.theater-nav-dot:hover{background:rgba(255,255,255,.5);}' +
      '.theater-fog{position:absolute;top:0;bottom:0;width:180px;pointer-events:none;z-index:50;}' +
      '.theater-fog-left{left:0;background:linear-gradient(90deg,rgba(0,0,0,.95) 0%,transparent 100%);}' +
      '.theater-fog-right{right:0;background:linear-gradient(-90deg,rgba(0,0,0,.95) 0%,transparent 100%);}' +
      '.project-theater-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(4,4,8,.6);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.55);font-size:.63rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:9px 18px;cursor:pointer;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:all .25s cubic-bezier(.16,1,.3,1);font-family:monospace;text-decoration:none;}' +
      '.project-theater-btn:hover{border-color:rgba(255,255,255,.22);color:rgba(255,255,255,.9);background:rgba(10,10,18,.8);box-shadow:0 8px 32px rgba(0,0,0,.7);transform:translateY(-1px);}' +
      '.theater-btn-icon{font-size:.85rem;opacity:.6;transition:opacity .2s;}' +
      '.project-theater-btn:hover .theater-btn-icon{opacity:1;}' +
      '.sidebar-theater-btn{width:100%;justify-content:center;border-radius:6px;padding:8px 12px;font-size:.58rem;margin-top:8px;}' +
      '@media(max-width:600px){.theater-card{width:280px;left:-140px;top:-195px;}.t-img-wrap{height:145px;}.theater-fog{width:70px;}#theater-close-btn span{display:none;}}';
    document.head.appendChild(el);
  }

  /* ── Public API ── */
  window.openProjectTheater = openTheater;
  window.closeProjectTheater = closeTheater;

})();

