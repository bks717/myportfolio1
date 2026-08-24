/**
 * GLOBAL PERSONAL MUSIC PLAYER & AUDIO CONTROLLER
 *
 * 1. Manages playback of the 3 tracks from mp3_pernonnel_section
 *    (Him & I, Piano Melody, Yen Ayto) with omoriyon.jpg cover art.
 * 2. Renders a sleek floating widget in the bottom-left corner across all pages.
 * 3. Enforces single-source audio rule: automatically pauses/mutes all other
 *    background/ambient audio on the site whenever personal music is playing.
 * 4. Preserves playback state and position across page navigations via sessionStorage.
 * 5. Syncs bi-directionally with the on-page widget in personal.html.
 */
(function () {
  'use strict';

  var PLAYLIST = [
    { title: "Him & I", artist: "G-Eazy & Halsey", src: "./mp3_pernonnel_section/him_and_i.mp3" },
    { title: "Piano Melody", artist: "Classical Solo", src: "./mp3_pernonnel_section/piano1.mp3" },
    { title: "Yen Ayto", artist: "Kannada Track", src: "./mp3_pernonnel_section/yen-ayto.mp3" }
  ];

  var COVER_ART = "./images/omoriyon.jpg";
  var STORAGE_KEY = "krups_global_music_state";

  var state = {
    trackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    widgetDismissed: false
  };

  /* Restore state from sessionStorage */
  try {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      state.trackIndex = typeof parsed.trackIndex === 'number' ? parsed.trackIndex : 0;
      state.isPlaying  = !!parsed.isPlaying;
      state.currentTime = typeof parsed.currentTime === 'number' ? parsed.currentTime : 0;
    }
  } catch (e) {}

  var audioEl = null;
  var widgetEl = null;

  /* ─────────────────────────────────────────────────────────────
   * INITIALIZE AUDIO ELEMENT
   * ───────────────────────────────────────────────────────────── */
  function initAudio() {
    if (audioEl) return;
    audioEl = document.createElement('audio');
    audioEl.id = 'krups-global-audio';
    audioEl.preload = 'metadata';
    document.body.appendChild(audioEl);

    audioEl.src = PLAYLIST[state.trackIndex].src;
    if (state.currentTime > 0) {
      audioEl.currentTime = state.currentTime;
    }

    audioEl.addEventListener('timeupdate', function () {
      state.currentTime = audioEl.currentTime;
      saveState();
      updateWidgetProgress();

      /* Sync with personal.html in-page elements if present */
      var pageBar = document.getElementById('pm-progress-bar');
      var pageCur = document.getElementById('pm-current-time');
      var pageDur = document.getElementById('pm-duration');
      if (pageBar && audioEl.duration) {
        pageBar.style.width = ((audioEl.currentTime / audioEl.duration) * 100) + '%';
      }
      if (pageCur) pageCur.textContent = formatTime(audioEl.currentTime);
      if (pageDur && audioEl.duration) pageDur.textContent = formatTime(audioEl.duration);
    });

    audioEl.addEventListener('ended', function () {
      nextTrack();
    });

    /* If was playing before page navigation, attempt resume on first user interaction or immediately */
    if (state.isPlaying) {
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(function () {
          muteAllOtherAudios();
          updateUI();
        }).catch(function () {
          /* Autoplay policy fallback: resume on first user gesture */
          function resumeOnGesture() {
            if (state.isPlaying) {
              audioEl.play().then(function() {
                muteAllOtherAudios();
                updateUI();
              }).catch(function(){});
            }
            ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
              window.removeEventListener(evt, resumeOnGesture, true);
            });
          }
          ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
            window.addEventListener(evt, resumeOnGesture, { once: true, capture: true, passive: true });
          });
        });
      }
    }
  }

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        trackIndex: state.trackIndex,
        isPlaying: state.isPlaying,
        currentTime: state.currentTime
      }));
    } catch (e) {}
  }

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* ─────────────────────────────────────────────────────────────
   * ENFORCE AUDIO EXCLUSIVITY (Mute all others when playing)
   * ───────────────────────────────────────────────────────────── */
  function muteAllOtherAudios() {
    var allAudios = document.querySelectorAll('audio');
    allAudios.forEach(function (a) {
      if (a !== audioEl) {
        a.pause();
      }
    });

    /* Update ambient sound buttons */
    var ambientBtns = document.querySelectorAll('#ambient-sound-btn, #sidebar-ambient-mute-btn');
    ambientBtns.forEach(function (b) {
      b.classList.add('off');
      var on = b.querySelector('.snd-on, .snd-on-icon');
      var off = b.querySelector('.snd-off, .snd-off-icon');
      if (on) on.style.display = 'none';
      if (off) off.style.display = '';
    });
  }

  /* ─────────────────────────────────────────────────────────────
   * PLAYBACK CONTROLS
   * ───────────────────────────────────────────────────────────── */
  function play() {
    if (!audioEl) initAudio();
    muteAllOtherAudios();
    state.isPlaying = true;
    saveState();
    audioEl.play().then(function () {
      updateUI();
    }).catch(function (e) {
      console.log('Playback error:', e);
    });
  }

  function pause() {
    if (!audioEl) return;
    state.isPlaying = false;
    saveState();
    audioEl.pause();
    updateUI();
  }

  function togglePlay() {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function setTrack(idx, shouldPlay) {
    state.trackIndex = (idx + PLAYLIST.length) % PLAYLIST.length;
    state.currentTime = 0;
    if (!audioEl) initAudio();
    audioEl.src = PLAYLIST[state.trackIndex].src;
    saveState();
    updateUI();
    if (shouldPlay !== false || state.isPlaying) {
      play();
    }
  }

  function nextTrack() {
    setTrack(state.trackIndex + 1, true);
  }

  function prevTrack() {
    if (audioEl && audioEl.currentTime > 3) {
      audioEl.currentTime = 0;
    } else {
      setTrack(state.trackIndex - 1, true);
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * RENDER FLOATING BOTTOM-LEFT MINI WIDGET
   * ───────────────────────────────────────────────────────────── */
  function renderWidget() {
    if (document.getElementById('gm-floating-widget')) return;
    injectCSS();

    widgetEl = document.createElement('div');
    widgetEl.id = 'gm-floating-widget';
    widgetEl.innerHTML = `
      <div class="gm-widget-inner">
        <!-- Album Art Thumbnail -->
        <div class="gm-art-wrap">
          <img src="${COVER_ART}" alt="Album Art" class="gm-art"/>
          <div class="gm-art-overlay"></div>
        </div>

        <!-- Track Information -->
        <div class="gm-info">
          <div class="gm-title-row">
            <span class="gm-title" id="gm-title">${PLAYLIST[state.trackIndex].title}</span>
            <!-- Bouncing Equalizer -->
            <div class="gm-eq ${state.isPlaying ? 'active' : ''}" id="gm-eq">
              <span></span><span></span><span></span>
            </div>
          </div>
          <span class="gm-artist" id="gm-artist">${PLAYLIST[state.trackIndex].artist}</span>
        </div>

        <!-- Mini Controls -->
        <div class="gm-controls">
          <button id="gm-prev" aria-label="Previous Track" class="gm-ctrl-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button id="gm-play" aria-label="Play or Pause" class="gm-play-btn">
            <svg id="gm-icon-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <svg id="gm-icon-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
          <button id="gm-next" aria-label="Next Track" class="gm-ctrl-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>

        <!-- Progress Scrubber -->
        <div class="gm-progress-bar-bg" id="gm-progress-bar-bg">
          <div class="gm-progress-bar-fill" id="gm-progress-bar-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(widgetEl);

    /* Attach events to floating widget */
    document.getElementById('gm-play').addEventListener('click', togglePlay);
    document.getElementById('gm-prev').addEventListener('click', prevTrack);
    document.getElementById('gm-next').addEventListener('click', nextTrack);

    var progBg = document.getElementById('gm-progress-bar-bg');
    if (progBg) {
      progBg.addEventListener('click', function (e) {
        if (!audioEl || !audioEl.duration) return;
        var rect = progBg.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        audioEl.currentTime = pct * audioEl.duration;
      });
    }

    updateUI();
  }

  function updateWidgetProgress() {
    var fill = document.getElementById('gm-progress-bar-fill');
    if (fill && audioEl && audioEl.duration) {
      fill.style.width = ((audioEl.currentTime / audioEl.duration) * 100) + '%';
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * SYNC UI STATE ACROSS ALL WIDGETS
   * ───────────────────────────────────────────────────────────── */
  function updateUI() {
    var track = PLAYLIST[state.trackIndex];

    /* Update Floating Widget */
    if (widgetEl) {
      var gmTitle = document.getElementById('gm-title');
      var gmArtist = document.getElementById('gm-artist');
      var gmIconPlay = document.getElementById('gm-icon-play');
      var gmIconPause = document.getElementById('gm-icon-pause');
      var gmEq = document.getElementById('gm-eq');

      if (gmTitle) gmTitle.textContent = track.title;
      if (gmArtist) gmArtist.textContent = track.artist;

      if (state.isPlaying) {
        widgetEl.classList.add('visible');
        if (gmIconPlay) gmIconPlay.style.display = 'none';
        if (gmIconPause) gmIconPause.style.display = 'block';
        if (gmEq) gmEq.classList.add('active');
      } else {
        if (gmIconPlay) gmIconPlay.style.display = 'block';
        if (gmIconPause) gmIconPause.style.display = 'none';
        if (gmEq) gmEq.classList.remove('active');
      }
    }

    /* Sync In-Page Personal.html Player Widget */
    var pageTitle = document.getElementById('pm-title');
    var pageArtist = document.getElementById('pm-artist');
    var pagePlayIcon = document.getElementById('pm-play-icon');
    var pagePauseIcon = document.getElementById('pm-pause-icon');
    var pageCard = document.querySelector('.pm-playing') || (pageTitle ? pageTitle.closest('.rounded-3xl') : null);
    var vinylGlow = document.getElementById('pm-vinyl-glow');

    if (pageTitle) pageTitle.textContent = track.title;
    if (pageArtist) pageArtist.textContent = track.artist;

    if (state.isPlaying) {
      if (pagePlayIcon) pagePlayIcon.classList.add('hidden');
      if (pagePauseIcon) pagePauseIcon.classList.remove('hidden');
      if (pageCard) pageCard.classList.add('pm-playing');
      if (vinylGlow) vinylGlow.style.opacity = '1';
    } else {
      if (pagePlayIcon) pagePlayIcon.classList.remove('hidden');
      if (pagePauseIcon) pagePauseIcon.classList.add('hidden');
      if (pageCard) pageCard.classList.remove('pm-playing');
      if (vinylGlow) vinylGlow.style.opacity = '0';
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * INJECT CSS FOR FLOATING WIDGET
   * ───────────────────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('gm-styles')) return;
    var s = document.createElement('style');
    s.id = 'gm-styles';
    s.textContent = `
      #gm-floating-widget {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 9998;
        transform: translateY(120px) scale(0.95);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        user-select: none;
      }
      #gm-floating-widget.visible {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      .gm-widget-inner {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 9px 14px 9px 9px;
        border-radius: 16px;
        background: rgba(10, 10, 18, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.2);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        max-width: 320px;
        overflow: hidden;
      }
      .gm-art-wrap {
        position: relative;
        width: 42px;
        height: 42px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .gm-art {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .gm-info {
        display: flex;
        flex-direction: column;
        min-width: 100px;
        max-width: 140px;
        overflow: hidden;
      }
      .gm-title-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .gm-title {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .gm-artist {
        font-family: monospace;
        font-size: 0.62rem;
        color: rgba(255, 255, 255, 0.55);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .gm-eq {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 10px;
      }
      .gm-eq span {
        width: 2px;
        height: 3px;
        background: #818cf8;
        border-radius: 1px;
        transition: height 0.2s ease;
      }
      .gm-eq.active span:nth-child(1) { animation: gmBounce 0.8s ease-in-out infinite alternate; }
      .gm-eq.active span:nth-child(2) { animation: gmBounce 1.1s ease-in-out 0.2s infinite alternate; }
      .gm-eq.active span:nth-child(3) { animation: gmBounce 0.7s ease-in-out 0.4s infinite alternate; }
      @keyframes gmBounce {
        0% { height: 3px; }
        100% { height: 10px; background: #38bdf8; }
      }
      .gm-controls {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }
      .gm-ctrl-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, transform 0.2s;
      }
      .gm-ctrl-btn:hover {
        color: #ffffff;
        transform: scale(1.15);
      }
      .gm-play-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #ffffff;
        color: #000000;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
      .gm-play-btn:hover {
        transform: scale(1.1);
        background: #e0e7ff;
      }
      .gm-progress-bar-bg {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
      }
      .gm-progress-bar-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #6366f1, #38bdf8);
        transition: width 0.1s linear;
      }
    `;
    document.head.appendChild(s);
  }

  /* ─────────────────────────────────────────────────────────────
   * BOOTSTRAP
   * ───────────────────────────────────────────────────────────── */
  function init() {
    initAudio();
    renderWidget();

    /* Wire up in-page personal player controls if present */
    var pagePlayBtn = document.getElementById('pm-play-btn');
    var pagePrevBtn = document.getElementById('pm-prev-btn');
    var pageNextBtn = document.getElementById('pm-next-btn');
    var pageProgContainer = document.getElementById('pm-progress-container');

    if (pagePlayBtn) {
      pagePlayBtn.addEventListener('click', togglePlay);
    }
    if (pagePrevBtn) {
      pagePrevBtn.addEventListener('click', prevTrack);
    }
    if (pageNextBtn) {
      pageNextBtn.addEventListener('click', nextTrack);
    }
    if (pageProgContainer) {
      pageProgContainer.addEventListener('click', function (e) {
        if (!audioEl || !audioEl.duration) return;
        var rect = pageProgContainer.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var pct = clickX / rect.width;
        audioEl.currentTime = pct * audioEl.duration;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Global API */
  window.KrupsMusic = {
    play: play,
    pause: pause,
    toggle: togglePlay,
    next: nextTrack,
    prev: prevTrack,
    setTrack: setTrack,
    getState: function () { return state; }
  };

})();
