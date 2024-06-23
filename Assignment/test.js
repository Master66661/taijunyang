let triRed;
let triPink;
let triBlue;
let triGreen;
let hand;
let cable;
let globalSpeedX = 0;
var stage = 1;
let triHigh = 387;
let img;

function setup() {
    createCanvas(1280, 720);
    triRed = new Tri(120, 560, 220, triHigh, 320, 560, '#EA715C'); //'#EA715C'
    triPink = new Tri(220, triHigh, 320, 560, 420, triHigh, '#ECC3C6');
    triBlue = new Tri(320, 560, 420, triHigh, 520, 560, '#94C5CD');
    triGreen = new Tri(780, 560, 880, triHigh, 980, 560, '#60C298');
    hand = new Hand();
    cable = new Cable();
    img = loadImage('cic.png');
    frameRate(60);
}

class Tri {
    constructor(x1, y1, x2, y2, x3, y3, color) {
        this.pos1 = createVector(x1, y1);
        this.pos2 = createVector(x2, y2);
        this.pos3 = createVector(x3, y3);
        this.color = color;
        this.size = 80;
        this.ballAngle = 0;

        this.blink = 0;
        this.blinkSpeed = 0.05; // Speed of the blinking
        this.blinkDelay = 60; // Number of frames to wait between blinks (approx 1 second at 60fps)
        this.counter = 0; // Counter to manage the blink delay

        this.triAngle = 0;
        this.adjustAngle = 0;

        this.triAngle2 = 0;
        this.adjustAngle2 = 0;

        this.triAngle3 = 0;
        this.adjustAngle3 = 0;

        this.triAngle4 = 0;
        this.adjustAngle4 = 0;

        this.ballx = 320;
        this.bally = 450;
        this.imagex = 420;
        this.imagey = 500;
        this.imageSize = 100;
        this.imageSize2 = 120;
        this.speedx = 0;
        this.speedx2 = 0;
        this.speedx3 = 0;
        this.speedx4 = 0;

        this.moving = true;
        this.firstRotate = true;
        this.secondRotate = true;
        this.thirdRotate = true;
        this.fourthRotate = true;
        this.fifthRotate = true;
        this.sixthRotate = true;
        this.lastRotate = true;

        this.moving2 = true;
        this.first2Rotate = true;
        this.second2Rotate = true;
        this.third2Rotate = true;
        this.fourth2Rotate = true;
        this.fifth2Rotate = true;
        this.sixth2Rotate = true;
        this.last2Rotate = true;

        this.moving3 = true;
        this.first3Rotate = true;
        this.second3Rotate = true;
        this.third3Rotate = true;
        this.fourth3Rotate = true;
        this.fifth3Rotate = true;
        this.sixth3Rotate = true;
        this.last3Rotate = true;

        this.moving4 = true;
        this.first4Rotate = true;
        this.second4Rotate = true;
        this.third4Rotate = true;
        this.fourth4Rotate = true;
        this.fifth4Rotate = true;
        this.sixth4Rotate = true;
        this.last4Rotate = true;

        this.rotationCenter = createVector(780,560);
        this.rotationRecover = createVector(-780,-560);
    }
    

    display() {
        noStroke();

        fill(this.color);
        push();
        translate(this.rotationCenter.x + globalSpeedX, this.rotationCenter.y);
        rotate(this.triAngle + this.adjustAngle + this.triAngle2 + this.adjustAngle2 + this.triAngle3 +this.adjustAngle3 + this.triAngle4 + this.adjustAngle4);
        translate(this.rotationRecover.x, this.rotationRecover.y);
        triangle(this.pos1.x + this.speedx + this.speedx2 + this.speedx3 + this.speedx4, this.pos1.y,
                 this.pos2.x + this.speedx + this.speedx2 + this.speedx3 + this.speedx4, this.pos2.y,
                 this.pos3.x + this.speedx + this.speedx2 + this.speedx3 + this.speedx4, this.pos3.y);
        pop();
    }

    image() {
        push();
        translate(this.rotationCenter.x + globalSpeedX, this.rotationCenter.y);
        rotate(this.triAngle + this.adjustAngle + this.triAngle2 + this.adjustAngle2 + this.triAngle3 +this.adjustAngle3 + this.triAngle4 + this.adjustAngle4);
        translate(this.rotationRecover.x, this.rotationRecover.y);
        translate(this.imagex+ this.speedx + this.speedx2 + this.speedx3 + this.speedx4,this.imagey);
        rotate(this.ballAngle - this.adjustAngle - this.adjustAngle2 - this.adjustAngle3- this.adjustAngle4);
        imageMode(CENTER);
        image(img, 0, 0, this.imageSize2, this.imageSize);
        pop();
    }


    updateBlink() {
        this.counter += 1;
        if (this.counter < this.blinkDelay) {
            // During the delay, keep eyes open
            this.blink = 7;
        } else if (this.counter < this.blinkDelay + 20) {
            // Blinking phase (adjust 20 to control blink duration)
            this.blink = Math.abs(sin((this.counter - this.blinkDelay) * this.blinkSpeed) * 10);
        } else {
            // Reset counter after the blink
            this.counter = 0;
        }
    }


    ball() {
        this.updateBlink(); // Update the blink value each frame

        push();
        noStroke();
        // Position the ball relative to the triangle
        translate(this.rotationCenter.x + globalSpeedX, this.rotationCenter.y);
        rotate(this.triAngle + this.adjustAngle + this.triAngle2 + this.adjustAngle2 + this.triAngle3 +this.adjustAngle3 + this.triAngle4 + this.adjustAngle4);
        translate(this.rotationRecover.x, this.rotationRecover.y);

        translate(this.ballx + this.speedx + this.speedx2 + this.speedx3 + this.speedx4, this.bally); // Change to triangle's position
        fill(255);
        circle(0, 0, this.size);
        rotate(this.ballAngle - this.adjustAngle - this.adjustAngle2 - this.adjustAngle3- this.adjustAngle4);
        fill('#FBDB3C');
        circle(0, this.size / 6, this.size / 1.5);

        // Eyes
        fill('#55514b');
        ellipse(-4, this.size / 8, 7,this.blink );
        ellipse(20, this.size / 8, 7,this.blink );

        // Noise
        noFill();
        stroke('#55514b');
        strokeWeight(7);
        arc(11,this.size / 8 , 10,28,1.6, PI + QUARTER_PI, OPEN);

        pop();

    }

    firstMove() {
            if (this.moving && this.speedx < 260) {
                this.speedx += 5;
                hand.back();
            } else {
                this.moving = false;
                
            }
            if (!this.moving) {
                if (this.firstRotate && this.adjustAngle < 1.05) {
                    this.adjustAngle += 0.03; // Rotate the triangle around the center
                    hand.perfect();
                } else {
                    this.firstRotate = false;
                }
            }
    }

    secondMove() {
        if (!this.firstRotate) {

            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;     
            
            if (this.secondRotate && this.adjustAngle < 4.17) {
                this.adjustAngle += 0.05; // Rotate the triangle around the center
            } else {
                this.secondRotate = false;
                triBlue.secondRotate = false;
                hand.magic();
                cable.show();

            }
        }
    }

    // cable update
    thirdMove_1() {
        if (!this.secondRotate) {
            this.adjustAngle = 0;
            this.rotationCenter.x = 1280;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -560; 

            if (this.thirdRotate && this.speedx < 325) {
                cable.move();
                this.speedx += 2.5;
                this.triAngle += 0.005;
            } else {
                if (this.speedx > 259) {
                    this.speedx -= 1.50;
                    this.triAngle = 0;
                    cable.back();
                }
                this.thirdRotate = false;
            }
        } 
    }

    thirdMove_2() { 
        if(!this.secondRotate) {
            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;  
    
            
            if (this.fourthRotate && this.adjustAngle < 4.2){
                this.adjustAngle += 0.075; // Rotate the triangle around the center
            } else {
                this.fourthRotate = false;
            }

        }   
    }

    fourthMove() {
        if (!this.fourthRotate) {
            this.rotationCenter.x = 1080;
            this.rotationCenter.y = triHigh + 1;   
            this.rotationRecover.x = -581;
            this.rotationRecover.y = -560;

            if (this.fifthRotate && this.adjustAngle < 7.31){
                this.adjustAngle += 0.0418;
            } else {
                this.fifthRotate = false;
                cable.magic();
            }
        }
    }

    fifthMove() {
        if (!this.fifthRotate){
            this.rotationCenter.x = 1180;
            this.rotationCenter.y = 561;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -558;

            if (this.sixthRotate && this.adjustAngle < 8.35){
                this.adjustAngle += 0.0418;
            } else {
                this.sixthRotate = false;
            }
        }
    }

    sixthMove() {
        if(!this.sixthRotate){
            this.adjustAngle = 0;
            this.rotationCenter.x = 1380;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            if(this.lastRotate && this.speedx < 520){
                this.speedx += 3.615;
            }else {
                this.lastRotate = false;
                this.imageSize = 0.01;
                this.imageSize2 = 0.01;
            }
        }
    }

    resetPositions() {
            globalSpeedX = 0;
            this.adjustAngle = 0;
            this.triAngle = 0;
            this.speedx = 0;
            this.rotationCenter.x = 780;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            triGreen.pos1.set(120, 560);
            triGreen.pos2.set(220, triHigh);
            triGreen.pos3.set(320, 560);
    
            triPink.pos1.set(220, triHigh);
            triPink.pos2.set(320, 560);
            triPink.pos3.set(420, triHigh);
    
            triRed.pos1.set(320, 560);
            triRed.pos2.set(420, triHigh);
            triRed.pos3.set(520, 560);
    
            triBlue.pos1.set(780, 560);
            triBlue.pos2.set(880, triHigh);
            triBlue.pos3.set(980, 560);

    }

    first2Move() {
            if(this.moving2 &&  this.speedx2 < 260){
                this.speedx2 += 5;
                hand.back();
            } else {
                this.moving2 = false;
            }
            if (!this.moving2) {
                if (this.first2Rotate && this.adjustAngle2 < 1.05) {
                    this.adjustAngle2 += 0.03; // Rotate the triangle around the center
                    hand.perfect();
                } else {
                    this.first2Rotate = false;
                }
        }
    }

    second2Move() {
        if (!this.first2Rotate) {

            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;     
            
            if (this.second2Rotate && this.adjustAngle2 < 4.17) {
                this.adjustAngle2 += 0.05; // Rotate the triangle around the center
            } else {
                this.second2Rotate = false;
                triRed.second2Rotate = false;
                hand.magic();
                cable.show();


            }
        }
    }

    third2Move_1() {
        if (!this.second2Rotate) {
            this.adjustAngle2 = 0;
            this.rotationCenter.x = 1280;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -560; 

            if (this.third2Rotate && this.speedx2 < 325) {
                cable.move();
                this.speedx2 += 2.5;
                this.triAngle2 += 0.005;
            } else {
                if (this.speedx2 > 259) {
                    this.speedx2 -= 1.50;
                    this.triAngle2 = 0;
                    cable.back();
                }
                this.third2Rotate = false;
            }
        } 
    }

    third2Move_2() { 
        if(!this.second2Rotate) {
            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;
    
            
            if (this.fourth2Rotate && this.adjustAngle2 < 4.2){
                this.adjustAngle2 += 0.075; // Rotate the triangle around the center
            } else {
                this.fourth2Rotate = false;
            }

        }   
    }

    fourth2Move() {
        if (!this.fourth2Rotate) {
            this.rotationCenter.x = 1080;
            this.rotationCenter.y = triHigh + 1;   
            this.rotationRecover.x = -581;
            this.rotationRecover.y = -560;

            if (this.fifth2Rotate && this.adjustAngle2 < 7.31){
                this.adjustAngle2 += 0.0418;
            } else {
                this.fifth2Rotate = false;
                cable.magic();
            }
        }
    }

    fifth2Move() {
        if (!this.fifth2Rotate){
            this.rotationCenter.x = 1180;
            this.rotationCenter.y = 561;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -558;

            if (this.sixth2Rotate && this.adjustAngle2 < 8.35){
                this.adjustAngle2 += 0.0418;
            } else {
                this.sixth2Rotate = false;
            }
        }
    }

    sixth2Move() {
        if(!this.sixth2Rotate){
            this.adjustAngle2 = 0;
            this.rotationCenter.x = 1380;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            if(this.last2Rotate && this.speedx2 < 520){
                this.speedx2 += 3.615;
            }else {
                this.last2Rotate = false;
            }
        }
    }

    reset2Positions() {
            globalSpeedX = 0;
            this.adjustAngle2 = 0;
            this.triAngle2 = 0;
            this.speedx2 = 0;
            this.rotationCenter.x = 780;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            triBlue.pos1.set(120, 560);
            triBlue.pos2.set(220, triHigh);
            triBlue.pos3.set(320, 560);
    
            triPink.pos1.set(220, triHigh);
            triPink.pos2.set(320, 560);
            triPink.pos3.set(420, triHigh);
    
            triGreen.pos1.set(320, 560);
            triGreen.pos2.set(420, triHigh);
            triGreen.pos3.set(520, 560);
    
            triRed.pos1.set(780, 560);
            triRed.pos2.set(880, triHigh);
            triRed.pos3.set(980, 560);            
    }

    first3Move() {
            if(this.moving3 &&  this.speedx3 < 260){
                this.speedx3 += 5;
                hand.back();
            } else {
                this.moving3 = false;
            }
            if (!this.moving3) {
                if (this.first3Rotate && this.adjustAngle3 < 1.05) {
                    this.adjustAngle3 += 0.03; // Rotate the triangle around the center
                    hand.perfect();
                } else {
                    this.first3Rotate = false;
                }
        }
    }

    second3Move() {
        if (!this.first3Rotate) {

            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;     
            
            if (this.second3Rotate && this.adjustAngle3 < 4.17) {
                this.adjustAngle3 += 0.05; // Rotate the triangle around the center
            } else {
                this.second3Rotate = false;
                triGreen.second3Rotate = false;
                hand.magic();
                cable.show();

            }
        }
    }

    third3Move_1() {
        if (!this.second3Rotate) {
            this.adjustAngle3 = 0;
            this.rotationCenter.x = 1280;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -560; 

            if (this.third3Rotate && this.speedx3 < 325) {
                cable.move();
                this.speedx3 += 2.5;
                this.triAngle3 += 0.005;
            } else {
                if (this.speedx3 > 259) {
                    this.speedx3 -= 1.50;
                    this.triAngle3 = 0;
                    cable.back();
                }
                this.third3Rotate = false;
            }
        } 
    }

    third3Move_2() { 
        if(!this.second3Rotate) {
            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;
    
            
            if (this.fourth3Rotate && this.adjustAngle3 < 4.2){
                this.adjustAngle3 += 0.075; // Rotate the triangle around the center
            } else {
                this.fourth3Rotate = false;
            }

        }   
    }

    fourth3Move() {
        if (!this.fourth3Rotate) {
            this.rotationCenter.x = 1080;
            this.rotationCenter.y = triHigh + 1;   
            this.rotationRecover.x = -581;
            this.rotationRecover.y = -560;

            if (this.fifth3Rotate && this.adjustAngle3 < 7.31){
                this.adjustAngle3 += 0.0418;
            } else {
                this.fifth3Rotate = false;
                cable.magic();
            }
        }
    }

    fifth3Move() {
        if (!this.fifth3Rotate){
            this.rotationCenter.x = 1180;
            this.rotationCenter.y = 561;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -558;

            if (this.sixth3Rotate && this.adjustAngle3 < 8.35){
                this.adjustAngle3 += 0.0418;
            } else {
                this.sixth3Rotate = false;
            }
        }
    }

    sixth3Move() {
        if(!this.sixth3Rotate){
            this.adjustAngle3 = 0;
            this.rotationCenter.x = 1380;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            if(this.last3Rotate && this.speedx3 < 520){
                this.speedx3 += 3.615;
            }else {
                this.last3Rotate = false;
            }
        }
    }

    reset3Positions() {
            this.adjustAngle3 = 0;
            this.triAngle3 = 0;
            this.speedx3 = 0;
            globalSpeedX = 0;
            this.imageSize = 100;
            this.imageSize2 = 120;
    
    
            this.rotationCenter.x = 780;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;
    
            triRed.pos1.set(120, 560);
            triRed.pos2.set(220, triHigh);
            triRed.pos3.set(320, 560);
    
            triPink.pos1.set(220, triHigh);
            triPink.pos2.set(320, 560);
            triPink.pos3.set(420, triHigh);
    
            triBlue.pos1.set(320, 560);
            triBlue.pos2.set(420, triHigh);
            triBlue.pos3.set(520, 560);
    
            triGreen.pos1.set(780, 560);
            triGreen.pos2.set(880, triHigh);
            triGreen.pos3.set(980, 560);
    
    }

    first4Move() {
            if(this.moving4 &&  this.speedx4 < 260){
                this.speedx4 += 5;
                hand.back();
            } else {
                this.moving4 = false;
            }
            if (!this.moving4) {
                if (this.first4Rotate && this.adjustAngle4 < 1.05) {
                    this.adjustAngle4 += 0.03; // Rotate the triangle around the center
                    hand.perfect();
                } else {
                    this.first4Rotate = false;
                }

        }
    }

    second4Move() {
        if (!this.first4Rotate) {

            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;     
            
            if (this.second4Rotate && this.adjustAngle4 < 4.17) {
                this.adjustAngle4 += 0.05; // Rotate the triangle around the center
            } else {
                this.second4Rotate = false;
                triBlue.second4Rotate = false;
                hand.magic();
                cable.show();

            }
        }
    }

    third4Move_1() {
        if (!this.second4Rotate) {
            this.adjustAngle4 = 0;
            this.rotationCenter.x = 1280;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -560; 

            if (this.third4Rotate && this.speedx4 < 325) {
                cable.move();
                this.speedx4 += 2.5;
                this.triAngle4 += 0.005;
            } else {
                if (this.speedx4 > 259) {
                    this.speedx4 -= 1.50;
                    this.triAngle4 = 0;
                    cable.back();
                }
                this.third4Rotate = false;
            }
        } 
    }

    third4Move_2() { 
        if(!this.second4Rotate) {
            this.rotationCenter.x = 880;
            this.rotationCenter.y = triHigh;  
            this.rotationRecover.x = -680;
            this.rotationRecover.y = -triHigh;
    
            
            if (this.fourth4Rotate && this.adjustAngle4 < 4.2){
                this.adjustAngle4 += 0.075; // Rotate the triangle around the center
            } else {
                this.fourth4Rotate = false;
            }

        }   
    }

    fourth4Move() {
        if (!this.fourth4Rotate) {
            this.rotationCenter.x = 1080;
            this.rotationCenter.y = triHigh + 1;   
            this.rotationRecover.x = -581;
            this.rotationRecover.y = -560;

            if (this.fifth4Rotate && this.adjustAngle4 < 7.31){
                this.adjustAngle4 += 0.0418;
            } else {
                this.fifth4Rotate = false;
                cable.magic();
            }
        }
    }

    fifth4Move() {
        if (!this.fifth4Rotate){
            this.rotationCenter.x = 1180;
            this.rotationCenter.y = 561;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -558;

            if (this.sixth4Rotate && this.adjustAngle4 < 8.35){
                this.adjustAngle4 += 0.0418;
            } else {
                this.sixth4Rotate = false;
            }
        }
    }

    sixth4Move() {
        if(!this.sixth4Rotate){
            this.adjustAngle4 = 0;
            this.rotationCenter.x = 1380;
            this.rotationCenter.y = 560;
            this.rotationRecover.x = -780;
            this.rotationRecover.y = -560;

            if(this.last4Rotate && this.speedx4 < 520){
                this.speedx4 += 3.615;
            }else {
                this.last4Rotate = false;
                this.imageSize = 0.01;
                this.imageSize2 = 0.01;
                
            }
        }
    }

    resetAll() {

        this.ballAngle = 0;
        this.triAngle = 0;
        this.adjustAngle = 0;

        this.triAngle2 = 0;
        this.adjustAngle2 = 0;

        this.triAngle3 = 0;
        this.adjustAngle3 = 0;

        this.triAngle4 = 0;
        this.adjustAngle4 = 0;

        this.speedx = 0;
        this.speedx2 = 0;
        this.speedx3 = 0;
        this.speedx4 = 0;

        this.moving2 = true;
        this.first2Rotate = true;
        this.second2Rotate = true;
        this.third2Rotate = true;
        this.fourth2Rotate = true;
        this.fifth2Rotate = true;
        this.sixth2Rotate = true;
        this.last2Rotate = true;

        this.moving3 = true;
        this.first3Rotate = true;
        this.second3Rotate = true;
        this.third3Rotate = true;
        this.fourth3Rotate = true;
        this.fifth3Rotate = true;
        this.sixth3Rotate = true;
        this.last3Rotate = true;

        this.moving4 = true;
        this.first4Rotate = true;
        this.second4Rotate = true;
        this.third4Rotate = true;
        this.fourth4Rotate = true;
        this.fifth4Rotate = true;
        this.sixth4Rotate = true;
        this.last4Rotate = true;

        this.rotationCenter.x = 780;
        this.rotationCenter.y = 560;
        this.rotationRecover.x = -780;
        this.rotationRecover.y = -560;

        triGreen.pos1.set(120, 560);
        triGreen.pos2.set(220, triHigh);
        triGreen.pos3.set(320, 560);

        triPink.pos1.set(220, triHigh);
        triPink.pos2.set(320, 560);
        triPink.pos3.set(420, triHigh);

        triRed.pos1.set(320, 560);
        triRed.pos2.set(420, triHigh);
        triRed.pos3.set(520, 560);

        triBlue.pos1.set(780, 560);
        triBlue.pos2.set(880, triHigh);
        triBlue.pos3.set(980, 560);

    }
    
}

class Hand {
    constructor(){
        this.handx = 460;
        this.handy = 480;
        this.handMove = 0;
        this.speedx = 0;
        this.lineSize = 25;
        this.handSize = 20;
        this.handFind = 0;
        this.circleSize = 30;
    }

    display(){
        push();
        translate(0 + globalSpeedX ,0); // Change to triangle's position
        translate(this.handx + this.speedx, this.handy); // Change to triangle's position
        stroke('#55514b');
        strokeWeight(this.lineSize);
        line(this.handFind,0,(-30) + this.handMove,0);
        strokeWeight(this.handSize);
        noFill();
        arc(0 + this.handMove,0,58,58,1.5, PI + HALF_PI, OPEN);
        noStroke();
        fill(255);
        circle((-30) + this.handMove,0,this.circleSize);
        pop();
    }

    move(){
        this.handMove += 5.2;
    }

    back(){
        if(this.handMove > 0){
            this.speedx += 1.75;
            this.handMove -= 1.75;
            if(this.handMove < 0){
                this.handMove = 0;
            } 
        }
    }

    perfect(){
        this.handFind += 0.5;
    }

    magic(){
        this.handSize = 0;
        this.circleSize = 0;
        this.lineSize = 0;
    }

    reset(){
        this.handx = 460;
        this.handy = 480;
        this.handMove = 0;
        this.speedx = 0;
        this.lineSize = 25;
        this.handSize = 20;
        this.handFind = 0;
        this.circleSize = 30;
        this.angle = 0;
    }
}

class Cable{
    constructor() {
        this.cablex = 980;
        this.cabley = 460;
        this.cableMove = 0;
        this.speedx = 0;
        this.cableSize = 0;
    }

    display() {
        push();
        translate(0 + globalSpeedX ,0); 
        translate(this.cablex + this.speedx, this.cabley); 
        noFill();
        stroke('#55514b');
        strokeWeight(this.cableSize);
        curve(360, -100, 60 + this.cableMove, 33, 0, -10, 0, 0);
        stroke('white');
        curve(360, -100, 60 + this.cableMove, 20, 0, 3, 0, 0);
        curve(360, -50, 60 + this.cableMove, 20, 0, 38, 0, 0);
        curve(360, -50, 60 + this.cableMove, 60, 0, 50, 0, 0);
        stroke('#55514b');
        curve(360, -100, 60 + this.cableMove, 43, 0, 11, 0, 0);
        // curve(360, -100, 100 + this.cableMove, 30, 0, 28, 0, 0);
        // line(this.handFind,0,(-30) + this.handMove,0);
        pop();

        // this.cableMove += 1;
    }

    show(){
        this.cableSize = 11;
    }

    move(){
        this.cableMove += 4.5;
    }

    back(){
        this.cableMove -= 2.5;
    }

    magic(){
        this.cableSize = 0;
    }

    reset() {
        this.cablex = 980;
        this.cabley = 460;
        this.cableMove = 0;
        this.speedx = 0;
        this.cableSize = 0;
    }





}

function draw() {
    // Set background color
    background('#FBDB3C');
    image(img, 500, 10, 170, 150);
    // movements();

    // triBlue.hand();
    // triRed.hand();
    // triGreen.hand();
    hand.display();
    cable.display();

    triRed.display();
    triBlue.display();
    triBlue.image();
    triGreen.display();
    triPink.display();

    triPink.ball();
    push();
    fill(0, 0, 0, 3); // Black color with transparency
    quad(0, -500, 850, 0, 400, 800, -800, 600);
    pop();

    fill(0);

    switch(stage) {
        case 1:
            if (globalSpeedX > -58){
                globalSpeedX -= 0.69;

                hand.move();
            } else {
                stage = 2;
            }

            break;

        case 2:
            if (globalSpeedX > -676.6){
                globalSpeedX -= 1.69;

                triRed.firstMove();
                triPink.firstMove();
                triBlue.firstMove();

                triPink.secondMove();
                triRed.secondMove();
                triRed.thirdMove_1();
                triBlue.thirdMove_2();

                triBlue.fourthMove();
                triBlue.fifthMove();
                triBlue.sixthMove();
            } else {
                hand.reset();
                cable.reset();
                triRed.resetPositions();
                triPink.resetPositions();
                triGreen.resetPositions();
                triBlue.resetPositions();
                stage = 3;
            }

            break;

        case 3:
            if (globalSpeedX > -58){
                globalSpeedX -= 0.69;

                hand.move();
            } else {
                stage = 4;
            }

            break;

        case 4: 
            if(globalSpeedX > -676.6){
            globalSpeedX -= 1.69;

            triRed.first2Move();
            triPink.first2Move();
            triGreen.first2Move();

            triPink.second2Move();
            triGreen.second2Move();
            triGreen.third2Move_1();
            triRed.third2Move_2();

            triRed.fourth2Move();
            triRed.fifth2Move();
            triRed.sixth2Move();

        } else {
            triRed.reset2Positions();
            triPink.reset2Positions();
            triGreen.reset2Positions();
            triBlue.reset2Positions();
            stage = 5;
            hand.reset();
            cable.reset();
        } 

        break;

        case 5:
            if (globalSpeedX > -58){
                globalSpeedX -= 0.69;

                hand.move();
            } else {
                stage = 6;
            }

            break;


        case 6:
            if(globalSpeedX > -676.6){
                globalSpeedX -= 1.69;

                triBlue.first3Move();
                triPink.first3Move();
                triGreen.first3Move();

                triPink.second3Move();
                triBlue.second3Move();
                triBlue.third3Move_1();
                triGreen.third3Move_2();

                triGreen.fourth3Move();
                triGreen.fifth3Move();
                triGreen.sixth3Move();

            } else {
                triRed.reset3Positions();
                triPink.reset3Positions();
                triGreen.reset3Positions();
                triBlue.reset3Positions();
                thirdStep = true;
                stage = 7;
                hand.reset();
                cable.reset();
            }      

            break;

        case 7:
            if (globalSpeedX > -58){
                globalSpeedX -= 0.69;

                hand.move();
            } else {
                stage = 8;
            }

            break;
            
        case 8:
            if(globalSpeedX > -676.6){
                globalSpeedX -= 1.69;
        
                triRed.first4Move();
                triPink.first4Move();
                triBlue.first4Move();
            
                triPink.second4Move();
                triRed.second4Move();
                triRed.third4Move_1();
                triBlue.third4Move_2();
            
                triBlue.fourth4Move();
                triBlue.fifth4Move();
                triBlue.sixth4Move();
            } else {
                fourthStep = true;
                stage = 9;
            }

            break;
            
        case 9:
            hand.reset();
            cable.reset();
            triBlue.resetAll();
            triPink.resetAll();
            triGreen.resetAll();
            triRed.resetAll();

            globalSpeedX = 0;
            stage = 3;
            break;
    }
}