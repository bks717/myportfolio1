/**
 * PROJECT THEATER - 360° Inward-Facing Circular Void
 *
 * The camera is locked at the true CENTER of the 360° circle.
 * Projects form an inward-facing cylindrical ring revolving around you.
 *
 * Controls:
 *   DRAG   -> Look around 360° from the center (yaw & pitch)
 *   SCROLL -> Spin the 360° revolving ring around you
 *   HOVER  -> Card pulls closer toward you, glows, brightens
 *   ESC    -> Exit
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
   * PROJECT DATA
   * ───────────────────────────────────────────────────────────── */
  var PROJECTS = [
    {
      id: 'puddy',
      title: 'Placement Buddy',
      desc: 'Production-grade RAG placement assistant powered by Google Gemini.',
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
      desc: 'A decentralised Land Registry System Built on Blockchain principles.',
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
      desc: 'Anti-fraud ticket booking system for RCB fans — trustless and transparent.',
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
      desc: 'Deep learning model that forecasts flood risk zones with high precision.',
      img: './images/flood.jpeg',
      link: 'https://github.com/bks717/mp-latest',
      linkLabel: 'GitHub',
      icons: ['./python.svg','./tensorflow.svg','./flask.svg','./pandas.svg','./numpy.svg'],
      iconAlts: ['Python','TensorFlow','Flask','Pandas','NumPy'],
      color: '#a78bfa',
    },
  ];

  /* ─────────────────────────────────────────────────────────────
   * 360° CIRCLE GEOMETRY (Centered on Perspective Eye Z = 1000px)
   * ───────────────────────────────────────────────────────────── */
  var PERSPECTIVE_D = 1000; /* Perspective distance of the camera eye */
  var RADIUS        = 920;  /* Distance from center to project cards (comfortably pushed back) */
  var BASE_ANGLES   = [-45, 45, 135, 225]; /* 4 projects around 360° */
  var Y_OFFSETS     = [ 20, -20,  30, -20]; /* Organic vertical stagger */

  /* ─────────────────────────────────────────────────────────────
   * STATE
   * ───────────────────────────────────────────────────────────── */
  var overlay     = null;
  var worldEl     = null;
  var cardEls     = [];
  var animFrame   = null;
  var theaterOpen = false;
  var time        = 0;

  /* Camera look state (user stands at center looking out) */
  var cam = {
    yaw: 0, pitch: 0,
    tyaw: 0, tpitch: 0,
  };

  /* Revolve angle of the ring around the user */
  var revolveAngle = 0;
  var revolveVel   = 0;

  /* Drag state */
  var drag = {
    active: false,
    lastX: 0, lastY: 0,
    velX: 0, velY: 0,
  };

  /* Touch state */
  var touch = { lastX: 0, lastY: 0 };

  /* Per-card animation state */
  var cardState = PROJECTS.map(function () {
    return {
      hovered: false,
      hoverT: 0,
      focusT: 0,
      breathT: Math.random() * Math.PI * 2,
    };
  });

  /* ─────────────────────────────────────────────────────────────
   * OPEN / CLOSE
   * ───────────────────────────────────────────────────────────── */
  function openTheater() {
    if (theaterOpen) return;
    theaterOpen = true;
    injectCSS();

    overlay = document.createElement('div');
    overlay.id = 'pt-overlay';
    overlay.innerHTML = buildShell();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    worldEl  = overlay.querySelector('#pt-world');
    cardEls  = [];

    /* Build and insert cards */
    PROJECTS.forEach(function (p, i) {
      var el = document.createElement('div');
      el.className = 'pt-card';
      el.setAttribute('data-idx', i);
      el.innerHTML = buildCardInner(p, i);
      el.style.setProperty('--card-color', p.color);
      worldEl.appendChild(el);
      cardEls.push(el);

      el.addEventListener('mouseenter', function () { cardState[i].hovered = true; });
      el.addEventListener('mouseleave', function () { cardState[i].hovered = false; });
    });

    /* Entrance fade */
    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
    });

    /* Reset camera at center looking forward */
    cam.yaw = 0; cam.pitch = 0;
    cam.tyaw = 0; cam.tpitch = 0;
    revolveAngle = 0;
    revolveVel = 0;
    drag.velX = 0; drag.velY = 0;
    time = 0;

    /* Events */
    overlay.addEventListener('mousedown',  onMouseDown);
    overlay.addEventListener('mousemove',  onMouseMove);
    overlay.addEventListener('mouseup',    onMouseUp);
    overlay.addEventListener('mouseleave', onMouseLeave);
    overlay.addEventListener('wheel',      onWheel, { passive: false });
    overlay.addEventListener('touchstart', onTouchStart, { passive: false });
    overlay.addEventListener('touchmove',  onTouchMove,  { passive: false });
    overlay.addEventListener('touchend',   onTouchEnd);
    document.addEventListener('keydown',   onKeyDown);
    overlay.querySelector('#pt-close').addEventListener('click', closeTheater);

    tick();
  }

  function closeTheater() {
    if (!theaterOpen) return;
    theaterOpen = false;
    cancelAnimationFrame(animFrame);
    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = '';
    if (overlay) {
      overlay.style.opacity = '0';
      var o = overlay;
      setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 450);
      overlay = null; worldEl = null; cardEls = [];
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * HTML BUILDERS
   * ───────────────────────────────────────────────────────────── */
  function buildShell() {
    return (
      '<div id="pt-scene">' +
        '<div id="pt-world"></div>' +
        /* HUD */
        '<div id="pt-hud">' +
          '<div class="pt-hud-label">&#9672;&nbsp; 360&deg; PROJECT THEATER &nbsp;&#9672;</div>' +
          '<div class="pt-hud-hint">Drag to look 360&deg; from center &nbsp;&middot;&nbsp; Scroll to revolve ring &nbsp;&middot;&nbsp; ESC to exit</div>' +
        '</div>' +
        /* Close */
        '<button id="pt-close" aria-label="Exit Project Theater">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>' +
          '</svg>' +
          '<span>EXIT</span>' +
        '</button>' +
      '</div>'
    );
  }

  function buildCardInner(p, i) {
    var icons = p.icons.map(function (src, j) {
      return '<div class="pt-icon" title="' + p.iconAlts[j] + '"><img src="' + src + '" alt="' + p.iconAlts[j] + '"/></div>';
    }).join('');
    var num = (i + 1) < 10 ? '0' + (i + 1) : '' + (i + 1);
    return (
      '<div class="pt-card-inner">' +
        '<div class="pt-img-area">' +
          '<div class="pt-img-bg"></div>' +
          '<img class="pt-img" src="' + p.img + '" alt="' + p.title + '" loading="lazy"/>' +
          '<div class="pt-img-fade"></div>' +
          '<div class="pt-badge">' + num + '</div>' +
        '</div>' +
        '<div class="pt-body">' +
          '<h2 class="pt-title">' + p.title + '</h2>' +
          '<p class="pt-desc">' + p.desc + '</p>' +
          '<div class="pt-icons">' + icons + '</div>' +
          '<a class="pt-cta" href="' + p.link + '" target="_blank" rel="noopener noreferrer">' +
            p.linkLabel +
            '<svg viewBox="0 0 448 512" fill="currentColor" width="10" height="10"><path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8l176 0 0 176c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"/></svg>' +
          '</a>' +
        '</div>' +
        '<div class="pt-glow"></div>' +
      '</div>'
    );
  }

  /* ─────────────────────────────────────────────────────────────
   * ANIMATION LOOP
   * ───────────────────────────────────────────────────────────── */
  function tick() {
    if (!theaterOpen) return;
    time += 0.012;

    /* ── Continuous subtle idle revolving + scroll spin inertia ── */
    revolveVel   *= 0.90;
    revolveAngle += 0.035 + revolveVel;

    /* ── Drag look inertia (full 360° continuous yaw from center) ── */
    if (!drag.active) {
      cam.tyaw   += drag.velX;
      cam.tpitch += drag.velY;
      drag.velX  *= 0.88;
      drag.velY  *= 0.88;
    }

    /* Clamp vertical pitch so user doesn't flip over zenith/nadir */
    cam.tpitch = Math.max(-42, Math.min(42, cam.tpitch));

    /* Smooth camera lerp */
    var L = 0.08;
    cam.yaw   += (cam.tyaw   - cam.yaw)   * L;
    cam.pitch += (cam.tpitch - cam.pitch) * L;

    /* ── True Center Camera Transform:
          Rotates the entire surrounding space around the camera eye at Z = PERSPECTIVE_D ── */
    if (worldEl) {
      worldEl.style.transform =
        'translateZ(' + PERSPECTIVE_D + 'px)' +
        ' rotateX(' + (-cam.pitch).toFixed(3) + 'deg)' +
        ' rotateY(' + (-cam.yaw).toFixed(3)  + 'deg)' +
        ' translateZ(-' + PERSPECTIVE_D + 'px)';
    }

    /* ── Position & Orient each project on the 360° circle around the user (0, 0, PERSPECTIVE_D) ── */
    cardEls.forEach(function (el, i) {
      var cs = cardState[i];

      /* Current orbital angle */
      var currentAngleDeg = BASE_ANGLES[i] + revolveAngle;
      var angleRad = (currentAngleDeg * Math.PI) / 180;

      /* Position on circle in X-Z around center (0, 0, PERSPECTIVE_D) */
      var posX = Math.sin(angleRad) * RADIUS;
      var posZ = PERSPECTIVE_D - Math.cos(angleRad) * RADIUS;
      var posY = Y_OFFSETS[i];

      /* Relative viewing angle compared to camera yaw */
      var relAngle = (currentAngleDeg - cam.yaw) % 360;
      while (relAngle > 180)  relAngle -= 360;
      while (relAngle < -180) relAngle += 360;
      var absRelAngle = Math.abs(relAngle);

      /* Proximity/Facing focus: 1.0 when looking right at it, 0.0 when on side/behind */
      var viewFocus = Math.max(0, Math.min(1, 1 - absRelAngle / 75));
      cs.focusT += (viewFocus - cs.focusT) * 0.08;

      /* Mouse hover */
      var hTarget = cs.hovered ? 1 : 0;
      cs.hoverT  += (hTarget - cs.hoverT) * 0.12;

      var totalFocus = Math.max(cs.focusT, cs.hoverT);

      /* Subtle breathing */
      cs.breathT += 0.010;
      var breathY = Math.sin(cs.breathT) * 6;

      /* Card faces directly inward toward the central viewer:
         rotateY is -currentAngleDeg */
      var cardFacingYaw = -currentAngleDeg;

      /* Pop card closer to the center on hover/focus (~100px forward) */
      var pullFactor = 1 - (totalFocus * 0.11);
      var curX = posX * pullFactor;
      var curZ = PERSPECTIVE_D - (PERSPECTIVE_D - posZ) * pullFactor;
      var curY = posY + breathY;
      var scale = 1 + totalFocus * 0.04;

      el.style.transform =
        'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,' + curZ.toFixed(2) + 'px)' +
        ' rotateY(' + cardFacingYaw.toFixed(2) + 'deg)' +
        ' scale(' + scale.toFixed(3) + ')';

      /* ── Visibility based on viewing direction ── */
      var baseOpacity    = 0.42 + totalFocus * 0.56;
      var baseBrightness = 0.44 + totalFocus * 0.56;

      el.style.opacity = baseOpacity.toFixed(3);
      el.style.filter  = 'brightness(' + baseBrightness.toFixed(3) + ')';

      /* Edge glow */
      var glow = el.querySelector('.pt-glow');
      if (glow) glow.style.opacity = (totalFocus * 0.85).toFixed(3);
    });

    animFrame = requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────────────────────
   * EVENTS
   * ───────────────────────────────────────────────────────────── */
  function onMouseDown(e) {
    if (e.target.closest && (
      e.target.closest('#pt-close') ||
      e.target.closest('.pt-cta')
    )) return;
    drag.active = true;
    drag.lastX  = e.clientX;
    drag.lastY  = e.clientY;
    drag.velX   = 0;
    drag.velY   = 0;
    if (overlay) overlay.style.cursor = 'grabbing';
  }

  function onMouseMove(e) {
    if (!drag.active) return;
    var dx = e.clientX - drag.lastX;
    var dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;

    /* 360° camera yaw and pitch control */
    cam.tyaw   += dx * 0.12;
    cam.tpitch += dy * 0.08;

    drag.velX = dx * 0.05;
    drag.velY = dy * 0.03;
  }

  function onMouseUp() {
    drag.active = false;
    if (overlay) overlay.style.cursor = 'grab';
  }

  function onMouseLeave() {
    drag.active = false;
    if (overlay) overlay.style.cursor = 'grab';
  }

  function onWheel(e) {
    e.preventDefault();
    /* Wheel spins the revolving ring around you */
    var delta = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY * 1.0;
    revolveVel += delta * 0.06;
    revolveVel  = Math.max(-15, Math.min(15, revolveVel));
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      touch.lastX = e.touches[0].clientX;
      touch.lastY = e.touches[0].clientY;
      drag.active = true;
      drag.velX = 0; drag.velY = 0;
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!drag.active || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - touch.lastX;
    var dy = e.touches[0].clientY - touch.lastY;
    touch.lastX = e.touches[0].clientX;
    touch.lastY = e.touches[0].clientY;
    cam.tyaw   += dx * 0.14;
    cam.tpitch += dy * 0.09;
    drag.velX   = dx * 0.05;
    drag.velY   = dy * 0.03;
  }

  function onTouchEnd() {
    drag.active = false;
  }

  function onKeyDown(e) {
    if (!theaterOpen) return;
    if (e.key === 'Escape') { closeTheater(); return; }
    if (e.key === 'ArrowLeft'  || e.key === 'a') cam.tyaw  -= 8;
    if (e.key === 'ArrowRight' || e.key === 'd') cam.tyaw  += 8;
    if (e.key === 'ArrowUp'    || e.key === 'w') revolveVel -= 2;
    if (e.key === 'ArrowDown'  || e.key === 's') revolveVel += 2;
  }

  /* ─────────────────────────────────────────────────────────────
   * CSS — ALL INJECTED INLINE
   * ───────────────────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('pt-styles')) return;
    var s = document.createElement('style');
    s.id  = 'pt-styles';
    s.textContent = [

      /* ── Overlay ── */
      '#pt-overlay{',
        'position:fixed;inset:0;z-index:99999;',
        'background:#000000;',
        'opacity:0;',
        'transition:opacity .5s ease;',
        'overflow:hidden;',
        'cursor:grab;',
        'user-select:none;',
      '}',

      /* ── Scene (perspective container with camera eye at Z = 1000px) ── */
      '#pt-scene{',
        'width:100%;height:100%;',
        'position:relative;',
        'perspective:1000px;',
        'perspective-origin:50% 50%;',
      '}',

      /* ── World (camera rotates around the central user at Z = 1000px) ── */
      '#pt-world{',
        'position:absolute;',
        'width:0;height:0;',
        'top:50%;left:50%;',
        'transform-style:preserve-3d;',
      '}',

      /* ── Individual inward-facing card ── */
      '.pt-card{',
        'position:absolute;',
        'width:380px;',
        'top:-240px;left:-190px;',
        'transform-style:preserve-3d;',
        'pointer-events:all;',
        'cursor:default;',
        'opacity:0;',
        'will-change:transform,opacity,filter;',
      '}',

      /* ── Card inner shell ── */
      '.pt-card-inner{',
        'position:relative;',
        'width:100%;',
        'border-radius:20px;',
        'background:rgba(8,8,14,.95);',
        'border:1px solid rgba(255,255,255,.08);',
        'overflow:hidden;',
        'backdrop-filter:blur(22px);',
        '-webkit-backdrop-filter:blur(22px);',
        'transition:border-color .35s,box-shadow .35s;',
      '}',
      '.pt-card:hover .pt-card-inner{',
        'border-color:rgba(255,255,255,.2);',
        'box-shadow:0 30px 80px rgba(0,0,0,.95), 0 0 40px rgba(255,255,255,.04);',
      '}',

      /* ── Project image ── */
      '.pt-img-area{',
        'position:relative;width:100%;height:195px;overflow:hidden;',
        'border-radius:18px 18px 0 0;',
      '}',
      '.pt-img-bg{position:absolute;inset:0;background:rgb(12,14,32);}',
      '.pt-img{',
        'position:absolute;inset:0;width:100%;height:100%;',
        'object-fit:cover;object-position:center top;',
        'transition:transform .6s ease;',
      '}',
      '.pt-card:hover .pt-img{transform:scale(1.05);}',
      '.pt-img-fade{',
        'position:absolute;inset:0;',
        'background:linear-gradient(180deg,transparent 30%,rgba(8,8,14,.98) 100%);',
      '}',
      '.pt-badge{',
        'position:absolute;top:12px;right:14px;',
        'font-size:.6rem;font-weight:800;letter-spacing:.22em;',
        'color:var(--card-color,#00ff99);',
        'background:rgba(0,0,0,.75);',
        'padding:4px 9px;border-radius:5px;',
        'font-family:monospace;',
        'text-shadow:0 0 10px var(--card-color,#00ff99);',
      '}',

      /* ── Card body ── */
      '.pt-body{padding:18px 22px 22px;}',
      '.pt-title{',
        'font-size:1.05rem;font-weight:700;',
        'color:rgba(255,255,255,.96);',
        'line-height:1.3;margin:0 0 7px;letter-spacing:-.01em;',
      '}',
      '.pt-desc{',
        'font-size:.78rem;color:rgba(190,193,221,.82);',
        'line-height:1.6;margin:0 0 14px;',
      '}',

      /* ── Tech icons ── */
      '.pt-icons{display:flex;gap:0;margin-bottom:16px;}',
      '.pt-icon{',
        'width:28px;height:28px;border-radius:50%;',
        'border:1px solid rgba(255,255,255,.12);',
        'background:#000;',
        'display:flex;align-items:center;justify-content:center;',
        'margin-left:-4px;',
        'transition:transform .2s;position:relative;z-index:1;',
      '}',
      '.pt-icon:first-child{margin-left:0;}',
      '.pt-icon:hover{transform:translateY(-3px) scale(1.15);z-index:10;}',
      '.pt-icon img{width:15px;height:15px;object-fit:contain;}',

      /* ── CTA link ── */
      '.pt-cta{',
        'display:inline-flex;align-items:center;gap:6px;',
        'font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;',
        'color:var(--card-color,#00ff99);',
        'text-decoration:none;',
        'padding:7px 15px;',
        'border:1px solid rgba(255,255,255,.15);border-radius:6px;',
        'background:rgba(255,255,255,.04);',
        'transition:all .2s;pointer-events:all;position:relative;z-index:10;',
      '}',
      '.pt-cta:hover{',
        'background:var(--card-color,#00ff99);color:#000;',
        'box-shadow:0 0 20px var(--card-color,#00ff99);',
        'transform:translateY(-1px);',
      '}',

      /* ── Edge glow ── */
      '.pt-glow{',
        'position:absolute;inset:-1px;border-radius:21px;',
        'border:1px solid var(--card-color,#00ff99);',
        'opacity:0;pointer-events:none;',
        'box-shadow:0 0 25px var(--card-color,#00ff99),inset 0 0 14px rgba(255,255,255,.02);',
        'transition:opacity .35s ease;',
      '}',

      /* ── HUD ── */
      '#pt-hud{',
        'position:absolute;top:24px;left:50%;transform:translateX(-50%);',
        'text-align:center;pointer-events:none;z-index:200;',
      '}',
      '.pt-hud-label{',
        'font-size:.64rem;font-weight:800;letter-spacing:.38em;text-transform:uppercase;',
        'color:rgba(255,255,255,.45);font-family:monospace;',
        'display:flex;align-items:center;justify-content:center;gap:6px;',
      '}',
      '.pt-hud-hint{',
        'font-size:.52rem;letter-spacing:.18em;color:rgba(255,255,255,.18);',
        'margin-top:5px;font-family:monospace;text-transform:uppercase;',
      '}',

      /* ── Exit button ── */
      '#pt-close{',
        'position:absolute;top:20px;right:20px;z-index:300;',
        'display:flex;align-items:center;gap:6px;',
        'background:rgba(5,5,9,.75);',
        'border:1px solid rgba(255,255,255,.12);',
        'border-radius:8px;',
        'color:rgba(255,255,255,.45);',
        'font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;',
        'padding:8px 14px;cursor:pointer;',
        'backdrop-filter:blur(12px);',
        'transition:all .2s;font-family:monospace;',
      '}',
      '#pt-close:hover{',
        'background:rgba(14,14,22,.94);',
        'border-color:rgba(255,255,255,.28);',
        'color:rgba(255,255,255,.9);',
        'box-shadow:0 4px 20px rgba(0,0,0,.7);',
      '}',

      /* ── THEATER MARQUEE BUTTON (Monochromatic Black & White Shade) ── */
      '.theater-marquee-btn{',
        'position:relative;',
        'display:inline-flex;align-items:center;gap:13px;',
        'padding:11px 24px 11px 18px;',
        'border-radius:12px;',
        'background:linear-gradient(135deg,rgba(16,16,20,.95) 0%,rgba(6,6,9,.98) 100%);',
        'border:1px solid rgba(255,255,255,.18);',
        'color:#ffffff;cursor:pointer;text-decoration:none;',
        'box-shadow:0 8px 32px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.05),inset 0 1px 0 rgba(255,255,255,.15);',
        'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);',
        'transition:all .3s cubic-bezier(.16,1,.3,1);',
        'overflow:hidden;',
      '}',
      '.theater-marquee-btn:hover{',
        'border-color:rgba(255,255,255,.55);',
        'background:linear-gradient(135deg,rgba(22,22,28,.98) 0%,rgba(10,10,14,.99) 100%);',
        'box-shadow:0 12px 40px rgba(0,0,0,.95),0 0 30px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.3);',
        'transform:translateY(-2px) scale(1.02);',
      '}',
      '.marquee-glow-effect{',
        'position:absolute;inset:-50%;',
        'background:radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 65%);',
        'opacity:0;transition:opacity .4s ease;',
        'pointer-events:none;',
      '}',
      '.theater-marquee-btn:hover .marquee-glow-effect{opacity:1;}',
      '.marquee-icon{',
        'display:flex;align-items:center;justify-content:center;',
        'width:34px;height:34px;border-radius:8px;',
        'background:rgba(255,255,255,.08);',
        'border:1px solid rgba(255,255,255,.22);',
        'color:#ffffff;',
        'transition:transform .3s ease,background .3s,border-color .3s;',
      '}',
      '.theater-marquee-btn:hover .marquee-icon{',
        'transform:rotate(10deg) scale(1.08);',
        'background:rgba(255,255,255,.16);',
        'border-color:rgba(255,255,255,.5);',
        'box-shadow:0 0 15px rgba(255,255,255,.3);',
      '}',
      '.marquee-text-group{display:flex;flex-direction:column;align-items:flex-start;}',
      '.marquee-main-title{',
        'font-family:monospace;font-size:.80rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;',
        'color:#ffffff;line-height:1.2;text-shadow:0 0 10px rgba(255,255,255,.25);',
      '}',
      '.marquee-sub-badge{',
        'font-family:monospace;font-size:.52rem;font-weight:700;letter-spacing:.24em;',
        'color:rgba(255,255,255,.62);text-transform:uppercase;',
        'margin-top:2px;',
      '}',
      '.theater-marquee-btn:hover .marquee-sub-badge{',
        'color:rgba(255,255,255,.9);',
      '}',
      '.marquee-arrow{',
        'font-size:.92rem;color:rgba(255,255,255,.45);margin-left:4px;',
        'transition:transform .3s ease,color .3s;',
      '}',
      '.theater-marquee-btn:hover .marquee-arrow{',
        'transform:translateX(4px);color:#ffffff;text-shadow:0 0 8px rgba(255,255,255,.6);',
      '}',
      '.sidebar-theater-btn{',
        'width:100%;justify-content:center;',
        'border-radius:6px;padding:8px 12px;font-size:.57rem;margin-top:8px;',
        'background:rgba(8,8,12,.7);border:1px solid rgba(255,255,255,.15);',
        'color:rgba(255,255,255,.65);font-family:monospace;cursor:pointer;',
      '}',

      /* ── Mobile ── */
      '@media(max-width:600px){',
        '.pt-card{width:300px;top:-210px;left:-150px;}',
        '.pt-img-area{height:150px;}',
        '#pt-close span{display:none;}',
        '.pt-hud-hint{display:none;}',
      '}',

    ].join('');
    document.head.appendChild(s);
  }

  /* Automatically inject CSS on load so the marquee button styles render immediately */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCSS);
  } else {
    injectCSS();
  }

  /* ─────────────────────────────────────────────────────────────
   * PUBLIC API
   * ───────────────────────────────────────────────────────────── */
  window.openProjectTheater  = openTheater;
  window.closeProjectTheater = closeTheater;

})();