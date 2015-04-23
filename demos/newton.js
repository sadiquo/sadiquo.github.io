var canvas, WIDTH, HEIGHT, ctx, y, scale, mouseX, mouseY,
    process = 0,
    scaleZoom = 1.685, // Vitesse de zoom
    precision = 200, // Nombre d'iteration maximum
    nb = 3, // L'exposant du polynome que l'ont résouds: z^nb-1=0
    epsilon = 1e-8,
    a = {r: 1, i: 0}; 

function calculColor(z){

    // Pour le calcul du polynome z^nb-1=0, on crée les variables pow=e^{nb-1} et pow2=e^nb
    for(var n = 0, pow = power(z, nb-1), pow2 = multiply(pow, z); n < precision; n++){
    
        z = sub(z, multiply(a, divide(sub(pow2,{r:1, i: 0}),multiply({r:nb, i: 0}, pow)))); // z = z - a * ((z^{n}-1)/(nb*z^{nb-1}))
        pow = power(z, nb-1);
        pow2 = multiply(pow, z);

        if(sqDist(pow2, {r: 1, i: 0}) < epsilon){ // Si le résulat est proche de 1
            
            // On regarde le signe de la partie réel et imaginaire pour choisir la couleur du pixel
            
            if(z.r > 0 && z.i > 0){
                return [200, 0, 255 - n*(255/precision)];
            }

            if(z.r > 0 && z.i < 0){
                return [0, 200, 255 - n*(255/precision)];
            }

            if(z.r < 0 && z.i > 0){
                return [100, 0, 255 - n*(255/precision)];
            }

            return [100, 255/2, 255 - n*(255/precision)];

        }

    }

    return  [0,0,0]; // Si ne converge pas, pixel noir

}

window.onload = function(){ // Initialisation

    canvas = document.getElementById('canvas');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    ctx = canvas.getContext('2d');
    mouseX = WIDTH / 2;
    mouseY = HEIGHT / 2;
    scale = 4/WIDTH;
    x = -2;
    y = -2*HEIGHT/WIDTH;
    
    render();

    window.onmousemove = function(e){ mouseX = e.clientX; mouseY = e.clientY;};
    window.onmousewheel = zoom;
    window.addEventListener('DOMMouseScroll', zoom, false);
    document.getElementById('send').onclick = function(){
        nb = +document.getElementById('nb-input').value;
        a.r = +document.getElementById('a-r-input').value;
        a.i = +document.getElementById('a-i-input').value;
        epsilon = +document.getElementById('epsilon-input').value;
        epsilon *= epsilon;
        precision = +document.getElementById('precision-input').value;
        
        render();
    };

    function zoom(e){ // Fonction de zoom

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

function render(){ // Affichage de l'ensemble
    
    process = new Date();

    var imageData = ctx.createImageData(WIDTH, HEIGHT);

    for(var i = 0, nb, l = WIDTH * HEIGHT * 4, k; i < l; i++){

        color = calculColor({
            r: (i % WIDTH) * scale + x,
            i: Math.floor(i / WIDTH) * scale + y
        });

        imageData.data[i*4] = color[0];
        imageData.data[i*4 + 1] = color[1];
        imageData.data[i*4 + 2] = color[2];
        imageData.data[i*4 + 3] = 255;
        


    }

    ctx.putImageData(imageData, 0, 0);
    console.log((new Date()) - process)
    process = 0;

}

// Fonction de calcul entre deux nombres complexes

function multiply(z1, z2){
    return {r: z1.r*z2.r-z1.i * z2.i, i: z1.r * z2.i + z1.i * z2.r};
}

function divide(z1, z2){
    return {
        r: (z1.r*z2.r+z1.i * z2.i)/(z2.r * z2.r + z2.i * z2.i),
        i: (z1.i * z2.r - z1.r*z2.i)/(z2.r * z2.r + z2.i * z2.i)
    };
}

function add(z1, z2){
    return {r: z1.r + z2.r, i: z1.i + z2.i};
}

function sub(z1, z2){
    return {r: z1.r - z2.r, i: z1.i - z2.i};
}

function sqDist(z1, z2){ // Carré de la distance entre 2 points
    var v = sub(z2, z1);
    return v.r * v.r + v.i* v.i;
}

function power(z, n){
    
    var r = z, tmp, tmp2;
    
    switch(n){ // Cas particulier pour les petit polynomes
        case 2:
            return multiply(z, z);
        case 3:
            return multiply(multiply(z, z), z);
        case 4:
            tmp =  multiply(z, z); return multiply(tmp, tmp);
        case 5:
            tmp =  multiply(z, z); return multiply(z,multiply(tmp, tmp));
        case 6:
            tmp =  multiply(z,multiply(z, z)); return multiply(tmp,tmp);
        case 7:
            tmp =  multiply(z,multiply(z, z)); return multiply(z,multiply(tmp,tmp));
        case 8:
            tmp =  multiply(z,z);tmp =  multiply(tmp,tmp); return multiply(tmp,tmp);
        case 9:
            tmp =  multiply(z,z);tmp =  multiply(tmp,tmp); return multiply(z,multiply(tmp,tmp));
        case 10:
            tmp =  multiply(z,z);tmp2 =  multiply(tmp,tmp); return multiply(tmp,multiply(tmp2,tmp2));
        case 11:
            tmp =  multiply(z,z);tmp2 =  multiply(tmp,tmp); return multiply(z,multiply(tmp,multiply(tmp2,tmp2)));
    }
    
    for(var i = 1; i < n; i++){ // cas général (long et non optimisé)
        r = multiply(r, z);
    }
    return r;
}