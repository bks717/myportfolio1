/**
 * Three.js Interactive 3D Intro Loader
 * 
 * Flow:
 * Phase 1: GLSL Chromatic Wave Shader Intro (Liquid Wave Distortion Shader)
 * Phase 2: Fade GLSL Shader -> Fade in 3D Voxel Particle Space
 * Phase 3: Scroll-to-Assemble 3D Voxel Photo (Rounded Mask, No Mouse Warp)
 * Phase 4: Completion Lock -> Drop Impact -> Amber Gold Shockwave Ripple -> Real HD Photo Fade
 * Phase 5: Royal Gold "View Profile →" CTA Button
 */

(function () {
  'use strict';

  // Fast-load check
  if (sessionStorage.getItem('hasLoadedBefore') === 'true') {
    document.documentElement.classList.add('fast-load');
    const existingLoader = document.getElementById('three-loading-screen');
    if (existingLoader) existingLoader.remove();
    // Fire revealed immediately so hero animations & music button still work
    document.dispatchEvent(new CustomEvent('portfolio:revealed'));
    return;
  }

  // Mark session
  sessionStorage.setItem('hasLoadedBefore', 'true');

  // Prevent scrolling during intro
  document.body.style.overflow = 'hidden';

  // ── Auto-trigger background audio at frame 0 ──
  function _tryAudio() {
    var bg = document.getElementById('portfolio-bg-audio');
    if (bg && bg.paused) {
      var p = bg.play();
      if (p && p.catch) p.catch(function() {});
    }
  }
  _tryAudio();

  // ── Fire loader:firstinteract on first real user gesture ──
  var _loaderInteracted = false;
  function _fireFirstInteract() {
    _tryAudio();
    if (_loaderInteracted) return;
    _loaderInteracted = true;
    document.dispatchEvent(new CustomEvent('loader:firstinteract'));
  }
  window.addEventListener('pointerdown', _fireFirstInteract, { once: true, passive: true });
  window.addEventListener('pointermove', _fireFirstInteract, { once: true, passive: true });
  window.addEventListener('wheel', _fireFirstInteract, { once: true, passive: true });
  window.addEventListener('touchstart', _fireFirstInteract, { once: true, passive: true });

  const container = document.getElementById('three-loading-screen');
  const canvas = document.getElementById('three-loader-canvas');
  const tapCue = document.getElementById('tap-instruction-cue');
  const scrollCue = document.getElementById('scroll-instruction-cue');
  const realImageContainer = document.getElementById('real-image-container');
  const rippleWave = document.getElementById('ripple-wave-effect');
  const viewProfileContainer = document.getElementById('view-profile-container');
  const viewProfileBtn = document.getElementById('view-profile-btn');

  if (!container || !canvas) return;

  // ── Tap to Begin Transition (Shader -> Voxel & Audio Play) ──
  function transitionFromShaderToVoxel() {
    if (currentPhase !== 'SHADER_STAGE' || shaderFadingOut) return;
    shaderFadingOut = true;
    currentPhase = 'FADE_SHADER';

    // Start background audio immediately on user tap
    _tryAudio();
    document.dispatchEvent(new CustomEvent('loader:firstinteract'));

    // Fade out tap cue
    if (tapCue) {
      tapCue.classList.remove('visible');
      tapCue.classList.add('hidden');
    }

    // Fade out shader canvas
    canvas.style.opacity = '0';

    setTimeout(() => {
      if (!instancedMesh && loadedImgElement) {
        setupVoxelMesh();
      }
      currentPhase = 'VOXEL_ASSEMBLY';
      canvas.style.opacity = '1';
      if (scrollCue) scrollCue.classList.add('visible');
    }, 550);
  }

  // Bind tap / click handlers on initial loading screen
  container.addEventListener('pointerdown', function() {
    if (currentPhase === 'SHADER_STAGE') {
      transitionFromShaderToVoxel();
    }
  });

  // Settings
  const isMobile = window.innerWidth < 768;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3D Voxel Projection Constants
  const targetCameraZ = 180;
  const instanceSize = 1.0;
  const randRangeZ = 2 * targetCameraZ * 0.99;
  const initCameraZ = targetCameraZ / 5;

  function f(x, y, targetZ) {
    const h = 0.5;
    const d = targetCameraZ;
    const D = -targetZ + d;
    const H = (h / d) * D;
    const s = H / h;
    return { s, p: new THREE.Vector3(x * s, y * s, targetZ) };
  }

  // WebGL Renderer & Scene Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Separate Scenes for Shader Stage & Voxel Stage
  const shaderScene = new THREE.Scene();
  const shaderCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

  const voxelScene = new THREE.Scene();
  const voxelCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
  voxelCamera.position.set(0, 0, initCameraZ);

  // GLSL Shader Code from Reference
  const vertexShaderSource = `
    attribute vec3 position;
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float xScale;
    uniform float yScale;
    uniform float distortion;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      
      float d = length(p) * distortion;
      
      float rx = p.x * (1.0 + d);
      float gx = p.x;
      float bx = p.x * (1.0 - d);

      float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
      float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
      float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  const shaderUniforms = {
    resolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
    time: { value: 0.0 },
    xScale: { value: 1.0 },
    yScale: { value: 0.5 },
    distortion: { value: 0.050 }
  };

  // Build Fullscreen Quad Mesh for GLSL Chromatic Wave
  const planePositions = new Float32Array([
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0
  ]);

  const shaderGeometry = new THREE.BufferGeometry();
  shaderGeometry.setAttribute('position', new THREE.BufferAttribute(planePositions, 3));

  const shaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    uniforms: shaderUniforms,
    side: THREE.DoubleSide
  });

  const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
  shaderScene.add(shaderMesh);

  // State Variables
  // PHASES: SHADER_STAGE -> FADE_SHADER -> VOXEL_ASSEMBLY -> COMPLETED
  let currentPhase = 'SHADER_STAGE';
  let instancedMesh = null;
  let particleData = [];
  let voxelCount = 0;
  let animationFrameId = null;
  let imageLoaded = false;
  let loadedImgElement = null;
  let shaderStartTime = null; // set on first render frame for accurate timing
  let shaderFadingOut = false;

  // Scroll Progress Assembly State
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  let isFullyAssembled = false;

  // Preload ME.jpg
  const imgUrls = [
    './images/saves-for-portfolio/me/ME.jpg',
    '/images/saves-for-portfolio/me/ME.jpg',
    'images/saves-for-portfolio/me/ME.jpg'
  ];

  function tryLoadImage(index) {
    if (index >= imgUrls.length) return;

    const testImg = new Image();
    testImg.onload = () => {
      imageLoaded = true;
      loadedImgElement = testImg;
      if (!instancedMesh) setupVoxelMesh();
    };
    testImg.onerror = () => tryLoadImage(index + 1);
    testImg.src = imgUrls[index];

    if (testImg.complete && testImg.naturalWidth > 0) {
      imageLoaded = true;
      loadedImgElement = testImg;
      if (!instancedMesh) setupVoxelMesh();
    }
  }

  tryLoadImage(0);

  // Canvas Rounded Corner Masking
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function setupVoxelMesh() {
    if (!loadedImgElement || instancedMesh) return;

    const imgWidth = loadedImgElement.naturalWidth || loadedImgElement.width || 634;
    const imgHeight = loadedImgElement.naturalHeight || loadedImgElement.height || 951;
    const imgRatio = imgWidth / imgHeight;

    const nRow = isMobile ? 130 : 230;
    const nCol = Math.round(nRow * imgRatio);
    const sz = instanceSize;

    const can = document.createElement('canvas');
    can.height = nRow;
    can.width = nCol;
    const ctx = can.getContext('2d');

    const cornerRadius = Math.round(nRow * 0.08); // 8% rounded corners
    drawRoundedRect(ctx, 0, 0, nCol, nRow, cornerRadius);
    ctx.clip();
    ctx.drawImage(loadedImgElement, 0, 0, imgWidth, imgHeight, 0, 0, nCol, nRow);

    let data;
    try {
      data = ctx.getImageData(0, 0, nCol, nRow).data;
    } catch (e) {
      data = new Uint8ClampedArray(nCol * nRow * 4);
    }

    const validParticles = [];
    for (let i = 0; i < nRow; ++i) {
      for (let j = 0; j < nCol; ++j) {
        const dataIdx = (i * nCol + j) * 4;
        const alpha = data[dataIdx + 3];

        if (alpha > 20) {
          const targetX = (j - nCol / 2 + 0.5) * sz;
          const targetY = (nRow / 2 - i + 0.5) * sz;
          const randZ = THREE.MathUtils.randFloatSpread(randRangeZ) * sz;

          const r = data[dataIdx] / 255;
          const g = data[dataIdx + 1] / 255;
          const b = data[dataIdx + 2] / 255;

          validParticles.push({
            targetX,
            targetY,
            randZ,
            color: new THREE.Color(r, g, b)
          });
        }
      }
    }

    voxelCount = validParticles.length;
    particleData = validParticles;

    const geom = new THREE.BoxGeometry(sz, sz, sz).translate(0, 0, -0.5 * sz);
    const mat = new THREE.MeshBasicMaterial();
    instancedMesh = new THREE.InstancedMesh(geom, mat, voxelCount);

    for (let i = 0; i < voxelCount; i++) {
      const pData = particleData[i];
      const { p, s } = f(pData.targetX, pData.targetY, pData.randZ);

      const matrix = new THREE.Matrix4()
        .identity()
        .setPosition(p)
        .multiply(new THREE.Matrix4().makeScale(s, s, s));

      instancedMesh.setMatrixAt(i, matrix);
      instancedMesh.setColorAt(i, pData.color);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    voxelScene.add(instancedMesh);
  }

  // Scroll Input Handling
  function handleScrollInput(delta) {
    if (currentPhase !== 'VOXEL_ASSEMBLY' || isFullyAssembled) return;

    targetScrollProgress += delta * 0.0018;
    targetScrollProgress = Math.max(0, Math.min(1, targetScrollProgress));

    if (targetScrollProgress >= 0.995) {
      targetScrollProgress = 1;
      scrollProgress = 1;
      isFullyAssembled = true;
      triggerCompletionDropAndRipple();
    }
  }

  window.addEventListener('wheel', (e) => {
    if (currentPhase === 'SHADER_STAGE') {
      transitionFromShaderToVoxel();
    } else {
      handleScrollInput(e.deltaY);
    }
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;
      handleScrollInput(deltaY * 3);
    }
  }, { passive: true });

  // Completion Drop Impact, Ripple & HD Real Photo Fade
  function triggerCompletionDropAndRipple() {
    currentPhase = 'COMPLETED';

    if (scrollCue) scrollCue.classList.add('hidden');

    if (realImageContainer) {
      realImageContainer.classList.add('visible', 'drop-impact');
    }

    setTimeout(() => {
      if (rippleWave) rippleWave.classList.add('expand');
    }, 150);

    setTimeout(() => {
      canvas.style.opacity = '0';
    }, 400);

    setTimeout(() => {
      if (viewProfileContainer) {
        viewProfileContainer.classList.add('active');
      }
    }, 800);
  }

  const dummyMatrix = new THREE.Matrix4();
  const dummyScaleMatrix = new THREE.Matrix4();

  // Animation Loop
  function render(timestamp) {
    animationFrameId = requestAnimationFrame(render);

    if (currentPhase === 'SHADER_STAGE') {
      // Set start time on first frame
      if (!shaderStartTime) {
        shaderStartTime = timestamp;
        canvas.style.opacity = '1'; // Fade canvas in
        if (tapCue) {
          setTimeout(() => {
            if (currentPhase === 'SHADER_STAGE' && !shaderFadingOut) {
              tapCue.classList.add('visible');
            }
          }, 350);
        }
      }

      // Animate GLSL chromatic liquid wave
      shaderUniforms.time.value += 0.015;
      renderer.render(shaderScene, shaderCamera);
    } else if (currentPhase === 'VOXEL_ASSEMBLY' && instancedMesh) {
      // Gentle auto-progress if idle
      if (!isFullyAssembled) {
        targetScrollProgress += 0.0006;
        if (targetScrollProgress >= 1) {
          targetScrollProgress = 1;
          isFullyAssembled = true;
          triggerCompletionDropAndRipple();
        }
      }

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.1;

      const currentCamZ = initCameraZ + (targetCameraZ - initCameraZ) * scrollProgress;
      voxelCamera.position.z = currentCamZ;

      for (let i = 0; i < voxelCount; i++) {
        const pData = particleData[i];
        if (!pData) continue;

        const effectiveZ = pData.randZ * (1 - scrollProgress);
        const { p, s } = f(pData.targetX, pData.targetY, effectiveZ);

        dummyMatrix
          .identity()
          .setPosition(p)
          .multiply(dummyScaleMatrix.makeScale(s, s, s));

        instancedMesh.setMatrixAt(i, dummyMatrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(voxelScene, voxelCamera);
    } else if (currentPhase === 'COMPLETED' && instancedMesh) {
      voxelCamera.position.z = targetCameraZ;
      renderer.render(voxelScene, voxelCamera);
    }
  }

  animationFrameId = requestAnimationFrame(render);

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    shaderUniforms.resolution.value.set(width * dpr, height * dpr);

    voxelCamera.aspect = width / height;
    voxelCamera.updateProjectionMatrix();

    const newDpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(newDpr);
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onWindowResize);

  function revealPortfolio() {
    container.classList.add('fade-out');

    setTimeout(() => {
      document.body.style.overflow = '';

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);

      if (instancedMesh) {
        voxelScene.remove(instancedMesh);
        instancedMesh.geometry.dispose();
        if (Array.isArray(instancedMesh.material)) {
          instancedMesh.material.forEach((m) => m.dispose());
        } else {
          instancedMesh.material.dispose();
        }
      }

      if (shaderMesh) {
        shaderScene.remove(shaderMesh);
        shaderGeometry.dispose();
        shaderMaterial.dispose();
      }

      renderer.dispose();

      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }

      // Signal to the rest of the page that the portfolio is now visible
      document.dispatchEvent(new CustomEvent('portfolio:revealed'));
    }, 800);
  }

  if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', () => {
      revealPortfolio();
    });
  }
})();
