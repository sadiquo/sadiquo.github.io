var ctx, WIDTH, HEIGHT, sliders, span, val = [1, 0, 0, 0, 0, 0], N = 6, t = 0, pulsation = 0.5,
    disp = [true, true, true], colors = ['blue', 'red', 'black'];

var sq = x => x * x, sqrt = Math.sqrt, cos = Math.cos, sin = Math.sin, pi = Math.PI;

function sommeSq(a){
    s = 0
    for(var i = 0; i < a.length; i++){
        s += sq(a[i]);
    }
    return s;
}

window.addEventListener('load', function(){
    var canvas = document.getElementById('canvas');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = "5";
    sliders = document.getElementsByClassName('mode');
    span = document.getElementsByClassName('val');
    
    document.getElementById('pulse').addEventListener('change', function(){
        pulsation = +pulse.value;
        document.getElementById('valpulse').innerHTML = pulsation.toFixed(2);
    });
    
    for(var i = 0; i < N; i++){
        sliders[i].addEventListener('change', (function(j){
            return function(){
                normaliser(j);
            };
        })(i));
    }
    
    for(var i = 0; i < 3; i++){
        document.getElementsByClassName('check')[i].addEventListener('change', (function(j){
            return function(){
                disp[j] = this.checked;
            };
        })(i));
    }
    
    trace();
});

function changeVal(i, a){
    val[i] = a;
    sliders[i].value = a;
    span[i].innerHTML = a.toFixed(2);
}

function normaliser(j){
    var newVal = +sliders[j].value, S = sommeSq(val) - sq(val[j]), rapp = (S > 0) ? (1 - sq(newVal))/S : 0;
    changeVal(j, newVal);

    for(var i = 0; i < N; i++){
        if(i != j){
            changeVal(i, (S > 0) ? sqrt(rapp*sq(val[i])) : sqrt((1-sq(newVal))/(N-1)));
        }
    }
}

function trace(){
    
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    var vals = [[], [], []];

    for(var x = 0; x < WIDTH; x++){
        vals[0][x] = 0;
        vals[1][x] = 0;
        
        for(var i = 0; i < N; i++){
            vals[0][x] += val[i] * cos(sq(i + 1) * t) * sin((i + 1) *  pi * x / WIDTH);
            vals[1][x] += val[i] * sin(-sq(i + 1) * t) * sin((i + 1) *  pi * x / WIDTH);
        }
        
        vals[2][x] = sq(vals[0][x]) + sq(vals[1][x]);
    }

    for(var i = 0; i < 3; i++){
        if(disp[i]){
            ctx.beginPath();
            ctx.moveTo(0, HEIGHT / 2);
            
            for(var x = 1; x < WIDTH; x ++){
                ctx.lineTo(x, HEIGHT / 2 - vals[i][x] * 150);
            }
            
            ctx.strokeStyle = colors[i];
            ctx.stroke();
        }
    }

    t += pulsation * 0.05;
    requestAnimationFrame(trace);
}
