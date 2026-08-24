/**
 * COLLEGE CINEMA - 3D Photo Globe / Sphere
 *
 * All memories from saves-for-portfolio are distributed across the
 * surface of a 3D sphere. The user orbits the globe freely in any direction
 * (left/right, up/down, diagonal) with smooth inertia, damping, and zoom.
 *
 * Controls:
 *   DRAG   -> Orbit the photo globe in 3D (horizontal, vertical, diagonal)
 *   SCROLL -> Zoom in / out
 *   HOVER  -> Photo pops forward from globe surface with neon glow
 *   CLICK  -> Open high-definition spotlight lightbox
 *   ESC    -> Exit
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
   * MEMORY ITEMS (All photos under saves-for-portfolio)
   * ───────────────────────────────────────────────────────────── */
  var MEMORIES = [
    { src: './images/saves-for-portfolio/me/ME.jpg', title: 'Self Portrait', tag: 'PROFILE', color: '#00ff99' },
    { src: './images/saves-for-portfolio/frnds/College-gng.jpg', title: 'College Gang', tag: 'FRIENDS', color: '#38bdf8' },
    { src: './images/saves-for-portfolio/frnds/4-B.jpg', title: 'Class 4-B Crew', tag: 'CAMPUS', color: '#818cf8' },
    { src: './images/saves-for-portfolio/hackathon/Global hCKATHON.jpg', title: 'Global Hackathon', tag: 'HACKATHON', color: '#f59e0b' },
    { src: './images/saves-for-portfolio/hackathon/Aikyam.jpg', title: 'Project Aikyam', tag: 'HACKATHON', color: '#ec4899' },
    { src: './images/saves-for-portfolio/hackathon/phantom code.jpeg', title: 'Phantom Code Challenge', tag: 'HACKATHON', color: '#a855f7' },
    { src: './images/saves-for-portfolio/hackathon/all-hackathons.jpeg', title: 'Hackathon Odyssey', tag: 'HACKATHON', color: '#06b6d4' },
    { src: './images/saves-for-portfolio/hackathon/all-certi.jpeg', title: 'Hackathon Laurels', tag: 'AWARDS', color: '#10b981' },
    { src: './images/saves-for-portfolio/robofiesta/robo-sumo.JPG', title: 'Robo Sumo Fight', tag: 'ROBOTICS', color: '#ef4444' },
    { src: './images/saves-for-portfolio/intern-pics/cad intern.png', title: 'CAD Robotics Modeling', tag: 'ENGINEERING', color: '#f97316' },
    { src: './images/saves-for-portfolio/intern-pics/erp-live-demo.png', title: 'ERP Live Deployment', tag: 'SOFTWARE', color: '#3b82f6' },
    { src: './images/saves-for-portfolio/intern-pics/hitechpolymachine.jpg', title: 'Industrial Machinery', tag: 'INDUSTRY', color: '#14b8a6' },
    { src: './images/saves-for-portfolio/intern-pics/woodindustrymachinebuttons.jpg', title: 'Machine Control Panel', tag: 'HARDWARE', color: '#8b5cf6' },
    { src: './images/saves-for-portfolio/marathon/Marathon.jpg', title: 'Bengaluru Marathon', tag: 'MARATHON', color: '#22c55e' },
    { src: './images/saves-for-portfolio/marathon/marathonwithtata.jpg', title: 'Tata Marathon Run', tag: 'MARATHON', color: '#eab308' },
    { src: './images/saves-for-portfolio/marathon/Marathon 2.jpg', title: 'Endurance 10K', tag: 'MARATHON', color: '#06b6d4' },
    { src: './images/saves-for-portfolio/marathon/Marathon 3.jpg', title: 'Finish Line Sprint', tag: 'MARATHON', color: '#ec4899' },
    { src: './images/saves-for-portfolio/rajyotsava/Kannada Rajyotsava.jpg', title: 'Kannada Rajyotsava', tag: 'CULTURE', color: '#f59e0b' },
    { src: './images/saves-for-portfolio/rajyotsava/Id taking.jpg', title: 'Campus Organizing Team', tag: 'LEADERSHIP', color: '#a855f7' },
    { src: './images/saves-for-portfolio/rajyotsava/rajyotsava card.jpeg', title: 'Rajyotsava Branding', tag: 'DESIGN', color: '#ef4444' },
    { src: './images/saves-for-portfolio/spc/SPCS.jpg', title: 'Placement Coordination', tag: 'PLACEMENT', color: '#38bdf8' },
    { src: './images/saves-for-portfolio/NSS/wateringplants.jpg', title: 'NSS Eco Plantation', tag: 'COMMUNITY', color: '#10b981' },
    { src: './images/saves-for-portfolio/NSS/watering.jpg', title: 'Campus Green Initiative', tag: 'NSS', color: '#84cc16' },
    { src: './images/saves-for-portfolio/travel/sagaruhillstop.jpg', title: 'Sagaru Hilltop Sunrise', tag: 'TRAVEL', color: '#0ea5e9' },
    { src: './images/saves-for-portfolio/travel/travelalot.jpg', title: 'Mountain Escapade', tag: 'TRAVEL', color: '#8b5cf6' },
    { src: './images/saves-for-portfolio/travel/Travelling.jpg', title: 'Highway Wanderlust', tag: 'TRAVEL', color: '#f97316' },
    { src: './images/saves-for-portfolio/travel/dog-pic.jpg', title: 'Trailside Companion', tag: 'TRAVEL', color: '#f43f5e' },
    { src: './images/saves-for-portfolio/games/Screenshot (10).png', title: 'Virtual Worlds Gameplay', tag: 'GAMING', color: '#6366f1' },
    { src: './images/saves-for-portfolio/games/Screenshot (21).png', title: 'Immersion Capture', tag: 'GAMING', color: '#d946ef' },
    { src: './images/saves-for-portfolio/games/Screenshot (169).png', title: 'Atmospheric Quest', tag: 'GAMING', color: '#14b8a6' },
    { src: './images/saves-for-portfolio/games/2024-07-15_22.46.35.png', title: 'Sandbox Universe', tag: 'GAMING', color: '#eab308' },
    { src: './images/saves-for-portfolio/rc.jpg', title: 'RC Rover & Hardware', tag: 'PROJECTS', color: '#ec4899' },
    { src: './images/saves-for-portfolio/cutemonkey.jpg', title: 'Wildlife Sanctuary', tag: 'NATURE', color: '#10b981' }
  ];

  /* ─────────────────────────────────────────────────────────────
   * SPHERE CONFIGURATION
   * ───────────────────────────────────────────────────────────── */
  var SPHERE_RADIUS = 540; /* Radius of the 3D photo globe */
  var GOLDEN_ANGLE  = 137.50776405003785; /* Degrees */

  /* ─────────────────────────────────────────────────────────────
   * STATE
   * ───────────────────────────────────────────────────────────── */
  var overlay    = null;
  var pivotEl    = null;
  var cardEls    = [];
  var animFrame  = null;
  var cinemaOpen = false;

  /* Globe Rotation Angles & Inertia */
  var rotX       = 12;   /* Initial tilt */
  var rotY       = 0;    /* Initial spin */
  var targetRotX = 12;
  var targetRotY = 0;
  var velX       = 0;
  var velY       = 0;

  /* Zoom State */
  var zoomZ       = 0;
  var targetZoomZ = 0;

  /* Pointer / Drag State */
  var isDragging = false;
  var lastPointerX = 0;
  var lastPointerY = 0;
  var lastDragTime = 0;

  /* Per-card animation / hover states */
  var cardStates = MEMORIES.map(function () {
    return {
      hovered: false,
      hoverT: 0,
      breathT: Math.random() * Math.PI * 2
    };
  });

  /* ─────────────────────────────────────────────────────────────
   * CALCULATE FIBONACCI SPHERE POINTS
   * ───────────────────────────────────────────────────────────── */
  var SPHERE_POINTS = [];
  var N = MEMORIES.length;

  for (var i = 0; i < N; i++) {
    /* Latitude ratio from +0.92 (top pole) down to -0.92 (bottom pole) */
    var yUnit = 1 - (i / (N - 1)) * 2;
    yUnit *= 0.90; /* Scale to keep polar cards nicely spread */
    
    var rSlice = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
    var thetaDeg = (i * GOLDEN_ANGLE) % 360;
    var thetaRad = (thetaDeg * Math.PI) / 180;

    var x = rSlice * Math.cos(thetaRad) * SPHERE_RADIUS;
    var y = -yUnit * SPHERE_RADIUS; /* Negative Y is UP in screen coordinates */
    var z = rSlice * Math.sin(thetaRad) * SPHERE_RADIUS;

    /* Outward normal angles (so cards lie tangent to sphere and face outward) */
    var lonDeg = (thetaDeg * -1) + 90;
    var latDeg = Math.asin(yUnit) * (180 / Math.PI);

    SPHERE_POINTS.push({
      x: x,
      y: y,
      z: z,
      lonDeg: lonDeg,
      latDeg: latDeg,
      uX: x / SPHERE_RADIUS,
      uY: y / SPHERE_RADIUS,
      uZ: z / SPHERE_RADIUS
    });
  }

  /* ─────────────────────────────────────────────────────────────
   * OPEN / CLOSE
   * ───────────────────────────────────────────────────────────── */
  function openCollegeCinema() {
    if (cinemaOpen) return;
    cinemaOpen = true;
    injectCSS();

    overlay = document.createElement('div');
    overlay.id = 'cc-overlay';
    overlay.innerHTML = buildShell();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    pivotEl = overlay.querySelector('#cc-globe-pivot');
    cardEls = [];

    /* Build Photo Cards on the Sphere */
    MEMORIES.forEach(function (m, idx) {
      var pt = SPHERE_POINTS[idx];
      var el = document.createElement('div');
      el.className = 'cc-card';
      el.setAttribute('data-idx', idx);
      el.style.setProperty('--cc-color', m.color);

      el.innerHTML =
        '<div class="cc-card-inner">' +
          '<div class="cc-img-wrap">' +
            '<img src="' + m.src + '" alt="' + m.title + '" loading="lazy" class="cc-img"/>' +
            '<div class="cc-img-overlay"></div>' +
          '</div>' +
          '<div class="cc-card-info">' +
            '<span class="cc-tag">' + m.tag + '</span>' +
            '<h4 class="cc-title">' + m.title + '</h4>' +
          '</div>' +
          '<div class="cc-glow"></div>' +
        '</div>';

      pivotEl.appendChild(el);
      cardEls.push(el);

      el.addEventListener('mouseenter', function () { cardStates[idx].hovered = true; });
      el.addEventListener('mouseleave', function () { cardStates[idx].hovered = false; });
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        openSpotlight(m);
      });
    });

    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
    });

    /* Reset Globe Rotation & Zoom */
    rotX = 12; rotY = 0;
    targetRotX = 12; targetRotY = 0;
    velX = 0; velY = 0;
    zoomZ = 0; targetZoomZ = 0;
    isDragging = false;

    /* Event Listeners */
    overlay.addEventListener('mousedown',  onMouseDown);
    overlay.addEventListener('mousemove',  onMouseMove);
    overlay.addEventListener('mouseup',    onMouseUp);
    overlay.addEventListener('mouseleave', onMouseLeave);
    overlay.addEventListener('wheel',      onWheel, { passive: false });
    overlay.addEventListener('touchstart', onTouchStart, { passive: false });
    overlay.addEventListener('touchmove',  onTouchMove,  { passive: false });
    overlay.addEventListener('touchend',   onTouchEnd);
    document.addEventListener('keydown',   onKeyDown);
    overlay.querySelector('#cc-close').addEventListener('click', closeCollegeCinema);

    tick();
  }

  function closeCollegeCinema() {
    if (!cinemaOpen) return;
    cinemaOpen = false;
    cancelAnimationFrame(animFrame);
    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = '';
    if (overlay) {
      overlay.style.opacity = '0';
      var o = overlay;
      setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 450);
      overlay = null; pivotEl = null; cardEls = [];
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * SPOTLIGHT MODAL LIGHTBOX
   * ───────────────────────────────────────────────────────────── */
  function openSpotlight(m) {
    var modal = document.createElement('div');
    modal.className = 'cc-spotlight-modal';
    modal.innerHTML =
      '<div class="cc-spotlight-backdrop"></div>' +
      '<div class="cc-spotlight-content">' +
        '<button class="cc-spotlight-close" aria-label="Close Preview">&times;</button>' +
        '<div class="cc-spotlight-img-box">' +
          '<img src="' + m.src + '" alt="' + m.title + '"/>' +
        '</div>' +
        '<div class="cc-spotlight-meta">' +
          '<span class="cc-spotlight-tag" style="color:' + m.color + ';border-color:' + m.color + '44;background:' + m.color + '15">' + m.tag + '</span>' +
          '<h3 class="cc-spotlight-title">' + m.title + '</h3>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('active'); });

    function close() {
      modal.classList.remove('active');
      setTimeout(function () { if (modal.parentNode) modal.parentNode.removeChild(modal); }, 350);
    }
    modal.querySelector('.cc-spotlight-close').addEventListener('click', close);
    modal.querySelector('.cc-spotlight-backdrop').addEventListener('click', close);
  }

  /* ─────────────────────────────────────────────────────────────
   * SHELL HTML
   * ───────────────────────────────────────────────────────────── */
  function buildShell() {
    return (
      '<div id="cc-scene">' +
        '<div id="cc-globe-pivot"></div>' +
        '<div id="cc-hud">' +
          '<div class="cc-hud-label">&#9672;&nbsp; COLLEGE CINEMA &bull; 3D PHOTO GLOBE &nbsp;&#9672;</div>' +
          '<div class="cc-hud-hint">Drag in any direction to orbit globe &nbsp;&middot;&nbsp; Scroll to zoom &nbsp;&middot;&nbsp; Click to inspect &nbsp;&middot;&nbsp; ESC to exit</div>' +
        '</div>' +
        '<button id="cc-close" aria-label="Exit College Cinema">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>' +
          '</svg>' +
          '<span>EXIT</span>' +
        '</button>' +
      '</div>'
    );
  }

  /* ─────────────────────────────────────────────────────────────
   * ANIMATION LOOP (3D Globe Rotation with Inertia & Damping)
   * ───────────────────────────────────────────────────────────── */
  function tick() {
    if (!cinemaOpen) return;

    /* Apply inertia velocity */
    if (!isDragging) {
      targetRotY += velY;
      targetRotX += velX;
      velX *= 0.91;
      velY *= 0.91;

      /* Subtle automatic ambient orbit when idle */
      targetRotY += 0.04;
    }

    /* Prevent sphere from flipping upside down */
    targetRotX = Math.max(-85, Math.min(85, targetRotX));

    /* Smooth Lerp damping */
    var L = 0.09;
    rotX  += (targetRotX  - rotX)  * L;
    rotY  += (targetRotY  - rotY)  * L;
    zoomZ += (targetZoomZ - zoomZ) * L;

    /* Transform the Central Globe Pivot */
    if (pivotEl) {
      pivotEl.style.transform =
        'translateZ(' + zoomZ.toFixed(2) + 'px)' +
        ' rotateX(' + rotX.toFixed(3) + 'deg)' +
        ' rotateY(' + rotY.toFixed(3) + 'deg)';
    }

    /* Update each Card's position and hover state on the globe */
    cardEls.forEach(function (el, idx) {
      var pt = SPHERE_POINTS[idx];
      var cs = cardStates[idx];

      /* Smooth hover transition */
      var hTarget = cs.hovered ? 1 : 0;
      cs.hoverT += (hTarget - cs.hoverT) * 0.14;

      cs.breathT += 0.012;
      var breath = Math.sin(cs.breathT) * 2;

      /* When hovered, card pops radially outward from the sphere surface */
      var popDist = cs.hoverT * 70;
      var curX = pt.x + pt.uX * (popDist + breath);
      var curY = pt.y + pt.uY * (popDist + breath);
      var curZ = pt.z + pt.uZ * (popDist + breath);

      var scale = 1 + cs.hoverT * 0.18;

      /* Place card at spherical coordinates and orient tangent to sphere surface */
      el.style.transform =
        'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,' + curZ.toFixed(2) + 'px)' +
        ' rotateY(' + pt.lonDeg.toFixed(2) + 'deg)' +
        ' rotateX(' + pt.latDeg.toFixed(2) + 'deg)' +
        ' scale(' + scale.toFixed(3) + ')';

      var glow = el.querySelector('.cc-glow');
      if (glow) glow.style.opacity = (cs.hoverT * 0.95).toFixed(3);
    });

    animFrame = requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────────────────────
   * POINTER / DRAG EVENTS (3D Globe Orbit in Any Direction)
   * ───────────────────────────────────────────────────────────── */
  function onMouseDown(e) {
    if (e.target.closest && (
      e.target.closest('#cc-close') ||
      e.target.closest('.cc-spotlight-modal')
    )) return;

    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastDragTime = performance.now();
    velX = 0;
    velY = 0;
    if (overlay) overlay.style.cursor = 'grabbing';
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    var now = performance.now();
    var dt = Math.max(1, now - lastDragTime);
    lastDragTime = now;

    var dx = e.clientX - lastPointerX;
    var dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    /* Horizontal drag rotates Y axis, vertical drag rotates X axis */
    var dragSpeed = 0.28;
    targetRotY += dx * dragSpeed;
    targetRotX -= dy * dragSpeed;

    /* Calculate instantaneous velocity for smooth release inertia */
    velY = (dx * dragSpeed) * 0.5;
    velX = (-dy * dragSpeed) * 0.5;
  }

  function onMouseUp() {
    isDragging = false;
    if (overlay) overlay.style.cursor = 'grab';
  }

  function onMouseLeave() {
    isDragging = false;
    if (overlay) overlay.style.cursor = 'grab';
  }

  /* Zoom with Mouse Wheel */
  function onWheel(e) {
    e.preventDefault();
    var delta = e.deltaMode === 1 ? e.deltaY * 25 : e.deltaY * 0.8;
    targetZoomZ -= delta * 0.9;
    /* Clamp Zoom Range */
    targetZoomZ = Math.max(-450, Math.min(320, targetZoomZ));
  }

  /* Touch Events */
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;
      velX = 0; velY = 0;
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - lastPointerX;
    var dy = e.touches[0].clientY - lastPointerY;
    lastPointerX = e.touches[0].clientX;
    lastPointerY = e.touches[0].clientY;

    var dragSpeed = 0.32;
    targetRotY += dx * dragSpeed;
    targetRotX -= dy * dragSpeed;
    velY = (dx * dragSpeed) * 0.5;
    velX = (-dy * dragSpeed) * 0.5;
  }

  function onTouchEnd() {
    isDragging = false;
  }

  function onKeyDown(e) {
    if (!cinemaOpen) return;
    if (e.key === 'Escape') {
      var spot = document.querySelector('.cc-spotlight-modal.active');
      if (spot) {
        spot.classList.remove('active');
        setTimeout(function () { if (spot.parentNode) spot.parentNode.removeChild(spot); }, 350);
        return;
      }
      closeCollegeCinema();
      return;
    }
    if (e.key === 'ArrowLeft'  || e.key === 'a') targetRotY -= 8;
    if (e.key === 'ArrowRight' || e.key === 'd') targetRotY += 8;
    if (e.key === 'ArrowUp'    || e.key === 'w') targetRotX -= 6;
    if (e.key === 'ArrowDown'  || e.key === 's') targetRotX += 6;
    if (e.key === '+'          || e.key === '=') targetZoomZ = Math.min(320, targetZoomZ + 60);
    if (e.key === '-'          || e.key === '_') targetZoomZ = Math.max(-450, targetZoomZ - 60);
  }

  /* ─────────────────────────────────────────────────────────────
   * INJECT STYLES
   * ───────────────────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('cc-styles')) return;
    var s = document.createElement('style');
    s.id  = 'cc-styles';
    s.textContent = [

      /* ── Fullscreen Overlay ── */
      '#cc-overlay{',
        'position:fixed;inset:0;z-index:99999;',
        'background:#000000;',
        'opacity:0;transition:opacity .5s ease;',
        'overflow:hidden;cursor:grab;user-select:none;',
      '}',

      /* ── Perspective Scene Container ── */
      '#cc-scene{',
        'width:100%;height:100%;position:relative;',
        'perspective:1100px;perspective-origin:50% 50%;',
      '}',

      /* ── Central 3D Globe Pivot (Rotates around X and Y) ── */
      '#cc-globe-pivot{',
        'position:absolute;width:0;height:0;',
        'top:50%;left:50%;transform-style:preserve-3d;',
        'will-change:transform;',
      '}',

      /* ── Spherical Photo Card ── */
      '.cc-card{',
        'position:absolute;width:170px;',
        'top:-105px;left:-85px;',
        'transform-style:preserve-3d;',
        'pointer-events:all;cursor:pointer;',
        'will-change:transform,opacity,filter;',
        'backface-visibility:visible;',
      '}',

      '.cc-card-inner{',
        'position:relative;width:100%;border-radius:12px;',
        'background:rgba(8,8,14,.95);border:1px solid rgba(255,255,255,.14);',
        'overflow:hidden;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
        'box-shadow:0 8px 25px rgba(0,0,0,.85), 0 0 15px rgba(0,0,0,.7);',
        'transition:border-color .25s,box-shadow .25s,transform .25s;',
      '}',
      '.cc-card:hover .cc-card-inner{',
        'border-color:rgba(255,255,255,.6);',
        'box-shadow:0 16px 50px rgba(0,0,0,.95), 0 0 25px var(--cc-color,#00ff99);',
      '}',

      '.cc-img-wrap{',
        'position:relative;width:100%;height:115px;overflow:hidden;',
        'background:#0a0a12;',
      '}',
      '.cc-img{',
        'width:100%;height:100%;object-fit:cover;object-position:center;',
        'transition:transform .4s ease;',
      '}',
      '.cc-card:hover .cc-img{transform:scale(1.08);}',
      '.cc-img-overlay{',
        'position:absolute;inset:0;',
        'background:linear-gradient(180deg,transparent 40%,rgba(8,8,14,.95) 100%);',
      '}',

      '.cc-card-info{padding:8px 12px 11px;}',
      '.cc-tag{',
        'font-family:monospace;font-size:.48rem;font-weight:800;letter-spacing:.2em;',
        'text-transform:uppercase;color:var(--cc-color,#00ff99);',
        'display:inline-block;margin-bottom:3px;',
      '}',
      '.cc-title{',
        'font-family:sans-serif;font-size:.72rem;font-weight:700;',
        'color:#ffffff;line-height:1.2;margin:0;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
      '}',

      '.cc-glow{',
        'position:absolute;inset:-1px;border-radius:13px;',
        'border:1px solid var(--cc-color,#00ff99);',
        'opacity:0;pointer-events:none;',
        'box-shadow:0 0 20px var(--cc-color,#00ff99),inset 0 0 10px rgba(255,255,255,.05);',
        'transition:opacity .3s ease;',
      '}',

      /* ── HUD ── */
      '#cc-hud{',
        'position:absolute;top:22px;left:50%;transform:translateX(-50%);',
        'text-align:center;pointer-events:none;z-index:200;',
      '}',
      '.cc-hud-label{',
        'font-size:.62rem;font-weight:800;letter-spacing:.35em;text-transform:uppercase;',
        'color:rgba(255,255,255,.45);font-family:monospace;',
      '}',
      '.cc-hud-hint{',
        'font-size:.50rem;letter-spacing:.18em;color:rgba(255,255,255,.2);',
        'margin-top:4px;font-family:monospace;text-transform:uppercase;',
      '}',

      /* ── Exit Button ── */
      '#cc-close{',
        'position:absolute;top:20px;right:20px;z-index:300;',
        'display:flex;align-items:center;gap:6px;',
        'background:rgba(6,6,10,.75);border:1px solid rgba(255,255,255,.14);',
        'border-radius:8px;color:rgba(255,255,255,.55);',
        'font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;',
        'padding:8px 14px;cursor:pointer;backdrop-filter:blur(12px);',
        'transition:all .2s;font-family:monospace;',
      '}',
      '#cc-close:hover{',
        'background:rgba(16,16,24,.95);border-color:rgba(255,255,255,.35);',
        'color:#ffffff;box-shadow:0 4px 20px rgba(0,0,0,.8);',
      '}',

      /* ── Spotlight Lightbox Modal ── */
      '.cc-spotlight-modal{',
        'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;',
        'opacity:0;visibility:hidden;transition:all .35s cubic-bezier(.16,1,.3,1);',
      '}',
      '.cc-spotlight-modal.active{opacity:1;visibility:visible;}',
      '.cc-spotlight-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(20px);}',
      '.cc-spotlight-content{',
        'position:relative;z-index:10;max-width:min(90vw,760px);max-height:88vh;',
        'background:rgba(10,10,16,.96);border:1px solid rgba(255,255,255,.2);',
        'border-radius:18px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,.95);',
        'display:flex;flex-direction:column;transform:scale(.92);transition:transform .35s cubic-bezier(.16,1,.3,1);',
      '}',
      '.cc-spotlight-modal.active .cc-spotlight-content{transform:scale(1);}',
      '.cc-spotlight-close{',
        'position:absolute;top:14px;right:16px;z-index:20;',
        'width:32px;height:32px;border-radius:50%;',
        'background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);',
        'color:#fff;font-size:1.2rem;line-height:1;display:flex;align-items:center;justify-content:center;',
        'cursor:pointer;transition:all .2s;',
      '}',
      '.cc-spotlight-close:hover{background:#fff;color:#000;}',
      '.cc-spotlight-img-box{width:100%;max-height:65vh;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center;}',
      '.cc-spotlight-img-box img{width:100%;height:100%;max-height:65vh;object-fit:contain;}',
      '.cc-spotlight-meta{padding:18px 22px;background:rgba(8,8,12,.95);border-top:1px solid rgba(255,255,255,.08);}',
      '.cc-spotlight-tag{',
        'font-family:monospace;font-size:.60rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;',
        'padding:3px 8px;border-radius:4px;border:1px solid;',
      '}',
      '.cc-spotlight-title{',
        'font-size:1.15rem;font-weight:700;color:#fff;margin:8px 0 0;',
      '}',

      /* ── COLLEGE CINEMA MARQUEE BUTTON (Personal Page Trigger) ── */
      '.college-cinema-btn{',
        'position:relative;',
        'display:inline-flex;align-items:center;gap:12px;',
        'padding:10px 22px 10px 16px;',
        'border-radius:10px;',
        'background:linear-gradient(135deg,rgba(16,16,22,.95) 0%,rgba(6,6,9,.98) 100%);',
        'border:1px solid rgba(255,255,255,.18);',
        'color:#ffffff;cursor:pointer;text-decoration:none;',
        'box-shadow:0 8px 30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.05),inset 0 1px 0 rgba(255,255,255,.15);',
        'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);',
        'transition:all .3s cubic-bezier(.16,1,.3,1);',
        'overflow:hidden;',
      '}',
      '.college-cinema-btn:hover{',
        'border-color:rgba(255,255,255,.55);',
        'background:linear-gradient(135deg,rgba(24,24,32,.98) 0%,rgba(10,10,14,.99) 100%);',
        'box-shadow:0 12px 40px rgba(0,0,0,.95),0 0 30px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.3);',
        'transform:translateY(-2px) scale(1.02);',
      '}',
      '.cinema-glow-effect{',
        'position:absolute;inset:-50%;',
        'background:radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 65%);',
        'opacity:0;transition:opacity .4s ease;pointer-events:none;',
      '}',
      '.college-cinema-btn:hover .cinema-glow-effect{opacity:1;}',
      '.cinema-icon{',
        'display:flex;align-items:center;justify-content:center;',
        'width:30px;height:30px;border-radius:7px;',
        'background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);',
        'color:#ffffff;transition:transform .3s ease,background .3s,border-color .3s;',
      '}',
      '.college-cinema-btn:hover .cinema-icon{',
        'transform:rotate(12deg) scale(1.08);background:rgba(255,255,255,.16);',
        'border-color:rgba(255,255,255,.5);box-shadow:0 0 15px rgba(255,255,255,.3);',
      '}',
      '.cinema-text-group{display:flex;flex-direction:column;align-items:flex-start;}',
      '.cinema-main-title{',
        'font-family:monospace;font-size:.76rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;',
        'color:#ffffff;line-height:1.2;',
      '}',
      '.cinema-sub-badge{',
        'font-family:monospace;font-size:.50rem;font-weight:700;letter-spacing:.22em;',
        'color:rgba(255,255,255,.62);text-transform:uppercase;margin-top:2px;',
      '}',
      '.college-cinema-btn:hover .cinema-sub-badge{color:rgba(255,255,255,.9);}',
      '.cinema-arrow{',
        'font-size:.88rem;color:rgba(255,255,255,.45);margin-left:2px;',
        'transition:transform .3s ease,color .3s;',
      '}',
      '.college-cinema-btn:hover .cinema-arrow{transform:translateX(4px);color:#ffffff;}',

      /* ── Mobile ── */
      '@media(max-width:600px){',
        '.cc-card{width:130px;top:-80px;left:-65px;}',
        '.cc-img-wrap{height:85px;}',
        '#cc-close span{display:none;}',
        '.cc-hud-hint{display:none;}',
      '}',

    ].join('');
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCSS);
  } else {
    injectCSS();
  }

  window.openCollegeCinema  = openCollegeCinema;
  window.closeCollegeCinema = closeCollegeCinema;

})();
