
// Requirement 5: use strict throughout the code
"use strict";

// keep track of current player
var currentPlayer = 0;
document.getElementById("currentPlayer").innerHTML = currentPlayer;	

// keep track of current mode (placing/shooting)
var currentMode = "Placing";
document.getElementById("currentMode").innerHTML = currentMode;	

// according to https://www.spelregler.org/sanka-skepp/
var initialShipsToPlace = [1,1,1,1,2,2,2,3,3,4];
var initShipsToPlace = initialShipsToPlace.slice();
var ships = initialShipsToPlace.slice();

// available size of gameboard
var minDim = 5;
var maxDim = 10;

var sizeFrag = document.createDocumentFragment();
var selectedDim;

// default size is 1 and ID 0, since this is the default selection in the list
var currentShipSize = ships[0];
var currentShipID = 0;
var currentRound = 0;

// will change for each ship being placed
var currentShipDirection = "horizontal";

// initialize two empty boards - one for each player
var gameBoardP0Ids = []; 
var gameBoardP1Ids = [];
var gameBoardSize;

// initialize two empty boards for keeping track of shots (P0 will contain the shots performed towards P0)
var gameBoardP0Shots = [];
var gameBoardP1Shots = [];

// ships shootings record
var shipsShotP0, shipsShotP1;
shipsShotP0 = shipsShotP1 = [1,1,1,1,2,2,2,3,3,4];

// keep track of id of ship being placed - default 0
var currentIdOfShip = 0;

// is the game in the placing or shooting phase (if false)
var isPlacing = true;

// function for selecting size and creating a game board according to the choosen size
var selectSize = function(){
	
	// retrieving the desired dimension
    selectedDim = this.id;
    gameBoardSize = selectedDim;
    // show ship alternatives to place
    document.getElementById("gameShips").style.display = "inline-flex";

    // show the direction of the ship being placed
    document.getElementById("gameShipDirection").style.display = "inline-flex";

    document.getElementById("currentDimension").innerHTML = selectedDim;
    document.getElementById("currentDimension").style.display="inline-flex";

    var docFragNew0 = document.createDocumentFragment();
  	console.log("setting up gaembarod");
    
    for(var i=0;i<selectedDim;i++){
    	var rowP0Shots = [];
    	var rowP1Shots = [];
    	var rowP0Ids = [];
    	var rowP1Ids = []

    	for(var j=0; j<selectedDim; j++){
    		rowP0Shots[j] = -1;
    		rowP1Shots[j] = -1;
    		rowP0Ids[j] = -1;
    		rowP1Ids[j] = -1;
    	}

		gameBoardP0Shots[i] = rowP0Shots;
		gameBoardP1Shots[i] = rowP1Shots;
		gameBoardP0Ids[i] = rowP0Ids;
		gameBoardP1Ids[i] = rowP1Ids;

    }

    // create game board for player 0
    var newDiv0 = document.createElement("div");
    newDiv0.setAttribute("id", 'containerP0');
    docFragNew0 = setupGameBoard(docFragNew0);
    newDiv0.appendChild(docFragNew0);
    document.getElementById('containerP0').parentNode.replaceChild(newDiv0, document.getElementById('containerP0'));	
    newDiv0.appendChild(docFragNew0);

    // create game board for player 1
    var newDiv1 = document.createElement("div");
    newDiv1.setAttribute("id", 'containerP1');
    newDiv1.style.display = "none";
    var docFragNew1	 = document.createDocumentFragment();
    docFragNew1 = setupGameBoard(docFragNew1);
    newDiv1.appendChild(docFragNew1);
    document.getElementById('containerP1').parentNode.replaceChild(newDiv1, document.getElementById('containerP1'));	
    newDiv1.appendChild(docFragNew1);

    // hide the selection of gameboard size
    var bsDiv = document.getElementById("boardSizeSelectionDiv");
    bsDiv.style.display = "none";
}

function updateDirection(selectObject) {
	//alert("Selected ship size..");
	console.log("SLE OBJ:" +selectObject);
	currentShipDirection = selectObject.value;
	console.log("CURRENT SHIP DIR: ",currentShipDirection);

	renderCurrentShip();
}

function selectShipSize(selectObject) {
	console.log("SLE OBJ:" +selectObject);
	currentShipSize = selectObject.target.value;
	currentShipID = selectObject.target.id;
	console.log("CURRENT SHIP SIZE: ",currentShipSize);
}

function renderCurrentShip(){
	var shipFrag = document.createDocumentFragment();
	var shipDiv = document.createElement("div");
		shipDiv.setAttribute("class", "shipDiv");
		shipDiv.setAttribute("id", "shipSelected");

		var tbl = document.createElement("table");
	tbl.setAttribute('border', '1');
	tbl.setAttribute('class', 'shipToSelect');

	var noOfRows; var noOfCols;

	if(currentShipDirection === "horizontal"){
		noOfRows = 1;
		noOfCols = ships[currentShipID];
	} else{
		noOfRows = ships[currentShipID];
		noOfCols = 1;
	}

	for(var row=0; row < noOfRows; row++){
		var tr = document.createElement("tr");
		for(var k=0; k<noOfCols;k++){
			var td = document.createElement("td");
			td.setAttribute("width", 10);
			td.setAttribute("height", 10);
			tr.appendChild(td);
		}

		tbl.appendChild(tr);
	}

	shipDiv.appendChild(tbl);
	shipFrag.appendChild(shipDiv);

	// Build a reference to the existing node to be replaced
	var parentDiv = document.getElementById("gameShipDirection");
	console.log("PARENT DIV: "+parentDiv);		
	var shipSelect = document.getElementById("shipSelected");
	parentDiv.replaceChild(shipFrag, shipSelect);
}

function updateShips(selectObject){
	console.log("SEL IN UPDATESHIPS: "+selectObject);	
	selectShipSize(selectObject);
	renderCurrentShip();
}

function cleanShips(){
	var shipFrag = document.createDocumentFragment();

	// for reload of ships
	var updatedShipsForm = document.createElement("form");
	updatedShipsForm.setAttribute("class", "radiobuttons-container");
	updatedShipsForm.setAttribute("id", "ships");
	shipFrag.appendChild(updatedShipsForm);

	document.getElementById("ships").parentNode.replaceChild(shipFrag, document.getElementById("ships"));
}

function renderShips(){
	//alert("Rendering ships...");
	
	var shipFrag = document.createDocumentFragment();

	// for reload of ships
	var updatedShipsForm = document.createElement("form");
	updatedShipsForm.setAttribute("class", "radiobuttons-container");
	updatedShipsForm.setAttribute("id", "ships");

		for(var i=0;i<ships.length;i++){
			var shipDiv = document.createElement("div");
			shipDiv.setAttribute("class", "shipDiv");

			var ship = document.createElement("input");
    	ship.setAttribute("type", 'radio');
    	ship.onchange = updateShips;

    	// set same name for all of the radio buttons -> only allows one to be selected
    	ship.setAttribute("name", 'shipselection');
    	ship.setAttribute("id", i);
    	ship.setAttribute("value", ships[i]);
    	
    	// select ship one by default
    	if(i==0){
    		ship.setAttribute("checked", "checked");
    	}
    	//ship.innerHTML("Ship",i);
    	shipDiv.appendChild(ship);
    	
    	var shipLabel = document.createElement("label");
    	shipLabel.setAttribute("for",i);
    	shipLabel.setAttribute("value",i+"label");
    	shipLabel.innerText = "Ship " +i;

    	shipDiv.appendChild(shipLabel);

    	// for visual representation of ships
    	var tbl = document.createElement("table");
		tbl.setAttribute('border', '1');
		tbl.setAttribute('class', 'shipToSelect');
		
		var tr = document.createElement("tr");

		for(var k=0; k<ships[i];k++){
			var td = document.createElement("td");
			td.setAttribute("width", 10);
			td.setAttribute("height", 10);
			tr.appendChild(td);
		}

		tbl.appendChild(tr);

		shipDiv.appendChild(tbl);
		shipFrag.appendChild(shipDiv);
		
		// check if this is the initial setup or a reload
		if(ships.length == 10){
			document.getElementById("ships").appendChild(shipFrag);
		} else{
			// reload of ships
			updatedShipsForm.appendChild(shipFrag);
		}
		
		}
		if(ships.length==10){
		} else{
			//alert("RELOADING SHIPS");
		console.log("THIS IS A RELOAD OF SHIPS", ships);
		document.getElementById("ships").parentNode.replaceChild(updatedShipsForm, document.getElementById("ships"));
		}
}

function myFunc(val){
	return val * 2;
}

function setupGameBoard(documentFragmentToAttachTo){

	var tbl = document.createElement("table");
		var tblBody = document.createElement("tbody");

		tbl.style.width = '100%';
		tbl.setAttribute('class','gameBoardBasic')
		tbl.setAttribute('border', '1');
	
	for(var i = 0; i < selectedDim; i++){
    	// append br tag for formatting our matrix
    	var tr = document.createElement("tr")
        for(var j = 0; j < selectedDim; j++){
            var cell = document.createElement('td');
            cell.setAttribute('text', i+","+j);
            cell.setAttribute('id', i+","+j);

            // setup empty board
            cell.innerHTML = "&nbsp;";
			cell.onclick = placeShip;
			cell.setAttribute("class", "buttonBasic");

            // append the button to our fragment
            tr.appendChild(cell);
        }

        tblBody.appendChild(tr);
        tbl.appendChild(tblBody);

        documentFragmentToAttachTo.appendChild(tbl);
    }

    return documentFragmentToAttachTo
}

// TODO: merge with setupgameBoard
function updateGameBoard(documentFragmentToAttachTo, newBoard){

	var tbl = document.createElement("table");
		var tblBody = document.createElement("tbody");

		tbl.style.width = '100%';
		tbl.setAttribute('class','gameBoardBasic')
		tbl.setAttribute('border', '1');
	
	for(var i = 0; i < selectedDim; i++){
    	// append br tag for formatting our matrix
    	var tr = document.createElement("tr");

        for(var j = 0; j < selectedDim; j++){
            var cell = document.createElement('td');
            cell.setAttribute('text', i+","+j);
            cell.setAttribute('id', i+","+j);

            // setup empty board
            if(newBoard[i][j] == -1){
            	cell.innerHTML = "&nbsp;";
            } else{
            	cell.innerHTML = newBoard[i][j];
            }
            

            if(newBoard[i][j] != -1){
            	cell.setAttribute("class", "buttonSelected");
            } else{
            	cell.setAttribute("class", "buttonBasic");
            }
			cell.onclick = placeShip;

            // append the button to our fragment
            tr.appendChild(cell);
        }

        tblBody.appendChild(tr);
        tbl.appendChild(tblBody);

        documentFragmentToAttachTo.appendChild(tbl);
    }
    return documentFragmentToAttachTo
}

// function for identifying "state", either placing or shooting phase
var placeShip = function(){

    // retrieve selection coordinates from user
    var selected = this.id.split(",");
    var row = selected[0];
    var col = selected[1];

    // retrieve which game board is selected 
	var selectedGameBoardID = this.parentNode.parentNode.parentNode.parentNode.id;

	// update current ship size each time we place
	currentShipSize = ships[currentShipID];

	// retrieve the current player name
	var gameBoardCurrentPlayer = selectedGameBoardID.slice(-2);

	if(isPlacing == true){

		// sanity check - that we don't try to place on the wrong board
		if(gameBoardCurrentPlayer[1] == currentPlayer){
			var newBoardIds = window['gameBoard'+gameBoardCurrentPlayer+'Ids'];

			var endCoord;
			if(currentShipDirection == "horizontal"){
				// horizontal direction
				endCoord = parseInt(col) + parseInt(currentShipSize);
			} else{
				// vertical direction
				endCoord = parseInt(row) + parseInt(currentShipSize);
			}
			 
			// means our ship is within the board
			if(endCoord <= selectedDim){
				
				// initialize isValid to be true
				var isValid = true;

				// iterate over coordinates of interest and check their content
				if(currentShipDirection === "horizontal"){
					for(var crd = col; crd<endCoord; crd++){
						if(newBoardIds[row][crd] != -1){
							isValid = false;
						}
					}
				} else{
					for(var rw = row; rw<endCoord; rw++){
						if(newBoardIds[rw][col] != -1){
							isValid = false;
						}
					}
				}

				// if there is nothing interfering with the placement - go ahead and place
				if(isValid){
					var startCoord;

					if(currentShipDirection === "horizontal"){
						startCoord = col;
					} else{
						startCoord = row;
					}

					for(var c = startCoord; c < endCoord; c++){
						// depending on direction of ship - fill either by col or row
						if(currentShipDirection === "horizontal"){
							//newBoard[row][c] = 1;
							newBoardIds[row][c] = currentIdOfShip;
						} else{
							//newBoard[c][col] = 1;
							newBoardIds[c][col] = currentIdOfShip;
						}
					}

					// update ships model
					// remove ship from list of options to place
					ships.splice(currentShipID, 1);
					
					// update current-ship-view
					renderCurrentShip();
					
					// update view
					console.log("GB from window: ", window['gameBoard'+gameBoardCurrentPlayer]);
					var gameBoardToPlaceOn = document.getElementById('container'+gameBoardCurrentPlayer);
					
					// inc currentIdOfShip - used in order to identify ship when placing ship
					currentIdOfShip++;

					// check if all ships are placed - hand over to other player to place or let other player shoot
					if(ships.length == 0){
						// assume player 0 always starts
						if(currentPlayer == 0){
							// switch player
							currentPlayer = 1;
							document.getElementById("currentPlayer").innerHTML = currentPlayer;	
							
							// reset ships
							ships = initialShipsToPlace;
							console.log("SHIPS: ", ships);
							currentIdOfShip = 0;

							cleanShips();
							renderShips();
							renderCurrentShip();

							// update view - show P1 gameboard and hide P0 gameboard
							var gameBoardDiv1 = document.getElementById("containerP1");
							var gameBoardDiv0 = document.getElementById("containerP0");
							gameBoardDiv1.style.display = "block";
							gameBoardDiv0.style.display = "none";

						} else{
							currentPlayer = 0;
							document.getElementById("currentPlayer").innerHTML = currentPlayer;
							alert("Time to shoot!");
							
							// update view - show P1 gameboard and hide P0 gameboard
							var gameBoardDiv0 = document.getElementById("containerP0");
							var gameBoardDiv1 = document.getElementById("containerP1");
							gameBoardDiv1.style.display = "none";
							gameBoardDiv0.style.display = "block";

							// retrieve list of tr tags - i.e. gameboard matrixs
							var listOfCells0 = gameBoardDiv0.childNodes[0].childNodes[0].childNodes;
							var listOfCells1 = gameBoardDiv1.childNodes[0].childNodes[0].childNodes;
							
							for(var i=0;i<listOfCells0.length;i++){
								var lenCols = listOfCells0[0].childNodes.length;
								console.log("LEN OF COLS:" + lenCols);
								for(var j=0; j<lenCols;j++){
									var cell0 = listOfCells0[i].childNodes[j];

									// sanity check - that the retrieved element is correct
									if(cell0.tagName == 'TD'){
										cell0.setAttribute("class","buttonBasic");
										cell0.innerHTML = "&nbsp;";
										cell0.onclick = shootShip;
									}
									
									var cell1 = listOfCells1[i].childNodes[j];

									// sanity check - that the retrieved element is correct
									if(cell1.tagName == 'TD'){
										cell1.setAttribute("class","buttonBasic");
										cell1.innerHTML = "&nbsp;";
										cell1.onclick = shootShip;
									}
								}											
							}

							isPlacing = false;

							// keep track of current mode
							currentMode = "shooting";
					        document.getElementById("currentMode").innerHTML = currentMode;

					        document.getElementById("gameShips").style.display = "none";
					        document.getElementById("gameShipDirection").style.display = "none";

					        // show button for next shooter
					        document.getElementById("gameNext").style.display = "block";

						}
					} else{
						// there are more ships to be placed - simply update ships view
						var newGameBoardFrag = document.createDocumentFragment();
						var newGameContainer = document.createElement("div");
				      	newGameContainer.setAttribute("id", 'container'+gameBoardCurrentPlayer);

						newGameBoardFrag = updateGameBoard(newGameBoardFrag, newBoardIds);
						
						newGameContainer.appendChild(newGameBoardFrag);

						gameBoardToPlaceOn.parentNode.replaceChild(newGameContainer,gameBoardToPlaceOn);
						
						renderShips();
					}

			} else{
				alert("Invalid placement of this type of ship, try again...")
			}

			} else{
				alert("Invalid placement, out of bounds, try again...")
			}

		} else{
			alert("Sorry, not your gameboard. Try with the other one..");
		}

	} else {	
		alert("Shooting phase...");
		console.log("SHOT:", row, col);
		var actualBoard = window['gameBoard'+gameBoardCurrentPlayer+'Ids'];
		var shotsBoard = window['gameBoard'+gameBoardCurrentPlayer+
		'Shots'];

		console.log("NEW BOARD - LETS HANDLE THE SHOT ACCORDING TO IT", actualBoard);

		if(actualBoard[row][col] != -1){
			console.log("HIT!");
			console.log("row,col COLOR IT", row,col);
		} else{
			console.log("MISS!");
			console.log("row,col COLOR IT", row,col);
		}

		shotsBoard[row][col] = 1;

		var gameBoardToPlaceOn = document.getElementById('container'+gameBoardCurrentPlayer);
		var newGameBoardFrag = document.createDocumentFragment();

		var newGameContainer = document.createElement("div");
      	newGameContainer.setAttribute("id", 'container'+gameBoardCurrentPlayer);

		newGameBoardFrag = updateGameBoard(newGameBoardFrag, shotsBoard);
		
		newGameContainer.appendChild(newGameBoardFrag);

		gameBoardToPlaceOn.parentNode.replaceChild(newGameContainer,gameBoardToPlaceOn);
	}

	//set currentShip back to 0 after each placement
	currentShipID = 0;
	currentShipSize 
}

var shipDestroyed = function(idHit){
	cleanShips();
	// show ship
	console.log("currentPlayer: "+currentPlayer);
	document.getElementById("gameShipsDestroyedP"+currentPlayer).style.display = "inline-flex";

	var shipFrag = document.createDocumentFragment();
	var shipDiv = document.createElement("div");
		shipDiv.setAttribute("class", "shipDestroyedDiv");
		shipDiv.setAttribute("id", "shipSelected");

		var tbl = document.createElement("table");
	tbl.setAttribute('border', '1');
	tbl.setAttribute('class', 'shipToSelect');

	var noOfRows; var noOfCols;

	noOfRows = 1;
	noOfCols = initShipsToPlace[idHit];

	for(var row=0; row < noOfRows; row++){
		var tr = document.createElement("tr");

		for(var col=0; col<noOfCols;col++){
			var td = document.createElement("td");
			td.setAttribute("width", 10);
			td.setAttribute("height", 10);
			tr.appendChild(td);
		}
		tbl.append(tr);
	}

	shipDiv.appendChild(tbl);
	shipFrag.appendChild(shipDiv);
	
	document.getElementById("shipsDestroyedP"+currentPlayer).appendChild(shipFrag);

	var opponentPlayerID;
	var currentPlayerID;
	
	if(currentPlayer == 0){
		opponentPlayerID = "P1";
		currentPlayerID = "P0";
	} else{
		opponentPlayerID = "P0";
		currentPlayerID = "P1";
	}
	
	var shipPartsLeft = window['shipsShot'+opponentPlayerID];
	
	var hasLost = true;

	for(var i = 0; i< shipPartsLeft.length;i++){
		if(shipPartsLeft[i] != 0){
			hasLost = false;
		}
	}

	var boardView = document.getElementById("container"+currentPlayerID);
	var listOfCells = boardView.childNodes[0].childNodes[0].childNodes;
	
	var newBoardIds = window['gameBoard'+opponentPlayerID+'Ids'];

	for(var i=0;i<listOfCells.length;i++){
		var lenCols = listOfCells[0].childNodes.length;
		console.log("LEN OF COLS:" + lenCols);

		for(var j=0; j<lenCols;j++){
			var cell = listOfCells[i].childNodes[j];

			// get id from other matrix
			var currId = newBoardIds[i][j];
			console.log("CURR ID: "+currId + ": "+idHit);
			//console.log("cell: "+cell.innerHTML());
			if(currId == idHit){
				console.log("MATCH!: ");
				cell.innerHTML = idHit;
			}
		}
	}
	console.log("shippartsleft: "+shipPartsLeft);
	console.log("haslost: "+hasLost);

	if(hasLost){
		console.log("PLAYER OPPONENT: "+opponentPlayerID + " has lost!");

		// SHOW GAME OVER - with winning player		
		document.getElementById("gameOver").style.display = "block";
		
		var winnerFrag = document.createDocumentFragment();

		var winner = document.createElement("h2");
		
		var t = document.createTextNode("WINNER IS:"+ currentPlayerID);

		winner.appendChild(t);

		winnerFrag.appendChild(winner);

		// append the fragment to our DOM
		document.getElementById("gameOverWinningPlayer").appendChild(winnerFrag);
	}

}

var shootShip = function(){
	//alert("Shooting ship...");
	
	console.log("..",this.id);
    //alert("CLICKED ID:",this.id);
    var selected = this.id.split(",");
    var row = selected[0];
    var col = selected[1];
	var selectedGameBoardID = this.parentNode.parentNode.parentNode.parentNode.id;
	console.log("Gameboard selected: ", selectedGameBoardID);

	// update current ship size each time we place
	currentShipSize = ships[currentShipID];

	// current player
	var gameBoardCurrentPlayer = selectedGameBoardID.slice(-2);
	console.log("CURR NAME: ", gameBoardCurrentPlayer);

	var gameBoardCurrentOpponent;
	if(gameBoardCurrentPlayer == "P0"){
		gameBoardCurrentOpponent = "P1";
	} else{
		gameBoardCurrentOpponent = "P0";
	}
	console.log("OPPP NAME: ", gameBoardCurrentOpponent);
	console.log("Curr player", currentPlayer);
	document.getElementById("currentPlayer").innerHTML = currentPlayer;

	// actualBoard is opponent's which we want to shoot at
	var actualBoard = window['gameBoard'+gameBoardCurrentOpponent+'Ids'];

	var newBoardIds = window['gameBoard'+gameBoardCurrentOpponent+'Ids'];
	console.log("newboarddis:"+newBoardIds);

	var idHit = newBoardIds[row][col];
	console.log("iddhiitt" + idHit);
		
		// reduce the ship as specified by the id - if 0 => shotdown(id);
		var shipsShotToReduce = window['shipsShot'+gameBoardCurrentOpponent];
		console.log("SHIPSSHOTOTREDUCEE" + shipsShotToReduce + ": "+'shipsShot'+gameBoardCurrentOpponent);
		var leftPartsOfShip = shipsShotToReduce[idHit]-1;
		shipsShotToReduce[idHit] = leftPartsOfShip;

		if(leftPartsOfShip == 0){
			// ship is destroyed
			shipDestroyed(idHit);
		}

	// use shipPos to keep track of ships on gameboard

	// shotsBoard keeps track of shots performed
	var shotsBoard = window['gameBoard'+gameBoardCurrentPlayer+
		'Shots'];
	console.log("PPP: "+ gameBoardCurrentPlayer);
	console.log("NEW BOARD - LETS HANDLE THE SHOT ACCORDING TO IT", actualBoard);

	shotsBoard[row][col] = 1;

	var boardView = document.getElementById("container"+gameBoardCurrentPlayer);
	var listOfCells0 = boardView.childNodes[0].childNodes[0].childNodes;
		
	if(actualBoard[row][col] != -1){
		console.log("HIT!");
		console.log("row,col COLOR IT", row,col, actualBoard[row][col]);
		
		for(var i=0;i<listOfCells0.length;i++){
			var idToShoot = row+","+col;
			var lenCols = listOfCells0[0].childNodes.length;
			console.log("LEN OF COLS:" + lenCols);

			for(var j=0; j<lenCols;j++){
				var cell0 = listOfCells0[i].childNodes[j];
		
				if(cell0.id == idToShoot){
					console.log("found id");
					cell0.setAttribute("class", 'buttonHit');
				}
			}
		}

	} else{
		console.log("MISS!");
		console.log("row,col COLOR IT", row,col, actualBoard[row][col]);
		var idToShoot = row+","+col;
		for(var i=0;i<listOfCells0.length;i++){
			
			var lenCols = listOfCells0[0].childNodes.length;

			for(var j=0; j<lenCols;j++){
				var cell0 = listOfCells0[i].childNodes[j];
		
				if(cell0.id == idToShoot){
					console.log("found id");
					cell0.setAttribute("class", 'buttonMiss');
				}
			}
		}
	}
}

function nextShooter(){
	// increment currentRound counter
	currentRound++;
	document.getElementById("currentRound").innerHTML = currentRound;
	document.getElementById("currentRoundWrapper").style.display = "inline-flex";

	// find current opponent
	var currentOpponent;
	if(currentPlayer == 0){
		currentOpponent = 1;
	} else{
		currentOpponent = 0;
	}

	// update view to show next shooter's gameboard
	document.getElementById("containerP"+currentPlayer).style.display = "none";
	document.getElementById("containerP"+currentOpponent).style.display = "block";
	document.getElementById("gameShipsDestroyedP"+currentPlayer).style.display = "none";
	document.getElementById("gameShipsDestroyedP"+currentOpponent).style.display = "inline-flex";

	// set players for next round
	if(currentPlayer == 0){
		currentPlayer = 1;
	} else{
		currentPlayer = 0;
	}
	
	document.getElementById("currentPlayer").innerHTML = currentPlayer;

}

var renderSizeSelection = function(){
	// loop over the predefined range of dimensions
	for(var i=minDim; i<=maxDim;i++){
		var button = document.createElement('button');
        button.setAttribute('id', i);
        button.innerHTML = i;
		button.onclick = selectSize;
		button.setAttribute('class', 'sizeSelectionButton');
		sizeFrag.appendChild(button);
	}

	// append the size buttons fragment to our DOM
    document.getElementById('sizeSelectionContainer').appendChild(sizeFrag);
}

var onStartup = function(){
	// render out our size selection alternatives
	renderSizeSelection();

	// create gameboard fragment - to be used by both
	var docFrag = document.createDocumentFragment();
   	docFrag = setupGameBoard(docFrag);
    
    // append the gameboard fragment to our DOM x2
    document.getElementById('containerP0').appendChild(docFrag);
    document.getElementById('containerP1').appendChild(docFrag);

    // render out our ships 
    renderShips();
	renderCurrentShip();
}

onStartup();
