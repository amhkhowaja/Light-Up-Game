// Elements
const game = document.querySelector("#game");
const gameTable = document.querySelector("#game-table");
const maps= document.querySelector("#Maps");

// Data
cell={color: "white", illuminated: false, bulb:false, value: 0};
boxes = [[cell, cell, cell],[cell, cell, cell],[cell, cell, cell]]

//game_levels

//white tile=" "
//black tile="#" or any digit like "4"
//light "*"
//bulb = "O"
//red bulb = X
const easyLevel = [
    [" "," "," ", "1", " "," ", " "],
    [" ","0"," ", " ", " ","0", " "],
    [" "," "," ", " ", " "," ", " "],
    ["#"," "," ", "#", " "," ", "#"],
    [" "," "," ", " ", " "," ", " "],
    [" ","0"," ", " ", " ","2", " "],
    [" "," "," ", "3", " "," ", " "]
]
const advancedLevel = [
    [" "," ","0", " ", "#"," ", " "],
    [" "," "," ", " ", " "," ", " "],
    ["#"," ","#", " ", "3"," ", "#"],
    [" "," "," ", "1", " "," ", " "],
    ["2"," ","#", " ", "#"," ", "#"],
    [" "," "," ", " ", " "," ", " "],
    [" "," ","#", " ", "2"," ", " "]
]

let gameState=easyLevel;
draw_table(gameState);

function draw_table(level){
    gameTable.innerHTML=""
    for ([x, i] of level.entries()){
        trElement = document.createElement("tr");
        for ([y,j] of i.entries()){
            td= document.createElement("td");
            td.row="something";
            if (j ==" "){
                td.style.backgroundColor = "white";
                
            }
            else if (j=="#"){
                td.style.backgroundColor = "black";
                td.style.color = "white";
                td.style.textAlign="center";

            }
            else if (/\d/.test(j)){
                td.style.backgroundColor = "black";
                td.style.color = "white";
                td.style.textAlign="center";
                td.innerHTML=j;
            }
            else if (j =="*"){
                td.style.backgroundColor = "#FFF0B4";
                
            }
            else if (j =="O"){
                let bulb = document.createElement("img");
                bulb.src="bulb.png";
                td.style.backgroundColor="#FFF0B4";
                td.appendChild(bulb);
                
            }
            else if (j=="X"){
                let bulb = document.createElement("img");
                bulb.src="bulb.png";
                td.style.backgroundColor="#F08C8C";
                td.appendChild(bulb);
            }
            td.dataset.row=x;
            td.dataset.column=y;
            trElement.appendChild(td);
        }
        gameTable.appendChild(trElement);
    }
}

gameTable.addEventListener("click", handleGameTable);

function handleGameTable(e){
    cell= e.target;
    if (e.target.matches("img")){
        cell=e.target.parentElement;
    }
    if (cell.matches("td")){
        //when placing bulb
        if (cell.style.backgroundColor!="black"){
            if (gameState[cell.dataset.row][cell.dataset.column]!=="O"){
                //drawing the bulb
                gameState[cell.dataset.row][cell.dataset.column]="O";
                //light scattering 
                [first , last]=getActiveColumns(cell.dataset.row, cell.dataset.column, gameState);
                [topd, bottom] = getActiveRows(cell.dataset.row, cell.dataset.column, gameState);
                
                for ([x,val] of gameState[cell.dataset.row].entries()){
                    if (x>=first && x<=last && x!=cell.dataset.column){
                        if (val!=="O"){
                            gameState[cell.dataset.row][x]="*";
                        }
                        else{

                        }
                    }
                    
                }
                for ([x,val] of gameState.entries()){
                    if (x>=topd && x<=bottom && x!=cell.dataset.row){
                        if (val[cell.dataset.column]!=="O"){
                            gameState[x][cell.dataset.column]="*";
                        }
                    }
                }
                

            }
            else {  //when removing bulb
                gameState[cell.dataset.row][cell.dataset.column]=" ";
                [first , last]=getActiveColumns(parseInt(cell.dataset.row), parseInt(cell.dataset.column), gameState);
                
                for ([x,val] of gameState[cell.dataset.row].entries()){
                    //horizontal removing X BEING COLUMN
                    [f,l]=getActiveRows(parseInt(cell.dataset.row),x, gameState);
                    [t,b]=getActiveColumns(parseInt(cell.dataset.row),parseInt(cell.dataset.column),gameState);
                    if (x>=first && x<=last && x!=cell.dataset.column){
                        if(!((transpose(gameState)[x].slice(f,l+1).includes("O")) || (gameState[cell.dataset.row].slice(t,b+1).includes("O")))){
                            gameState[cell.dataset.row][x]=" ";

                        }
                        
                        
                    } // handle the same column
                    else if (x>=first && x<=last && x===parseInt(cell.dataset.column)){
                        //for same row:
                        [f, l] = getActiveColumns(parseInt(cell.dataset.row), x, gameState);
                        if (gameState[cell.dataset.row].slice(f,l+1).includes("O")){
                            i=0;
                            gameState[cell.dataset.row]=gameState[cell.dataset.row].map((e,i) => {
                                if (i>=f && i<=l && e!="O"){
                                    e="*";
                                }
                                
                                return e;
                            });
                        }
                    }
                    
                }
                // vertiCAL REMOVING
                [topd, bottom] = getActiveRows(parseInt(cell.dataset.row), parseInt(cell.dataset.column), gameState);
                console.log("Verticle removing");
                for ([y,val] of gameState.entries()){
                    if (y>=topd && y<=bottom && y!=cell.dataset.row){
                        [f,l]=getActiveColumns(y,parseInt(cell.dataset.column),gameState);
                        [t,b]=getActiveRows(parseInt(cell.dataset.row),parseInt(cell.dataset.column), gameState);
                        if(!(gameState[y].slice(f, l+1).includes("O") || (transpose(gameState)[cell.dataset.column].slice(t,b+1).includes("O")))){
                            gameState[y][cell.dataset.column]=" ";

                        }
                    }
                    else if (y>=topd && y<=bottom && y===parseInt(cell.dataset.row)){
                        //for same column:
                        [t,b] = getActiveRows(y, cell.dataset.column, gameState);
                        if (transpose(gameState)[cell.dataset.column].slice(t,b+1).includes("O")){
                            i=0;
                            let transposed =transpose(gameState);
                            transposed[cell.dataset.column]=transposed[cell.dataset.column].map((e,i) => {
                                if (i>=t && i<=b && e!="O"){
                                    e="*";
                                }
                                return e;
                            })
                            gameState= transpose(transposed);
                        }
                    }
            
                }
            }
            //check if there are any conflicts
            
            
        }

    }
    console.log(gameState);
    draw_table(gameState);
    
}
function handleBlackNumbers(){

}
function handleRedBulb(){

}
function getActiveColumns(x,y, game){
    let row=game[x]
    let leftdd = row.slice(0,parseInt(y));
    let rightdd = row.slice((parseInt(y)+1),);
    let testBlack= (element) => element==="#" || /\d/.test(element)
    let lIndex= leftdd.findLastIndex(testBlack)+1;
    let rIndex=rightdd.findIndex(testBlack)==-1?rightdd.length+leftdd.length:rightdd.findIndex(testBlack) +leftdd.length;
    return [lIndex, rIndex];
}
function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }
function getActiveRows(x,y, game){
    let col = transpose(game)[y];
    let topdd = col.slice(0,parseInt(x));
    let bottomdd = col.slice((parseInt(x)+1),);
    let testBlack= (element) => element==="#" || /\d/.test(element)
    let tIndex= topdd.findLastIndex(testBlack)+1;
    let bIndex=bottomdd.findIndex(testBlack)==-1?bottomdd.length+topdd.length:bottomdd.findIndex(testBlack) +topdd.length;
    return [tIndex, bIndex];
}

