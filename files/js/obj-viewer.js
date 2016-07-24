var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), zoom = 3.5e6, speedZoom = 1.1,
    relativeX = 0, mouseDown = 0, posMouse, k = 4/5, WIDTH = window.innerWidth, HEIGHT = window.innerHeight, e = 0;

canvas.width = WIDTH;
canvas.height = HEIGHT;

var data = [
    {name: 'sun', size: 1.3916e9},
    {name: 'earth', size: 1.27562e7, 
        moons: [
            {name: 'moon', size: 3.4748e6},
            {name: 'iss', size: 50}
        ]
    },
    {name: 'saturn', size: 1.16464e8,
        moons: [
            {name: 'mimas', size: 4.15e5 },
            {name: 'anceladus', size: 5.13e5 },
            {name: 'tethys', size: 1.060e6 },
            {name: 'dione', size: 1.118e6 },
            {name: 'rhea', size: 1.527e6 },
            {name: 'titan', size: 5.151e6 },
            {name: 'iapetus', size: 1.468e6 },
            {name: 'prometheus', size: 8.5e4 },
            {name: 'epimetheus', size: 1.1e5 },
            {name: 'janus', size: 1.90e5 },
            {name: 'methone', size: 3.2e3 },
            {name: 'telesto', size: 2.5e4 },
            {name: 'helene', size: 4.5e4 },
            {name: 'hyperion', size: 3.7e5 },
            {name: 'phoebe', size: 2.17e5 },
            {name: 'atlas', size: 3.4e4 },
			{name: 'pandora', size: 8.1e4 },
			{name: 'calypso', size: 1.8e4 }
        ]
    },
    {name: 'neptune', size: 4.9244e7,
        moons: [
            {name: 'triton', size: 2.708e6 },
            {name: 'proteus', size: 4.2e5 }
        ]
    },
    {name: 'jupiter', size: 1.39822e8,
        moons: [
            {name: 'io', size: 3.6432e6 },
            {name: 'europa', size: 3.121e6 },
            {name: 'ganymede', size: 5.2624e6 },
            {name: 'callisto', size: 4.82e6 },
            {name: 'thebe', size: 1.0e5 }
        ]
    },
    {name: 'uranus', size: 5.0724e7,
        moons: [
            {name: 'titania', size: 1.57e6 },
            {name: 'oberon', size: 1.523e6 },
            {name: 'ariel', size: 1.158e6 },
            {name: 'miranda', size: 4.8e5 },
            {name: 'umbriel', size: 1.169e6 }
        ]
    },
    {name: 'mars', size: 6.78e6,
        moons: [
            {name: 'deimos', size: 1.24e4},
            {name: 'phobos', size: 2.25e4},
        ]
    },
    {name: 'pluto', size: 2.37e6 ,
        moons: [
            {name: 'charon', size: 1.2e6 },
            {name: 'nix', size: 42e3 },
			{name: 'New Horizons', size: 2.5 }
        ]
    },
    {name: 'ida', size: 2.6e4 , 
        moons: [
            {name: 'dactyl', size: 1.4e3 }
        ]
    },
    {name: 'venus', size: 1.2104e7},
    {name: 'mercury', size: 4.88e6},
    {name: 'churyumov', size: 4.1e3, moons: [
            {name: 'rosetta', size: 3}
        ]},
    {name: 'ceres', size: 9.52e5},
    {name: 'vesta', size: 4.54e5},
    {name: 'B 612', size: 5},
    {name: 'lutetia', size: 1e5 },
    {name: 'mathilde', size: 4.8e4 },
    {name: 'eros', size: 2.0e4 },
    {name: 'gaspra', size: 1.7e4 },
    {name: 'wild 2', size: 5.5e3 },
    {name: 'toutatis', size: 4.2e3 },
    {name: 'tempel 1', size: 7.6e3 },
    {name: 'itokawa', size: 2.5e2 },
];

data.sort(function(a, b){
    return a.size < b.size;
});

var list = [];

for(var i = 0; i < data.length; i++){
    list.push({name: data[i].name, size: data[i].size, planet: i});

    if(data[i].moons){

        data[i].moons.sort(function(a, b){
            return a.size < b.size;
        });
        
        for(j = 0; j < data[i].moons.length; j++){
            list.push({name: data[i].moons[j].name, size: data[i].moons[j].size, planet: i});
        }
    }
}

for(var i =0; i < list.length; i++){
    load(list[i]);
}

function scroll(e){ 
    var oldZoom = zoom;
    zoom = ((e.wheelDelta || -e.detail) > 0) ? zoom / speedZoom : zoom * speedZoom;
    relativeX +=  WIDTH * k * oldZoom - WIDTH * k * zoom;
    display();
}

function load(obj){

    var img = new Image();
    obj.img = img;

    img.onload = function(){
        obj.imgWidth = obj.img.width;
        if(e < list.length - 1){
            e++;
        } else {
            init();
        }
    };
    
    img.src = "/files/obj-view-img/" + obj.name + ".jpg";

}

function init(){

    for(var i = 0, obj, x = 0; i < list.length; i++){
        obj = list[i];
        obj.prop = obj.img.width / obj.img.height;
        obj.name = obj.name[0].toUpperCase() + obj.name.substr(1, obj.name.length);
        obj.x = x + obj.size * obj.prop * 0.75;
        x += 2 * obj.size * obj.prop;
    }

    var last = list[list.length - 1];
    relativeX = last.x - k * WIDTH * zoom + last.size * last.prop / 2 ;
    
    window.onmousedown = function(e){
        mouseDown = 1;
        posMouse = e.clientX;
    };

    window.onmouseup = function(e){
        mouseDown = 0;
    };

    window.onmousemove = function(e){

        if(mouseDown){
            relativeX += (posMouse - e.clientX) * zoom;
            display();
        }
        
        posMouse = e.clientX;

    };

    window.addEventListener("mousewheel", scroll, false);
    window.addEventListener("DOMMouseScroll", scroll, false);
    
    ctx.fillStyle = "white";
    
    display();

}

function display(){
    
    ctx.clearRect(0,0, WIDTH, HEIGHT);

    for(var i = 0, obj, x, y, w, h, sz; i < list.length; i++){

        obj = list[i];
        x = (obj.x - relativeX) / zoom;
        y = (HEIGHT - obj.size / zoom) / 2;
        h = obj.size / zoom;
        w = h * obj.prop;
        sz = Math.round(obj.size / 10 / zoom);

        ctx.drawImage(obj.img, x, y, w, h);
        ctx.font= sz + "px Verdana";
        ctx.fillText(obj.name, x + w / 2 - 0.3 * sz * obj.name.length, (HEIGHT + 1.3 * obj.size / zoom) / 2 );

    }

}
