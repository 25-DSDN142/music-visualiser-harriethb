let blackCol = [0,0,0];
let whiteCol = [255,255,255];
let orangeAlpha = [244,161,39,50]
let creamBG = [255,236,180]


function draw_one_frame(words, vocal, drum, bass, other, counter) {


let seconds = Math.floor(counter / 60)


if (seconds < 10) {
  background(blackCol);
} else (
  background (whiteCol)
)


 // --- Background colour shifts with vocals ---
 let bg = map(vocal, 0, 100, 180, 230); // light teal tones
 background(152, bg, 180);


fill(orangeAlpha);


let stripeWidth = map(other,40,100,40,80,true);


let numStripes = height / stripeWidth;
for (let i=0; i<numStripes; i=i+2) {


  let cury = map(i,0,numStripes-1,0,height)


  circle(canvasWidth/2,canvasHeight/2,cury*0.5)
}


let ovalPlace = map(vocal,20,100,height-50,50,true);
let ovalSize = map(vocal,20,100,60,150,true);


fill(229,119,30)
ellipse(width/2,ovalPlace,ovalSize);


fill (whiteCol);
stroke(blackCol);
strokeWeight(4);
textFont('Cascadia Code');
textAlign(CENTER);
textStyle(BOLD);
textSize(40);
text(words,canvasWidth/2,canvasHeight*5/6);
noStroke()
}
