import Phaser from "phaser";
import hotDogPath from './vendor/assets/images/hotdog.png'
import shipPath from './vendor/assets/images/duck90.png'
import bgPath from './vendor/assets/images/38_PixelSky.png'
import GameOver from "./game-over";


const playerNgSpeed = 30
const playerSpeed = 80

class SpaceStretch2Game extends Phaser.Scene {
    constructor() {
        super({ key: 'stretch-duck' });
    }

    preload() {
        this.load.image('hotdog', hotDogPath);
        this.load.image('ship', shipPath);
        this.load.image('bg', bgPath);
    }

    create() {
        // background
        this.bg = this.add.image(config.width / 2, config.height / 2, 'bg');
        this.bg.setDisplaySize(config.width, config.height);

        const playerScale = 3
        const hotDogScale = 0.35

        this.score = 0
        this.hotdogsCnt = 10
        this.cursors = this.input.keyboard.createCursorKeys();
        const textSytle = {
            fontFamily: 'Orbitron',
            fontSize: '25px',
            fill: '#132028'
        }
        // openingText
        this.add.text(
            5,
            5,
            'GET HOTDOGS 🌭',
            textSytle
        );

        //Add the scoreboard in
        this.scoreBoard = this.add.text(
            this.physics.world.bounds.width - 150,
            0,
            "SCORE: 0", textSytle);

        this.physics.world.setBoundsCollision(true, true, true, true)

        this.player = this.physics.add.sprite(
            this.physics.world.bounds.width / 2,
            this.physics.world.bounds.height / 2,
            'ship',
        );

        this.player.setScale(playerScale)
        this.player.setCollideWorldBounds(true);

        const hotdogsGroup = this.physics.add.group({
            key: 'hotdog',
            quantity: this.hotdogsCnt,
            collideWorldBounds: true,
        })
        hotdogsGroup.getChildren().forEach(dog => dog.setScale(hotDogScale))
        Phaser.Actions.RandomRectangle(hotdogsGroup.getChildren(), this.physics.world.bounds)

        this.physics.add.overlap(this.player, hotdogsGroup, collectBalls, null, this)
        function collectBalls(avatar, ball) {
            ball.destroy()
            this.score += 1
            this.scoreBoard.setText(`SCORE: ${this.score}`)
        }
    }

    update(time, delta) {
        // check if won
        if (this.score === this.hotdogsCnt) {
            this.scene.start('you-won', {
                bg: "pxl-sky",
                msg: "You Won! 🎉 \n" +
                "All 🌭🌭🌭🌭 are eaten 😋"
            })
            return
        }
        this.handlePlayerMoves()
    }

    handlePlayerMoves() {
        this.player.body.setAngularVelocity(0);
        this.player.body.setVelocity(0, 0);
        this.player.body.setAcceleration(0)

        if (window.gameUpMove() || this.cursors.up.isDown) {
            const ng = this.player.angle
            const vec = this.physics.velocityFromAngle(ng, playerSpeed)
            this.player.body.setVelocity(vec.x, vec.y);
        } else if (window.gameLeftMove() || this.cursors.left.isDown) {
            this.player.body.setAngularVelocity(playerNgSpeed * -1);
        } else if (window.gameRightMove() || this.cursors.right.isDown) {
            this.player.body.setAngularVelocity(playerNgSpeed);
        }
    }
}

const isMobile = window.innerWidth < 450
const scaleDownSketch = !isMobile

const config = {
    type: Phaser.AUTO,
    parent: 'main-canvas',
    width: scaleDownSketch ? window.innerWidth / 1.2 : window.innerWidth,
    height: scaleDownSketch ? window.innerHeight / 1.3 : window.innerHeight / 1.2,
    scene: [SpaceStretch2Game, GameOver],
    audio: {
        noAudio: true
    },
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    },
    fps: 30
}

const game = new Phaser.Game(config)

