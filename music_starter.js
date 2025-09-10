let angle = 0; // for orbiting shapes


function draw_one_frame(words, vocal, drum, bass, other, counter) {
 // --- Background colour shifts with vocals ---
 let bg = map(vocal, 0, 100, 180, 230); // light teal tones
 background(152, bg, 180);


 // --- Pulsing "sun" with drums ---
 let sunSize = map(drum, 0, 100, 80, 400);
 noStroke();
 fill(255, 200, 0); // warm yellow
 ellipse(width/2, height/2, sunSize, sunSize);


 // --- Bass: horizon stripes ---
 let bassShift = map(bass, 0, 100, -50, 50);
 for (let i = 0; i < 5; i++) {
   let stripeY = height/2 + i * 40 + bassShift;
   fill(200 - i*20, 120 + i*10, 70); // browns/oranges
   rect(0, stripeY, width, 40);
 }


 // slowly rotate
 angle += 0.02;


 // --- Optional lyric display (subtle, bottom) ---
 fill(255);
 textAlign(CENTER);
//   textSize(18);
//   text(words, width/2, height - 30);
}

