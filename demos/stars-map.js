var canvas = document.getElementById('map'), WIDTH = canvas.width, HEIGHT = canvas.height, zoom = 1,
    radius = Math.min(WIDTH, HEIGHT) / 2, mouse = {down: false, pos: {x: 0, y: 0}},
    ctx = canvas.getContext('2d'), Camera = {angularPosition: {x: Math.PI / 2, y: 0}},
    cos = Math.cos, sin = Math.sin, objects = [];

ctx.translate(WIDTH / 2, HEIGHT / 2);


for(var i = 0; i < datas.length; i++){
    var obj = {}, data = datas[i], angX = data[1] / 12 * Math.PI, angY = data[2] / 180 * Math.PI;
    obj.size = data[0];
    obj.pos = {
        x: radius * cos(angY) * cos(angX),
        y: -radius * sin(angY),
        z: radius * cos(angY) * sin(angX)
    }
    objects.push(obj);
}

render();

window.addEventListener('mousedown', function(e){ 
    mouse.down = true;
    editMousePos(e.clientX, e.clientY);
});

window.addEventListener('mousemove', function(e){ 
    if(mouse.down == true){
        rotate(e.clientX - mouse.pos.x, e.clientY - mouse.pos.y);
        editMousePos(e.clientX, e.clientY);
    }
});

window.addEventListener('mouseup', function(){ mouse.down = false;});

function scroll(e){ 
    zoom += zoom * 0.05 * (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))));
    zoom = Math.max(1, zoom); 
    render();
}

window.addEventListener("mousewheel", scroll, false);
window.addEventListener("DOMMouseScroll", scroll, false);

function editMousePos(x, y){
    mouse.pos.x = x;
    mouse.pos.y = y;
}

function rotate(x, y){
    Camera.angularPosition.x += x / 200 / zoom;
    Camera.angularPosition.y += y / 200 / zoom;
    Camera.angularPosition.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, Camera.angularPosition.y));
    render();
}

function render(){

    ctx.fillStyle="darkblue";
    ctx.fillRect(-WIDTH/2, -HEIGHT/2, WIDTH, HEIGHT);
    ctx.beginPath();
    
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    for(var i = 0; i < objects.length; i++){

        var obj = objects[i], position = MatrixX(MatrixY(obj.pos, Camera.angularPosition.x), -Camera.angularPosition.y);
        
        if(position.z < 0 || 
            obj.size > 4 + zoom || 
            Math.abs(position.x * zoom) > radius * 1.5 || 
            Math.abs(position.y * zoom) > radius * 1.5){
            continue;
        }

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(position.x * zoom, position.y * zoom, Math.log(Math.exp(-obj.size) * 50 + 1) * zoom, 0, 2 * Math.PI);
        ctx.fill();

    }

}

function MatrixX(point, ang){
    var sin = Math.sin(ang), cos = Math.cos(ang);
    return {
        x: point.x,
        y: cos * point.y - sin * point.z,
        z: sin * point.y + cos * point.z
    };
}

function MatrixY(point, ang){
    return {
        x: cos(ang) * point.x + sin(ang) * point.z,
        y: point.y,
        z: -sin(ang) * point.x + cos(ang) * point.z
    };
}