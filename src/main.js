/* Kaeden Young
Rocket Patrol Mod
Time for completion: 15ish hours
*/ 


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyD;


/* Points Breakdown
Added Copyright-free background music to the play scene (5)
Create a new scrolling tile sprite for background (5)
Implement Parallax scrolling (10)
Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
Create new artwork for all of the in-game assests (rocket, spaceshhips, explosion) (20)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
Create and implemtn a new weapon (w/ new behavior and graphics) (20)
Redesign the game's artwork, UI, and sound to change its theme/aestheic (to something other than sci-fi) (60)
But its really late, so deduct what you think is necessary
*/