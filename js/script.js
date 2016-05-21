var gameOfLife = (function() {

	document.addEventListener('DOMContentLoaded', startPage, false);
	var variables = {
		table : [],
		table2 : [],
		n : 50,
		m : 50,
		typeCondition : true,
		canvas : 0,
		ctx : 0,
		numberColors : 0,
		tableColors : [],
		numberCellsColors1: [],
		numberCellsColors2: [],
		timer: 0,
		activeCells : [] 
	};
	var elements = {};

	function startPage() {
		elements.buttonRandom = document.getElementById("buttonRandom");
		elements.buttonStartGame = document.getElementById("buttonStartGame");
		elements.buttonStop = document.getElementById("buttonStop");
		elements.buttonClear = document.getElementById("buttonClear");
		elements.buttonUniform = document.getElementById("buttonUniform");
		elements.buttonMouse = document.getElementById("buttonMouse");
		elements.widthTable = document.getElementById("width");
		elements.heightTable = document.getElementById("height");
		elements.numberColors = document.getElementById("numberColors");
		elements.canvas = document.getElementById("myCanvas");
		elements.neighborhood = document.getElementById("neighborhood");
		elements.buttonRadius = document.getElementById("buttonRadius");
		elements.radius = document.getElementById("radius");
		elements.buttonContinuousGrowth = document.getElementById("buttonContinuousGrowth");
		
		variables.ctx = elements.canvas.getContext("2d");
		
		elements.buttonRandom.addEventListener('click', function() {
			clearTimeout(variables.timer);
			variables.ctx.clearRect(0, 0,elements.canvas.width, elements.canvas.height);
			createTable();
			setColors();
			random();
			drawTable(variables.table);
		}, false);
		
		elements.buttonStartGame.addEventListener('click', function() {
			execute(variables.table, variables.table2, variables.numberCellsColors1, variables.numberCellsColors2);
		}, false);
		elements.buttonContinuousGrowth.addEventListener('click', function() {
			continuesGrowth(variables.table, variables.table2, variables.numberCellsColors1, variables.numberCellsColors2);
		}, false);
		
		elements.buttonStop.addEventListener('click', function() {
			clearTimeout(variables.timer);
		}, false);
		
		elements.buttonClear.addEventListener('click', function() {
			clearTimeout(variables.timer);
			variables.ctx.clearRect(0, 0,elements.canvas.width, elements.canvas.height);
			createTable();
			drawTable(variables.table);
		}, false);
		
		elements.buttonUniform.addEventListener('click', function() {
			clearTimeout(variables.timer);
			variables.ctx.clearRect(0, 0,elements.canvas.width, elements.canvas.height);
			createTable();
			setColors();
			uniform();
			drawTable(variables.table);
		}, false);
		elements.buttonMouse.addEventListener('click', mouse, false);
		elements.buttonRadius.addEventListener('click', function() {
			clearTimeout(variables.timer);
			variables.ctx.clearRect(0, 0,elements.canvas.width, elements.canvas.height);
			createTable();
			setColors();
			randomRadius();
		}, false);
	}

	function execute(table1, table2, numberCellsColors1, numberCellsColors2) {
		growth(table1, table2, numberCellsColors1);
		drawTable(table2);
		variables.timer=setTimeout(function() {
			execute(table2, table1, numberCellsColors2, numberCellsColors1);
		}, 100);
	}
	
	function continuesGrowth(table1, table2, numberCellsColors1, numberCellsColors2) {
		growth(table1, table2, numberCellsColors1);
					
					
	
			
			var columnNewSeed = Math.round(Math.random() * (variables.n - 1));
			var rowNewSeed = Math.round(Math.random() * (variables.m - 1));		
			if(variables.table2[columnNewSeed][rowNewSeed].state!=1){
						variables.tableColors[variables.tableColors.length] = getRandomColor();
						variables.table2[columnNewSeed][rowNewSeed].state = 1;
								variables.table2[columnNewSeed][rowNewSeed].color = variables.tableColors.length-1;
		}
		drawTable(table2);
		variables.timer=setTimeout(function() {
			continuesGrowth(table2, table1, numberCellsColors2, numberCellsColors1);
		}, 100);
	}
	
	
	
	function setColors() {
		variables.tableColors = new Array(variables.numberColors);
		for (var i = 0; i < variables.numberColors; i++) {
			variables.tableColors[i] = getRandomColor();
		}
	}

	function createTable() {
		variables.n = elements.widthTable.value;
		variables.m = elements.heightTable.value;
		variables.numberColors = elements.numberColors.value;
		variables.typeCondition = document.getElementById("periodic").checked;
		variables.table = new Array(variables.n);
		for (var i = 0; i < variables.n; i++) {
			variables.table[i] = new Array(variables.m);
		}
		variables.table2 = new Array(variables.n);
		for (var i = 0; i < variables.n; i++) {
			variables.table2[i] = new Array(variables.m);
		}
		for (var i = 0; i < variables.n; i++) {
			for (var j = 0; j < variables.m; j++) {
				variables.table[i][j] = {
					state : 0,
					color : 0
				};
				variables.table2[i][j] = {
					state : 0,
					color : 0
				};
			}
		}		
		for(var i=0 ; i<variables.numberColors ; i++){
			variables.numberCellsColors1[i]=0;
			variables.numberCellsColors2[i]=0;
		}
	}

	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	function drawTable(table) {
		for (var i = 0; i < variables.n; i++) {
			for (var j = 0; j < variables.m; j++) {
				if (table[i][j].state == 1) {
					variables.ctx.fillStyle = variables.tableColors[table[i][j].color];
				} else {
					variables.ctx.fillStyle = "black";
				}
				variables.ctx.fillRect(i * 10, j * 10, 10, 10);
			}
		}
	}

	function random() {
		var indexColumn = 0, indexRow = 0;
		for (var i = 0; i < variables.numberColors; i++) {
			indexColumn = Math.round(Math.random() * (variables.n - 1));
			indexRow = Math.round(Math.random() * (variables.m - 1));
			variables.table[indexColumn][indexRow].state = 1;
			variables.table[indexColumn][indexRow].color = i;
			variables.table2[indexColumn][indexRow].state = 1;
			variables.table2[indexColumn][indexRow].color = i;
		}
	}
	
	function randomRadius() {
		setTimeout(function() {
			var indexColumn = 0, indexRow = 0, counter=0, maxCounter=70000;
			for (var i = 0; i < variables.numberColors; i++) {
				do {
					indexColumn = Math.round(Math.random() * (variables.n - 1));
					indexRow = Math.round(Math.random() * (variables.m - 1));
					counter++;
					if(counter>maxCounter){
						alert("Lack of space");
						location.reload(false);
					}
				} while (function() {
					for(var i=0 ; i<variables.activeCells.length ; i++){
						var d = Math.sqrt(Math.pow(indexColumn-variables.activeCells[i].x, 2) + Math.pow(indexRow-variables.activeCells[i].y, 2));
						if(d < elements.radius.value){
							return true;
						}
						if(variables.typeCondition == true){
							maxCounter=30000;
							if(indexColumn+elements.radius.value > variables.n){
								indexColumn = elements.radius.value - (variables.n - indexColumn);
							}
							if(indexColumn-elements.radius.value < 0){
								indexColumn = variables.n - ( elements.radius.value- indexColumn);
							}						
							if(indexRow+elements.radius.value > variables.m){
								indexRow = elements.radius.value - (variables.m - indexRow);
							}
							if(indexRow-elements.radius.value < 0){
								indexRow = variables.m - ( elements.radius.value- indexRow);
							}
							var d = Math.sqrt(Math.pow(indexColumn-variables.activeCells[i].x, 2) + Math.pow(indexRow-variables.activeCells[i].y, 2));
							if(d < elements.radius.value){
								return true;
							}
						}						
					}
					return false;
				}());
				counter=0;
				variables.table[indexColumn][indexRow].state = 1;
				variables.table[indexColumn][indexRow].color = i;
				variables.table2[indexColumn][indexRow].state = 1;
				variables.table2[indexColumn][indexRow].color = i;
				var cell = {
						x: indexColumn,
						y: indexRow
				}
				variables.activeCells[variables.activeCells.length]=cell;
			}
			drawTable(variables.table);
		}, 1);
		
		
		
	
	}
	
	function uniform() {
		var indexColumn = 0, indexRow = 0;
		var difColumn= Math.round(variables.n/Math.ceil((Math.sqrt(variables.numberColors)+1)));
		var difRow=Math.round(variables.m/Math.ceil((Math.sqrt(variables.numberColors)+1)));
		indexColumn =difColumn;
		indexRow = difRow;
		for (var i = 0; i < variables.numberColors; i++) {
			variables.table[indexColumn][indexRow].state = 1;
			variables.table[indexColumn][indexRow].color = i;
			variables.table2[indexColumn][indexRow].state = 1;
			variables.table2[indexColumn][indexRow].color = i;
			indexColumn=indexColumn+difColumn;			
			if(indexColumn>variables.n-1){
				indexColumn=difColumn
				indexRow=indexRow+difRow;
			}
			if(indexRow>variables.m-1){
				indexRow=difRow;
			}
		}
	}
	
	function mooreNoPeriodic(x, y, table, table2, numberCellsColors) {
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}					
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function mooreCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function moorePeriodic(x, y, table, table2, numberCellsColors) {
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function mooreCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	
	//*******************************************************************************************************************//
	
	function vonNeumanNoPeriodic(x, y, table, table2, numberCellsColors) {
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}		
				if((i==x-1 && j==y-1) ||  (i==x-1 && j==y+1) || (i==x+1 && j==y-1)  || (i==x+1 && j==y+1)){
					continue;
				}				
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function vonNeumanCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				if((i==x-1 && j==y-1) ||  (i==x-1 && j==y+1) || (i==x+1 && j==y-1)  || (i==x+1 && j==y+1)){
					continue;
				}
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function vonNeumanPeriodic(x, y, table, table2, numberCellsColors) {
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if((temp1==x-1 && temp2==y-1) ||  (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  || (temp1==x+1 && temp2==y+1)){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function vonNeumanCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
				if((temp1==x-1 && temp2==y-1) ||  (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  || (temp1==x+1 && temp2==y+1)){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	
	//*******************************************************************************************************************//
	
		function hexaLeftNoPeriodic(x, y, table, table2, numberCellsColors) {
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}		
				if(  (i==x-1 && j==y+1) || (i==x+1 && j==y-1) ){
					continue;
				}				
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function hexaLeftCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				if(  (i==x-1 && j==y+1) || (i==x+1 && j==y-1)  ){
					continue;
				}
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function hexaLeftPeriodic(x, y, table, table2, numberCellsColors) {
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if( (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  ){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function hexaLeftCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
				if( (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  ){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	
	//*******************************************************************************************************************//
	
			function hexaRightNoPeriodic(x, y, table, table2, numberCellsColors) {
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}		
				if(  (i==x-1 && j==y-1) || (i==x+1 && j==y+1) ){
					continue;
				}				
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function hexaRightCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				if(  (i==x-1 && j==y-1) || (i==x+1 && j==y+1)  ){
					continue;
				}
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function hexaRightPeriodic(x, y, table, table2, numberCellsColors) {
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if( (temp1==x-1 && temp2==y-1) || (temp1==x+1 && temp2==y+1)  ){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function hexaRightCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
				if( (temp1==x-1 && temp2==y-1) || (temp1==x+1 && temp2==y+1)  ){
					continue;
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	
	//*******************************************************************************************************************//
	
	
	
			function hexaRandNoPeriodic(x, y, table, table2, numberCellsColors) {
				var random = Math.floor(Math.random() * 2);
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}		
								
				if(random==1){
					if(  (i==x-1 && j==y-1) || (i==x+1 && j==y+1) ){
					continue;
				}
				}else{
									if( (i==x-1 && j==y+1) || (i==x+1 && j==y-1)  ){
					continue;
				}
				}
				
								
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function hexaRandCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
	var random = Math.floor(Math.random() * 2);
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				if(random==1){
					if(  (i==x-1 && j==y-1) || (i==x+1 && j==y+1) ){
					continue;
				}
				}else{
					if( (i==x-1 && j==y+1) || (i==x+1 && j==y-1)  ){
					continue;
				}
				}
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function hexaRandPeriodic(x, y, table, table2, numberCellsColors) {
		var random = Math.floor(Math.random() * 2);
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if(random==1){
					if(  (temp1==x-1 && temp2==y-1) || (temp1==x+1 && temp2==y+1) ){
					continue;
				}
				}else{
				if( (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  ){
					continue;
				}
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function hexaRandCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
								if(random==1){
					if(  (temp1==x-1 && temp2==y-1) || (temp1==x+1 && temp2==y+1) ){
					continue;
				}
				}else{
				if( (temp1==x-1 && temp2==y+1) || (temp1==x+1 && temp2==y-1)  ){
					continue;
				}
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	//*******************************************************************************************************************//
	
	
				function pentaRandNoPeriodic(x, y, table, table2, numberCellsColors) {
				var random = Math.floor(Math.random() * 2);
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i){
					table2[i][j].state=1;
					table2[i][j].color=table[i][j].color;
					continue;					
				}		
								
				if(random==1){
					if(  (i==x+1 && j==y-1) || (i==x+1 && j==y)|| (i==x+1 && j==y+1) ){
					continue;
				}
				}else{
				if(  (i==x-1 && j==y-1) || (i==x-1 && j==y)|| (i==x-1 && j==y+1) ){
					continue;
				}
				}
				
								
				if (i == -1 || i == variables.n || j == -1 || j == variables.m){
					continue;
				}
				if (table[i][j].state == 0){					
					if(mooreCheckColorNeighboursNoPeriodic(i, j, table, table[x][y].color,numberCellsColors)){						
						table2[i][j].state=1;
						table2[i][j].color=table[x][y].color;
						numberCellsColors[table2[i][j].color]++;	
					}
				}					
			}
		}
	}
	
	function pentaRandCheckColorNeighboursNoPeriodic(x, y, table, mainColor, numberCellsColors) {	
	var random = Math.floor(Math.random() * 2);
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				if (y == j && x == i)
					continue;
				
				if(random==1){
					if(  (i==x+1 && j==y-1) || (i==x+1 && j==y)|| (i==x+1 && j==y+1) ){
					continue;
				}
				}else{
				if(  (i==x-1 && j==y-1) || (i==x-1 && j==y)|| (i==x-1 && j==y+1) ){
					continue;
				}
				}
				if (i == -1 || i == variables.n || j == -1 || j == variables.m)
					continue;	
				if (table[i][j].state == 1 && table[i][j].color != mainColor && numberCellsColors[table[i][j].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	function pentaRandPeriodic(x, y, table, table2, numberCellsColors) {
		var random = Math.floor(Math.random() * 2);
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					table2[temp1][temp2].state=1;
					table2[temp1][temp2].color=table[temp1][temp2].color;
					continue;	
				}
				if(random==1){
					if(  (temp1==x+1 && temp2==y-1) || (temp1==x+1 && temp2==y)|| (temp1==x+1 && temp2==y+1) ){
					continue;
				}
				}else{
				if(  (temp1==x-1 && temp2==y-1) || (temp1==x-1 && temp2==y)|| (temp1==x-1 && temp2==y+1) ){
					continue;
				}
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 0){					
					if(mooreCheckColorNeighboursPeriodic(temp1, temp2, table, table[x][y].color,numberCellsColors)){						
						table2[temp1][temp2].state=1;
						table2[temp1][temp2].color=table[x][y].color;
						numberCellsColors[table2[temp1][temp2].color]++;	
					}
				}			
			}
		}
	}
	
	function pentaRandCheckColorNeighboursPeriodic(x, y, table, mainColor, numberCellsColors) {	
		var temp1 = 0;
		var temp2 = 0;
		for (var i = x - 1; i <= (x + 1); i++) {
			for (var j = y - 1; j <= (y + 1); j++) {
				temp1 = i;
				temp2 = j;
				if (y == temp2 && x == temp1){
					continue;	
				}
								
				if(random==1){
					if(  (temp1==x+1 && temp2==y-1) || (temp1==x+1 && temp2==y)|| (temp1==x+1 && temp2==y+1) ){
					continue;
				}
				}else{
				if(  (temp1==x-1 && temp2==y-1) || (temp1==x-1 && temp2==y)|| (temp1==x-1 && temp2==y+1) ){
					continue;
				}
				}
				if (temp1 == -1) {
					temp1 = variables.n - 1;
				}
				if (temp1 == variables.n) {
					temp1 = 0;
				}
				if (temp2 == -1) {
					temp2 = variables.m - 1;
				}
				if (temp2 == variables.m) {
					temp2 = 0;
				}
				if (table[temp1][temp2].state == 1 && table[temp1][temp2].color != mainColor && numberCellsColors[table[temp1][temp2].color] > numberCellsColors[mainColor]){
					return false;
				}	
				
			}
		}
		return true;
	}
	
	//*******************************************************************************************************************//
	
	function growth(table, table2, numberCellsColors) {
		for(var i=0 ; i<variables.n; i++){
			for(var j=0 ; j<variables.m ; j++){
				if(table[i][j].state == 1){
					if (variables.typeCondition == true) {
						if(elements.neighborhood.value=="Moore"){
							moorePeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Von neumann"){
							vonNeumanPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal left"){
							hexaLeftPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal right"){
							hexaRightPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal random"){
							hexaRandPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Pentagonal random"){
							pentaRandPeriodic(i, j, table, table2, numberCellsColors);
						}
					} else {
						if(elements.neighborhood.value=="Moore"){
							mooreNoPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Von neumann"){
							vonNeumanNoPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal left"){
							hexaLeftNoPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal right"){
							hexaRightNoPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Hexagonal random"){
							hexaRandNoPeriodic(i, j, table, table2, numberCellsColors);
						}
						if(elements.neighborhood.value=="Pentagonal random"){
							pentaRandNoPeriodic(i, j, table, table2, numberCellsColors);
						}
					}
				}
			}
		}
	}
	
	
	function mouse() {
		elements.canvas.addEventListener('mousedown', function(evt) {
			var mousePos = getMousePos(elements.canvas, evt);
			var tx = Math.round(mousePos.x / 10);
			var ty = Math.round(mousePos.y / 10);
			variables.tableColors[variables.tableColors.length] = getRandomColor();			
			variables.ctx.fillStyle = variables.tableColors[variables.tableColors.length-1]
			variables.ctx.fillRect(tx * 10, ty * 10, 10, 10);
			variables.table[tx][ty].state = 1;
			variables.table[tx][ty].color = variables.tableColors.length-1;
		}, false);
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x : Math.round((evt.clientX - rect.left) / (rect.right - rect.left)
					* canvas.width),
			y : Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top)
					* canvas.height)
		};
	}
}());
