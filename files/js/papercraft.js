(function(){

    var ctx = document.getElementById('canvas').getContext('2d'), i,
    axeX = 0, axeY = 0, plan = [], down, old, face, pos=[], cub = [];

    document.addEventListener('mousedown', function(e){ down = 1; old = [e.clientX, e.clientY]; }, false);
    document.addEventListener('mouseup', function(e){ down = 0 });
    document.addEventListener('mousemove', function(e){ 
    
        if(down) {

            axeY += (e.clientY - old[1]) / 100;
            axeX -= (e.clientX - old[0]) / 100;
            old = [e.clientX, e.clientY];
            draw();

        }

    }, false);
    
    ctx.font = "50px Helvetica";
    ctx.fillText( "CHARGEMENT...", 100, 225 );

    plan[0] = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    plan[1] = [[0,0,0],[-0.69,0,0],[0.69,0,0],[0,-1,0],[0,0.64,0]];
    face = [[4,5,1,0],[0,1,2,3],[2,3,7,6],[4,5,6,7],[5,1,2,6],[4,0,3,7]];
    size = [[130,140],[50,90],[50,90],[200,140],[100,40]];


    function cube(i){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.s = size[i];
    }

    for (i = 0; i<5; i++){
        cub[i] = new cube(i);
    }

    var img = new Image();
    img.src = "../files/luffy.png";
    img.onload = draw;

    function generate(i, type){

        var pars = parseInt(i/8),
        base = plan[type][i%8][1] * cub[pars].s[1] * Math.sin(axeY) + plan[type][i%8][2] * cub[pars].s[0] * Math.cos(axeY),
        x = base * Math.sin(axeX) + plan[type][i%8][0] * cub[pars].s[0] * Math.cos(axeX),
        y = plan[type][i%8][1] * cub[pars].s[1] * Math.cos(axeY) - plan[type][i%8][2] * cub[pars].s[0] * Math.sin(axeY);
        z = base * Math.cos(axeX) - plan[type][i%8][0] * cub[pars].s[0] * Math.sin(axeX);

        if (type == 0) {
            pos[i] = [x / 2 + cub[pars].x, y / 2 + cub[pars].y, z];
        }

        else { 
            cub[i].x = x  + 250; 
            cub[i].y = y + 250; 
            cub[i].z = z; 
        };

    }

    function draw() {

        ctx.clearRect(0, 0, 700, 600);
        
        for (i = 0; i < 5; i++){
            generate(i, 1);
        }
        
        for(i = 0; i < 40; i++) {
            generate(i, 0);
        }

        for (i = 0; i < 30; i ++){
        
            if (pos[face[i%6][0]][2] + pos[face[i%6][2]][2] < 0){

                ctx.globalCompositeOperation = (cub[parseInt(i/6)].z > 0) ? "destination-over" : "source-over";
                var g = parseInt(i/6)*8,
                scalX = (pos[face[i%6][1] + g][0] - pos[face[i%6][0] + g][0]),
                scalY = (pos[face[i%6][3] + g][1] - pos[face[i%6][0] + g][1]),
                inclX = (pos[face[i%6][1] + g][1] - pos[face[i%6][0] + g][1]),
                inclY = (pos[face[i%6][3] + g][0] - pos[face[i%6][0] + g][0]),
                gap = (i < 6) ? 0 : (i < 18) ? 1 : parseInt(i/6)-1;
                ctx.save();
                ctx.translate(pos[face[i%6][0] + g][0], pos[face[i%6][0] + g][1]);
                ctx.transform(scalX, inclX, inclY, scalY, 0, 0);
                if ( i == 14){ ctx.translate(0.5, 0.5); ctx.scale(-1,1); ctx.translate(-0.5, -0.5);};
                ctx.drawImage(img, ((i%6>4) ? 4 : i%6 ) * 200, gap * 200, 200, 200, 0, 0, 1, 1);
                ctx.restore();

            }

        }

    }

})();