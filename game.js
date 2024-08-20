/* global Phaser */
import {createAnimations} from "/animations.js"

const config = {
    type: Phaser.AUTO, // webgl, canvas
    width: 400,
    height: 300,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics:{
        default: 'arcade',
        arcade: {
            gravity : {y:300},
            debug:false
        }
    },
    scene:{
        preload, // se ejecuta para cargar recursos
        create, //se ejecuta cuando el juego comienza
        update // se ejecuta en cada frame
    }
}

new Phaser.Game(config)
// this -> game -> el juego que estamos construyendo

function preload () {
    this.load.image(
        'cloud-1',
        '/assets/scenery/overworld/cloud1.png'
    )

    this.load.image(
        'floor-bricks',
        '/assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario',  //<-- id 
        'assets/entities/mario.png',
        { frameWidth:18, frameHeight:16}
    )

    this.load.audio('game-over', '/assets/sound/music/gameover.mp3')

} // 1.


function create () {
    // imange (x,y, id-del-asset)
    this.add.image(100,50, 'cloud-1') // la nuve y su posicon
        .setOrigin(0,0)
        .setScale(0.15)

    this.floor = this.physics.add.staticGroup()

    this.floor
        .create(180, config.height-0, 'floor-bricks')
        .setOrigin(0, 1)
        .refreshBody()

    this.floor
        .create(0, config.height-0, 'floor-bricks')
        .setOrigin(0, 1)
        .refreshBody()

    this.isJumping = false;

    this.mario = this.physics.add.sprite(70,240, 'mario')    //mario posicion y gravedad
    .setOrigin(0,1)
    .setCollideWorldBounds(true)
    .setGravityY(300)


    this.physics.world.setBounds(0, 0, 2000, config.height) // aqui le damos el tamaño al mundo respectivamente 
    this.physics.add.collider(this.mario, this.floor)

    this.cameras.main.setBounds(0,0,2000,config.height) // el tamaño del mundo en cuestion de la camara posiciones, ancho y alto
    this.cameras.main.startFollow(this.mario) //camara sigue a mario

    createAnimations(this)

    this.keys = this.input.keyboard.createCursorKeys()


}

function update () {
    if (this.mario.isDead) return

    if (this.keys.left.isDown){
        this.mario.x -= 3
        this.mario.flipX = true
        this.mario.anims.play('mario-walk', true)
    }else if(this.keys.right.isDown){
        this.mario.x += 3
        this.mario.flipX = false
        this.mario.anims.play('mario-walk', true)
    }else{
        this.mario.anims.play('mario-idle', true)
    }
    if (this.keys.up.isDown && this.mario.body.touching.down){
        this.mario.setVelocityY(-300)
        this.mario.anims.play('mario-jump', true)

    }
    if (this.mario.y >= config.height) {
        this.mario.isDead = true
        this.mario.anims.play('mario-dead')
        this.mario.setCollideWorldBounds(false)
        this.sound.add('game-over', { volume: 0.2 }).play()
    
        setTimeout(() => {
            this.mario.setVelocityY(-350)
        }, 100)
    
        setTimeout(() => {
            this.scene.restart()
        }, 2000)
    }

    
}


