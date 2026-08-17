const nav = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
if (menuBtn && nav) {
menuBtn.addEventListener("click", () => {
nav.classList.toggle("open");
});
}
const prefersReducedMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;
const clamp01 = value =>
Math.min(
Math.max(value, 0),
1
);
const lerp = (
start,
end,
progress
) =>
start +
(
end -
start
) *
progress;
function easeInOutCubic(value) {
return value < 0.5
? 4 *
value *
value *
value
: 1 -
Math.pow(
-2 * value + 2,
3
) / 2;
}
function rangeProgress(
value,
start,
end
) {
return clamp01(
(
value -
start
) /
Math.max(
end -
start,
0.0001
)
);
}
function initCursorGlow() {
document
.querySelector(".cursor-glow")
?.remove();
const glow =
document.createElement("div");
glow.className =
"cursor-glow";
glow.setAttribute(
"aria-hidden",
"true"
);
glow.style.zIndex =
"900";
document.body.appendChild(
glow
);
const siteHeader =
document.querySelector(
".site-header"
);
if (siteHeader) {
siteHeader.style.zIndex =
"1000";
}
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let hasMoved = false;
const followSpeed =
0.14;
window.addEventListener(
"pointermove",
event => {
targetX =
event.clientX;
targetY =
event.clientY;
if (!hasMoved) {
currentX =
targetX;
currentY =
targetY;
hasMoved =
true;
}
glow.style.opacity =
"1";
},
{
passive: true
}
);
function animateGlow() {
currentX +=
(
targetX -
currentX
) *
followSpeed;
currentY +=
(
targetY -
currentY
) *
followSpeed;
glow.style.transform =
`translate3d(
${currentX}px,
${currentY}px,
0
)
translate(
-50%,
-50%
)`;
requestAnimationFrame(
animateGlow
);
}
animateGlow();
document.documentElement
.addEventListener(
"mouseleave",
() => {
glow.style.opacity =
"0";
}
);
document.documentElement
.addEventListener(
"mouseenter",
() => {
if (hasMoved) {
glow.style.opacity =
"1";
}
}
);
window.addEventListener(
"blur",
() => {
glow.style.opacity =
"0";
}
);
}
if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
initCursorGlow
);
} else {
initCursorGlow();
}
function initCircularLineBackground() {
  document
    .querySelector(".calis-circle-bg")
    ?.remove();
  const layer =
    document.createElement("div");
  layer.className =
    "calis-circle-bg";
  layer.setAttribute(
    "aria-hidden",
    "true"
  );
  const ringConfigs = [
  { x: -4,  y: 12, size: 420, react: 1.00, dir:  1, alpha: .085 },
  { x: 18,  y: 28, size: 190, react: 1.20, dir: -1, alpha: .095 },
  { x: 42,  y: 10, size: 310, react: .90, dir:  1, alpha: .075 },
  { x: 66,  y: 24, size: 150, react: 1.25, dir: -1, alpha: .095, accent: true },
  { x: 91,  y:  8, size: 390, react: .85, dir:  1, alpha: .075 },
  { x:  7,  y: 63, size: 230, react: 1.15, dir: -1, alpha: .090 },
  { x: 31,  y: 78, size: 460, react: .78, dir:  1, alpha: .070 },
  { x: 54,  y: 58, size: 175, react: 1.30, dir: -1, alpha: .095 },
  { x: 77,  y: 72, size: 285, react: 1.00, dir:  1, alpha: .085, accent: true },
  { x: 97,  y: 58, size: 205, react: 1.20, dir: -1, alpha: .085 },
  { x: 49,  y: 96, size: 350, react: .82, dir:  1, alpha: .072 },
  { x: 84,  y: 98, size: 520, react: .72, dir: -1, alpha: .065 }
];
  const rings =
    ringConfigs.map(
      (config, index) => {
        const element =
          document.createElement(
            "span"
          );
        element.className =
          "calis-circle-ring";
        if (config.accent) {
          element.classList.add(
            "is-accent"
          );
        }
        element.style.setProperty(
          "--ring-left",
          `${config.x}%`
        );
        element.style.setProperty(
          "--ring-top",
          `${config.y}%`
        );
        element.style.setProperty(
          "--ring-size",
          `${config.size}px`
        );
        element.style.setProperty(
          "--ring-alpha",
          config.alpha
        );
        element.style.setProperty(
          "--ring-duration",
          `${16 + (index % 5) * 3}s`
        );
        element.style.setProperty(
          "--ring-delay",
          `${-(index * 1.9)}s`
        );
        layer.appendChild(
          element
        );
        return {
          element,
          config,
          centerX: 0,
          centerY: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          scaleX: 1,
          scaleY: 1,
          vScaleX: 0,
          vScaleY: 0
        };
      }
    );
  document.body.insertBefore(
    layer,
    document.body.firstChild
  );
  if (
    prefersReducedMotion ||
    !window.matchMedia(
      "(any-hover:hover) and (pointer:fine)"
    ).matches
  ) {
    return;
  }
  let pointerX =
    window.innerWidth * .5;
  let pointerY =
    window.innerHeight * .5;
  let targetX = pointerX;
  let targetY = pointerY;
  let previousX = pointerX;
  let previousY = pointerY;
  let velocityX = 0;
  let velocityY = 0;
  let targetVelocityX = 0;
  let targetVelocityY = 0;
  let movementEnergy = 0;
  let pointerActive = false;
  function updateRingGeometry() {
    const layerRect =
      layer.getBoundingClientRect();
    rings.forEach(
      state => {
        const rect =
          state.element
            .getBoundingClientRect();
        state.centerX =
          rect.left -
          layerRect.left +
          rect.width / 2;
        state.centerY =
          rect.top -
          layerRect.top +
          rect.height / 2;
      }
    );
  }
  updateRingGeometry();
  window.addEventListener(
    "resize",
    updateRingGeometry,
    { passive: true }
  );
  window.addEventListener(
    "pointermove",
    event => {
      pointerActive = true;
      targetX =
        event.clientX;
      targetY =
        event.clientY;
      const moveX =
        event.clientX -
        previousX;
      const moveY =
        event.clientY -
        previousY;
      previousX =
        event.clientX;
      previousY =
        event.clientY;
      targetVelocityX =
        Math.max(
          -90,
          Math.min(
            90,
            moveX
          )
        );
      targetVelocityY =
        Math.max(
          -90,
          Math.min(
            90,
            moveY
          )
        );
      movementEnergy =
        Math.max(
          movementEnergy,
          clamp01(
            Math.hypot(
              moveX,
              moveY
            ) / 24
          )
        );
    },
    { passive: true }
  );
  function settleRings() {
    pointerActive = false;
    targetVelocityX = 0;
    targetVelocityY = 0;
  }
  document.documentElement
    .addEventListener(
      "mouseleave",
      settleRings
    );
  window.addEventListener(
    "blur",
    settleRings
  );
  function spring(
    state,
    valueKey,
    velocityKey,
    target,
    stiffness = .065,
    damping = .77
  ) {
    state[velocityKey] +=
      (
        target -
        state[valueKey]
      ) *
      stiffness;
    state[velocityKey] *=
      damping;
    state[valueKey] +=
      state[velocityKey];
  }
  function animateCircularLines() {
    pointerX +=
      (
        targetX -
        pointerX
      ) *
      .24;
    pointerY +=
      (
        targetY -
        pointerY
      ) *
      .24;
    velocityX +=
      (
        targetVelocityX -
        velocityX
      ) *
      .26;
    velocityY +=
      (
        targetVelocityY -
        velocityY
      ) *
      .26;
    targetVelocityX *= .80;
    targetVelocityY *= .80;
    movementEnergy *= .91;
    const normalizedX =
      (
        pointerX /
        Math.max(
          window.innerWidth,
          1
        ) -
        .5
      ) * 2;
    const normalizedY =
      (
        pointerY /
        Math.max(
          window.innerHeight,
          1
        ) -
        .5
      ) * 2;
    document.documentElement
      .style.setProperty(
        "--circle-field-x",
        `${normalizedX * 18}px`
      );
    document.documentElement
      .style.setProperty(
        "--circle-field-y",
        `${normalizedY * 14}px`
      );
    const layerRect =
      layer.getBoundingClientRect();
    const localPointerX =
      pointerX -
      layerRect.left;
    const localPointerY =
      pointerY -
      layerRect.top;
    rings.forEach(
      (state, index) => {
        const config =
          state.config;
        const dx =
          state.centerX -
          localPointerX;
        const dy =
          state.centerY -
          localPointerY;
        const distance =
          Math.max(
            Math.hypot(
              dx,
              dy
            ),
            1
          );
        const influenceRadius =
          config.size * .72 +
          260;
        const proximity =
          clamp01(
            1 -
            distance /
            influenceRadius
          );
        const influence =
          proximity *
          proximity *
          (
            3 -
            2 * proximity
          );
        const awayX =
          dx /
          distance;
        const awayY =
          dy /
          distance;
        const idleDirection =
          index % 2 === 0
            ? 1
            : -1;
        const pushStrength =
          influence *
          config.react *
          (
            10 +
            movementEnergy * 52
          );
        const momentumX =
          velocityX *
          .34 *
          influence *
          config.react *
          config.dir;
        const momentumY =
          velocityY *
          .34 *
          influence *
          config.react *
          config.dir;
        const targetRingX =
          awayX *
          pushStrength +
          momentumX +
          normalizedX *
          11 *
          idleDirection;
        const targetRingY =
          awayY *
          pushStrength +
          momentumY +
          normalizedY *
          8 *
          -idleDirection;
        const stretch =
          influence *
          movementEnergy *
          .095 *
          config.react;
        let targetScaleX = 1;
        let targetScaleY = 1;
        if (
          Math.abs(velocityX) >=
          Math.abs(velocityY)
        ) {
          targetScaleX =
            1 + stretch;
          targetScaleY =
            1 - stretch * .58;
        } else {
          targetScaleX =
            1 - stretch * .58;
          targetScaleY =
            1 + stretch;
        }
        spring(
          state,
          "x",
          "vx",
          targetRingX
        );
        spring(
          state,
          "y",
          "vy",
          targetRingY
        );
        spring(
          state,
          "scaleX",
          "vScaleX",
          targetScaleX,
          .075,
          .76
        );
        spring(
          state,
          "scaleY",
          "vScaleY",
          targetScaleY,
          .075,
          .76
        );
        state.x =
          Math.max(
            -85,
            Math.min(
              85,
              state.x
            )
          );
        state.y =
          Math.max(
            -85,
            Math.min(
              85,
              state.y
            )
          );
        state.scaleX =
          Math.max(
            .88,
            Math.min(
              1.14,
              state.scaleX
            )
          );
        state.scaleY =
          Math.max(
            .88,
            Math.min(
              1.14,
              state.scaleY
            )
          );
        state.element.style.setProperty(
          "--ring-x",
          `${state.x.toFixed(2)}px`
        );
        state.element.style.setProperty(
          "--ring-y",
          `${state.y.toFixed(2)}px`
        );
        state.element.style.setProperty(
          "--ring-scale-x",
          state.scaleX.toFixed(4)
        );
        state.element.style.setProperty(
          "--ring-scale-y",
          state.scaleY.toFixed(4)
        );
      }
    );
    requestAnimationFrame(
      animateCircularLines
    );
  }
  animateCircularLines();
}
if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initCircularLineBackground
  );
} else {
  initCircularLineBackground();
}
function initContinuousMarquee() {
const marquees =
Array.from(
new Set(
document.querySelectorAll(
".marquee, .pdf-marquee"
)
)
);
marquees.forEach(
marquee => {
const children =
Array.from(
marquee.children
);
if (!children.length) {
return;
}
const track =
children[0];
children
.slice(1)
.forEach(
child => {
child.remove();
}
);
const sourceText =
(
marquee.dataset.marqueeSource ||
track.textContent ||
""
)
.replace(
/\s+/g,
" "
)
.trim();
if (!sourceText) {
return;
}
marquee.dataset.marqueeSource =
sourceText;
marquee.setAttribute(
"aria-label",
sourceText
);
track.setAttribute(
"aria-hidden",
"true"
);
let marqueeAnimation =
null;
let resizeTimer =
null;
function createPhrase() {
const phrase =
document.createElement(
"span"
);
phrase.className =
"marquee-phrase";
phrase.textContent =
sourceText;
return phrase;
}
function buildMarquee() {
marqueeAnimation?.cancel();
marqueeAnimation =
null;
track.innerHTML =
"";
track.classList.add(
"marquee-track"
);
const firstGroup =
document.createElement(
"span"
);
firstGroup.className =
"marquee-group";
firstGroup.setAttribute(
"aria-hidden",
"true"
);
track.appendChild(
firstGroup
);
let count =
0;
do {
firstGroup.appendChild(
createPhrase()
);
count +=
1;
} while (
firstGroup.scrollWidth <
window.innerWidth +
180 &&
count <
30
);
const secondGroup =
firstGroup.cloneNode(
true
);
track.appendChild(
secondGroup
);
const shift =
firstGroup
.getBoundingClientRect()
.width;
if (shift <= 0) {
return;
}
if (
prefersReducedMotion
) {
track.style.transform =
"translate3d(0,0,0)";
return;
}
const pixelsPerSecond =
58;
const duration =
Math.max(
15000,
(
shift /
pixelsPerSecond
) *
1000
);
marqueeAnimation =
track.animate(
[
{
transform:
`translate3d(
-${shift}px,
0,
0
)`
},
{
transform:
"translate3d(0,0,0)"
}
],
{
duration,
easing:
"linear",
iterations:
Infinity
}
);
}
buildMarquee();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
buildMarquee
);
}
window.addEventListener(
"resize",
() => {
clearTimeout(
resizeTimer
);
resizeTimer =
setTimeout(
buildMarquee,
160
);
}
);
}
);
}
if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
initContinuousMarquee
);
} else {
initContinuousMarquee();
}
document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(
link => {
link.addEventListener(
"click",
event => {
const href =
link.getAttribute(
"href"
);
if (
!href ||
href === "#"
) {
return;
}
const target =
document.querySelector(
href
);
if (!target) {
return;
}
event.preventDefault();
target.scrollIntoView({
behavior:
prefersReducedMotion
? "auto"
: "smooth"
});
}
);
}
);
if (
"IntersectionObserver" in
window
) {
const observer =
new IntersectionObserver(
entries => {
entries.forEach(
entry => {
if (
!entry.isIntersecting
) {
return;
}
entry.target
.classList.add(
"visible"
);
observer.unobserve(
entry.target
);
}
);
},
{
threshold:
0.12
}
);
document
.querySelectorAll(
".reveal"
)
.forEach(
element => {
const hasCustomScrollEffect =
element.closest(
".pdf-studio-seven"
) ||
element.closest(
".pdf-why-section"
) ||
element.closest(
"#programs.pdf-programs-section"
) ||
element.closest(
".pdf-cta-wrap"
);
if (
hasCustomScrollEffect
) {
element.classList.add(
"visible"
);
} else {
observer.observe(
element
);
}
}
);
} else {
document
.querySelectorAll(
".reveal"
)
.forEach(
element => {
element.classList.add(
"visible"
);
}
);
}
const studioScrollSection =
document.querySelector(
".pdf-studio-seven"
);
const studioScrollHeading =
studioScrollSection
?.querySelector(
".section-title"
) ||
null;
const studioScrollGrid =
studioScrollSection
?.querySelector(
".studio-seven-grid"
) ||
null;
const studioPhotoCards =
studioScrollGrid
? Array.from(
studioScrollGrid
.querySelectorAll(
".studio-photo"
)
)
: [];
const studioNextSection =
document.querySelector(
"#home .pdf-why-section"
);
let studioScrollTicking =
false;
function getStudioSpreadPositions() {
const horizontal =
Math.min(
window.innerWidth *
0.25,
430
);
const vertical =
Math.min(
window.innerHeight *
0.22,
210
);
return [
{
x:
-horizontal *
1.00,
y:
vertical *
0.12,
rotate:
-3.5
},
{
x:
-horizontal *
0.48,
y:
-vertical *
0.95,
rotate:
-2.5
},
{
x:
horizontal *
0.68,
y:
-vertical *
0.90,
rotate:
2.8
},
{
x:
horizontal *
1.02,
y:
vertical *
0.08,
rotate:
3.6
},
{
x:
-horizontal *
0.82,
y:
vertical *
0.95,
rotate:
-2.8
},
{
x:
horizontal *
0.04,
y:
vertical *
1.08,
rotate:
1.5
},
{
x:
horizontal *
0.88,
y:
vertical *
0.92,
rotate:
3.0
}
];
}
function resetStudioCinematic() {
if (
studioScrollHeading
) {
studioScrollHeading
.style.opacity =
"";
studioScrollHeading
.style.transform =
"";
studioScrollHeading
.style.filter =
"";
}
if (
studioScrollGrid
) {
studioScrollGrid
.style.transform =
"";
}
studioPhotoCards.forEach(
photo => {
photo.style.opacity =
"";
photo.style.transform =
"";
photo.style.filter =
"";
photo.classList.remove(
"is-scroll-faded"
);
}
);
if (
studioNextSection
) {
studioNextSection
.style.opacity =
"";
studioNextSection
.style.transform =
"";
studioNextSection
.style.filter =
"";
}
}
function updateStudioCinematic() {
studioScrollTicking =
false;
if (
!studioScrollSection ||
!studioScrollGrid
) {
return;
}
const desktopMotion =
window.matchMedia(
"(min-width:1051px)"
).matches;
if (
!desktopMotion ||
prefersReducedMotion
) {
resetStudioCinematic();
return;
}
const viewportHeight =
window.innerHeight;
const sectionRect =
studioScrollSection
.getBoundingClientRect();
const entranceStart =
viewportHeight *
0.96;
const entranceEnd =
viewportHeight *
0.08;
const entranceProgress =
clamp01(
(
entranceStart -
sectionRect.top
) /
Math.max(
entranceStart -
entranceEnd,
1
)
);
const entranceEase =
easeInOutCubic(
entranceProgress
);
const stickyDistance =
Math.max(
studioScrollSection
.offsetHeight -
viewportHeight,
1
);
const stickyProgress =
clamp01(
-sectionRect.top /
stickyDistance
);
studioScrollGrid
.style.transform =
"translate3d(0,0,0) scale(1)";
const spreadPositions =
getStudioSpreadPositions();
studioPhotoCards.forEach(
(
photo,
index
) => {
const spread =
spreadPositions[
index
] ||
{
x: 0,
y: 0,
rotate: 0
};
const photoX =
lerp(
spread.x,
0,
entranceEase
);
let photoY =
lerp(
spread.y,
0,
entranceEase
);
const photoRotation =
lerp(
spread.rotate,
0,
entranceEase
);
const entranceOpacity =
entranceEase;
const entranceBlur =
lerp(
8,
0,
entranceEase
);
const fadeSequenceStart =
0.02;
const fadeStep =
0.080;
const fadeDuration =
0.11;
const photoFadeStart =
fadeSequenceStart +
index *
fadeStep;
const photoFadeEnd =
photoFadeStart +
fadeDuration;
const photoFadeProgress =
rangeProgress(
stickyProgress,
photoFadeStart,
photoFadeEnd
);
const photoFadeEase =
easeInOutCubic(
photoFadeProgress
);
photoY +=
lerp(
0,
-14,
photoFadeEase
);
const finalOpacity =
entranceOpacity *
(
1 -
photoFadeEase
);
photo.style.opacity =
finalOpacity;
photo.style.transform =
`translate3d(
${photoX}px,
${photoY}px,
0
)
rotate(
${photoRotation}deg
)
scale(1)`;
photo.style.filter =
`blur(
${entranceBlur}px
)`;
photo.classList.toggle(
"is-scroll-faded",
finalOpacity <=
0.05
);
}
);
if (
studioScrollHeading
) {
const progress =
rangeProgress(
stickyProgress,
0.02,
0.27
);
const ease =
easeInOutCubic(
progress
);
studioScrollHeading
.style.opacity =
lerp(
1,
0,
ease
);
studioScrollHeading
.style.transform =
`translate3d(
0,
${lerp(
0,
-54,
ease
)}px,
0
)`;
studioScrollHeading
.style.filter =
`blur(
${lerp(
0,
4,
ease
)}px
)`;
}
if (
studioNextSection
) {
const progress =
rangeProgress(
stickyProgress,
0.04,
0.74
);
const ease =
easeInOutCubic(
progress
);
studioNextSection
.style.opacity =
lerp(
0,
1,
ease
);
studioNextSection
.style.transform =
"";
studioNextSection
.style.filter =
"";
}
}
function requestStudioCinematicUpdate() {
if (
studioScrollTicking
) {
return;
}
studioScrollTicking =
true;
requestAnimationFrame(
updateStudioCinematic
);
}
if (
studioScrollSection &&
studioScrollGrid
) {
window.addEventListener(
"scroll",
requestStudioCinematicUpdate,
{
passive: true
}
);
window.addEventListener(
"resize",
requestStudioCinematicUpdate
);
window.addEventListener(
"load",
requestStudioCinematicUpdate
);
requestStudioCinematicUpdate();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
requestStudioCinematicUpdate
);
}
}
const whyScrollSection =
document.querySelector(
"#home .pdf-why-section"
);
const whyCopyBlock =
whyScrollSection
?.querySelector(
".pdf-why-copy"
) ||
null;
const whyFeatureCards =
whyScrollSection
? Array.from(
whyScrollSection
.querySelectorAll(
".pdf-feature-card"
)
)
: [];
const programsScrollSection =
document.querySelector(
"#programs.pdf-programs-section"
) ||
document.querySelector(
"#programs"
);
const whyFadeItems =
[
whyCopyBlock,
...whyFeatureCards
]
.filter(
Boolean
);
let whyScrollTicking =
false;
function resetWhyScrollTransition() {
whyFadeItems.forEach(
item => {
item.style.opacity =
"";
item.style.transform =
"";
item.style.filter =
"";
item.style.pointerEvents =
"";
item.style.transition =
"";
}
);
if (
programsScrollSection
) {
programsScrollSection
.style.opacity =
"";
programsScrollSection
.style.transform =
"";
programsScrollSection
.style.filter =
"";
programsScrollSection
.style.transition =
"";
}
}
function updateWhyScrollTransition() {
whyScrollTicking =
false;
if (
!whyScrollSection
) {
return;
}
const desktopMotion =
window.matchMedia(
"(min-width:1051px)"
).matches;
if (
!desktopMotion ||
prefersReducedMotion
) {
resetWhyScrollTransition();
return;
}
const viewportHeight =
window.innerHeight;
const whyRect =
whyScrollSection
.getBoundingClientRect();
const exitStart =
viewportHeight *
0.94;
const exitEnd =
viewportHeight *
0.28;
const whyExitProgress =
clamp01(
(
exitStart -
whyRect.bottom
) /
Math.max(
exitStart -
exitEnd,
1
)
);
const sequenceStart =
0.00;
const sequenceStep =
0.14;
const fadeDuration =
0.22;
whyFadeItems.forEach(
(
item,
index
) => {
const itemFadeStart =
sequenceStart +
index *
sequenceStep;
const itemFadeEnd =
itemFadeStart +
fadeDuration;
const itemFadeProgress =
rangeProgress(
whyExitProgress,
itemFadeStart,
itemFadeEnd
);
if (
itemFadeProgress <=
0
) {
item.style.opacity =
"";
item.style.transform =
"";
item.style.filter =
"";
item.style.pointerEvents =
"";
item.style.transition =
"";
return;
}
const itemFadeEase =
easeInOutCubic(
itemFadeProgress
);
const itemOpacity =
lerp(
1,
0,
itemFadeEase
);
item.style.transition =
"none";
item.style.opacity =
itemOpacity;
item.style.transform =
"";
item.style.filter =
"";
item.style.pointerEvents =
itemOpacity <=
0.05
? "none"
: "";
}
);
if (
programsScrollSection
) {
const progress =
rangeProgress(
whyExitProgress,
0.14,
0.88
);
const ease =
easeInOutCubic(
progress
);
programsScrollSection
.style.transition =
"none";
programsScrollSection
.style.opacity =
lerp(
0,
1,
ease
);
programsScrollSection
.style.transform =
"";
programsScrollSection
.style.filter =
"";
}
}
function requestWhyScrollUpdate() {
if (
whyScrollTicking
) {
return;
}
whyScrollTicking =
true;
requestAnimationFrame(
updateWhyScrollTransition
);
}
if (
whyScrollSection
) {
whyScrollSection
.classList.add(
"visible"
);
whyFadeItems.forEach(
item => {
item.classList.add(
"visible"
);
}
);
window.addEventListener(
"scroll",
requestWhyScrollUpdate,
{
passive: true
}
);
window.addEventListener(
"resize",
requestWhyScrollUpdate
);
window.addEventListener(
"load",
requestWhyScrollUpdate
);
requestWhyScrollUpdate();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
requestWhyScrollUpdate
);
}
}
const programsRevealSection =
document.querySelector(
"#programs.pdf-programs-section"
) ||
document.querySelector(
"#programs"
);
const programsRevealCards =
programsRevealSection
? Array.from(
programsRevealSection
.querySelectorAll(
".pdf-program-card"
)
)
: [];
let programsRevealTicking =
false;
function removeOldProgramsCinematicStage() {
if (
!programsRevealSection
) {
return;
}
const oldStage =
programsRevealSection
.querySelector(
":scope > .programs-cinematic-stage"
);
if (!oldStage) {
return;
}
const oldHeading =
oldStage.querySelector(
".pdf-programs-heading"
);
const oldList =
oldStage.querySelector(
".pdf-program-list"
);
if (
oldHeading
) {
programsRevealSection
.insertBefore(
oldHeading,
oldStage
);
}
if (
oldList
) {
programsRevealSection
.insertBefore(
oldList,
oldStage
);
}
oldStage.remove();
}
function applyProgramsNormalLayout() {
if (
!programsRevealSection
) {
return;
}
const desktopMotion =
window.matchMedia(
"(min-width:1051px)"
).matches;
if (
desktopMotion
) {
programsRevealSection
.style.setProperty(
"height",
"auto",
"important"
);
programsRevealSection
.style.setProperty(
"min-height",
"auto",
"important"
);
programsRevealSection
.style.setProperty(
"padding-top",
"72px",
"important"
);
programsRevealSection
.style.setProperty(
"padding-bottom",
"100px",
"important"
);
programsRevealSection
.style.setProperty(
"overflow",
"visible",
"important"
);
programsRevealSection
.style.setProperty(
"transform",
"none",
"important"
);
programsRevealSection
.style.setProperty(
"filter",
"none",
"important"
);
} else {
[
"height",
"min-height",
"padding-top",
"padding-bottom",
"overflow",
"transform",
"filter"
]
.forEach(
property => {
programsRevealSection
.style.removeProperty(
property
);
}
);
}
}
function resetProgramsReveal() {
programsRevealCards.forEach(
card => {
card.style.opacity =
"";
card.style.clipPath =
"";
card.style.transform =
"";
card.style.filter =
"";
card.style.borderColor =
"";
card.style.pointerEvents =
"";
card.style.transition =
"";
const image =
card.querySelector(
".pdf-program-image img"
);
if (
image
) {
image.style.transform =
"";
image.style.transition =
"";
}
}
);
}
function updateProgramsReveal() {
programsRevealTicking =
false;
if (
!programsRevealSection ||
!programsRevealCards.length
) {
return;
}
applyProgramsNormalLayout();
const desktopMotion =
window.matchMedia(
"(min-width:1051px)"
).matches;
if (
!desktopMotion ||
prefersReducedMotion
) {
resetProgramsReveal();
return;
}
const viewportHeight =
window.innerHeight;
const enterStart =
viewportHeight *
0.94;
const enterEnd =
viewportHeight *
0.52;
const exitStart =
viewportHeight *
0.30;
const exitEnd =
viewportHeight *
0.06;
programsRevealCards.forEach(
(
card,
index
) => {
const cardRect =
card.getBoundingClientRect();
const enterProgress =
clamp01(
(
enterStart -
cardRect.top
) /
Math.max(
enterStart -
enterEnd,
1
)
);
const exitProgress =
clamp01(
(
exitStart -
cardRect.top
) /
Math.max(
exitStart -
exitEnd,
1
)
);
const enterEase =
easeInOutCubic(
enterProgress
);
const exitEase =
easeInOutCubic(
exitProgress
);
const enterOpacity =
lerp(
0.12,
1,
enterEase
);
const exitOpacity =
lerp(
1,
0,
exitEase
);
const finalOpacity =
enterOpacity *
exitOpacity;
const bottomMask =
lerp(
14,
0,
enterEase
);
const topMask =
lerp(
0,
18,
exitEase
);
card.style.opacity =
finalOpacity;
card.style.clipPath =
`inset(
${topMask}%
0
${bottomMask}%
0
round 18px
)`;
card.style.transform =
"none";
card.style.filter =
"none";
card.style.transition =
"none";
const visibleStrength =
enterEase *
(
1 -
exitEase
);
const borderAlpha =
lerp(
0.07,
0.17,
visibleStrength
);
card.style.borderColor =
`rgba(
255,
255,
255,
${borderAlpha}
)`;
const image =
card.querySelector(
".pdf-program-image img"
);
if (
image
) {
const enterX =
index % 2 ===
0
? -28
: 28;
const exitX =
index % 2 ===
0
? 20
: -20;
const enteringX =
lerp(
enterX,
0,
enterEase
);
const leavingX =
lerp(
0,
exitX,
exitEase
);
image.style.transition =
"none";
image.style.transform =
`translate3d(
${
enteringX +
leavingX
}px,
0,
0
)`;
}
card.style.pointerEvents =
finalOpacity <=
0.05
? "none"
: "";
}
);
}
function requestProgramsRevealUpdate() {
if (
programsRevealTicking
) {
return;
}
programsRevealTicking =
true;
requestAnimationFrame(
updateProgramsReveal
);
}
if (
programsRevealSection &&
programsRevealCards.length
) {
removeOldProgramsCinematicStage();
applyProgramsNormalLayout();
programsRevealSection
.classList.add(
"visible"
);
programsRevealCards.forEach(
card => {
card.classList.add(
"visible"
);
}
);
window.addEventListener(
"scroll",
requestProgramsRevealUpdate,
{
passive: true
}
);
window.addEventListener(
"resize",
requestProgramsRevealUpdate
);
window.addEventListener(
"load",
requestProgramsRevealUpdate
);
requestProgramsRevealUpdate();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
requestProgramsRevealUpdate
);
}
}
const studioImages =
Array.from(
document.querySelectorAll(
".studio-seven-grid .studio-photo img"
)
);
const studioPopup =
document.getElementById(
"studioPopup"
);
const studioPopupImage =
document.getElementById(
"studioPopupImage"
);
const studioPopupClose =
document.getElementById(
"studioPopupClose"
);
const studioPopupPrev =
document.getElementById(
"studioPopupPrev"
);
const studioPopupNext =
document.getElementById(
"studioPopupNext"
);
const studioPopupCounter =
document.getElementById(
"studioPopupCounter"
);
let studioCurrentIndex =
0;
let studioTouchStartX =
0;
let studioTouchEndX =
0;
let studioAnimatedClone =
null;
let studioOriginImage =
null;
let studioIsAnimating =
false;
const wait =
milliseconds =>
new Promise(
resolve =>
setTimeout(
resolve,
milliseconds
)
);
function waitForImageReady(
image
) {
if (
!image ||
(
image.complete &&
image.naturalWidth >
0
)
) {
return Promise.resolve();
}
return new Promise(
resolve => {
const finish =
() =>
resolve();
image.addEventListener(
"load",
finish,
{
once: true
}
);
image.addEventListener(
"error",
finish,
{
once: true
}
);
}
);
}
function updateStudioPopup() {
if (
!studioPopupImage ||
!studioImages.length
) {
return;
}
const image =
studioImages[
studioCurrentIndex
];
studioPopupImage.src =
image.currentSrc ||
image.src;
studioPopupImage.alt =
image.alt ||
"CalisLanka studio photo";
studioOriginImage =
image;
if (
studioPopupCounter
) {
studioPopupCounter
.textContent =
`${
studioCurrentIndex +
1
} / ${
studioImages.length
}`;
}
}
function getStudioPopupTargetRect() {
if (
!studioPopupImage
) {
return null;
}
const width =
studioPopupImage
.offsetWidth;
const height =
studioPopupImage
.offsetHeight;
if (
width <= 0 ||
height <= 0
) {
return studioPopupImage
.getBoundingClientRect();
}
return {
left:
(
window.innerWidth -
width
) / 2,
top:
(
window.innerHeight -
height
) / 2,
width,
height
};
}
function removeStudioAnimatedClone() {
if (
!studioAnimatedClone
) {
return;
}
studioAnimatedClone
.remove();
studioAnimatedClone =
null;
}
async function animateStudioImageToPopup(
originalImage
) {
if (
!originalImage ||
!studioPopupImage
) {
return;
}
if (
prefersReducedMotion
) {
studioPopupImage
.style.opacity =
"1";
return;
}
removeStudioAnimatedClone();
const startRect =
originalImage
.getBoundingClientRect();
const endRect =
getStudioPopupTargetRect();
if (
!endRect ||
endRect.width <=
0 ||
endRect.height <=
0
) {
studioPopupImage
.style.opacity =
"1";
return;
}
const clone =
originalImage
.cloneNode(
true
);
studioAnimatedClone =
clone;
Object.assign(
clone.style,
{
position:
"fixed",
left:
`${startRect.left}px`,
top:
`${startRect.top}px`,
width:
`${startRect.width}px`,
height:
`${startRect.height}px`,
margin:
"0",
objectFit:
"cover",
objectPosition:
"center",
borderRadius:
"17px",
zIndex:
"10001",
pointerEvents:
"none",
boxShadow:
"0 18px 55px rgba(0,0,0,.28)",
willChange:
"left, top, width, height, border-radius"
}
);
document.body.appendChild(
clone
);
studioPopupImage
.style.opacity =
"0";
clone.getBoundingClientRect();
clone.style.transition =
`
left .34s cubic-bezier(.22,1,.36,1),
top .34s cubic-bezier(.22,1,.36,1),
width .34s cubic-bezier(.22,1,.36,1),
height .34s cubic-bezier(.22,1,.36,1),
border-radius .34s cubic-bezier(.22,1,.36,1)
`;
requestAnimationFrame(
() => {
clone.style.left =
`${endRect.left}px`;
clone.style.top =
`${endRect.top}px`;
clone.style.width =
`${endRect.width}px`;
clone.style.height =
`${endRect.height}px`;
clone.style.borderRadius =
"16px";
}
);
await wait(
360
);
studioPopupImage
.style.opacity =
"1";
removeStudioAnimatedClone();
}
async function openStudioPopup(
index
) {
if (
!studioPopup ||
!studioPopupImage ||
!studioImages.length ||
studioIsAnimating
) {
return;
}
studioIsAnimating =
true;
studioCurrentIndex =
index;
studioOriginImage =
studioImages[
index
];
updateStudioPopup();
studioPopup.hidden =
false;
studioPopup.setAttribute(
"aria-hidden",
"false"
);
document.body.classList.add(
"studio-popup-open"
);
studioPopup.classList.remove(
"is-open"
);
studioPopupImage
.style.opacity =
"0";
await waitForImageReady(
studioPopupImage
);
void studioPopup.offsetWidth;
requestAnimationFrame(
() => {
studioPopup.classList.add(
"is-open"
);
}
);
await wait(
18
);
await animateStudioImageToPopup(
studioOriginImage
);
studioPopupImage
.style.opacity =
"1";
studioIsAnimating =
false;
}
async function animateStudioImageBack() {
if (
!studioOriginImage ||
!studioPopupImage
) {
return;
}
if (
prefersReducedMotion
) {
return;
}
removeStudioAnimatedClone();
const startRect =
studioPopupImage
.getBoundingClientRect();
const endRect =
studioOriginImage
.getBoundingClientRect();
if (
startRect.width <=
0 ||
endRect.width <=
0
) {
return;
}
const clone =
studioPopupImage
.cloneNode(
true
);
studioAnimatedClone =
clone;
Object.assign(
clone.style,
{
position:
"fixed",
left:
`${startRect.left}px`,
top:
`${startRect.top}px`,
width:
`${startRect.width}px`,
height:
`${startRect.height}px`,
margin:
"0",
objectFit:
"cover",
objectPosition:
"center",
borderRadius:
"16px",
zIndex:
"10001",
pointerEvents:
"none",
boxShadow:
"0 18px 55px rgba(0,0,0,.24)",
willChange:
"left, top, width, height, opacity, border-radius"
}
);
document.body.appendChild(
clone
);
studioPopupImage
.style.opacity =
"0";
clone.getBoundingClientRect();
clone.style.transition =
`
left .32s cubic-bezier(.22,1,.36,1),
top .32s cubic-bezier(.22,1,.36,1),
width .32s cubic-bezier(.22,1,.36,1),
height .32s cubic-bezier(.22,1,.36,1),
border-radius .32s cubic-bezier(.22,1,.36,1),
opacity .26s ease
`;
requestAnimationFrame(
() => {
clone.style.left =
`${endRect.left}px`;
clone.style.top =
`${endRect.top}px`;
clone.style.width =
`${endRect.width}px`;
clone.style.height =
`${endRect.height}px`;
clone.style.borderRadius =
"17px";
clone.style.opacity =
"0.28";
}
);
await wait(
340
);
removeStudioAnimatedClone();
}
function finishStudioClose() {
if (
!studioPopup
) {
return;
}
studioPopup.hidden =
true;
studioPopup.classList.remove(
"is-open"
);
if (
studioPopupImage
) {
studioPopupImage.src =
"";
studioPopupImage
.style.opacity =
"";
studioPopupImage
.style.transform =
"";
studioPopupImage
.style.transition =
"";
}
document.body.classList.remove(
"studio-popup-open"
);
studioOriginImage =
null;
studioIsAnimating =
false;
removeStudioAnimatedClone();
}
async function closeStudioPopup() {
if (
!studioPopup ||
studioPopup.hidden ||
studioIsAnimating
) {
return;
}
studioIsAnimating =
true;
studioOriginImage =
studioImages[
studioCurrentIndex
];
studioPopup.setAttribute(
"aria-hidden",
"true"
);
const returnAnimation =
animateStudioImageBack();
requestAnimationFrame(
() => {
studioPopup.classList.remove(
"is-open"
);
}
);
await returnAnimation;
finishStudioClose();
}
async function changeStudioImage(
nextIndex
) {
if (
!studioPopupImage ||
studioIsAnimating
) {
return;
}
studioIsAnimating =
true;
if (
!prefersReducedMotion
) {
studioPopupImage
.style.transition =
"opacity .12s ease, transform .12s cubic-bezier(.22,1,.36,1)";
studioPopupImage
.style.opacity =
"0";
studioPopupImage
.style.transform =
"scale(.99)";
await wait(
120
);
}
studioCurrentIndex =
nextIndex;
updateStudioPopup();
await waitForImageReady(
studioPopupImage
);
studioOriginImage =
studioImages[
studioCurrentIndex
];
if (
!prefersReducedMotion
) {
requestAnimationFrame(
() => {
studioPopupImage
.style.opacity =
"1";
studioPopupImage
.style.transform =
"scale(1)";
}
);
await wait(
130
);
} else {
studioPopupImage
.style.opacity =
"1";
}
studioPopupImage
.style.transition =
"";
studioPopupImage
.style.transform =
"";
studioIsAnimating =
false;
}
function showNextStudioImage() {
if (
!studioImages.length ||
studioIsAnimating
) {
return;
}
changeStudioImage(
(
studioCurrentIndex +
1
) %
studioImages.length
);
}
function showPreviousStudioImage() {
if (
!studioImages.length ||
studioIsAnimating
) {
return;
}
changeStudioImage(
(
studioCurrentIndex -
1 +
studioImages.length
) %
studioImages.length
);
}
studioImages.forEach(
(
image,
index
) => {
image.addEventListener(
"click",
() => {
openStudioPopup(
index
);
}
);
}
);
studioPopupClose
?.addEventListener(
"click",
event => {
event.stopPropagation();
closeStudioPopup();
}
);
studioPopupPrev
?.addEventListener(
"click",
event => {
event.stopPropagation();
showPreviousStudioImage();
}
);
studioPopupNext
?.addEventListener(
"click",
event => {
event.stopPropagation();
showNextStudioImage();
}
);
studioPopup
?.addEventListener(
"click",
event => {
if (
event.target ===
studioPopup
) {
closeStudioPopup();
}
}
);
document.addEventListener(
"keydown",
event => {
if (
!studioPopup ||
studioPopup.hidden
) {
return;
}
if (
event.key ===
"Escape"
) {
closeStudioPopup();
}
if (
event.key ===
"ArrowRight"
) {
showNextStudioImage();
}
if (
event.key ===
"ArrowLeft"
) {
showPreviousStudioImage();
}
}
);
studioPopup
?.addEventListener(
"touchstart",
event => {
studioTouchStartX =
event
.changedTouches[0]
.clientX;
},
{
passive: true
}
);
studioPopup
?.addEventListener(
"touchend",
event => {
studioTouchEndX =
event
.changedTouches[0]
.clientX;
const difference =
studioTouchEndX -
studioTouchStartX;
if (
difference <
-50
) {
showNextStudioImage();
}
if (
difference >
50
) {
showPreviousStudioImage();
}
},
{
passive: true
}
);
function initFinalStatsCounter() {
const statsSection =
document.querySelector(
"#home .pdf-stats"
);
if (
!statsSection
) {
return;
}
const statItems =
Array.from(
statsSection
.querySelectorAll(
".pdf-stat"
)
);
if (
!statItems.length
) {
return;
}
const statData =
[
{
value:
250,
suffix:
"+"
},
{
value:
20,
suffix:
"+"
},
{
value:
98,
suffix:
"%"
},
{
value:
8,
suffix:
"+"
}
];
let animationStarted =
false;
statItems.forEach(
(
item,
index
) => {
const number =
item.querySelector(
"strong"
);
const label =
item.querySelector(
"span"
);
const data =
statData[
index
];
if (
!number ||
!data
) {
return;
}
number.textContent =
`0${data.suffix}`;
number.style.opacity =
"0";
number.style.transform =
"translate3d(0,24px,0)";
number.style.filter =
"blur(4px)";
number.style.transition =
`
opacity .65s cubic-bezier(.22,1,.36,1),
transform .75s cubic-bezier(.22,1,.36,1),
filter .65s ease
`;
if (
label
) {
label.style.opacity =
"0";
label.style.transform =
"translate3d(0,12px,0)";
label.style.transition =
`
opacity .65s cubic-bezier(.22,1,.36,1),
transform .75s cubic-bezier(.22,1,.36,1)
`;
}
}
);
function animateStat(
item,
index
) {
const number =
item.querySelector(
"strong"
);
const label =
item.querySelector(
"span"
);
const data =
statData[
index
];
if (
!number ||
!data
) {
return;
}
const target =
data.value;
const suffix =
data.suffix;
const delay =
index *
140;
const duration =
target >=
100
? 1500
: 1250;
let startTime =
null;
let revealStarted =
false;
function update(
timestamp
) {
if (
startTime ===
null
) {
startTime =
timestamp;
}
const elapsed =
timestamp -
startTime;
if (
elapsed <
delay
) {
requestAnimationFrame(
update
);
return;
}
if (
!revealStarted
) {
revealStarted =
true;
number.style.opacity =
"1";
number.style.transform =
"translate3d(0,0,0)";
number.style.filter =
"blur(0)";
number.classList.add(
"stat-count-visible"
);
if (
label
) {
label.style.opacity =
"1";
label.style.transform =
"translate3d(0,0,0)";
}
item.classList.add(
"stat-visible"
);
}
const progress =
Math.min(
(
elapsed -
delay
) /
duration,
1
);
const eased =
1 -
Math.pow(
1 -
progress,
4
);
const currentValue =
Math.round(
target *
eased
);
number.textContent =
`${currentValue}${suffix}`;
if (
progress <
1
) {
requestAnimationFrame(
update
);
} else {
number.textContent =
`${target}${suffix}`;
}
}
requestAnimationFrame(
update
);
}
function startStats() {
if (
animationStarted
) {
return;
}
animationStarted =
true;
statItems.forEach(
(
item,
index
) => {
animateStat(
item,
index
);
}
);
}
if (
prefersReducedMotion
) {
statItems.forEach(
(
item,
index
) => {
const number =
item.querySelector(
"strong"
);
const label =
item.querySelector(
"span"
);
const data =
statData[
index
];
if (
number &&
data
) {
number.textContent =
`${data.value}${data.suffix}`;
number.style.opacity =
"1";
number.style.transform =
"none";
number.style.filter =
"none";
number.classList.add(
"stat-count-visible"
);
}
if (
label
) {
label.style.opacity =
"1";
label.style.transform =
"none";
}
item.classList.add(
"stat-visible"
);
}
);
return;
}
if (
"IntersectionObserver" in
window
) {
const statsObserver =
new IntersectionObserver(
entries => {
entries.forEach(
entry => {
if (
!entry.isIntersecting
) {
return;
}
startStats();
statsObserver.disconnect();
}
);
},
{
threshold:
0.20,
rootMargin:
"0px 0px -5% 0px"
}
);
statsObserver.observe(
statsSection
);
} else {
startStats();
}
}
if (
document.readyState ===
"loading"
) {
document.addEventListener(
"DOMContentLoaded",
initFinalStatsCounter
);
} else {
initFinalStatsCounter();
}
const homeCtaScrollSection =
document.querySelector(
"#home .pdf-cta-wrap"
) ||
document.querySelector(
".pdf-cta-wrap"
);
const homeCtaScrollCard =
homeCtaScrollSection
? homeCtaScrollSection
.querySelector(
".pdf-cta-card"
)
: null;
let homeCtaScrollTicking =
false;
function resetHomeCtaScroll() {
if (
!homeCtaScrollSection ||
!homeCtaScrollCard
) {
return;
}
homeCtaScrollSection
.classList.add(
"visible"
);
homeCtaScrollSection
.style.opacity =
"";
homeCtaScrollSection
.style.transform =
"";
homeCtaScrollSection
.style.filter =
"";
homeCtaScrollSection
.style.transition =
"";
homeCtaScrollCard
.style.opacity =
"";
homeCtaScrollCard
.style.transform =
"";
homeCtaScrollCard
.style.filter =
"";
homeCtaScrollCard
.style.transition =
"";
}
function updateHomeCtaScroll() {
homeCtaScrollTicking =
false;
if (
!homeCtaScrollSection ||
!homeCtaScrollCard
) {
return;
}
if (
prefersReducedMotion
) {
resetHomeCtaScroll();
return;
}
homeCtaScrollSection
.classList.add(
"visible"
);
homeCtaScrollSection
.style.opacity =
"1";
homeCtaScrollSection
.style.transform =
"none";
homeCtaScrollSection
.style.filter =
"none";
homeCtaScrollSection
.style.transition =
"none";
const viewportHeight =
window.innerHeight;
const rect =
homeCtaScrollSection
.getBoundingClientRect();
const fadeStart =
viewportHeight *
0.94;
const fadeEnd =
viewportHeight *
0.38;
const fadeProgress =
clamp01(
(
fadeStart -
rect.top
) /
Math.max(
fadeStart -
fadeEnd,
1
)
);
const fadeEase =
easeInOutCubic(
fadeProgress
);
homeCtaScrollCard
.style.transition =
"none";
homeCtaScrollCard
.style.opacity =
lerp(
0,
1,
fadeEase
);
homeCtaScrollCard
.style.transform =
"none";
homeCtaScrollCard
.style.filter =
"none";
}
function requestHomeCtaScrollUpdate() {
if (
homeCtaScrollTicking
) {
return;
}
homeCtaScrollTicking =
true;
requestAnimationFrame(
updateHomeCtaScroll
);
}
if (
homeCtaScrollSection &&
homeCtaScrollCard
) {
homeCtaScrollSection
.classList.add(
"visible"
);
window.addEventListener(
"scroll",
requestHomeCtaScrollUpdate,
{
passive: true
}
);
window.addEventListener(
"resize",
requestHomeCtaScrollUpdate
);
window.addEventListener(
"load",
requestHomeCtaScrollUpdate
);
requestHomeCtaScrollUpdate();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
requestHomeCtaScrollUpdate
);
}
}
function secondaryMotionDesktopEnabled() {
return (
window.matchMedia(
"(min-width:1051px)"
).matches &&
!prefersReducedMotion
);
}
function secondaryTopProgress(
element,
startRatio = 0.94,
endRatio = 0.38
) {
if (!element) {
return 1;
}
const rect =
element.getBoundingClientRect();
const viewportHeight =
window.innerHeight;
const start =
viewportHeight *
startRatio;
const end =
viewportHeight *
endRatio;
return clamp01(
(
start -
rect.top
) /
Math.max(
start -
end,
1
)
);
}
function secondarySectionProgress(
element,
enterRatio = 0.92,
leaveRatio = 0.18
) {
if (!element) {
return 1;
}
const rect =
element.getBoundingClientRect();
const viewportHeight =
window.innerHeight;
const start =
viewportHeight *
enterRatio;
const travel =
start +
rect.height -
viewportHeight *
leaveRatio;
return clamp01(
(
start -
rect.top
) /
Math.max(
travel,
1
)
);
}
function secondaryExitProgress(
element,
startRatio = 0.20,
endRatio = -0.08
) {
if (!element) {
return 0;
}
const rect =
element.getBoundingClientRect();
const viewportHeight =
window.innerHeight;
const start =
viewportHeight *
startRatio;
const end =
viewportHeight *
endRatio;
return clamp01(
(
start -
rect.bottom
) /
Math.max(
start -
end,
1
)
);
}
function secondaryMarkManaged(
element,
className
) {
if (!element) {
return;
}
element.classList.add(
className,
"visible"
);
}
const blogMotionRoot =
document.querySelector(
"#blog"
);
const blogHero =
blogMotionRoot
?.querySelector(
".pdf-blog-hero"
) ||
null;
const blogHeroKicker =
blogHero
?.querySelector(
".kicker, .eyebrow"
) ||
null;
const blogHeroTitle =
blogHero
?.querySelector(
"h1"
) ||
null;
const blogHeroText =
blogHero
?.querySelector(
"p"
) ||
null;
const blogAboutSection =
blogMotionRoot
?.querySelector(
".pdf-about-section"
) ||
null;
const blogAboutHeading =
blogAboutSection
?.querySelector(
".pdf-about-heading, .section-title"
) ||
null;
const blogStoryGrid =
blogAboutSection
?.querySelector(
".pdf-story-grid"
) ||
null;
const blogStoryPhoto =
blogAboutSection
?.querySelector(
".pdf-story-photo"
) ||
null;
const blogStoryCopy =
blogAboutSection
?.querySelector(
".pdf-story-copy"
) ||
null;
const blogStoryHighlight =
blogAboutSection
?.querySelector(
".pdf-story-highlight"
) ||
null;
const blogJourneyRow =
blogMotionRoot
?.querySelector(
".pdf-journey-photo-row"
) ||
null;
const blogJourneyFigures =
blogJourneyRow
? Array.from(
blogJourneyRow
.querySelectorAll(
"figure"
)
)
: [];
const blogCoachSection =
blogMotionRoot
?.querySelector(
".pdf-coach-section"
) ||
null;
const blogCoachHeading =
blogCoachSection
?.querySelector(
".section-title"
) ||
null;
const blogCoachPhoto =
blogCoachSection
?.querySelector(
".pdf-coach-photo"
) ||
null;
const blogCoachCopy =
blogCoachSection
?.querySelector(
".pdf-coach-copy"
) ||
null;
const blogQualifications =
blogCoachSection
? Array.from(
blogCoachSection
.querySelectorAll(
".pdf-qualification"
)
)
: [];
const blogAchievementsSection =
blogMotionRoot
?.querySelector(
".pdf-achievements-section"
) ||
null;
const blogAchievementsHeading =
blogAchievementsSection
?.querySelector(
".section-title"
) ||
null;
const blogAchievementCards =
blogAchievementsSection
? Array.from(
blogAchievementsSection
.querySelectorAll(
".pdf-achievement-card"
)
)
: [];
const blogMomentsSection =
blogMotionRoot
?.querySelector(
".pdf-moments-section"
) ||
null;
const blogMomentsHeading =
blogMomentsSection
?.querySelector(
".section-title"
) ||
null;
const blogMomentsGrid =
blogMomentsSection
?.querySelector(
".pdf-moments-grid"
) ||
null;
const blogMomentFigures =
blogMomentsSection
? Array.from(
blogMomentsSection
.querySelectorAll(
".pdf-moments-grid figure"
)
)
: [];
const blogVideoSection =
blogMotionRoot
?.querySelector(
".pdf-video-section"
) ||
null;
const blogFeaturedVideo =
blogVideoSection
?.querySelector(
".pdf-featured-video"
) ||
null;
const blogFeaturedCaption =
blogFeaturedVideo
?.querySelector(
".pdf-featured-caption"
) ||
null;
const blogFeaturedPlay =
blogFeaturedVideo
?.querySelector(
".pdf-play"
) ||
null;
const blogVideoCards =
blogVideoSection
? Array.from(
blogVideoSection
.querySelectorAll(
".pdf-video-card"
)
)
: [];
const blogTimelineSection =
blogMotionRoot
?.querySelector(
".pdf-timeline-section"
) ||
null;
const blogTimelineHeading =
blogTimelineSection
?.querySelector(
".section-title"
) ||
null;
const blogTimeline =
blogTimelineSection
?.querySelector(
".pdf-timeline"
) ||
null;
const blogTimelineArticles =
blogTimeline
? Array.from(
blogTimeline
.querySelectorAll(
"article"
)
)
: [];
const blogCtaWrap =
blogMotionRoot
?.querySelector(
".pdf-blog-cta-wrap"
) ||
null;
const blogCta =
blogCtaWrap
?.querySelector(
".pdf-blog-cta"
) ||
null;
function initBlogAchievementsEntrance() {
if (
!blogAchievementsSection
) {
return;
}
const achievementItems =
[
blogAchievementsHeading,
...blogAchievementCards
]
.filter(
Boolean
);
if (
!achievementItems.length
) {
return;
}
blogAchievementsSection
.classList.add(
"achievement-enter-ready"
);
achievementItems.forEach(
(
item,
index
) => {
item.classList.add(
"achievement-enter-item",
"visible"
);
item.style.setProperty(
"--achievement-delay",
`${
Math.max(
0,
index - 1
) *
120
}ms`
);
}
);
let hasEntered =
false;
function revealAchievements() {
if (
hasEntered
) {
return;
}
hasEntered =
true;
achievementItems.forEach(
item => {
item.classList.add(
"achievement-entered"
);
}
);
}
if (
prefersReducedMotion
) {
revealAchievements();
return;
}
const rect =
blogAchievementsSection
.getBoundingClientRect();
if (
rect.top <
window.innerHeight *
0.86 &&
rect.bottom >
0
) {
revealAchievements();
return;
}
if (
"IntersectionObserver" in
window
) {
const achievementObserver =
new IntersectionObserver(
entries => {
entries.forEach(
entry => {
if (
!entry.isIntersecting
) {
return;
}
revealAchievements();
achievementObserver
.disconnect();
}
);
},
{
threshold:
0.18,
rootMargin:
"0px 0px -8% 0px"
}
);
achievementObserver.observe(
blogAchievementsSection
);
} else {
revealAchievements();
}
}
function initBlogTimelineAutoAnimation() {
if (
!blogTimelineSection ||
!blogTimeline
) {
return;
}
blogTimelineSection
.classList.add(
"timeline-auto-ready"
);
if (
blogTimelineHeading
) {
blogTimelineHeading
.classList.add(
"timeline-heading-auto",
"visible"
);
}
blogTimelineArticles.forEach(
(
article,
index
) => {
article.classList.add(
"visible"
);
article.style.setProperty(
"--timeline-delay",
`${
120 +
index *
800
}ms`
);
}
);
let timelineStarted =
false;
function startTimeline() {
if (
timelineStarted
) {
return;
}
timelineStarted =
true;
blogTimelineSection
.classList.add(
"timeline-auto-active"
);
}
if (
prefersReducedMotion
) {
startTimeline();
return;
}
const rect =
blogTimelineSection
.getBoundingClientRect();
if (
rect.top <
window.innerHeight *
0.82 &&
rect.bottom >
0
) {
startTimeline();
return;
}
if (
"IntersectionObserver" in
window
) {
const timelineObserver =
new IntersectionObserver(
entries => {
entries.forEach(
entry => {
if (
!entry.isIntersecting
) {
return;
}
startTimeline();
timelineObserver
.disconnect();
}
);
},
{
threshold:
0.24,
rootMargin:
"0px 0px -8% 0px"
}
);
timelineObserver.observe(
blogTimelineSection
);
} else {
startTimeline();
}
}
function prepareBlogScrollMotion() {
if (
!blogMotionRoot
) {
return;
}
blogMotionRoot
.classList.add(
"blog-scroll-ready"
);
[
blogHeroKicker,
blogHeroTitle,
blogHeroText,
blogAboutHeading,
blogStoryPhoto,
blogStoryCopy,
blogStoryHighlight,
...blogJourneyFigures,
blogCoachHeading,
blogCoachPhoto,
blogCoachCopy,
...blogQualifications,
blogMomentsHeading,
...blogMomentFigures,
blogFeaturedVideo,
...blogVideoCards,
blogCta
]
.filter(
Boolean
)
.forEach(
element => {
secondaryMarkManaged(
element,
"blog-scroll-item"
);
}
);
initBlogAchievementsEntrance();
initBlogTimelineAutoAnimation();
}
function resetBlogScrollMotion() {
if (
!blogMotionRoot
) {
return;
}
const clearElement =
element => {
if (!element) {
return;
}
element.style.opacity =
"";
element.style.transform =
"";
element.style.filter =
"";
element.style.clipPath =
"";
element.style.pointerEvents =
"";
element.style.transition =
"";
};
[
blogHeroKicker,
blogHeroTitle,
blogHeroText,
blogAboutHeading,
blogStoryPhoto,
blogStoryCopy,
blogStoryHighlight,
...blogJourneyFigures,
blogCoachHeading,
blogCoachPhoto,
blogCoachCopy,
...blogQualifications,
blogMomentsHeading,
...blogMomentFigures,
blogFeaturedVideo,
blogFeaturedCaption,
blogFeaturedPlay,
...blogVideoCards,
blogCta
]
.filter(
Boolean
)
.forEach(
clearElement
);
blogHero
?.style.removeProperty(
"--blog-hero-glow-opacity"
);
blogHero
?.style.removeProperty(
"--blog-hero-glow-y"
);
blogStoryPhoto
?.style.removeProperty(
"--story-image-y"
);
blogStoryHighlight
?.style.removeProperty(
"--story-highlight-progress"
);
blogJourneyFigures.forEach(
figure => {
figure.style.removeProperty(
"--journey-image-y"
);
}
);
blogCoachPhoto
?.style.removeProperty(
"--coach-image-y"
);
blogQualifications.forEach(
qualification => {
qualification.style.removeProperty(
"--qualification-line-progress"
);
}
);
blogMomentFigures.forEach(
figure => {
figure.style.removeProperty(
"--moment-image-y"
);
}
);
blogFeaturedVideo
?.style.removeProperty(
"--featured-video-image-y"
);
}
function updateBlogHeroMotion() {
if (
!blogHero
) {
return;
}
const heroRect =
blogHero
.getBoundingClientRect();
const heroDistance =
Math.max(
heroRect.height *
0.78,
1
);
const rawExit =
clamp01(
-heroRect.top /
heroDistance
);
const heroExit =
easeInOutCubic(
rawExit
);
if (
blogHeroKicker
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.02,
0.56
)
);
blogHeroKicker.style.opacity =
lerp(
1,
0,
progress
);
blogHeroKicker.style.clipPath =
`inset(
0
0
${lerp(
0,
100,
progress
)}%
0
)`;
blogHeroKicker.style.transform =
"none";
blogHeroKicker.style.filter =
"none";
}
if (
blogHeroTitle
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.10,
0.88
)
);
blogHeroTitle.style.opacity =
lerp(
1,
0,
progress
);
blogHeroTitle.style.clipPath =
`inset(
0
0
${lerp(
0,
100,
progress
)}%
0
)`;
blogHeroTitle.style.transform =
"none";
blogHeroTitle.style.filter =
"none";
}
if (
blogHeroText
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.18,
0.72
)
);
blogHeroText.style.opacity =
lerp(
1,
0,
progress
);
blogHeroText.style.transform =
"none";
blogHeroText.style.filter =
"none";
}
blogHero.style.setProperty(
"--blog-hero-glow-opacity",
lerp(
0.48,
0.08,
heroExit
)
);
blogHero.style.setProperty(
"--blog-hero-glow-y",
`${
lerp(
0,
64,
heroExit
)
}px`
);
}
function updateBlogStoryMotion() {
if (
!blogAboutSection
) {
return;
}
const storyExitBase =
easeInOutCubic(
secondaryExitProgress(
blogStoryGrid ||
blogStoryPhoto,
0.74,
0.18
)
);
const headingProgress =
easeInOutCubic(
secondaryTopProgress(
blogAboutHeading,
0.96,
0.56
)
);
const headingExit =
easeInOutCubic(
rangeProgress(
storyExitBase,
0.00,
0.66
)
);
if (
blogAboutHeading
) {
blogAboutHeading.style.opacity =
headingProgress *
(
1 -
headingExit
);
blogAboutHeading.style.transform =
`translate3d(
0,
${
lerp(
0,
-28,
headingExit
)
}px,
0
)`;
blogAboutHeading.style.filter =
"none";
}
const photoProgress =
easeInOutCubic(
secondaryTopProgress(
blogStoryPhoto,
0.94,
0.36
)
);
const photoExit =
easeInOutCubic(
rangeProgress(
storyExitBase,
0.04,
0.92
)
);
if (
blogStoryPhoto
) {
const entryOpacity =
lerp(
0.10,
1,
photoProgress
);
blogStoryPhoto.style.opacity =
entryOpacity *
(
1 -
photoExit
);
blogStoryPhoto.style.clipPath =
`inset(
${
lerp(
0,
13,
photoExit
)
}%
0
${
lerp(
18,
0,
photoProgress
)
}%
0
round 17px
)`;
blogStoryPhoto.style.transform =
`translate3d(
0,
${
lerp(
0,
-34,
photoExit
)
}px,
0
)`;
blogStoryPhoto.style.filter =
"none";
}
const copyProgress =
easeInOutCubic(
secondaryTopProgress(
blogStoryCopy,
0.88,
0.38
)
);
const copyExit =
easeInOutCubic(
rangeProgress(
storyExitBase,
0.10,
0.82
)
);
if (
blogStoryCopy
) {
blogStoryCopy.style.opacity =
copyProgress *
(
1 -
copyExit
);
blogStoryCopy.style.transform =
`translate3d(
0,
${
lerp(
0,
-24,
copyExit
)
}px,
0
)`;
blogStoryCopy.style.filter =
"none";
}
if (
blogStoryHighlight
) {
const highlightProgress =
easeInOutCubic(
rangeProgress(
copyProgress,
0.32,
0.94
)
);
blogStoryHighlight.style.opacity =
lerp(
0.20,
1,
highlightProgress
) *
(
1 -
copyExit
);
blogStoryHighlight.style.setProperty(
"--story-highlight-progress",
highlightProgress *
(
1 -
copyExit
)
);
}
const sectionProgress =
secondarySectionProgress(
blogStoryGrid ||
blogAboutSection,
0.94,
0.14
);
blogStoryPhoto
?.style.setProperty(
"--story-image-y",
`${
lerp(
23,
-23,
sectionProgress
)
}px`
);
}
function updateBlogJourneyMotion() {
if (
!blogJourneyRow ||
!blogJourneyFigures.length
) {
return;
}
const base =
secondaryTopProgress(
blogJourneyRow,
0.96,
0.28
);
const scene =
secondarySectionProgress(
blogJourneyRow,
0.96,
0.10
);
const exitBase =
secondaryExitProgress(
blogJourneyRow,
0.76,
0.18
);
const directions =
[
-1,
0,
1
];
blogJourneyFigures.forEach(
(
figure,
index
) => {
const start =
index *
0.10;
const end =
Math.min(
start +
0.58,
1
);
const enterProgress =
easeInOutCubic(
rangeProgress(
base,
start,
end
)
);
const exitStart =
index *
0.08;
const exitEnd =
Math.min(
exitStart +
0.58,
1
);
const exitProgress =
easeInOutCubic(
rangeProgress(
exitBase,
exitStart,
exitEnd
)
);
const direction =
directions[
index %
directions.length
];
const entryX =
lerp(
direction *
48,
0,
enterProgress
);
const entryY =
lerp(
34,
0,
enterProgress
);
const exitX =
lerp(
0,
direction *
22,
exitProgress
);
const exitY =
lerp(
0,
-38,
exitProgress
);
figure.style.opacity =
lerp(
0.08,
1,
enterProgress
) *
(
1 -
exitProgress
);
figure.style.transform =
`translate3d(
${
entryX +
exitX
}px,
${
entryY +
exitY
}px,
0
)`;
figure.style.clipPath =
`inset(
${
lerp(
0,
15,
exitProgress
)
}%
0
${
lerp(
17,
0,
enterProgress
)
}%
0
round 16px
)`;
figure.style.filter =
"none";
figure.style.setProperty(
"--journey-image-y",
`${
lerp(
14,
-14,
scene
)
}px`
);
}
);
}
function updateBlogCoachMotion() {
if (
!blogCoachSection
) {
return;
}
const coachExitBase =
secondaryExitProgress(
blogCoachSection,
0.74,
0.18
);
const headingProgress =
easeInOutCubic(
secondaryTopProgress(
blogCoachHeading,
0.96,
0.60
)
);
const headingExit =
easeInOutCubic(
rangeProgress(
coachExitBase,
0.00,
0.60
)
);
if (
blogCoachHeading
) {
blogCoachHeading.style.opacity =
headingProgress *
(
1 -
headingExit
);
blogCoachHeading.style.transform =
`translate3d(
0,
${
lerp(
0,
-28,
headingExit
)
}px,
0
)`;
blogCoachHeading.style.filter =
"none";
}
const photoProgress =
easeInOutCubic(
secondaryTopProgress(
blogCoachPhoto,
0.94,
0.34
)
);
const photoExit =
easeInOutCubic(
rangeProgress(
coachExitBase,
0.05,
0.88
)
);
if (
blogCoachPhoto
) {
blogCoachPhoto.style.opacity =
lerp(
0.08,
1,
photoProgress
) *
(
1 -
photoExit
);
blogCoachPhoto.style.clipPath =
`inset(
${
lerp(
0,
13,
photoExit
)
}%
0
${
lerp(
16,
0,
photoProgress
)
}%
0
round 17px
)`;
blogCoachPhoto.style.transform =
`translate3d(
0,
${
lerp(
0,
-32,
photoExit
)
}px,
0
)`;
blogCoachPhoto.style.filter =
"none";
}
const copyProgress =
easeInOutCubic(
secondaryTopProgress(
blogCoachCopy,
0.88,
0.36
)
);
const copyExit =
easeInOutCubic(
rangeProgress(
coachExitBase,
0.10,
0.82
)
);
if (
blogCoachCopy
) {
blogCoachCopy.style.opacity =
copyProgress *
(
1 -
copyExit
);
blogCoachCopy.style.transform =
`translate3d(
0,
${
lerp(
0,
-24,
copyExit
)
}px,
0
)`;
blogCoachCopy.style.filter =
"none";
}
const coachScene =
secondarySectionProgress(
blogCoachSection,
0.94,
0.12
);
blogCoachPhoto
?.style.setProperty(
"--coach-image-y",
`${
lerp(
24,
-24,
coachScene
)
}px`
);
if (
blogQualifications.length
) {
const qualificationList =
blogQualifications[0]
.parentElement;
const base =
secondaryTopProgress(
qualificationList,
0.90,
0.26
);
blogQualifications.forEach(
(
qualification,
index
) => {
const start =
index *
0.11;
const end =
Math.min(
start +
0.52,
1
);
const enterProgress =
easeInOutCubic(
rangeProgress(
base,
start,
end
)
);
const exitStart =
index *
0.055;
const exitEnd =
Math.min(
exitStart +
0.58,
1
);
const exitProgress =
easeInOutCubic(
rangeProgress(
coachExitBase,
exitStart,
exitEnd
)
);
qualification.style.opacity =
lerp(
0.16,
1,
enterProgress
) *
(
1 -
exitProgress
);
qualification.style.transform =
`translate3d(
0,
${
lerp(
0,
-14,
exitProgress
)
}px,
0
)`;
qualification.style.filter =
"none";
qualification.style.setProperty(
"--qualification-line-progress",
enterProgress *
(
1 -
exitProgress
)
);
}
);
}
}
function updateBlogMomentsMotion() {
if (
!blogMomentsSection ||
!blogMomentsGrid
) {
return;
}
const base =
secondaryTopProgress(
blogMomentsGrid,
0.54,
0.12
);
const scene =
secondarySectionProgress(
blogMomentsGrid,
0.70,
0.12
);
const exitBase =
secondaryExitProgress(
blogMomentsGrid,
0.50,
0.04
);
const headingProgress =
easeInOutCubic(
secondaryTopProgress(
blogMomentsHeading,
0.90,
0.54
)
);
const headingExit =
easeInOutCubic(
rangeProgress(
exitBase,
0.00,
0.55
)
);
if (
blogMomentsHeading
) {
blogMomentsHeading.style.opacity =
headingProgress *
(
1 -
headingExit
);
blogMomentsHeading.style.transform =
`translate3d(
0,
${
lerp(
0,
-24,
headingExit
)
}px,
0
)`;
blogMomentsHeading.style.filter =
"none";
}
const gridRect =
blogMomentsGrid
.getBoundingClientRect();
const screenCenterX =
window.innerWidth *
0.50;
const screenCenterY =
window.innerHeight *
0.52;
blogMomentFigures.forEach(
(
figure,
index
) => {
const enterStart =
index *
0.10;
const enterEnd =
Math.min(
enterStart +
0.24,
0.92
);
const enterProgress =
easeInOutCubic(
rangeProgress(
base,
enterStart,
enterEnd
)
);
const exitStart =
index *
0.055;
const exitEnd =
Math.min(
exitStart +
0.36,
0.92
);
const exitProgress =
easeInOutCubic(
rangeProgress(
exitBase,
exitStart,
exitEnd
)
);
const finalCenterX =
gridRect.left +
figure.offsetLeft +
figure.offsetWidth /
2;
const finalCenterY =
gridRect.top +
figure.offsetTop +
figure.offsetHeight /
2;
const towardCenterX =
(
screenCenterX -
finalCenterX
) *
0.82;
const towardCenterY =
(
screenCenterY -
finalCenterY
) *
0.82;
const enterX =
lerp(
towardCenterX,
0,
enterProgress
);
const enterY =
lerp(
towardCenterY,
0,
enterProgress
);
const enterZ =
lerp(
-860,
0,
enterProgress
);
const exitX =
lerp(
0,
towardCenterX *
0.34,
exitProgress
);
const exitY =
lerp(
0,
towardCenterY *
0.28,
exitProgress
);
const exitZ =
lerp(
0,
-430,
exitProgress
);
const enterScale =
lerp(
0.54,
1,
enterProgress
);
const exitScale =
lerp(
1,
0.78,
exitProgress
);
figure.style.opacity =
enterProgress *
(
1 -
exitProgress
);
figure.style.transform =
`translate3d(
${
enterX +
exitX
}px,
${
enterY +
exitY
}px,
${
enterZ +
exitZ
}px
)
scale(
${
enterScale *
exitScale
}
)`;
figure.style.clipPath =
"none";
figure.style.filter =
"none";
figure.style.setProperty(
"--moment-image-y",
`${
lerp(
10,
-10,
scene
)
}px`
);
}
);
}
function updateBlogVideoMotion() {
if (
!blogVideoSection ||
!blogFeaturedVideo
) {
return;
}
const base =
secondaryTopProgress(
blogFeaturedVideo,
0.66,
0.27
);
const exitBase =
secondaryExitProgress(
blogVideoSection,
0.46,
0.04
);
const featuredProgress =
easeInOutCubic(
rangeProgress(
base,
0.00,
0.66
)
);
const featuredExit =
easeInOutCubic(
rangeProgress(
exitBase,
0.04,
0.88
)
);
const sectionRect =
blogVideoSection
.getBoundingClientRect();
const screenCenterX =
window.innerWidth *
0.50;
const screenCenterY =
window.innerHeight *
0.52;
const finalVideoCenterX =
sectionRect.left +
blogFeaturedVideo.offsetLeft +
blogFeaturedVideo.offsetWidth /
2;
const finalVideoCenterY =
sectionRect.top +
blogFeaturedVideo.offsetTop +
blogFeaturedVideo.offsetHeight /
2;
const towardCenterX =
(
screenCenterX -
finalVideoCenterX
) *
0.78;
const towardCenterY =
(
screenCenterY -
finalVideoCenterY
) *
0.78;
const enterX =
lerp(
towardCenterX,
0,
featuredProgress
);
const enterY =
lerp(
towardCenterY,
0,
featuredProgress
);
const enterZ =
lerp(
-760,
0,
featuredProgress
);
const leaveX =
lerp(
0,
towardCenterX *
0.20,
featuredExit
);
const leaveY =
lerp(
0,
-20,
featuredExit
);
const leaveZ =
lerp(
0,
-300,
featuredExit
);
const featuredScale =
lerp(
0.68,
1,
featuredProgress
) *
lerp(
1,
0.90,
featuredExit
);
blogFeaturedVideo.style.opacity =
featuredProgress *
(
1 -
featuredExit
);
blogFeaturedVideo.style.clipPath =
"none";
blogFeaturedVideo.style.transform =
`translate3d(
${
enterX +
leaveX
}px,
${
enterY +
leaveY
}px,
${
enterZ +
leaveZ
}px
)
scale(
${featuredScale}
)`;
blogFeaturedVideo.style.filter =
"none";
const scene =
secondarySectionProgress(
blogVideoSection,
0.72,
0.10
);
blogFeaturedVideo.style.setProperty(
"--featured-video-image-y",
`${
lerp(
10,
-10,
scene
)
}px`
);
const captionProgress =
easeInOutCubic(
rangeProgress(
featuredProgress,
0.52,
0.96
)
);
if (
blogFeaturedCaption
) {
blogFeaturedCaption.style.opacity =
captionProgress *
(
1 -
featuredExit
);
blogFeaturedCaption.style.transform =
"none";
blogFeaturedCaption.style.filter =
"none";
}
if (
blogFeaturedPlay
) {
blogFeaturedPlay.style.opacity =
captionProgress *
(
1 -
featuredExit
);
blogFeaturedPlay.style.transform =
"";
blogFeaturedPlay.style.filter =
"none";
}
blogVideoCards.forEach(
(
card,
index
) => {
const start =
0.28 +
index *
0.12;
const end =
Math.min(
start +
0.34,
0.96
);
const enterProgress =
easeInOutCubic(
rangeProgress(
base,
start,
end
)
);
const exitStart =
index *
0.07;
const exitEnd =
Math.min(
exitStart +
0.56,
1
);
const exitProgress =
easeInOutCubic(
rangeProgress(
exitBase,
exitStart,
exitEnd
)
);
card.style.opacity =
enterProgress *
(
1 -
exitProgress
);
card.style.transform =
`translate3d(
${
lerp(
72,
0,
enterProgress
) +
lerp(
0,
16,
exitProgress
)
}px,
${
lerp(
30,
0,
enterProgress
) +
lerp(
0,
-10,
exitProgress
)
}px,
${
lerp(
-300,
0,
enterProgress
) +
lerp(
0,
-150,
exitProgress
)
}px
)
scale(
${
lerp(
0.92,
1,
enterProgress
) *
lerp(
1,
0.96,
exitProgress
)
}
)`;
card.style.filter =
"none";
}
);
}
function updateBlogCtaMotion() {
if (
!blogCta
) {
return;
}
const progress =
easeInOutCubic(
secondaryTopProgress(
blogCtaWrap ||
blogCta,
0.94,
0.38
)
);
blogCta.style.opacity =
progress;
blogCta.style.transform =
"none";
blogCta.style.filter =
"none";
}
function updateBlogScrollMotion() {
if (
!blogMotionRoot
) {
return;
}
if (
!secondaryMotionDesktopEnabled()
) {
resetBlogScrollMotion();
return;
}
updateBlogHeroMotion();
updateBlogStoryMotion();
updateBlogJourneyMotion();
updateBlogCoachMotion();
updateBlogMomentsMotion();
updateBlogVideoMotion();
updateBlogCtaMotion();
}
const appointmentBookingSection =
document.querySelector(
".booking"
);
const appointmentMotionRoot =
appointmentBookingSection
? (
appointmentBookingSection
.closest(
"#appointment"
) ||
appointmentBookingSection
.closest(
".page"
) ||
appointmentBookingSection
.closest(
"main"
) ||
appointmentBookingSection
.parentElement
)
: null;
const appointmentHero =
appointmentMotionRoot
?.querySelector(
".inner-hero"
) ||
null;
const appointmentHeroKicker =
appointmentHero
?.querySelector(
".kicker, .eyebrow"
) ||
null;
const appointmentHeroTitle =
appointmentHero
?.querySelector(
"h1"
) ||
null;
const appointmentHeroText =
appointmentHero
?.querySelector(
"p"
) ||
null;
const appointmentBookingPanel =
appointmentBookingSection
?.querySelector(
".booking-panel"
) ||
null;
const appointmentForm =
appointmentBookingPanel
?.querySelector(
"form"
) ||
null;
const appointmentBookingSide =
appointmentBookingSection
?.querySelector(
".booking-side"
) ||
null;
const appointmentInfoCard =
appointmentBookingSide
?.querySelector(
".info-card"
) ||
null;
const appointmentInfoRows =
appointmentInfoCard
? Array.from(
appointmentInfoCard
.querySelectorAll(
".info-row"
)
)
: [];
let appointmentFieldGroups =
[];
function collectAppointmentFieldGroups() {
if (
!appointmentForm
) {
appointmentFieldGroups =
[];
return;
}
const groups =
[];
Array.from(
appointmentForm.children
)
.forEach(
child => {
if (
child.matches(
'input[type="hidden"]'
)
) {
return;
}
const containsControl =
child.matches(
"label, .field-grid, .form-errors, .submit, .form-note, button"
) ||
Boolean(
child.querySelector?.(
'input:not([type="hidden"]), select, textarea, button'
)
);
if (
containsControl
) {
groups.push(
child
);
}
}
);
appointmentFieldGroups =
groups;
}
function engageAppointmentForm() {
if (
!appointmentMotionRoot
) {
return;
}
appointmentMotionRoot
.classList.add(
"appointment-form-engaged"
);
appointmentFieldGroups.forEach(
group => {
group.style.opacity =
"1";
group.style.transform =
"none";
group.style.filter =
"none";
group.style.clipPath =
"none";
group.style.pointerEvents =
"auto";
}
);
if (
appointmentBookingPanel
) {
appointmentBookingPanel
.style.opacity =
"1";
appointmentBookingPanel
.style.clipPath =
"none";
}
}
function prepareAppointmentScrollMotion() {
if (
!appointmentMotionRoot ||
!appointmentBookingSection
) {
return;
}
appointmentMotionRoot
.classList.add(
"appointment-motion-page",
"appointment-scroll-ready"
);
collectAppointmentFieldGroups();
[
appointmentHeroKicker,
appointmentHeroTitle,
appointmentHeroText,
appointmentBookingPanel,
appointmentBookingSide,
appointmentInfoCard,
...appointmentInfoRows
]
.filter(
Boolean
)
.forEach(
element => {
secondaryMarkManaged(
element,
"appointment-scroll-item"
);
}
);
appointmentFieldGroups.forEach(
group => {
group.classList.add(
"appointment-field-sync",
"appointment-scroll-item",
"visible"
);
}
);
if (
appointmentForm
) {
appointmentForm
.addEventListener(
"focusin",
engageAppointmentForm
);
appointmentForm
.addEventListener(
"input",
engageAppointmentForm
);
appointmentForm
.addEventListener(
"change",
engageAppointmentForm
);
appointmentForm
.addEventListener(
"submit",
engageAppointmentForm
);
if (
appointmentForm
.querySelector(
".field-error, .form-errors, .errorlist"
)
) {
engageAppointmentForm();
}
}
if (
appointmentBookingPanel
?.querySelector(
".success.show"
)
) {
engageAppointmentForm();
}
}
function resetAppointmentScrollMotion() {
if (
!appointmentMotionRoot
) {
return;
}
const clearElement =
element => {
if (!element) {
return;
}
element.style.opacity =
"";
element.style.transform =
"";
element.style.filter =
"";
element.style.clipPath =
"";
element.style.borderColor =
"";
element.style.pointerEvents =
"";
element.style.transition =
"";
};
[
appointmentHeroKicker,
appointmentHeroTitle,
appointmentHeroText,
appointmentBookingPanel,
...appointmentFieldGroups,
appointmentBookingSide,
appointmentInfoCard,
...appointmentInfoRows
]
.filter(
Boolean
)
.forEach(
clearElement
);
appointmentHero
?.style.removeProperty(
"--appointment-hero-glow-opacity"
);
appointmentHero
?.style.removeProperty(
"--appointment-hero-glow-y"
);
appointmentBookingPanel
?.style.removeProperty(
"--booking-panel-line-progress"
);
appointmentBookingSide
?.style.removeProperty(
"--booking-side-y"
);
appointmentBookingSide
?.style.removeProperty(
"--booking-side-image-y"
);
}
function updateAppointmentHeroMotion() {
if (
!appointmentHero
) {
return;
}
const rect =
appointmentHero
.getBoundingClientRect();
const distance =
Math.max(
rect.height *
0.80,
1
);
const rawExit =
clamp01(
-rect.top /
distance
);
const heroExit =
easeInOutCubic(
rawExit
);
if (
appointmentHeroKicker
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.02,
0.54
)
);
appointmentHeroKicker
.style.opacity =
lerp(
1,
0,
progress
);
appointmentHeroKicker
.style.clipPath =
`inset(
0
0
${
lerp(
0,
100,
progress
)
}%
0
)`;
appointmentHeroKicker
.style.transform =
"none";
appointmentHeroKicker
.style.filter =
"none";
}
if (
appointmentHeroTitle
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.10,
0.88
)
);
appointmentHeroTitle
.style.opacity =
lerp(
1,
0,
progress
);
appointmentHeroTitle
.style.clipPath =
`inset(
0
0
${
lerp(
0,
100,
progress
)
}%
0
)`;
appointmentHeroTitle
.style.transform =
"none";
appointmentHeroTitle
.style.filter =
"none";
}
if (
appointmentHeroText
) {
const progress =
easeInOutCubic(
rangeProgress(
heroExit,
0.18,
0.72
)
);
appointmentHeroText
.style.opacity =
lerp(
1,
0,
progress
);
appointmentHeroText
.style.transform =
"none";
appointmentHeroText
.style.filter =
"none";
}
appointmentHero.style.setProperty(
"--appointment-hero-glow-opacity",
lerp(
0.52,
0.10,
heroExit
)
);
appointmentHero.style.setProperty(
"--appointment-hero-glow-y",
`${
lerp(
0,
72,
heroExit
)
}px`
);
}
function updateAppointmentBookingMotion() {
if (
!appointmentBookingSection ||
!appointmentBookingPanel
) {
return;
}
const formEngaged =
appointmentMotionRoot
?.classList.contains(
"appointment-form-engaged"
);
const panelProgress =
easeInOutCubic(
secondaryTopProgress(
appointmentBookingPanel,
0.94,
0.34
)
);
if (
!formEngaged
) {
appointmentBookingPanel
.style.opacity =
lerp(
0.08,
1,
panelProgress
);
appointmentBookingPanel
.style.clipPath =
`inset(
0
0
${
lerp(
11,
0,
panelProgress
)
}%
0
round 32px
)`;
} else {
appointmentBookingPanel
.style.opacity =
"1";
appointmentBookingPanel
.style.clipPath =
"none";
}
appointmentBookingPanel
.style.transform =
"none";
appointmentBookingPanel
.style.filter =
"none";
appointmentBookingPanel
.style.borderColor =
`rgba(
255,
255,
255,
${
lerp(
0.06,
0.18,
panelProgress
)
}
)`;
appointmentBookingPanel
.style.setProperty(
"--booking-panel-line-progress",
panelProgress
);
if (
!appointmentFieldGroups.length
) {
return;
}
if (
formEngaged
) {
appointmentFieldGroups.forEach(
group => {
group.style.opacity =
"1";
group.style.transform =
"none";
group.style.filter =
"none";
group.style.clipPath =
"none";
group.style.pointerEvents =
"auto";
}
);
return;
}
const scene =
secondarySectionProgress(
appointmentBookingSection,
0.92,
0.10
);
const count =
appointmentFieldGroups.length;
appointmentFieldGroups.forEach(
(
group,
index
) => {
const normalizedIndex =
count <=
1
? 0
: index /
(
count -
1
);
const start =
0.08 +
normalizedIndex *
0.46;
const end =
Math.min(
start +
0.34,
0.96
);
const progress =
easeInOutCubic(
rangeProgress(
scene,
start,
end
)
);
group.style.opacity =
lerp(
0.08,
1,
progress
);
group.style.transform =
`translate3d(
0,
${
lerp(
24,
0,
progress
)
}px,
0
)`;
group.style.clipPath =
`inset(
0
0
${
lerp(
18,
0,
progress
)
}%
0
)`;
group.style.filter =
"none";
group.style.pointerEvents =
progress >=
0.35
? "auto"
: "none";
}
);
}
function updateAppointmentSideMotion() {
if (
!appointmentBookingSide
) {
return;
}
const visible =
easeInOutCubic(
secondaryTopProgress(
appointmentBookingSide,
0.94,
0.40
)
);
const scene =
secondarySectionProgress(
appointmentBookingSection,
0.94,
0.10
);
appointmentBookingSide
.style.opacity =
lerp(
0.12,
1,
visible
);
appointmentBookingSide
.style.setProperty(
"--booking-side-y",
`${
lerp(
26,
-16,
scene
)
}px`
);
appointmentBookingSide
.style.setProperty(
"--booking-side-image-y",
`${
lerp(
20,
-20,
scene
)
}px`
);
if (
appointmentInfoCard
) {
const infoProgress =
easeInOutCubic(
rangeProgress(
visible,
0.18,
0.96
)
);
appointmentInfoCard
.style.opacity =
lerp(
0.20,
1,
infoProgress
);
appointmentInfoCard
.style.transform =
"none";
appointmentInfoCard
.style.filter =
"none";
}
appointmentInfoRows.forEach(
(
row,
index
) => {
const start =
0.20 +
index *
0.10;
const end =
Math.min(
start +
0.48,
1
);
const progress =
easeInOutCubic(
rangeProgress(
visible,
start,
end
)
);
row.style.opacity =
lerp(
0.22,
1,
progress
);
row.style.transform =
"none";
row.style.filter =
"none";
}
);
}
function updateAppointmentScrollMotion() {
if (
!appointmentMotionRoot ||
!appointmentBookingSection
) {
return;
}
if (
!secondaryMotionDesktopEnabled()
) {
resetAppointmentScrollMotion();
return;
}
updateAppointmentHeroMotion();
updateAppointmentBookingMotion();
updateAppointmentSideMotion();
}
let secondaryPagesMotionTicking =
false;
function updateSecondaryPagesMotion() {
secondaryPagesMotionTicking =
false;
updateBlogScrollMotion();
updateAppointmentScrollMotion();
}
function requestSecondaryPagesMotionUpdate() {
if (
secondaryPagesMotionTicking
) {
return;
}
secondaryPagesMotionTicking =
true;
requestAnimationFrame(
updateSecondaryPagesMotion
);
}
if (
blogMotionRoot ||
appointmentMotionRoot
) {
prepareBlogScrollMotion();
prepareAppointmentScrollMotion();
window.addEventListener(
"scroll",
requestSecondaryPagesMotionUpdate,
{
passive: true
}
);
window.addEventListener(
"resize",
requestSecondaryPagesMotionUpdate
);
window.addEventListener(
"load",
requestSecondaryPagesMotionUpdate
);
const pageMotionObserver =
new MutationObserver(
requestSecondaryPagesMotionUpdate
);
if (
blogMotionRoot
) {
pageMotionObserver.observe(
blogMotionRoot,
{
attributes: true,
attributeFilter:
[
"class"
]
}
);
}
if (
appointmentMotionRoot &&
appointmentMotionRoot !==
blogMotionRoot
) {
pageMotionObserver.observe(
appointmentMotionRoot,
{
attributes: true,
attributeFilter:
[
"class"
]
}
);
}
requestSecondaryPagesMotionUpdate();
if (
document.fonts
?.ready
) {
document.fonts.ready
.then(
requestSecondaryPagesMotionUpdate
);
}
}