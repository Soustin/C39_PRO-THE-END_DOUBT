var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound, trexSound, gameOvrSound1, gameOvrSound2;
var backGround, backGroundImg;

function preload(){
  trex_running = loadAnimation("Dino_Running_1.png", "Dino_Running_2.png", "Dino_Running_3png.png", "Dino_Running_4.png", "Dino_Running_5.png", "Dino_Running_6.png");
  trex_collided = loadAnimation("Dino_Collided_1.png", "Dino_Collided_2.png", "Dino_Collided_3.png", "Dino_Collided_4.png", "Dino_Collided_5.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Thorny_1.png");
  obstacle2 = loadImage("Thorny_2.png");
  obstacle3 = loadImage("Thorny_3.png");
  obstacle4 = loadImage("Thorny_4.png");
  obstacle5 = loadImage("Thorny_5.png");
  obstacle6 = loadImage("Thorny_6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  backGroundImg = loadImage("cartoon-desert-bg for C39 Pro.jpg")
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  gameOvrSound1 = loadSound("mixkit-sad-game-over-trombone-471.wav");
  gameOvrSound1 = loadSound("mixkit-spooky-game-over-1948.wav")
  // trexSound = loadSound("TrexSoundMix.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  backGround = createSprite(0, displayHeight/2, displayWidth*2, displayHeight);
  backGround.addImage(backGroundImg);
  backGround.scale = 5;

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.velocityX = 10;
  

  trex.scale = 0.8;
  
  ground = createSprite(width/6, height-50, windowWidth, 20);
  ground.addImage("ground",groundImage);
  // ground.x = ground.width /2;
  
  gameOver = createSprite(width/4, height-250, 25, 25);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/6, displayWidth - 960);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/300, height-35, windowWidth, 10);
  invisibleGround.visible = false;
  // camera.position.x = invisibleGround.x;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;

  // if (typeof trexSound.loop == 'boolean')
  // {
  //     trexSound.loop = true;
  // }
  
}

function draw() {
  
  background(180);
  
  // trexSound.loop();

  // camera.position.x = displayWidth-700
  
  if(gameState === PLAY){

    push();
    camera.position.x = trex.x;
    pop();
    // camera.position.y = displayHeight/2; 

    trex.setAnimation("running", trex_running);

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)

    // gameOver.velocityX = -4;
    // restart.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }

    if (ground.x < camera.position.x){
      ground.x = camera.position.x+200;
    }

    if (invisibleGround.x < camera.position.x){
      invisibleGround.x = camera.position.x+200;
    }

    if (backGround.x < camera.position.x - 200){
      backGround.x = camera.position.x+180;
    }

    // if (gameOver.x < camera.position.x){
    //   gameOver.x = camera.position.x+10;
    // }

    // if (restart.x < camera.position.x){
    //   restart.x = camera.position.x+10;
    // }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play();
        trex.changeAnimation("collided", trex_collided);
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();

      // trex.x != camera.position.x;
      // trex.x = windowWidth/2;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);

      gameOvrSound1.play();
     
      ground.velocityX = 0;
      // trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1); 
     
   if(mousePressedOver(restart)) {
     reset();
     trex.changeAnimation("running", trex_running);
    }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();

  //displaying score
  textSize(30)
  text("Score: "+ score, camera.position.x-800, windowHeight/10);

}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 200 === 0){
   var obstacle = createSprite(random(windowWidth, windowWidth), windowHeight-50, 10, 40);
  //  obstacle.velocityX = -(6 + score/100);

  obstacle.y = Math.round(random(windowHeight-60, windowHeight-50));
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }

    if (obstacle.x < camera.position.x){
      obstacle.x = camera.position.x+700;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   
    obstaclesGroup.setColliderEach("rectangle",0,0,98,obstacle.height);
    obstaclesGroup.debug = true
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 50 === 0) {
    var cloud = createSprite(random(windowWidth +200, windowWidth+1000), 120, 40, 10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    // cloud.velocityX = -3;

    if (cloud.x < camera.position.x){
      cloud.x = camera.position.x+700;
    }
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

