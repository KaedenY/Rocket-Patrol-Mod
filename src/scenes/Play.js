class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('PlayerTank', './assets/Player Tank.png');
        this.load.image('EnemyTank', './assets/Enemy Tank.png');
        this.load.image('EnemyTruck', './assets/Enemy Vehicle.png');
        this.load.image('Bullets', './assets/Bullets.png');
        this.load.image('TankShell', './assets/Tank Shell.png');
        this.load.image('Sky_Background', './assets/Sky_Background.png');
        this.load.image('middleground', './assets/middleground.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //Play Background Music
        this.sound.play('sfx_play_music');

        // place tile sprite for background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'Sky_Background').setOrigin(0, 0);
        //place tile sprite for middle ground
        this.middlefield = this.add.tileSprite(0, 0, 640, 480, 'middleground').setOrigin(0, 0);


        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x696969).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x696969).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x696969).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x696969).setOrigin(0 ,0);

        // add Tank_Shell (p1)
        this.player1shell = new Tank_Shell(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'TankShell').setOrigin(0.5, 0);
        this.player1tank = new Player_Tank(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'PlayerTank').setOrigin(0.5, 0);
        this.player1bullets = new Bullets(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'Bullets').setOrigin(0.5, 0);

        // add enemy tanks (x3)
        this.ship01 = new Enemy_Tank(this, game.config.width + borderUISize*6, borderUISize*4, 'EnemyTank', 0, 30).setOrigin(0, 0);
        this.ship02 = new Enemy_Tank(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'EnemyTank', 0, 20).setOrigin(0,0);
        this.ship03 = new Enemy_Tank(this, game.config.width, borderUISize*6 + borderPadding*4, 'EnemyTank', 0, 10).setOrigin(0,0);

        //Add enemy trucks
        this.truck01 = new Enemy_Truck(this, game.config.width, borderUISize*6 + borderPadding*4, 'EnemyTruck', 0, 0).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //Updating Tile Sprites
        this.background.tilePositionX -= 1;
        this.middlefield.tilePositionX -= 3; //Should be parallaxing


        if(!this.gameOver) {
            this.player1tank.update(); 
            this.player1shell.update(); 
            this.player1bullets.update();             // update p1
            this.ship01.update();               // update enemy_tank (x3)
            this.ship02.update();
            this.ship03.update();
            this.truck01.update();
        }

        // check collisions
        if(this.checkCollision(this.player1shell, this.ship03)) {
            this.player1shell.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.player1shell, this.ship02)) {
            this.player1shell.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.player1shell, this.ship01)) {
            this.player1shell.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.player1bullets, this.truck01)) {
            this.player1bullets.reset();
            this.shipExplode(this.truck01);
        }
    }

    checkCollision(Tank_Shell, Enemy_Tank) {
        // simple AABB checking
        if (Tank_Shell.x < Enemy_Tank.x + Enemy_Tank.width && 
            Tank_Shell.x + Tank_Shell.width > Enemy_Tank.x && 
            Tank_Shell.y < Enemy_Tank.y + Enemy_Tank.height &&
            Tank_Shell.height + Tank_Shell.y > Enemy_Tank. y) {
                return true;
        } else {
            return false;
        }
    }


    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        //
        this.sound.play('sfx_explosion');
      }
}