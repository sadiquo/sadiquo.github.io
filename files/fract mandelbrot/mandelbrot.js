var canvas, WIDTH, HEIGHT, ctx, scale, mouseX, mouseY, color = [[Math.random() * 255, Math.random() * 255, Math.random() * 255]], Julia = false, point = [0, 0],
    scaleZoom = 4, precision = 1200, mouseDown = [0, 0];

for(var i = 1; i <= 3000; i++){
    color[i] = [color[i-1][0] + (Math.random()-0.5) * 50 % 256, 
                color[i-1][1] + (Math.random()-0.5) * 50 % 256,
                color[i-1][2] + (Math.random()-0.5) * 50 % 256];
}

function nbIteration(Re0, Im0){

    var x = Re0, y = Im0, q = (x - 0.25)*(x - 0.25) + y * y, sq1 = x*x, sq2 = y*y,
        Re = (Julia ? point[0] : Re0), Im = (Julia ? point[1] : Im0);

    if(!Julia && ( (x + 1)*(x + 1) + y * y < 1 / 16 || q * (q + (x - 0.25)) < y*y / 4 )){
        return -1
    }

    for(var n = 0; n <= precision; n++){
        y = 2 * x * y + Im;
        x = sq1 - sq2 + Re;
        sq1 = x * x;
        sq2 = y * y;
        if(sq1 + sq2 >= 4){
            return n;
        }
    }
    return -1;
}

function init(){
    scale =  3.5 / WIDTH;
    x = -scale * WIDTH / 2 - 0.5;
    y = -HEIGHT / 2 * scale;
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
    init();
    render();

    window.addEventListener('keypress', function(e){
        switch(e.key){
            case '0':
                init();
                break;
            case '+':
            case '-': 
                zoom(e);
                break;
            case 'p':
                precision += 100;
                break;
            case 'j': 
                Julia = !Julia;
                point = [x + mouseX * scale, y + mouseY * scale]
                break;
            default: return false;
        }
        render();
    }, false);

    window.addEventListener('mousemove', function(e){
        mouseX = e.clientX - canvas.offsetWidth;
        mouseY = e.clientY - canvas.offsetHeight;
    }, false);
    
    window.addEventListener('mousedown', function(e){
        mouseDown = [e.clientX, e.clientY];
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, false);

    window.addEventListener('mouseup', function(e){
        x += (mouseDown[0] - e.clientX) * scale;
        y += (mouseDown[1] - e.clientY) * scale;
        render();
    }, false);

    window.addEventListener('mousemove', function(e){ 
        mouseX = e.clientX; 
        mouseY = e.clientY; 
    }, false);
    
    function zoom(e){
        var newScale = (e.key == "+" ? scale / scaleZoom : scale * scaleZoom);
        x += mouseX * scale - WIDTH * newScale / 2;
        y += mouseY * scale - HEIGHT * newScale / 2;
        scale = newScale;
    }
    
};

function render(){

    var imageData = ctx.createImageData(WIDTH, HEIGHT), N = WIDTH * HEIGHT * 4;

    for(var i = 0; i < N; i++){

        var n = nbIteration((i % WIDTH) * scale + x, Math.floor(i / WIDTH) * scale + y);
        imageData.data[i*4 + 3] = (n >= 0 ? 255 : 0);

        if(n >= 0){
            imageData.data[i*4] = color[n][0];
            imageData.data[i*4 + 1] = color[n][1];
            imageData.data[i*4 + 2] = color[n][2];
        }

    }

    ctx.putImageData(imageData, 0, 0);

}