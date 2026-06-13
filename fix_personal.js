const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'personal.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

const personalStyles = `
<style id="personal-fixes">
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes wordCycle {
    0%, 18% { opacity: 1; transform: translateY(0); filter: blur(0); }
    22%, 100% { opacity: 0; transform: translateY(-24px); filter: blur(6px); }
}
@keyframes beamDrift {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(24px); }
}
@keyframes beamDriftReverse {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-24px); }
}
@keyframes meteorRise {
    0% { opacity: 0; transform: translateY(0); }
    10% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-220px); }
}
@keyframes meteorLine {
    0% { transform: translateY(120px); opacity: 0; }
    15% { opacity: 1; }
    100% { transform: translateY(-260px); opacity: 0; }
}
@keyframes globeSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes bookScroll {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-12px); }
}
@keyframes cardReveal {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.personal-hero-title {
    background: linear-gradient(to bottom, #fafafa, #ffffff, rgba(255,255,255,0.75));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
}
.personal-hero-kicker {
    font-size: clamp(1rem, 2vw, 1.25rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    font-weight: 600;
    margin-bottom: 0.75rem;
}
.personal-word-rotate {
    display: inline-block;
    position: relative;
    height: 1.15em;
    min-width: 11ch;
    vertical-align: bottom;
    overflow: hidden;
}
.personal-word-rotate span {
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
    color: rgb(245, 245, 245);
    opacity: 0;
    animation: wordCycle 12s ease-in-out infinite;
}
.personal-word-rotate span:nth-child(1) { animation-delay: 0s; }
.personal-word-rotate span:nth-child(2) { animation-delay: 3s; }
.personal-word-rotate span:nth-child(3) { animation-delay: 6s; }
.personal-word-rotate span:nth-child(4) { animation-delay: 9s; }

.personal-beam-left { animation: beamDrift 8s ease-in-out infinite; }
.personal-beam-right { animation: beamDriftReverse 8s ease-in-out infinite; }

.personal-card-reveal {
    opacity: 1 !important;
    transform: none !important;
    animation: cardReveal 0.8s ease-out forwards;
}
.personal-card-reveal:nth-child(1) { animation-delay: 0.05s; }
.personal-card-reveal:nth-child(2) { animation-delay: 0.15s; }
.personal-card-reveal:nth-child(3) { animation-delay: 0.25s; }
.personal-card-reveal:nth-child(4) { animation-delay: 0.35s; }
.personal-card-reveal:nth-child(5) { animation-delay: 0.45s; }

.personal-book-row {
    animation: bookScroll 28s linear infinite;
}
.personal-book-row:hover {
    animation-play-state: paused;
}

.personal-globe {
    width: min(420px, 90vw);
    aspect-ratio: 1;
    border-radius: 50%;
    position: relative;
    margin: 0 auto;
    background:
        radial-gradient(circle at 30% 30%, rgba(0, 255, 153, 0.35), transparent 55%),
        radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.25), transparent 50%),
        linear-gradient(135deg, #111827, #0f172a 60%, #111827);
    box-shadow:
        inset -18px -18px 40px rgba(0, 0, 0, 0.55),
        inset 12px 12px 30px rgba(255, 255, 255, 0.06),
        0 0 60px rgba(0, 255, 153, 0.12);
    overflow: hidden;
}
.personal-globe::before {
    content: "";
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background:
        repeating-linear-gradient(
            90deg,
            transparent 0 14px,
            rgba(255, 255, 255, 0.05) 14px 15px
        ),
        repeating-linear-gradient(
            0deg,
            transparent 0 18px,
            rgba(255, 255, 255, 0.04) 18px 19px
        );
    animation: globeSpin 30s linear infinite;
}
.personal-globe::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.18), transparent 35%);
}

.personal-meteor-line {
    animation: meteorLine 4s ease-in-out infinite;
    transform: none !important;
}
.personal-meteor-line:nth-child(2) { animation-delay: 1.2s; }
.personal-meteor-line:nth-child(3) { animation-delay: 2.4s; }
.personal-meteor-line:nth-child(4) { animation-delay: 0.6s; }
.personal-meteor-line:nth-child(5) { animation-delay: 1.8s; }
.personal-meteor-dot {
    animation: meteorRise 3.5s ease-out infinite;
}
.personal-meteor-dot:nth-child(2) { animation-delay: 0.4s; }
.personal-meteor-dot:nth-child(3) { animation-delay: 0.8s; }
.personal-meteor-dot:nth-child(4) { animation-delay: 1.2s; }
.personal-meteor-dot:nth-child(5) { animation-delay: 1.6s; }

.personal-section-enter {
    animation: fadeInUp 0.9s ease-out forwards;
}
.personal-hobby-card img {
    transition: transform 0.45s ease, filter 0.45s ease;
}
.personal-hobby-card:hover img {
    transform: scale(1.03);
    filter: brightness(1.05);
}
</style>
`;

$('#personal-fixes').remove();
$('head').append(personalStyles);

// Hero title gradient typo + styling (main hero only, not nav logo)
$('.h-\\[30dvh\\] h1').each((_, el) => {
    const $el = $(el);
    const cls = ($el.attr('class') || '').replace(':via-white', 'via-white');
    $el.attr('class', `${cls} personal-hero-title`.trim());
});
$('header h1').removeClass('personal-hero-title');

// Replace broken rotating-word snapshot with CSS cycle
$('div.text-2xl, div.text-3xl').filter((_, el) => {
    return $(el).text().includes('Ara is');
}).first().each((_, el) => {
    const $el = $(el);
    $el.html(`
Ara is<!-- --> <br class="lg:hidden block">
<div class="relative inline-block personal-word-rotate">
  <span>Curious</span>
  <span>Disciplined</span>
  <span>Peaceful</span>
  <span>Creative</span>
</div>
<br>
<span class="hidden lg:block">Built this website with love ❤️🍕🚀</span>
    `.trim());
    $el.addClass('personal-section-enter');
});

// Background beams
$('.absolute.top-0.left-0.w-screen').first().addClass('personal-beam-left').attr('style', '');
$('.absolute.top-0.right-0.w-screen').first().addClass('personal-beam-right').attr('style', '');

// Life components carousel cards (were opacity:0)
$('h2').filter((_, el) => $(el).text().includes("Components of Ara's Life")).each((_, el) => {
    const $section = $(el).closest('.w-screen.max-w-full, div').first().parent();
    $section.find('.rounded-3xl').each((i, card) => {
        const $card = $(card);
        const style = $card.attr('style') || '';
        if (style.includes('opacity:0') || style.includes('opacity: 0')) {
            $card.removeAttr('style');
            $card.addClass('personal-card-reveal');
        }
    });
});

// Book image rows – gentle horizontal motion
$('p').filter((_, el) => $(el).text().trim() === 'Enjoyer of good books').each((_, el) => {
    const $container = $(el).closest('.p-4, .sm\\:p-8').find('.flex.flex-row').first().parent();
    $container.find('.flex.flex-row').addClass('personal-book-row');
});

// Empty globe canvas → CSS globe
$('canvas').each((_, canvas) => {
    const $canvas = $(canvas);
    const $wrap = $canvas.parent();
    $canvas.remove();
    $wrap.html('<div class="personal-globe" aria-hidden="true"></div>');
});

// Meteor / thank-you particle section cleanup
$('div.h-96.md\\:h-\\[40rem\\]').find('.absolute.left-0.top-20.m-auto').each((i, el) => {
    const $el = $(el);
    const style = $el.attr('style') || '';
    if (style.includes('rgb(0, 255, 153)')) {
        $el.addClass('personal-meteor-line');
        $el.attr('style', 'background: linear-gradient(to top, rgb(0, 255, 153), rgba(0, 255, 153, 0.5), transparent);');
    }
});

$('div.h-96.md\\:h-\\[40rem\\]').find('span.rounded-full').each((_, el) => {
    const $el = $(el);
    $el.removeClass('stagger-animate');
    $el.addClass('personal-meteor-dot');
    $el.attr('style', 'background: linear-gradient(rgb(0, 255, 153), rgba(0, 255, 153, 0.7));');
});

$('div.absolute.z-50.h-2.w-2').each((_, el) => {
    $(el).find('.stagger-animate').removeClass('stagger-animate');
});

// Remove bad stagger-animate + blur from letter spans inside hero
$('.personal-word-rotate .stagger-animate').removeClass('stagger-animate');
$('[style*="blur(8px)"]').each((_, el) => {
    let style = $(el).attr('style') || '';
    style = style.replace(/filter:\s*blur\([^)]+\);?/g, '').trim();
    $(el).attr('style', style || undefined);
});

// Strip stagger-animate from decorative particles that should not fade-in from below
$('.absolute.h-1.w-1.rounded-full.stagger-animate').each((_, el) => {
    const $el = $(el);
    if (!$el.hasClass('personal-meteor-dot')) {
        $el.removeClass('stagger-animate');
        $el.css('opacity', '1');
    }
});

// Hobby cards hover polish
$('.grid.grid-cols-1.lg\\:grid-cols-6 .p-4, .grid.grid-cols-1.lg\\:grid-cols-6 .sm\\:p-8').addClass('personal-hobby-card');

// Hero block entrance
$('.h-\\[30dvh\\]').first().addClass('personal-section-enter');

// Carousel scroll buttons (minimal, page-local)
if (!$('#personal-carousel-script').length) {
    $('body').append(`
<script id="personal-carousel-script">
(function () {
  var row = document.querySelector('.overflow-x-scroll .flex.flex-row.justify-start.gap-4');
  if (!row) return;
  var scroller = row.closest('.overflow-x-scroll');
  var buttons = document.querySelectorAll('.flex.justify-end.gap-2.mr-10 button');
  if (buttons.length < 2 || !scroller) return;
  buttons[0].disabled = false;
  buttons[0].addEventListener('click', function () {
    scroller.scrollBy({ left: -320, behavior: 'smooth' });
  });
  buttons[1].addEventListener('click', function () {
    scroller.scrollBy({ left: 320, behavior: 'smooth' });
  });
})();
</script>
    `.trim());
}

fs.writeFileSync(htmlPath, $.html());
console.log('Personal page animations and layout updated.');
