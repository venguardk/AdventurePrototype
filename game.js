class Loading extends Phaser.Scene{
    constructor() {
        super('loading');
    }
    preload(){
        // progress bar
        const progress = this.add.graphics();
        this.add.text(920, 450, 'Loading...');
        progress.fillStyle(0x222222, 0.8);
        progress.fillRect(815, 470, 320, 50);

        this.load.on('progress', value => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(815, 480, 300 * value, 30);
        });

        this.load.on('complete', () => {
            this.add.text(895, 530, 'Click to begin');
         });

        //loading assets
        this.load.path = "./assets/";
        this.load.video('logo', 'Studio Intro.mp4');
        this.load.audio('dial', 'Dial up.mp3');
        this.load.image('start', 'Menu.jpg');
        this.load.image('background', 'Background.png');
        this.load.image('sword', 'Sprite Sword.png');
        this.load.image('swordColor', 'Sprite Sword Color.png');
        this.load.image('shield', 'Sprite Shield.png');
        this.load.image('shieldColor', 'Sprite Shield Color.png');
        this.load.image('tome', 'Sprite Tome.png');
        this.load.image('tomeColor', 'Sprite Tome Color.png');
        this.load.image('forest', 'Forest.jpg');
        this.load.image('goblin', 'Goblin.png');
        this.load.image('temple','Temple.png');
        this.load.image('treasure', 'Treasure.png');
        this.load.image('roomBlue', 'Room Blue.png');
        this.load.image('roomGreen', 'Room Green.png');
        this.load.image('gemBlue', 'Gem Blue.png');
        this.load.image('bug', 'Gem Green Bug.png');
        this.load.image('dragon', 'Dragon.png');
    }
    create(){
        this.add.text(0, 0, 'Loading...');
        this.input.on('pointerdown', ()=> this.scene.start('studio'));
    }
}

class Studio extends Phaser.Scene{
    constructor(){
        super('studio');
    }
    create(){
        this.sound.play('dial');
        const videoLogo = this.add.video(960, 540, 'logo');
        videoLogo.on('locked', () => {
            let message = this.add.text(640, 100, 'Click to play video');
            videoLogo.on('unlocked', () => {
                message.destroy();
            });
        });
        videoLogo.play();

        this.input.on('pointerdown', () => this.scene.start('menu'));
        
        this.time.delayedCall(2000, () =>{
            this.cameras.main.fadeOut(2000, 0, 0, 0);
        });
        
        this.time.delayedCall(5000, () => this.scene.start('menu'));
    }
}

class Menu extends Phaser.Scene{
    constructor(){
        super('menu');
    }
    create(){
        this.add.text(0, 0, 'Menu');
        this.imageBG = this.add.image(1200, 540, 'start');
        this.imageBG.setScale(1.15);

        this.add.text(10, 25, "Path to Adventure", {
            fontFamily: 'Georgia, serif',
            fontSize: 50,
        });
        this.add.text(10, 100, "Click to Begin").setFontSize(20);
        
        this.input.on('pointerdown', () => this.scene.start('choice'));
    }
}

class Choice extends AdventureScene{
    constructor(){
        super("choice", "Choose your equipment!");
    }

    onEnter(){
        this.add.image(this.w *0.33, this.w * 0.27, "background").setScale(0.6);

        this.setValues();

        let sword = this.add.image(this.w * 0.4, this.w * 0.2, 'sword')
            .setScale(0.3)
            .setInteractive()
            .on('pointerover', () => {
                this.showImage('swordColor', this.w * 0.4, this.w * 0.2, 0.3);
                this.showMessage('A Sword: Made for those who believe only in their own strength.')
            })  
            .on('pointerdown', () => {
                this.showMessage("You have chosen the sword");
                if(this.hasItem("shield") || this.hasItem("tome")){
                    this.loseItem("shield");
                    this.loseItem("tome");
                }
                this.gainItem('sword');
            });
        
        let shield = this.add.image(this.w * 0.2, this.w * 0.4, 'shield')
            .setScale(0.2)
            .setInteractive()
            .on('pointerover', () => {
                this.showImage('shieldColor', this.w *0.2, this.w * 0.4, 0.2);
                this.showMessage("A Shield: Made for those who believe frinedship is key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You have chosen the shield");
                if(this.hasItem("sword") || this.hasItem("tome")){
                    this.loseItem('sword');
                    this.loseItem('tome');
                }
                this.gainItem('shield');
            });
        
        let tome = this.add.image(this.w * 0.6, this.w *0.4, 'tome')
            .setScale(0.2)
            .setInteractive()
            .on('pointerover', () => {
                this.showImage('tomeColor', this.w * 0.6, this.w *0.4, 0.2);
                this.showMessage("A Tome: Made for those who want creative solutions, but has limited uses.")
            })
            .on('pointerdown', () => {
                this.showMessage("You have chosen the tome");
                if(this.hasItem("sword") || this.hasItem("shield")){
                    this.loseItem("sword");
                    this.loseItem("shield");
                }
                this.gainItem("tome");
            });
        
        this.continue = this.add.text(this.w * 0.35, this.w* 0.5, "Continue!")
            .setFontSize(50)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem('sword') || this.hasItem('shield') || this.hasItem('tome')){
                    this.showMessage("Are you sure about your choice?");
                } else{
                    this.showMessage("It's dangerous to go alone!");
                }
            })
            
            .on('pointerdown', () => {
                if (this.hasItem('sword') || this.hasItem('shield') || this.hasItem('tome')){
                this.showMessage("Onward to Adventure!")
                this.gotoScene('gobbers')
            } else{
                this.showMessage("Choose an equipment");
                this.tweens.add({
                    targets: this.continue,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            }
        });
    }
}

class Gobbers extends AdventureScene{
    constructor(){
        super('gobbers', "On the path towards a temple of treasure...");
    }
    
    onEnter(){
        this.add.image(this.w *0.35, this.w * 0.3, "forest").setScale(1.2);

        let goblin = this.add.image(this.w * 0.6, this.w * 0.4, 'goblin')
            .setScale(0.2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('There appears to be a goblin on the path');
            })
        
        this.time.delayedCall(2000, () => {
            this.add.text(this.w * 0.4, this.w * 0.25, 'Attack?')
                .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => {
                    this.showMessage("Have at you!");
                })
                .on('pointerdown', () => {
                    if(this.hasItem('sword')){
                        this.showMessage("You easily take down the goblin, no one's getting that treasure, but me");
                    } else if (this.hasItem('tome')){
                        this.useMP();
                        let mp = this.checkMP();
                        this.showMessage(`You use your magic to defeat the goblin. ${mp} mp left.`)
                    } else{
                        this.damageHP();
                        let hp = this.checkHP();
                        this.showMessage(`It was a difficult fight, but you managed to win with ${hp} hp.`);
                    }
                    this.tweens.add({
                        targets: goblin,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                    });
                    this.time.delayedCall(5000, () => this.gotoScene('temple'));
                })
            this.add.text(this.w * 0.5, this.w * 0.25,'Sneak past?')
                .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => this.showMessage("Don't be suspicious!"))
                .on('pointerdown', () => {
                    var chance = Phaser.Math.Between(1, 3);
                    if(chance > 1){ 
                        this.showMessage("Snuck past");
                    } else{
                        this.damageHP();
                        let hp = this.checkHP();
                        this.showMessage(`Couldn't get past and the goblin attacked, leaving you with ${hp} hp.`);
                    }
                    this.gotoScene('temple');
                })
            this.add.text(this.w * 0.65, this.w * 0.25,'Talk?')
                    .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => this.showMessage("Diplomacy!"))
                .on('pointerdown', () => {
                    if(this.hasItem("shield")){
                        this.tweens.add({
                            targets: goblin,
                            y: '+=' + this.s,
                            repeat: 2,
                            yoyo: true,
                            ease: 'Sine.inOut',
                            duration: 100
                        });
                        this.showMessage("The name's Gobbers and you seem nice. I'll join your party!");
                        this.gainItem('Gobbers');
                        this.time.delayedCall(3000, () => this.gotoScene('temple'));
                    }
                    else{
                        this.showMessage("The goblin sees you as a threat, and runs away");
                        this.time.delayedCall(2000, () => this.gotoScene('temple'));
                    }
                })
        })
    }
}

class Temple extends AdventureScene{
    constructor(){
        super("temple", "The Fabled Temple of treasure!");
    }

    onEnter(){
        this.add.image(this.w *0.33, this.w * 0.27, "background").setScale(0.6);
        this.add.image(this.w *0.375, this.w * 0.28, "temple").setScale(0.54);

        this.add.text(this.w * 0, this.w * 0.025, "Green Room")
            .setFontSize(this.s * 2)
            .setColor(0xffffff)
            .setInteractive()
            .on('pointerover', () => {
                if(this.hasItem('green gem')){
                    this.showMessage("You've seen there is all to see there");
                }else{this.showMessage("You can see a slight glow down the hall")};
            })
            .on('pointerdown', () =>{
                if(this.hasItem('green gem')){
                    this.showMessage("You have the gem, already");
                }else{
                    this.showMessage("You head down the green hall");
                    this.gotoScene("greenRoom");
                }
                
            });
        
        this.add.text(this.w * 0.64, this.w * 0.025, "Blue Room")
        .setFontSize(this.s * 2)
        .setColor(0xffffff)
        .setInteractive()
        .on('pointerover', () => {
            if(this.hasItem('blue gem')){
                this.showMessage("You've seen there is all to see there");
            }else{this.showMessage("You can hear the sound of rushing water down the hall")};
        })
        .on('pointerdown', () =>{
            if(this.hasItem('blue gem')){
                this.showMessage("You have the gem, already");
            }else{
            this.showMessage("You head down the blue hall");
            this.gotoScene("blueRoom");
            }
        });
        
        this.add.text(this.w * 0.31, this.w * 0.01, "Orange Room")
        .setFontSize(this.s * 2)
        .setColor(0xffffff)
        .setInteractive()
        .on('pointerover', () => {
            if(this.hasItem('green gem') && (this.hasItem('blue gem'))){
                this.showMessage("The door is now unlocked");
            }else{this.showMessage("The door's seem locked")};
        })
        .on('pointerdown', () =>{
            if(this.hasItem('green gem') && this.hasItem('blue gem')){
                this.showMessage("The door swings open with revealing a blinding light...");
                this.gotoScene('final');
            }
        });
    }
}

class GreenRoom extends AdventureScene{
    constructor(){
        super("greenRoom", "A bright green room with a strange glowing gem.");
    }

    onEnter(){
        this.add.image(this.w *0.37, this.w * 0.28, "roomGreen").setScale(0.54);

        this.add.text(this.w * 0.6, this.w * 0.5, "Return")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Head back towards the temple?"))
            .on('pointerdown', () => {
                this.showMessage("You walk back the way you came")
                this.gotoScene('temple');
            });

        let fairy = this.add.image(this.w * 0.5, this.w*0.2, 'bug')
            .setScale(0.2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: fairy,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });        
            })
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: fairy,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                });
                this.showMessage("There's a flash of light, and resting in your hands is a gleaming green gem");
                this.gainItem('green gem');
            });
    }
}

class Blueroom extends AdventureScene{
    constructor(){
        super("blueRoom", "A raging river stretches before you.");
    }
    
    onEnter(){
        this.add.image(this.w *0.37, this.w * 0.28, "roomBlue").setScale(0.54);
        if (this.hasItem('tome')){
            let mp = this.checkMP();
            this.add.text(this.w * 0.35, this.w * 0.3, 'Use Magic?').setFontSize(this.s * 2);
            this.add.text(this.w *0.35, this.w *0.35, 'Yes')
                .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => this.showMessage(`Will use MP, ${mp} remaining`))
                .on('pointerdown', () => {
                    this.useMP();
                    let mp = this.checkMP();
                    this.showMessage(`With your magic, you are able to freeze the river and obtain the brilliant blue gem! 
                    MP: ${mp}`);
                    this.tweens.add({
                        targets: blue,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                    });
                    this.gainItem('blue gem');
                });
            this.add.text(this.w * 0.4, this.w * 0.35, 'No')
                .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => this.showMessage('This will be pretty risky without magic'))
                .on('pointerdown', () => {
                    this.damageHP();
                    let hp = this.checkHP();
                    this.showMessage(`It was a difficult time, and took it's toll
                    ${hp} HP left.`)
                    this.tweens.add({
                        targets: blue,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                    });
                    this.gainItem('blue gem');
                });
        }
        
        let blue = this.add.image(this.w*0.4, this.w*0.2, 'gemBlue')
            .setScale(0.2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(`Across the water is a blue gem.
                Fjord the river?`);
            })
            .on('pointerdown', () => {
                if(this.hasItem('sword')){
                    this.showMessage("With your well-trained body, you make it safely to the brilliant blue gem and back");
                    this.tweens.add({
                        targets: blue,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                    });
                    this.gainItem('blue gem');
                }
                else if(this.hasItem('shield')){
                    if(this.hasItem('Gobbers')){
                        this.showMessage("Gobbers uses your shield to travel across the water and obtains the brilliant blue gem!");
                    }
                    else{
                        this.damageHP();
                        let hp = this.checkHP();
                        this.showMessage(`It was a rough ride, and you barely obtain the blue gem. 
                        ${hp} HP left`);
                    }
                    this.tweens.add({
                        targets: blue,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                    });
                    this.gainItem('blue gem');
                }
            });

        this.add.text(this.w * 0.6, this.w * 0.5, "Return")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Head back towards the temple?"))
            .on('pointerdown', () => {
                this.showMessage("You walk back the way you came")
                this.gotoScene('temple');
            });
    }
}

class FinalRoom extends AdventureScene{
    constructor(){
        super("final", "The treasure room!");
    }
    
    onEnter(){
        this.add.image(this.w *0.33, this.w * 0.27, "background").setScale(0.6);
        let treasure = this.add.image(this.w *0.375, this.w * 0.28, "treasure").setScale(0.54);
        this.tweens.add({
            targets: treasure,
            x: '+=' + this.s,
            repeat: 2,
            yoyo: true,
            ease: 'Sine.inOut',
            duration: 1000
        })
        this.time.delayedCall(2000, () =>{
            let dragon = this.add.image(this.w*0.4, this.w*0.3, 'dragon')
                .setScale(0.4)
                .setInteractive()
                .on('pointerover', () => {
                    this.showMessage("Who dares enter my domain?!!");
                })
        })
        this.time.delayedCall(3000, () => {
            let mp = this.checkMP();
            let attack = this.add.text(this.w*0.1, this.w*0.5, 'Attack')
                .setFontSize(this.s *2)
                .setInteractive()
                .on('pointerover', () => {
                    this.showMessage("Charge!");
                })
                .on('pointerdown', () => {
                    var chance = Phaser.Math.Between(1, 3);
                    if(this.hasItem('sword')){
                        if(chance > 1){
                            this.damageDP();
                            let dp = this.checkDP();
                            this.showMessage(`The attack was successful!
                            ${dp} DP left`);
                        }
                    }
                    else if(this.hasItem('Gobbers') && chance > 1){
                        this.damageDP();
                        let dp = this.checkDP();
                        this.showMessage(`The attack was successful!
                        ${dp} DP left`);
                    }
                    else if(this.hasItem('tome') && mp > 0){
                            this.useMP();
                            let mp = this.checkMP();
                            this.damageDP();
                            let dp = this.checkDP();
                            this.showMessage(`The attack was successful!
                            ${mp} MP left.
                            ${dp} DP left`)
                    }
                    else if(chance > 2){
                        this.showMessage('The attack was successful!');
                        this.damageDP();
                        let dp = this.checkDP();
                    }else{
                        this.damageHP();
                        if(this.hasItem('shield') == false){this.damageHP();}
                        let hp = this.checkHP();
                        this.showMessage(`It was a miss. 
                    The dragon breathes fire.
                    ${hp} HP left.`)
                        
                        if(hp <= 0){
                            this.showMessage("You start to lose consciousness");
                            this.time.delayedCall(1000, () => this.gotoScene('outro'));
                        }
                    }
                    if(dp <= 0){
                        this.tweens.add({
                            targets: dragon,
                            y: `-=${2 * this.s}`,
                            alpha: { from: 1, to: 0 },
                            duration: 500,
                        });
                        this.showMessage('The dragon has been defeated!');
                        this.time.delayedCall(1000, () => this.gotoScene('outro'));
                    }
                })
            
            let talk = this.add.text(this.w * 0.3, this.w * 0.5, 'Talk')
                .setFontSize(this.s * 2)
                .setInteractive()
                .on('pointerover', () => this.showImage.message('Please it was a mistake!'))
                .on('pointerdown', () => {
                    if(this.hasItem('Gobbers')){
                        this.showMessage('Hmmmm, you seem like a nice fellow, considering you have befriended my associate, Gobbers. I will share my treasures with you!');
                        this.time.delayedCall(3000, () => this.gotoScene('outro'));
                    }else{
                        this.showMessage("Haha, it's too late! Now fight!");
                    }
            });
        })
    }
}

// class Demo1 extends AdventureScene {
//     constructor() {
//         super("demo1", "First Room");
//     }

//     onEnter() {

//         let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => this.showMessage("Metal, bent."))
//             .on('pointerdown', () => {
//                 this.showMessage("No touching!");
//                 this.tweens.add({
//                     targets: clip,
//                     x: '+=' + this.s,
//                     repeat: 2,
//                     yoyo: true,
//                     ease: 'Sine.inOut',
//                     duration: 100
//                 });
//             });

//         let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage("It's a nice key.")
//             })
//             .on('pointerdown', () => {
//                 this.showMessage("You pick up the key.");
//                 this.gainItem('key');
//                 this.tweens.add({
//                     targets: key,
//                     y: `-=${2 * this.s}`,
//                     alpha: { from: 1, to: 0 },
//                     duration: 500,
//                     onComplete: () => key.destroy()
//                 });
//             })

//         let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 if (this.hasItem("key")) {
//                     this.showMessage("You've got the key for this door.");
//                 } else {
//                     this.showMessage("It's locked. Can you find a key?");
//                 }
//             })
//             .on('pointerdown', () => {
//                 if (this.hasItem("key")) {
//                     this.loseItem("key");
//                     this.showMessage("*squeak*");
//                     door.setText("🚪 unlocked door");
//                     this.gotoScene('demo2');
//                 }
//             })

//     }
// }

// class Demo2 extends AdventureScene {
//     constructor() {
//         super("demo2", "The second room has a long name (it truly does).");
//     }
//     onEnter() {
//         this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage("You've got no other choice, really.");
//             })
//             .on('pointerdown', () => {
//                 this.gotoScene('demo1');
//             });

//         let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage('*giggles*');
//                 this.tweens.add({
//                     targets: finish,
//                     x: this.s + (this.h - 2 * this.s) * Math.random(),
//                     y: this.s + (this.h - 2 * this.s) * Math.random(),
//                     ease: 'Sine.inOut',
//                     duration: 500
//                 });
//             })
//             .on('pointerdown', () => this.gotoScene('outro'));
//     }
// }

// class Intro extends Phaser.Scene {
//     constructor() {
//         super('intro')
//     }
//     create() {
//         this.add.text(50,50, "Adventure awaits!").setFontSize(50);
//         this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
//         this.input.on('pointerdown', () => {
//             this.cameras.main.fade(1000, 0,0,0);
//             this.time.delayedCall(1000, () => this.scene.start('demo1'));
//         });
//     }
// }

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('Menu'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Loading, Studio, Menu, Choice, Gobbers, Temple, GreenRoom, Blueroom, FinalRoom, Outro],
    title: "Adventure Game",
});

