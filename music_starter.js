// Variables
let cols = 8;
let rows = 6;
let sparklePositions = [];
let angle = 0; // for orbiting shapes
let blackCol = [0,0,0];
let whiteCol = [255,255,255];
let orangeAlpha = [244,161,39,50];

// 3 minutes at ~60fps = 10800 frames
let songFrames = 10800;

function setup() {
  createCanvas(640, 480);
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  // --- Progress through song (0 → 1) ---
  let progress = constrain(counter / songFrames, 0, 1);

  // --- Background colour ---
  // Music-reactive teal tone
  let bgMusic = color(152, map(vocal, 0, 100, 180, 230), 180);
  // Night-time dark tone (navy-ish)
  let bgNight = color(30, 20, 60);
  // Blend between them as song goes on
  let bgCol = lerpColor(bgMusic, bgNight, progress);
  background(bgCol);

  // --- Circle colour based on vocals ---
  let circleCol = lerpColor(color(255, 100, 100), color(255, 255, 0), map(vocal, 0, 100, 0, 1));
  fill(circleCol);
  noStroke();

  // --- Grid of circles ---
  let spacingX = width / (cols + 1);
  let spacingY = height / (rows + 1);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Base positions
      let x = (i + 1) * spacingX;
      let y = (j + 1) * spacingY;

      // Size mapped to drums
      let size = map(drum, 0, 100, 20, 80);

      // Horizontal sway from bass
      let sway = map(bass, 0, 100, -40, 40);
      let offset = sin(counter * 0.03 + j) * sway;

      ellipse(x + offset, y, size, size);
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
    sp.y += 1; // drift down
    if (sp.y > height) {
      sparklePositions.splice(i, 1); // remove when offscreen
    }
  }

  // --- Sun setting animation (diagonal) ---
  let sunX = map(progress, 0, 1, 100, width - 100);
  let sunY = map(progress, 0, 1, 0, height + 200);

  // Sun colour shifts from yellow → orange → red
  let sunCol = lerpColor(color(255, 220, 0), color(255, 80, 50), progress);

  let sunSize = map(drum, 0, 100, 80, 400);
  noStroke();
  fill(sunCol);
  ellipse(sunX, sunY, sunSize, sunSize);

  // --- Stripes inside the sun ---
  fill(orangeAlpha);
  let stripeWidth = map(other, 40, 100, 40, 80, true);
  let numStripes = height / stripeWidth;

  for (let i = 0; i < numStripes; i += 2) {
    let cury = map(i, 0, numStripes - 1, 0, height);
    circle(sunX, sunY, cury * 0.5);
  }

  // --- Horizon stripes (fade darker over time) ---
  let bassShift = map(bass, 0, 100, -50, 50);
  for (let i = 0; i < 5; i++) {
    let stripeY = height/1.3 + i * 25 + bassShift;
    // Start bright orange → end dark purple/black
    let startCol = color(200 - i*20, 120 + i*10, 70);
    let endCol = color(40, 20, 40);
    let stripeCol = lerpColor(startCol, endCol, progress);
    fill(stripeCol);
    rect(0, stripeY, width, 25);
  }

  // --- lyric display ---
  fill(whiteCol);
  stroke(whiteCol);
  textFont('Cascadia Code');
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(40);
  text(words, width/2, height*5/6);
  noStroke();
}