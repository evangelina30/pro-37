//Create variables here
var gamestate;
var dog,happyDog,sadDog;
var happydog;
var database;
var sfood;
var foodObj;
var feed,addFood;
var fedTime,lastFed,currentTime;
var foodstock;
var BackgroundImage;
var bedroom,washroom,garden;
var readState;
function preload()
{
	//load images here
 
  dogimage = loadImage("images/dogImg.png");
  happydog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
 
}

function setup() {
  database = firebase.database();
	createCanvas(1000, 1000);


  dog = createSprite(150,150,50,50);
  dog.addImage(dogimage);
  dog.scale=0.15;

  feed=createButton("Feed the dog")
   feed.position(700,95);
    feed.mousePressed(feedDog);

     addFood=createButton("Add Food");
     addFood.position(800,95);
     addFood.mousePressed(addFoods);

  foodstock=database.ref('Food');
  foodstock.on("value",readStock);
 

  fedTime=database.ref('FeedTime');
    fedTime.on("value",function(data){
       lastFed=data.val();
       });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  

  
  
  currentTime=hour();
   if(currentTime==(lastFed+1)){ update("Playing");
    foodObj.garden();
   }else if(currentTime==(lastFed+2)){
      update("Sleeping"); foodObj.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
        update("Bathing"); 
        foodObj.washroom();
       }else{ update("Hungry")
       foodObj.display();
       }

    if(gamestate!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(dogimage);
    }       
            drawSprites(); 
          }
function readStock(data){ 
foodS=data.val();

 }
 function feedDog(){ 
   dog.addImage(happyDog); 
   foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
   database.ref('/').update({
      Food:foodObj.getFoodStock(), 
      FeedTime:hour(),
       gameState:"Hungry"
       })
       } 
       //function to add food in stock
       
       function addFoods(){ 
          foodS++; database.ref('/').update({ Food:foodS })
         } 
         //update gameState 
         function update(state){
            database.ref('/').update({ 
              gameState:state 
            })

          }
