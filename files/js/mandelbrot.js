var canvas, button, precision_input, WIDTH, HEIGHT, ctx, y, scale, mouseX, mouseY, 
    process = 0, scaleZoom = 2, precision = 900, mouseDown;

var color = [];

for(var i = 0; i <= precision; i++){
    color[i] = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

function nbIteration(Re0, Im0, Re, Im){

    var n = 0, x = Re0, y = Im0, inter, sq1 = 0, sq2 = 0;

    if(typeof(Im) == "undefined"){
        Re = Re0;
        Im = Im0;
    }

    while(sq1 + sq2 <= 4 && n < precision){
        sq1 = x * x;
        sq2 = y * y;
        y = 2 * x * y + Im;
        x = sq1 - sq2 + Re;
        n++;
    }

    return n;

}

window.onload = function(){

    canvas = document.getElementById('canvas');
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    mouseX = WIDTH / 2;
    mouseY = HEIGHT / 2;
    x = -2.25;
    y = -1;
    scale =  2/HEIGHT;
    render();

    window.onmousemove = function(e){ mouseX = e.clientX - canvas.offsetWidth; mouseY = e.clientY - canvas.offsetHeight;};
    window.onmousewheel = zoom;
    window.addEventListener('DOMMouseScroll', zoom, false);

    window.onmousedown = function(e){
        if(process){
            return false;
        }
        
        mouseDown = [e.clientX, e.clientY];
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    window.onmouseup = function(e){

        x += (mouseDown[0] - e.clientX) * scale;
        y += (mouseDown[1] - e.clientY) * scale;
            render();
        
        mouseDown = 0;
    };

    window.onmousemove = function(e){ mouseX = e.clientX; mouseY = e.clientY; };
    
    function zoom(e){

        if(process){
            return false;
        }

        process = 1;

        var newScale = (((e.detail | e.deltaY) < 0) ? scale / scaleZoom : scale * scaleZoom);

        x += mouseX * scale - WIDTH * newScale / 2;
        y += mouseY * scale - HEIGHT * newScale / 2;
        scale = newScale;
        
        render();

    }
    
};

function render(){
    
    process = new Date();

    var imageData = ctx.createImageData(WIDTH, HEIGHT);

    for(var i = 0, nb, l = WIDTH * HEIGHT * 4, k; i < l; i++){

        nb = nbIteration((i % WIDTH) * scale + x, Math.floor(i / WIDTH) * scale + y) ;
        var val = Math.log(nb) * 20;

        imageData.data[i*4] = nb/4;
        imageData.data[i*4 + 1] = 0;
        imageData.data[i*4 + 2] = 0;

        if(nb == precision){
            imageData.data[i*4+ 3] = 0;
        }
        else{
            imageData.data[i*4 + 3] = 255;
        }

    }

    ctx.putImageData(imageData, 0, 0);
    console.log((new Date()) - process)
    process = 0;

}