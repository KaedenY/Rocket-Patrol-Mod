class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_tank_shell', './assets/tank_firing_shot_sound_effect.wav');
        this.load.audio('sfx_explosion', './assets/Explosion_Sound_Effect.wav');
        this.load.audio('sfx_machine_gun', './assets/Machine_Gun_Sound_Effect.wav');
        this.load.audio('sfx_play_music', './assets/Kubbi - Digestive biscuit.wav');
        this.load.audio('sfx_select', './assets/Gamemode Select.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '26px',
            backgroundColor: '#8A2BE2',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'Tank Patrol', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3, 'Use (F) to fire cannon and (D) to fire gun', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FF00FF';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}