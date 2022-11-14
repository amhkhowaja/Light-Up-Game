// Elements
const game = document.querySelector("#game");
const gameTable = document.querySelector("#game-table");
const maps= document.querySelector("#Maps");
const form = document.querySelector("#form");
const mainPage= document.querySelector("#main_page");
const gameResult = document.querySelector("#gameResult");
const checkCorrect= document.querySelector("#checkCorrect");
const player_name = document.querySelector("#player_name");
const playerNameIn = document.querySelector("#playerName");
const backbtn = document.querySelector("#back");
const restartButton =document.querySelector("#restart");
const elapsedElm=document.querySelector("#elapsed");
const gameLevelElm = document.querySelector("#gameLevel");
let playing =false;
//game_levels

//white tile=" "
//black tile="#" or any digit like "4"
//light "*"
//bulb = "O"
//red bulb = X
gameState=[]
const easyLevel = [
    [" "," "," ", "1,b", " "," ", " "],
    [" ","0,b"," ", " ", " ","2,b", " "],
    [" "," "," ", " ", " "," ", " "],
    ["#"," "," ", "#", " "," ", "#"],
    [" "," "," ", " ", " "," ", " "],
    [" ","#"," ", " ", " ","2,b", " "],
    [" "," "," ", "3,b", " "," ", " "]
]
const advancedLevel = [
    [" "," ","0,b", " ", "#"," ", " "],
    [" "," "," ", " ", " "," ", " "],
    ["#"," ","#", " ", "3,b"," ", "#"],
    [" "," "," ", "1,b", " "," ", " "],
    ["2,b"," ","#", " ", "#"," ", "#"],
    [" "," "," ", " ", " "," ", " "],
    [" "," ","#", " ", "2,b"," ", " "]
]
const extreme = [
    [" ","#"," ", " ", " "," ", " "," "," ", " "],
    [" "," "," ", " ", " ","3,b", " ","2,b"," ", "#"],
    [" ","0,b","#", " ", " "," ", " ","#"," ", " "],
    [" "," "," ", " ", "#"," ", " "," "," ", " "],
    [" ","1,b"," ", " ", "#","1,b", "#"," "," ", " "],
    [" "," "," ", "#", "#","#", " "," ","3,b", " "],
    [" "," "," ", " ", " ","#", " "," "," ", " "],
    [" "," ","1,b", " ", " "," ", " ","0,b","#", " "],
    ["3,b"," ","#", " ", "0,b"," ", " "," "," ", " "],
    [" "," "," ", " ", " "," ", " "," ","0,b", " "],
    // [" "," "," ", " ", " "," ", " "," "," ", " "],
    
]

// let gameState=extreme;
// let gameState=advancedLevel;
// gameState=[];
form.addEventListener("submit", handlePlayButton);
function handlePlayButton(e){
    e.preventDefault();
    
    let level = [...document.getElementsByName("level")].filter((x)=> x.checked==true)[0];
    console.log(level)
    if (level.value==="easy"){
        gameState=JSON.parse(JSON.stringify(easyLevel));

    }
    else if(level.value==="advanced"){
        gameState=JSON.parse(JSON.stringify(advancedLevel));

    }
    else if (level.value==="extreme"){
        gameState=JSON.parse(JSON.stringify(extreme));
    }
    player_name.innerHTML=`<p>${playerNameIn.value}</p>`;
    gameLevelElm.innerHTML=`<p>${(level.value)} level</p>`;

    playing = true;
    mainPage.hidden=true;
    game.hidden=false;
    gameResult.hidden=true;
    console.log(gameState);
    start = Date.now();
    console.log(gameState[0]);

    draw_table(gameState);
    // return false;
}

restartButton.addEventListener("click", (e) => {
    return handlePlayButton(e);
});
// draw_table(gameState);
function getElapsedTime(){
    let end = Date.now();
    let elapsed = parseInt((end - start)/1000);   
    if (elapsed<60){
        elapsedElm.innerHTML=`<p>Elapsed Time: ${elapsed} s</p>`;
    }
    else {
        elapsedElm.innerHTML=`<p>Elapsed Time: ${parseInt(elapsed/60)} m ${elapsed-(parseInt(elapsed/60)*60)} s</p>`
    }
    return elapsed/1000;

    
}
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
                let [number , color] = j.split(",");
                console.log(number,color);
                console.log
                if (color==="b"){
                    td.style.backgroundColor = "black";
                    td.style.color = "white";
                    td.style.textAlign="center";
                    td.innerHTML=number;
                }
                else {
                    td.style.backgroundColor = "#229954";
                    td.style.color = "white";
                    td.style.textAlign="center";
                    td.innerHTML=number;
                }
                
            }
            else if (j =="*"){
                td.style.backgroundColor = "#FFF9B4";
                
            }
            else if (j =="O"){
                let bulb = document.createElement("img");
                bulb.src="bulb.png";
                td.style.backgroundColor="#FFF57E";
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

backbtn.addEventListener("click", handleBackButton);
function handleBackButton(e){
    if (confirm("Your solution will be erased when you will come back!")==true){
        game.hidden=true;
        mainPage.hidden=false;
        playing=false;
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
        if (cell.style.backgroundColor!="black" && cell.style.backgroundColor!="#229954"){
            console.log(cell.dataset.row, cell.dataset.column);
            if (gameState[cell.dataset.row][cell.dataset.column]===" "){
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
            else if (gameState[cell.dataset.row][cell.dataset.column]==="O"){  //when removing bulb
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
            else if(gameState[cell.dataset.row][cell.dataset.column]==="X"){
                //removing the conflict
                
                //remove the illumination


                //if there is more than one Xs then X otherwise O
                
                
                //horizontal removing. X BEING COLUMN
                gameState[cell.dataset.row][cell.dataset.column]=" ";
                [first , last]=getActiveColumns(parseInt(cell.dataset.row), parseInt(cell.dataset.column), gameState);
                
                for ([x,val] of gameState[cell.dataset.row].entries()){
                    [f,l]=getActiveRows(parseInt(cell.dataset.row),x, gameState);
                    [t,b]=getActiveColumns(parseInt(cell.dataset.row),parseInt(cell.dataset.column),gameState);
                    if (x>=first && x<=last && x!=cell.dataset.column){
                        if(!((transpose(gameState)[x].slice(f,l+1).includes("X")) || (gameState[cell.dataset.row].slice(t,b+1).includes("X"))) && !((transpose(gameState)[x].slice(f,l+1).includes("O")) || (gameState[cell.dataset.row].slice(t,b+1).includes("O")))){
                            gameState[cell.dataset.row][x]=" ";

                        }
                        
                        
                    } // handle the same column
                    else if (x>=first && x<=last && x===parseInt(cell.dataset.column)){
                        //for same row:
                        [f, l] = getActiveColumns(parseInt(cell.dataset.row), x, gameState);
                        if (gameState[cell.dataset.row].slice(f,l+1).includes("X")){
                            
                            gameState[cell.dataset.row]=gameState[cell.dataset.row].map((e,i) => {
                                if (i>=f && i<=l && e!="X"){
                                    e="*";
                                }
                                
                                return e;
                            });
                            console.log(gameState[cell.dataset.row]);
                            let cross= gameState[cell.dataset.row].filter((x) => x=="X").length>1;
                            
                            gameState[cell.dataset.row]=gameState[cell.dataset.row].map((e,i) => {
                                let crossv = transpose(gameState)[i].filter((m) => m==="X").length>1;
                                console.log(e,i);
                                console.log(cross);
                                console.log(f,l);
                                if (!(crossv || cross) && e=="X" && i>=f  && i<=l){
                                    e="O";
                                }
                                return e;
                            });
                            console.log(gameState[cell.dataset.row]);
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
                        if(!(gameState[y].slice(f, l+1).includes("X") || (transpose(gameState)[cell.dataset.column].slice(t,b+1).includes("X"))) && !(gameState[y].slice(f, l+1).includes("O") || (transpose(gameState)[cell.dataset.column].slice(t,b+1).includes("O")))){
                            gameState[y][cell.dataset.column]=" ";

                        }
                    }
                    else if (y>=topd && y<=bottom && y===parseInt(cell.dataset.row)){
                        //for same column:
                        [t,b] = getActiveRows(y, cell.dataset.column, gameState);
                        if (transpose(gameState)[cell.dataset.column].slice(t,b+1).includes("X")){
                            i=0;
                            let transposed =transpose(gameState);
                            transposed[cell.dataset.column]=transposed[cell.dataset.column].map((e,i) => {
                                if (i>=t && i<=b && e!="X"){
                                    e="*";
                                }
                                return e;
                            });
                            console.log(transposed[cell.dataset.column])
                            let crossv = transposed[cell.dataset.column].filter((m) => m==="X").length>1;
                            
                            transposed[cell.dataset.column]=transposed[cell.dataset.column].map((e,i) => {
                                let cross= gameState[i].filter((x) => x=="X").length>1;
                                if (!(crossv || cross) && e=="X" && i>=t  && i<=b){
                                    e="O";
                                }
                                return e;
                            });
                            console.log(transposed[cell.dataset.column]);
                            gameState= transpose(transposed);

                        }
                    }
            
                }
                
            }
            else if(gameState[cell.dataset.row][cell.dataset.column]==="*"){
                
                gameState[cell.dataset.row][cell.dataset.column]="X";
                //light scattering 
                [first , last]=getActiveColumns(cell.dataset.row, cell.dataset.column, gameState);
                [topd, bottom] = getActiveRows(cell.dataset.row, cell.dataset.column, gameState);
                
                for ([x,val] of gameState[cell.dataset.row].entries()){
                    if (x>=first && x<=last && x!=cell.dataset.column){
                        if (val==="X"){
                            gameState[cell.dataset.row][x]="X";
                        }
                        else if(val ==="O") {
                            gameState[cell.dataset.row][x]="X";

                        }
                        else{
                            gameState[cell.dataset.row][x]="*";

                        }
                        
                    }
                    
                }
                for ([x,val] of gameState.entries()){
                    if (x>=topd && x<=bottom && x!=cell.dataset.row){
                        if (val[cell.dataset.column]==="X"){
                            gameState[x][cell.dataset.column]="X";
                        }
                        else if (val[cell.dataset.column]==="O"){
                            gameState[x][cell.dataset.column]="X";
                        }
                        else{
                            gameState[x][cell.dataset.column]="*";
                            
                        }
                        
                    }
                }

            }
            
        }
        console.log(gameState);
        handleBlackNumbers(gameState);
        if (isGameCorrect(gameState)){
            gameResult.innerHTML = "<h3>Congratulations , You Won</h3>";
            gameResult.hidden=false;
        }
        else{
            gameResult.hidden=true;
        }
        draw_table(gameState);

    }
    
    
}
checkCorrect.addEventListener("click", handleCheckSolution);
function handleCheckSolution(e){
    if (isGameCorrect(gameState)){
        gameResult.innerHTML = "<h3>Congratulations , You Won</h3>";
    }
    else {
        gameResult.innerHTML ="<h3>You have some mistakes in the solution. please check</h3>";
    }
    gameResult.hidden=false;
    // console.log("Game won: ",isGameCorrect(gameState));
}
function handleBlackNumbers(game){
    let matrix=[];
    game.map((e,i) => {
        let col=[];
        console.log((/\d/.test("ss")));
        console.log(game[i])
        let hasNumber=game[i].filter((c) => (/\d/.test(parseInt(c)))).length>=1;
        if(hasNumber){
            game[i].map((c, j) => {
                let count =0;
                if (/\d/.test(c)){
                    let digit = parseInt(c);
                    if (j<game[i].length-1 && (game[i][j+1]==="O" || game[i][j+1]==="X")){
                        count +=1;
                    }
                    if (j>0 && (game[i][j-1]==="O" || game[i][j-1]==="X")){
                        count+=1;
                    }
                    if (i>0 && (game[i-1][j]==="O" || game[i-1][j]==="X")){
                        count+=1;
                    }
                    if (i<game.length-1 && (game[i+1][j]==="O" || game[i+1][j]==="X")){
                        count+=1;
                    }
                    let [num,color] = game[i][j].split(",");
                    console.log(num, col);
                    if (count===parseInt(num)){
                        game[i][j]= num+","+"g";
                    }
                    else{
                        game[i][j]=num+","+"b";
                    }
                    
                }
                col.push(count);
                return c;
            });
        }
        matrix.push(col);
    });
    //now we have the matrix






    return matrix;
}

function isGameCorrect(game){
   //there are no white tiles
   //there are no Xs
   //the number tiles are all green and no black 
   let correct =game.every((e,i) => {
    e=game[i].every((k) => k=="O" || k=="*" || k=="#" || k.split(",")[1]=="g");
    return e;
   });
   return correct;
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


function viewTimeInterval(){
    if (playing && !isGameCorrect(gameState)){
        return getElapsedTime();
    }
    else{
        return 0;
    }
    
}
setInterval(viewTimeInterval,1000);