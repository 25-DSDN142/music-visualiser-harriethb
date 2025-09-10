// Variables
let cols = 8;
let rows = 6;
let sparklePositions = [];
let angle = 0; // for orbiting shapes
let blackCol = [0,0,0];
let whiteCol = [255,255,255];
let orangeAlpha = [244,161,39,50];
let stars = [];
let moonCol = [220, 220, 255];
let moonPos;


// 3 minutes at ~60fps = 10800 frames
let songFrames = 10800;


function setup() {
 createCanvas(640, 480);
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  // --- Progress through song (0 → 1) ---
  let progress = constrain(counter / songFrames, 0, 1);

  // --- Background colour ---
  let bgMusic = color(152, map(vocal, 0, 100, 180, 230), 180);
  let bgNight = color(30, 20, 60);
  let bgCol = lerpColor(bgMusic, bgNight, progress);
  background(bgCol);

// --- Stars fade in after halfway ---
if (progress > 0.5) {
  if (stars.length < 150) { // limit number of stars
    stars.push(createVector(random(width), random(height/2))); 
  }

  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    // twinkle with vocals or 'other'
    let twinkle = map(other, 0, 100, 150, 255);
    let size = random(1, 3);
    noStroke();
    fill(255, 255, 255, twinkle);
    ellipse(s.x, s.y, size, size);
  }
}

  // --- Circle colour (with fade to night) ✨ ---
  let brightCol = lerpColor(color(255, 100, 100), color(255, 255, 0), map(vocal, 0, 100, 0, 1));
  let darkCol   = color(120, 100, 80);
  let circleCol = lerpColor(brightCol, darkCol, progress);

  // --- Grid of stripey + solid circles ✨ ---
  let spacingX = width / (cols + 1);
  let spacingY = height / (rows + 1);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i + 1) * spacingX;
      let y = (j + 1) * spacingY;
      let baseSize = map(drum, 0, 100, 20, 80);

      let sway = map(bass, 0, 100, -40, 40);
      let offset = sin(counter * 0.03 + j) * sway;

      // Stripey halo rings
      let rings = 6;
      for (let r = 0; r < rings; r++) {
        let ringSize = baseSize * (1 + r * 0.35);
        let alpha = (r % 2 === 0) ? 180 : 50;

        noFill();
        stroke(red(circleCol), green(circleCol), blue(circleCol), alpha);
        strokeWeight(3);
        ellipse(x + offset, y, ringSize, ringSize);
      }

      // Inner filled circle
      noStroke();
      fill(circleCol);
      ellipse(x + offset, y, baseSize * 0.8, baseSize * 0.8);
    }
  }

  // --- Sparkles from 'other' channel ---
  if (other > 70 && frameCount % 5 === 0) {
    sparklePositions.push(createVector(random(width), random(height)));
  }

  fill(255, 255, 255, 150);
  for (let i = sparklePositions.length - 1; i >= 0; i--) {
    let sp = sparklePositions[i];
    ellipse(sp.x, sp.y, 8, 8);
    sp.y += 1;
    if (sp.y > height) {
      sparklePositions.splice(i, 1);
    }
  }

  // --- Sun setting animation (diagonal) ---
  let sunX = map(progress, 0, 1, 100, width - 100);
  let sunY = map(progress, 0, 1, 0, height + 200);
  let sunCol = lerpColor(color(255, 220, 0), color(255, 80, 50), progress);

  let sunSize = map(drum, 0, 100, 80, 400);
  noStroke();
  fill(sunCol);
  ellipse(sunX, sunY, sunSize, sunSize);

  // --- Sun rings (darken over time) ✨ ---
  let stripeStart = color(255, 180, 80, 80);
  let stripeEnd   = color(100, 50, 30, 60);
  let stripeCol   = lerpColor(stripeStart, stripeEnd, progress);

  fill(stripeCol);
  noStroke();
  let stripeWidth = map(other, 40, 120, 40, 100, true);
  let numStripes = height / stripeWidth;
  for (let i = 0; i < numStripes; i += 2) {
    let cury = map(i, 0, numStripes - 1, 0, height);
    circle(sunX, sunY, cury * 0.5);
  }

 // --- Moon rises from halfway (progress > 0.5) ---
if (progress > 0.5) {
  let moonProgress = map(progress, 0.5, 1, 0, 1, true);

  // Path: from bottom-right → top-left
  let moonX = map(moonProgress, 0, 1, width + 100, width * 0.2);
  let moonY = map(moonProgress, 0, 1, height + 100, height * 0.2);

  // Pulse with vocals for smoother breathing effect
  let baseMoonSize = 140;
  let pulse = map(vocal, 0, 100, -25, 40);
  let moonSize = baseMoonSize + pulse;

  // Halo effect (rings with fading alpha)
  for (let r = 6; r >= 1; r--) {
    let haloSize = moonSize * (1 + r * 0.25);
    let alpha = map(r, 6, 1, 20, 120);
    noStroke();
    fill(moonCol[0], moonCol[1], moonCol[2], alpha);
    ellipse(moonX, moonY, haloSize, haloSize);
  }

  // Actual moon core
  noStroke();
  fill(lerpColor(color(200,200,255), color(255,240,200), vocal/100));
  ellipse(moonX, moonY, moonSize, moonSize);

  // Store moon position for stars to use
  moonPos = createVector(moonX, moonY);
}

  // --- Horizon stripes ---
  let bassShift = map(bass, 0, 100, -50, 50);
  for (let i = 0; i < 5; i++) {
    let stripeY = height/1.3 + i * 25 + bassShift;
    let startCol = color(200 - i*20, 120 + i*10, 70);
    let endCol = color(40, 20, 40);
    let stripeCol = lerpColor(startCol, endCol, progress);
    fill(stripeCol);
    rect(0, stripeY, width, 25);
  }

 // --- Lyric display (pulsing + colour-matched to grid) ---
let lyricBaseSize = 50;  // bigger than before
let lyricPulse = map(vocal, 0, 100, -10, 25); // pulse with vocals
let lyricSize = lyricBaseSize + lyricPulse;

fill(circleCol);   // same colour as grid/halos
noStroke();
textFont('Cascadia Code');
textAlign(CENTER);
textStyle(BOLD);
textSize(lyricSize);
text(words, width/2, height * 11/12);

}