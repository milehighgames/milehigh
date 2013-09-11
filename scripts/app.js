"use strict";function PlaneLayout(a){var b=[],c=0;this.aisles=[];for(var d=0;d<a.length;d++){if(0===d&&(c=a[d].length),c!==a[d].length)throw new Error("initPlaneLayout: Rows are not all the same length.");b.push(a[d].split(""))," "===a[d][0]&&this.aisles.push(d)}this.planeLayout=b,this.width=c,this.height=b.length,this.numAisles=this.aisles.length,this.lavs=[];for(var e,d=0;d<this.width;d++)for(var f=0;f<this.height;f++)e={x:d,y:f},this.isLocationALavatory(e)&&this.lavs.push(e)}function World(a,b,c){this.planeLayout=new PlaneLayout(a),this.player=c,this.player.state=World.PlayerState.HORNY,this.currentObstacle=null,this.travelers=[],this.attendants=[],this.numMovingNPOs=0,this.initRandomTravelersAtSpecificSeats(b),this.initCrew()}function GameStats(){this.turns=0,this.scores=0,this.attemptedScores=0,this.failedScores=0,this.levelsCompleted=0,this.startTime=(new Date).getTime()}function Traveler(a,b){b=b||{},this.id=a,this.x=b.x||0,this.y=b.y||0,this.heat=0,this.baseHeat=Math.floor(Math.random(10)),this.encounters=0,this.blocks=0,this.paired=!1,this.moving=!1,this.returning=!1,this.lavatoryUsage=0}function Attendant(a){this.side=0===a.aisleCol?-1:1,this.x=this.originalX=a.aisleCol,this.y=a.aisleRow,this.direction=this.side>0?"l":"r",this.inSeat=!0,this.speed=1,this.hasCart=!0}PlaneLayout.prototype.arrayForRender=function(){return this.planeLayout},PlaneLayout.prototype.findRandomSeat=function(){for(var a,b,c=this.height,d=this.width;;)if(a=Math.floor(Math.random()*c),b=Math.floor(Math.random()*d),"O"===this.planeLayout[a][b])return{x:b,y:a}},PlaneLayout.prototype.isSeatTaken=function(a,b){for(var c=0;c<b.length;c++)if(a.y===b[c].y&&a.x===b[c].x)return!0},PlaneLayout.prototype.isLocationOutOfBounds=function(a){return a.y<0||a.x<0||a.y>this.height-1||a.x>this.width-1?!0:!1},PlaneLayout.prototype.isLocationASeat=function(a){return this.isLocationOutOfBounds(a)?!1:"O"===this.planeLayout[a.y][a.x]?!0:!1},PlaneLayout.prototype.isLocationALavatory=function(a){return this.isLocationOutOfBounds(a)?!1:"+"===this.planeLayout[a.y][a.x]?!0:!1},PlaneLayout.prototype.isLocationUnMoveable=function(a,b){var c=b.x,d=b.y;if(this.isLocationOutOfBounds(b))return!0;switch(this.planeLayout[d][c]){case"O":case" ":case"+":return a.y===d&&(this.isLocationASeat(a)||this.isLocationASeat(b))?!0:!1;default:return!0}},PlaneLayout.prototype.atLeftEdge=function(a){return 0===a.x},PlaneLayout.prototype.atRightEdge=function(a){return a.x===this.width-1},PlaneLayout.prototype.atTopEdge=function(a){return 0===a.y},PlaneLayout.prototype.atBottomEdge=function(a){return a.y===this.height-1},World.PlayerState={HORNY:1,FLIRTING:2,PAIRED:3,IN_LAVATORY:4},World.Obstacle={LANDING:1,TURBULENCE:2,SNACKS:3,TERRIST:4,TURBULENCE_IMMINENT:5},World.PAIRING_HEAT_THRESHOLD=10,World.NPO_MOVE_PROBABILITY=.05,World.MAX_MOVING_NPOS=3,World.MAX_TRAVELER_LAVATORY_OCCUPANCY_TURNS=3,World.TURBULENCE_PROBABILITY=.02,World.SNACK_PROBABILITY=.1,World.prototype.initRandomTravelersAtSpecificSeats=function(a){for(var b,c,d,e=0;a>e;e++){for(b=!0;b;)c=this.planeLayout.findRandomSeat(),b=this.planeLayout.isSeatTaken(c,this.travelers);d=new Traveler("T"+e,c),this.travelers.push(d)}},World.prototype.initCrew=function(){for(var a=0,b=-1;a<this.planeLayout.aisles.length;a++)this.attendants.push(new Attendant({aisleRow:this.planeLayout.aisles[a],aisleCol:-1===b?0:this.planeLayout.width-1})),b=-b},World.prototype.spaceNotAvailableToMoveTo=function(a,b){var c=b.x,d=b.y;if(this.planeLayout.isLocationUnMoveable(a,{x:c,y:d}))return!0;for(var e=0;e<this.travelers.length;e++)if(c===this.travelers[e].x&&d===this.travelers[e].y&&!this.travelers[e].paired)return!0;return this.isAttendantAtLocation(b)?!0:!1},World.prototype.isAttendantAtLocation=function(a){for(var b=0;b<this.attendants.length;b++)if(this.attendants[b].hitTest(a))return!0},World.prototype.canIMoveLeft=function(a){var b={x:a.x,y:a.y};return this.planeLayout.atLeftEdge(b)?!1:this.spaceNotAvailableToMoveTo(b,{x:b.x-1,y:b.y})?!1:!0},World.prototype.canIMoveRight=function(a){var b={x:a.x,y:a.y};return this.planeLayout.atRightEdge(b)?!1:this.spaceNotAvailableToMoveTo(b,{x:b.x+1,y:b.y})?!1:!0},World.prototype.canIMoveUp=function(a){var b={x:a.x,y:a.y};return this.planeLayout.atTopEdge(b)?!1:this.spaceNotAvailableToMoveTo(b,{x:b.x,y:b.y-1})?!1:!0},World.prototype.canIMoveDown=function(a){var b={x:a.x,y:a.y};return this.planeLayout.atBottomEdge(b)?!1:this.spaceNotAvailableToMoveTo(b,{x:b.x,y:b.y+1})?!1:!0},World.prototype.getTravelerAtLocation=function(a){for(var b=null,c=0,d=this.travelers.length;d>c;c++)if(this.travelers[c].x===a.x&&this.travelers[c].y===a.y){b=this.travelers[c];break}return b},World.prototype.getClosestAisle=function(a){for(var b=this.planeLayout.aisles[0],c=1;c<this.planeLayout.aisles.length;c++)Math.abs(this.planeLayout.aisles[c]-a)<b&&(b=this.planeLayout.aisles[c]);return b},World.prototype.getNearbyTravelers=function(a){var b=[],c={x:this.player.x,y:this.player.y},d={};a=a||{};for(var e=-1;1>=e;e++){d.x=c.x+e;for(var f=-1;1>=f&&(d.y=c.y+f,!(this.planeLayout.isLocationASeat(d)&&this.planeLayout.isSeatTaken(d,this.travelers)&&(b.push(this.getTravelerAtLocation(d)),a.breakOnMatch)));f++);}return b},World.prototype.updateTravelerHeatLevels=function(a){for(var b,c=0,d=this.travelers.length;d>c;c++){b=!1;for(var e=0;e<a.length;e++)if(a[e].id===this.travelers[c].id){b=!0;break}b?this.travelers[c].heat+=1:this.travelers[c].heat=0}},World.prototype.resetTravelerHeatLevels=function(){for(var a=0,b=this.travelers.length;b>a;a++)this.travelers[a].heat=0},World.prototype.travelersReadyToPair=function(a){for(var b=[],c=0,d=this.travelers.length;d>c;c++)for(var e=0;e<a.length;e++)a[e].id===this.travelers[c].id&&this.travelers[c].heat>=World.PAIRING_HEAT_THRESHOLD&&b.push(this.travelers[c]);return b},World.prototype.pairedTravelers=function(){return this.travelers.filter(function(a){return a.paired})},World.prototype.playerInLavatory=function(){return this.planeLayout.isLocationALavatory(this.player)?!0:!1},World.prototype.findTravelersARandomPlaceToSit=function(a){var b,c,d=this.planeLayout,e=this.travelers;a.forEach(function(a){for(c=!0;c;)b=d.findRandomSeat(),c=d.isSeatTaken(b,e);a.x=b.x,a.y=b.y})},World.prototype.findClosestLavatoryTo=function(a){var b,c,d=2*this.planeLayout.width;return this.planeLayout.lavs.forEach(function(e){b=this.getCartesianDistance(a,e),d>b&&(d=b,c=e)},this),c},World.prototype.getCartesianDistance=function(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)},World.prototype.clearAllPairings=function(){this.travelers.forEach(function(a){a.unpair()})},World.prototype.inTurbulence=function(){return this.currentObstacle===World.Obstacle.TURBULENCE},World.prototype.isAttendantAtEndOfAisle=function(a){return"l"===a.direction?a.hasCart?a.x<=2:this.planeLayout.atLeftEdge(a):a.hasCart?a.x>=this.planeLayout.width-3:this.planeLayoutatRightEdge(a)},World.prototype.canAttendantMoveTo=function(a){return!(this.getTravelerAtLocation(a)||this.player.x===a.x&&this.player.y===a.y)},World.prototype.startTravelerTripToLavatory=function(a){a.moving=!0,a.ogX=a.x,a.ogY=a.y,a.destination=this.findClosestLavatoryTo(a),console.log("moving passenger "+a.id+" to lav at ",a.destination),a.targetAisle=this.getClosestAisle(a.destination.y),console.log("target aisle: "+a.targetAisle)},World.prototype.startTravelerTripToSeat=function(a){a.destination={x:a.ogX,y:a.ogY},a.returning=!0,console.log("moving back to seat",a.destination)},World.prototype.moveTravelerToLavatory=function(a){a.x===a.destination.x&&a.y===a.destination.y?(a.lavatoryUsage++,a.lavatoryUsage>World.MAX_TRAVELER_LAVATORY_OCCUPANCY_TURNS+1&&(a.lavatoryUsage=0,this.startTravelerTripToSeat(a))):this.moveTraveler(a)},World.prototype.moveTravelerToSeat=function(a){a.x===a.destination.x&&a.y===a.destination.y?(a.moving=a.returning=!1,this.numMovingNPOs--,console.log("traveler back at seat!",a.destination)):this.moveTraveler(a)},World.prototype.moveTraveler=function(a){var b=a.x,c=a.y;a.y===a.targetAisle&&a.x===a.destination.x?c+=a.destination.y>a.y?1:-1:a.y!==a.targetAisle?c+=a.returning&&a.x===a.destination.x?a.y>a.destination.y?-1:1:a.targetAisle>a.y?1:-1:a.x!==a.destination.x&&(b+=a.destination.x>a.x?1:-1),(this.player.x!==b||this.player.y!==c)&&(this.isAttendantAtLocation({x:b,y:c})&&c===a.targetAisle&&(c+=1),a.x=b,a.y=c)},Traveler.prototype.pair=function(a){this.paired=!0,this.x=a.x,this.y=a.y;var b=new CustomEvent("audio",{detail:"whistle"});window.dispatchEvent(b)},Traveler.prototype.unpair=function(){this.paired=!1},Traveler.prototype.canMove=function(){return 0===this.heat&&!this.paired},Attendant.prototype.walk=function(){this.inSeat=!1},Attendant.prototype.move=function(){this.x=this.getNextMoveLocationX()},Attendant.prototype.hitTest=function(a){return this.inSeat?!1:this.y!==a.y?!1:this.x===a.x?!0:this.hasCart&&Math.abs(this.x-a.x)<=2?"l"===this.direction?a.x<this.x:a.x>this.x:void 0},Attendant.prototype.getNextMoveLocationX=function(){return this.x+("l"===this.direction?-1:1)*this.speed},Attendant.prototype.getNextMoveCartLocationX=function(){return this.getNextMoveLocationX()+("l"===this.direction?-2:2)},Attendant.prototype.returnToSeat=function(){this.direction="l"===this.direction?"r":"l",this.speed=2},Attendant.prototype.sit=function(){this.speed=1,this.inSeat=!0,this.direction=this.side>0?"l":"r",this.x=this.originalX};var MileHigh=function(){var a=20,b=["#OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO###","+OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO+#+","                                       ","#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO+#","#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO##","#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO+#","                                       ","+OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO+#+","#OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO###"];this.player=this.initPlayer(),this.world=new World(b,a,this.player),window.AudioContext&&(this.audio=this.initAudio()),this.controls=this.initControls(this.player),this.gameStats=new GameStats,this.initObstacles()};MileHigh.prototype.lastTurnTime=0,MileHigh.prototype.score=0,MileHigh.prototype.nextTurn=function(a){var b=Math.floor((a-this.lastTurnTime)/1e3);(!a||0===this.lastTurnTime||b>=1)&&(this.lastTurnTime=a||0,this.playTurn())},MileHigh.prototype.updateScore=function(a){var b=new CustomEvent("audio",{detail:"playerScore"});window.dispatchEvent(b),this.score+=a,document.getElementById("score").textContent=this.score},MileHigh.prototype.playTurn=function(){switch(this.moveNPOs(),this.player.state){case World.PlayerState.HORNY:this.checkForFlirting();break;case World.PlayerState.FLIRTING:this.checkForPairing();break;case World.PlayerState.PAIRED:this.world.playerInLavatory()&&(this.player.state=World.PlayerState.IN_LAVATORY);break;case World.PlayerState.IN_LAVATORY:this.updateScore(this.world.pairedTravelers().length),this.resetPlayerState()}switch(this.getObstacle()){case World.Obstacle.LANDING:this.gameOver();break;case World.Obstacle.TURBULENCE_IMMINENT:this.seatBeltsAlert();break;case World.Obstacle.TURBULENCE:this.updateTurbulence();break;case World.Obstacle.SNACKS:console.log("snack time!"),this.addSnackCarts()}this.gameStats.turns++},MileHigh.prototype.checkForFlirting=function(){var a=this.world.getNearbyTravelers({breakOnMatch:!0});return 0===a.length?(this.player.state=World.PlayerState.HORNY,this.world.resetTravelerHeatLevels(),void 0):(a.length>0&&(this.player.state=World.PlayerState.FLIRTING),void 0)},MileHigh.prototype.checkForPairing=function(){if(this.world.currentObstacle!==World.Obstacle.TURBULENCE&&this.world.currentObstacle!==World.Obstacle.TURBULENCE_IMMINENT){var a=this.world.getNearbyTravelers();if(0===a.length&&(this.player.state=World.PlayerState.HORNY),this.world.updateTravelerHeatLevels(a),this.pairedTravelers=this.world.travelersReadyToPair(a),this.world.travelersReadyToPair(a).length>0){this.player.state=World.PlayerState.PAIRED;var b=this.player;this.pairedTravelers.forEach(function(a){a.pair(b)})}}},MileHigh.prototype.resetPlayerState=function(){this.world.findTravelersARandomPlaceToSit(this.world.pairedTravelers()),this.world.clearAllPairings(),this.player.state=World.PlayerState.HORNY},MileHigh.prototype.moveAttendants=function(){this.world.attendants.forEach(function(a){a.inSeat||(this.currentObstacle===World.Obstacle.TURBULENCE&&a.returnToSeat(),this.isAttendantAtEndOfAisle(a)?a.sit():this.canAttendantMoveTo({x:a.getNextMoveCartLocationX(),y:a.y})&&a.move())},this.world)},MileHigh.prototype.moveTravelers=function(){this.world.travelers.forEach(function(a){a.canMove()&&(a.moving?a.returning?this.moveTravelerToSeat(a):this.currentObstacle===World.Obstacle.TURBULENCE_IMMINENT||this.currentObstacle===World.Obstacle.TURBULENCE?this.startTravelerTripToSeat(a):this.moveTravelerToLavatory(a):this.numMovingNPOs<World.MAX_MOVING_NPOS&&Math.random()<=World.NPO_MOVE_PROBABILITY&&(this.startTravelerTripToLavatory(a),this.numMovingNPOs++))},this.world)},MileHigh.prototype.moveNPOs=function(){this.moveAttendants(),this.moveTravelers()},MileHigh.prototype.initControls=function(a){function b(b){var d=new CustomEvent("audio",{detail:"playerMove"});window.dispatchEvent(d),"L"===b&&c.canIMoveLeft(a)?a.x--:"R"===b&&c.canIMoveRight(a)?a.x++:"U"===b&&c.canIMoveUp(a)?a.y--:"D"===b&&c.canIMoveDown(a)&&a.y++}var c=this.world,d={};window.addEventListener("keydown",function(a){37===a.keyCode?b("L"):38===a.keyCode?b("U"):39===a.keyCode?b("R"):40===a.keyCode&&b("D")},!1),window.addEventListener("touchstart",function(a){a.preventDefault(),1===a.touches.length&&(d.startX=a.touches[0].pageX,d.startY=a.touches[0].pageY)},!1),window.addEventListener("touchmove",function(a){a.preventDefault(),d.stopX=a.touches[0].pageX,d.stopY=a.touches[0].pageY},!1),window.addEventListener("touchend",function(a){a.preventDefault(),d.startY>d.stopY+100?b("U"):d.startY<d.stopY-50?b("D"):d.startX>d.stopX-50?b("L"):d.startX<d.stopX+50&&b("R")},!1)},MileHigh.prototype.initPlayer=function(){return{x:2,y:3,width:23,height:23,state:null}},MileHigh.PIECE_SIZE=25,MileHigh.renderSimpleSquare=function(a,b,c,d){var e=b*MileHigh.PIECE_SIZE+1,f=c*MileHigh.PIECE_SIZE+1,g=MileHigh.PIECE_SIZE-2,h=MileHigh.PIECE_SIZE-2;a.fillStyle=d,a.fillRect(f,e,g,h)},MileHigh.renderImageData=function(a,b,c,d){var e=b*MileHigh.PIECE_SIZE,f=c*MileHigh.PIECE_SIZE;a.drawImage(d,e,f)},MileHigh.prototype.render=function(a,b,c){this.beginRendering(a,b,c),this.renderPlane(a,this.world.planeLayout,b,c),this.renderTravelers(a,this.world.travelers,b,c),this.renderCrew(a),this.renderPlayer(a),this.renderHUD(a,this.gameStats,b,c),this.endRendering(a)},MileHigh.prototype.beginRendering=function(a,b,c){if(a.save(),this.world.currentObstacle===World.Obstacle.TURBULENCE){var d=Math.random(),e=Math.random(),f=10*d,g=10*e;this.jiggleX=0===10*d%2?-f:f,this.jiggleY=0===10*e%2?-g:g,a.translate(this.jiggleX,this.jiggleY)}else a.clearRect(0,0,b,c)},MileHigh.prototype.endRendering=function(a){a.translate(-this.jiggleX,-this.jiggleY),a.restore()},MileHigh.prototype.renderPlane=function(a,b,c){function d(b,c,d){var e=b*j,f=c*j,g=j,h=j;a.fillStyle=d,a.fillRect(f,e,g,h)}function e(b,c,d){var e=b*j,f=c*j;a.drawImage(d,f,e)}function f(a,b){e(a,b,window.imgSeat)}function g(a,b){d(a,b,"#0D0")}function h(a,b){d(a,b,"#888")}function i(){}var j=25;a.clearRect(0,0,b,c);for(var k=this.world.planeLayout.arrayForRender(),l=0;l<k.length;l++)for(var m=0;m<k[0].length;m++)switch(k[l][m]){case"O":f(l,m);break;case" ":i(l,m);break;case"+":g(l,m);break;default:h(l,m)}},MileHigh.TRAVELER_INITIAL_COLOR_RGB=[0,143,255],MileHigh.TRAVELER_COLOR_HEX="#008",MileHigh.prototype.getHeatColor=function(){function a(a,c,d){return b(a)+b(c)+b(d)}function b(a){return a=parseInt(a,10),isNaN(a)?"00":(a=Math.max(0,Math.min(a,255)),"0123456789ABCDEF".charAt((a-a%16)/16)+"0123456789ABCDEF".charAt(a%16))}var c=255/World.PAIRING_HEAT_THRESHOLD,d=MileHigh.TRAVELER_INITIAL_COLOR_RGB[1]/World.PAIRING_HEAT_THRESHOLD,e=MileHigh.TRAVELER_INITIAL_COLOR_RGB[2]/World.PAIRING_HEAT_THRESHOLD;return function(b){var f,g,h;return f=MileHigh.TRAVELER_INITIAL_COLOR_RGB[0]+b*c,g=MileHigh.TRAVELER_INITIAL_COLOR_RGB[1]-b*d,h=MileHigh.TRAVELER_INITIAL_COLOR_RGB[2]-b*e,a(f,g,h)}}(),MileHigh.prototype.renderTravelers=function(a){function b(b,d,e){MileHigh.renderSimpleSquare(a,b,d,e>0?c.getHeatColor(e):MileHigh.TRAVELER_COLOR_HEX)}for(var c=this,d=this.world.travelers,e=0;e<d.length;e++)d[e].paired||b(d[e].y,d[e].x,d[e].heat)},MileHigh.ATTENDANT_COLOR="#0000ff",MileHigh.CART_COLOR="#fff",MileHigh.prototype.renderCrew=function(a){this.world.attendants.forEach(function(b){if(!b.inSeat){var c=b.y,d=b.x,e="r"===b.direction?1:-1;MileHigh.renderSimpleSquare(a,c,d,MileHigh.ATTENDANT_COLOR),b.hasCart&&(MileHigh.renderSimpleSquare(a,c,d+1*e,MileHigh.CART_COLOR),MileHigh.renderSimpleSquare(a,c,d+2*e,MileHigh.CART_COLOR))}})},MileHigh.prototype.renderPlayer=function(a){var b=25;MileHigh.renderImageData(a,this.player.x,this.player.y,window.imgPlayer);var c=this.world.pairedTravelers().length;c>0&&(a.font="10pt Arial",a.fillStyle="white",a.textAlign="center",a.fillText(c+"",this.player.x*b+b/2+1,this.player.y*b+b/2+6))},MileHigh.prototype.renderHUD=function(a,b){var c=document.getElementById("turnCounter"),d=document.getElementById("turnsLeftCounter");c.textContent=b.turns,d.textContent=this.maxTurns-b.turns},MileHigh.prototype.renderText=function(a,b,c,d){a.textAlign="left",a.fillStyle="white",a.fillText(b,c,d)},MileHigh.prototype.initAudio=function(){function a(){var a=10,b=new Float32Array(a),c=new Float32Array(a),d=null;for(d=0;a>d;d++)b[d]=Math.sin(Math.PI*d/a);for(d=0;a>d;d++)c[d]=Math.cos(Math.PI*d/a);return o.createWaveTable(b,c)}function b(){var a=10,b=new Float32Array(a),c=null;for(c=0;c<b.length;c++)b[c]=c%2;return o.createWaveTable(b,b)}function c(c){"CustomSine"===c?n.setWaveTable(a()):"CustomSquare"===c?n.setWaveTable(b()):"Square"===c&&(n.type=1)}function d(a){p.gain.value=a}function e(a){n.frequency.value=a}function f(){n.noteOff(0)}function g(){n.noteOn(0)}function h(a,b,h){n&&f(),n=o.createOscillator(),c(a),e(b),p=o.createGainNode(),d(h),n.connect(p),p.connect(o.destination),g()}function i(){h("CustomSquare",293.66,.6),setTimeout(function(){e(246.94),setTimeout(f,500)},500)}function j(){h("CustomSine",400,.6),setTimeout(function(){e(600),setTimeout(function(){f(),setTimeout(function(){h("CustomSine",400,.6),setTimeout(function(){e(500),setTimeout(function(){e(400),setTimeout(function(){f()},150)},50)},50)},50)},50)},150)}function k(){h("Square",98,.4),setTimeout(f,30)}function l(){h("CustomSine",587.33,.6),setTimeout(function(){e(783.99),setTimeout(f,100)},100)}function m(a){"seatBelts"===a.detail&&i(),"whistle"===a.detail&&j(),"playerMove"===a.detail&&k(),"playerScore"===a.detail&&l()}var n,o=new AudioContext,p=null;addEventListener("audio",m,!1)},MileHigh.prototype.maxTurns=200,MileHigh.prototype.initObstacles=function(){this.turbulenceWarningAt=null,this.lastSnackAt=null,this.delayBeforeTurbulence=5,this.turbulenceDuration=3},MileHigh.prototype.getObstacle=function(){return this.isLanding()?World.Obstacle.LANDING:this.hasTurbulenceWarning()?World.Obstacle.TURBULENCE_IMMINENT:this.hasTurbulence()?World.Obstacle.TURBULENCE:this.hasSnacks()?World.Obstacle.SNACKS:null},MileHigh.prototype.obstacleInProgress=function(){return this.world.currentObstacle?!0:!1},MileHigh.prototype.isLanding=function(){return this.obstacleInProgress()?!1:this.gameStats.turns>=this.maxTurns?!0:!1},MileHigh.prototype.hasTurbulenceWarning=function(){return this.obstacleInProgress()?!1:Math.random()<World.TURBULENCE_PROBABILITY},MileHigh.prototype.hasTurbulence=function(){return this.world.currentObstacle!==World.Obstacle.TURBULENCE_IMMINENT?this.world.currentObstacle===World.Obstacle.TURBULENCE:(new Date).getTime()-this.turbulenceWarningAt>1e3*this.delayBeforeTurbulence?!0:void 0},MileHigh.prototype.isTurbulenceOver=function(){return(new Date).getTime()-this.lastTurbulenceAt>1e3*this.turbulenceDuration},MileHigh.prototype.hasSnacks=function(){return this.obstacleInProgress()?!1:Math.random()<World.SNACK_PROBABILITY},MileHigh.prototype.gameOver=function(){this.world.currentObstacle=World.Obstacle.LANDING},MileHigh.prototype.seatBeltsAlert=function(){var a=new CustomEvent("audio",{detail:"seatBelts"});window.dispatchEvent(a),this.world.currentObstacle=World.Obstacle.TURBULENCE_IMMINENT,this.turbulenceWarningAt=(new Date).getTime()},MileHigh.prototype.updateTurbulence=function(){this.world.currentObstacle===World.Obstacle.TURBULENCE?this.isTurbulenceOver()&&this.removeTurbulence():this.addTurbulence()},MileHigh.prototype.addTurbulence=function(){this.world.currentObstacle!==World.Obstacle.TURBULENCE&&(document.getElementById("turbulence-alert").classList.remove("hide"),this.world.currentObstacle=World.Obstacle.TURBULENCE,this.lastTurbulenceAt=(new Date).getTime(),this.player.state!==World.PlayerState.IN_LAVATORY&&this.resetPlayerState(),this.world.resetTravelerHeatLevels())},MileHigh.prototype.removeTurbulence=function(){document.getElementById("turbulence-alert").classList.add("hide"),this.world.currentObstacle=null},MileHigh.prototype.addSnackCarts=function(){this.world.attendants.forEach(function(a){a.walk()})},function(){var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;window.requestAnimationFrame=a,window.AudioContext=window.AudioContext||window.webkitAudioContext}(),function(){function a(a){f.render(e,d.width,d.height),f.nextTurn(a)}function b(c){return f.world.currentObstacle===World.Obstacle.LANDING?(document.getElementById("gameover-alert").classList.remove("hide"),void 0):(requestAnimationFrame(b),a(c),void 0)}function c(){b(),window.addEventListener("load",function(){window.scrollTo(0,1)},!1)}var d=document.getElementById("gameCanvas"),e=d.getContext("2d");!function(){d.width="975",d.height="225"}();var f=new MileHigh,g=new Image;g.src="images/seat.gif";var h=new Image;h.src="images/face.gif";var i=new Image;i.src="images/trav.gif",h.onload=function(){window.imgSeat=g,window.imgPlayer=h,window.imgTrav=i,c()}}();