(function(){ 

    var canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), i,
        equals = [[[]],[[]]], arc, line, trait, turnTo, cases, fill, score;
    
    init();
    
    function init(){

        score = [0, 0];
        turnTo = 0;
        
        canvas.onclick= function(e){
    
            var ratio = canvas.clientWidth / 700,
                x = parseInt((e.clientX + document.documentElement.scrollLeft - 170 * ratio - canvas.offsetLeft) / (120 * ratio)),
                y = parseInt((e.clientY + document.documentElement.scrollTop - 20 * ratio - canvas.offsetTop) / (120 * ratio));

            if(turnTo == 0 && !cases[x][y] && x < 3 && y < 3){
                cross(x, y);
            }

        }; 

        load();

    }

    function load(){

        fill = 0;
        ctx.clearRect( 0, 0, 700, 400 );
        ctx.font = "45px Helvetica";
        ctx.fillText( "Joueur", 10, 180 );
        ctx.fillText( score[0], 65, 240 );
        ctx.fillText( "Robot", 550, 180 );
        ctx.fillText( score[1], 595, 240 );
        ctx.strokeStyle = "Gray";
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth= "12";

        for (i = 1; i < 3; i++){
            ctx.moveTo(i * 120 + 170, 20);
            ctx.lineTo(i * 120 + 170, 380);
            ctx.moveTo(180, i * 120 + 20);
            ctx.lineTo(520, i * 120 + 20);
        }

        ctx.stroke();
        cases=[[],[],[]];

        if(turnTo == 1){
            IA();
        }

    }

    function cross(x, y) {

        trait = [0, 0];
        repeat = setInterval(draw_cross, 20);
        
        function draw_cross() {

            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.moveTo(x * 120 + 275, y * 120 + 40);
            ctx.lineTo(x * 120 + 275 - trait[0] * 85, y * 120 + 40 + 85 * trait[0]);
            ctx.stroke();
            ctx.moveTo(x * 120 + 190, y * 120 + 40);
            ctx.lineTo(x * 120 + 190 + trait[1] * 85, y * 120 + 40 + 85 * trait[1]);
            if (trait[1]) ctx.stroke();
            
            (trait[0] > 1) ? trait[1] += 0.05 : trait[0] += 0.05;

            if (trait[1] > 1) {
                clearInterval(repeat); 
                cases[x][y] = "x";
                verif(0);
            }

        }

    }

    function circle(x, y) {

        arc = 0;
        repeat = setInterval(draw_circle, 20);

        function draw_circle() {

            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.arc(x * 120 + 230, y * 120 + 80, 40, (arc - 0.2) * Math.PI, arc * Math.PI);
            ctx.stroke();

            if ( arc > 2 ) {
                clearInterval(repeat);
                cases[x][y] = "o";
                verif(1);
            }

            else arc += 0.1;

        }

    }

    function verif(joueur){

        for(i = 0; i < 3; i++){
            
            equals[0][i] = cases[0][i] == cases[1][i] && cases[1][i] == cases[2][i];
            equals[1][i] = cases[i][0] == cases[i][1] && cases[i][1] == cases[i][2];
            
            if (cases[i][i]){
             
                if (equals[0][i]) {
                    win(joueur, 0, i, 2, 0); 
                    return;
                }
                
                if (equals[1][i]) {
                    win(joueur, i, 0, 0, 2); 
                    return;
                }

            }

        }
        
        equals[2] = cases[0][0] == cases[1][1] && cases[1][1] == cases[2][2] && cases[1][1];
        equals[3] = cases[0][2] == cases[1][1] && cases[1][1] == cases[2][0] && cases[1][1];

        fill++;
        turnTo = !turnTo;

        if (equals[2]) win(joueur, 0, 0, 2, 2);
        else if(equals[3]){ win(joueur, 2, 0, -2, 2); }
        else if(fill == 9) { wait = setTimeout(load, 1500); }
        else if(turnTo){ IA();}

    }

    function IA(){

        for(i = 0; i < 3; i++){

            if (cases[1][i] == cases[2][i] && cases[2][i] && !cases[0][i]) { circle(0,i); return; }
            if (cases[i][1] == cases[i][2] && cases[i][2] && !cases[i][0]) { circle(i,0); return; }
            if (cases[0][i] == cases[2][i] && cases[2][i] && !cases[1][i]) { circle(1,i); return; }
            if (cases[i][0] == cases[i][2] && cases[i][2] && !cases[i][1]) { circle(i,1); return; }
            if (cases[0][i] == cases[1][i] && cases[1][i] && !cases[2][i]) { circle(2,i); return; }
            if (cases[i][0] == cases[i][1] && cases[i][1] && !cases[i][2]) { circle(i,2); return; }

        }

        if (cases[1][1] == cases[2][2] && cases[2][2] && !cases[0][0]){ circle(0,0); return; }
        if (cases[0][2] == cases[1][1] && cases[1][1] && !cases[2][0]){ circle(2,0); return; }
        if (cases[0][0] == cases[2][2] && cases[2][2] && !cases[1][1]){ circle(1,1); return; }
        if (cases[2][0] == cases[0][2] && cases[0][2] && !cases[1][1]){ circle(1,1); return; }
        if (cases[1][1] == cases[2][0] && cases[2][0] && !cases[0][2]){ circle(0,2); return; }
        if (cases[0][0] == cases[1][1] && cases[1][1] && !cases[2][2]){ circle(2,2); return; }

        do {
            x = Math.round(Math.random() * 2);
            y = Math.round(Math.random() * 2);
        } while (cases[x][y]);

        circle(x, y);

    }

    function win(winner, beginX, beginY, difX, difY){

        line = 0;
        repeat = setInterval(draw_line, 20);
        
        function draw_line(){

            ctx.beginPath();
            ctx.strokeStyle = (winner) ? "red" : "blue";
            ctx.moveTo(beginX * 120 + 230, beginY * 120 + 80);
            ctx.lineTo((beginX + difX * line) * 120 + 230 , (beginY + difY * line) * 120 + 80 );
            ctx.stroke();
            line += 0.03;

            if (line > 1){

                clearInterval(repeat); 
                score[winner]++;

                wait = setTimeout(function(){
                    turnTo = !winner;
                    load();
                }, 1500);

            }
        
        }

    }

})();