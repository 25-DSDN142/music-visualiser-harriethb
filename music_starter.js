

// Variables
let cols = 8;
let rows = 6;
let sparklePositions = [];
let angle = 0; // for orbiting shapes
let blackCol = [0,0,0];
let whiteCol = [255,255,255];
let orangeAlpha = [244,161,39,50]

function setup() {
  createCanvas(640, 480);
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {

    // --- Background colour shifts with vocals ---
  let bg = map(vocal, 0, 100, 180, 230); // light teal tones
  background(152, bg, 180);

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

      // Draw concentric rings with fading opacity
    let rings = 5; // number of rings per circle
    for (let r = 0; r < rings; r++) {
      let ringSize = baseSize + r * 15; // each ring gets bigger
      let alpha = map(r, 0, rings - 1, 150, 20); // outer rings more transparent

      fill(244, 161, 39, alpha); // orange-ish, with transparency
      noStroke();
      ellipse(x + offset, y, ringSize, ringSize);
    }
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

  // --- Bonus "slide off" effect on strong bass ---
  if (bass > 90) {
    translate(0, counter % height); // slides grid downwards temporarily
  }

  // --- Pulsing "sun" with drums ---
  let sunSize = map(drum, 0, 100, 80, 400);
  noStroke();
  fill(255, 200, 0); // warm yellow
  ellipse(width/2, height/2, sunSize, sunSize);

//the stripes in the sun
fill(orangeAlpha);

let stripeWidth = map(other,40,100,40,80,true);

let numStripes = height / stripeWidth;
for (let i=0; i<numStripes; i=i+2) {

   let cury = map(i,0,numStripes-1,0,height)

   circle(canvasWidth/2,canvasHeight/2,cury*0.5)
}

let ovalPlace = map(vocal,20,100,height-50,50,true);
let ovalSize = map(vocal,20,100,60,150,true);


  // --- Bass: horizon stripes ---
  let bassShift = map(bass, 0, 100, -50, 50);
  for (let i = 0; i < 5; i++) {
    let stripeY = height/2 + i * 40 + bassShift;
    fill(200 - i*20, 120 + i*10, 70); // browns/oranges
    rect(0, stripeY, width, 40);
  }

  // --- lyric display
fill (whiteCol);
stroke(whiteCol);
textFont('Cascadia Code');
textAlign(CENTER);
textStyle(BOLD);
textSize(40);
text(words,canvasWidth/2,canvasHeight*5/6);
noStroke()
}