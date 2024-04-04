var canvas
var ctx
var fps = 50
var anchoFicha = 50
var altoFicha = 50
var protagonista
var muro = '#044f14'
var tierra = '#c6892f'

var escenario=[
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,2,0,0,2,2,0,0,0,0,2,2,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
    [0,2,2,2,2,2,2,0,2,2,0,0,0,0,0],
    [0,2,2,2,2,2,0,0,0,2,2,2,2,2,0],
    [0,2,2,2,2,0,0,0,0,0,2,2,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

var jugador = function() {

    this.x = 100
    this.y = 100
    this.vy = 0
    this.vx = 0
    this.gravedad = 0.5
    this.friccion = 0.5
    this.salto = 10
    this.velocidad = 2
    this.velocidadMax = 5
    this.suelo = false
    this.pulsaIzquierda = false
    this.pulsaDerecha = false

    this.correccion = function(lugar) {
        //colision suelo (abajo)
        if(lugar == 1) {
            this.y = parseInt(this.y / altoFicha) * altoFicha
        }
        ///arriba
        if(lugar == 2) {
            this.y = parseInt((this.y / altoFicha) + 1) * altoFicha
        }
        //izquierda
        if(lugar == 3) {
            this.x = parseInt(this.x / anchoFicha) * anchoFicha
        }
        //derecha
        if(lugar == 4) {
            this.x = parseInt((this.x / anchoFicha) + 1) * altoFicha
        }
    }

    this.fisica = function() {
        /////Primero implementar gravedad
        if(this.suelo == false)
            this.vy += this.gravedad
        ////Movimiento horizontal del usuario
        if(this.pulsaDerecha == true && this.vx <= this.velocidadMax)
            this.vx += this.velocidad
        if(this.pulsaIzquierda == true && this.vx >= 0 - (this.velocidadMax))
            this.vx -= this.velocidad

        ///Aplicar friccion
        //derecha
        if(this.vx > 0) {
            this.vx -= this.friccion
            if(this.vx < 0)
                this.vx = 0
        }
        //izquierda
        if(this.vx < 0) {
            this.vx += this.friccion
            if(this.vx > 0)
                this.vx = 0
        }
        //colisiones derecha
        if(this.vx > 0) {
            if((this.colision(this.x + anchoFicha + this.vx, this.y + 1) == true) || (this.colision(this.x + anchoFicha + this.vx, this.y + altoFicha - 1) == true)) {
                if(this.x != parseInt(this.x / anchoFicha) * anchoFicha) this.correccion(4)
                this.vx = 0
            }
        }
         //colisiones izquierda
         if(this.vx < 0) {
            if((this.colision(this.x + this.vx, this.y + 1) == true) || (this.colision(this.x+this.vx, this.y+altoFicha-1) == true)) {
                if(this.x != parseInt(this.x / anchoFicha) * anchoFicha) this.correccion(3)
                this.vx = 0
            }
         }
        //Asigne valores
        this.y += this.vy
        this.x += this.vx

        ///colision techo
        if(this.vy < 0) {
            if((this.colision(this.x + 1, this.y) == true) || (this.colision(this.x + anchoFicha - 1, this.y) == true)) {
                this.vy = 0
                this.correccion(2)
            }
        }
        ///Colision suelo
        if(this.vy >= 0) {
            if((this.colision(this.x + 1, this.y + altoFicha) == true) || (this.colision(this.x + anchoFicha - 1, this.y + altoFicha) == true) ) {
                this.suelo = true
                this.vy = 0
                this.correccion(1)
            }
            else {
                this.suelo = false
            }

        }
    }

    this.colision = function(x, y) {
        var colisiona = false

        if(escenario[parseInt(y / altoFicha)][parseInt(x / anchoFicha)] == 0) {
            colisiona = true
        }
        return colisiona
    }

    this.dibuja = function () {
        this.fisica()
        ctx.fillStyle ='#820c01'
        ctx.fillRect(this.x, this.y, anchoFicha, altoFicha)
    }

    this.arriba = function() {
        if(this.suelo == true) {
            this.vy -= this.salto
            this.suelo = false
        }
    }

    this.derecha = function() {
        this.pulsaDerecha = true
    }

    this.izquierda = function() {
       this.pulsaIzquierda = true
    }

    this.sueltaDerecha = function() {
        this.pulsaDerecha = false
    }

    this.sueltaIzquierda = function() {
        this.pulsaIzquierda = false
    }
}

function dibujaEscenario() {
    var color

    for (y = 0; y < 10; y++) {
        for(x = 0;x < 15; x++) {

            if(escenario[y][x] == 0) color = muro
            if(escenario[y][x] == 2) color = tierra
            ctx.fillStyle = color
            ctx.fillRect(x * anchoFicha, y * altoFicha, anchoFicha, altoFicha)
        }
    }
}

function borrarCanvas() {
    canvas.width = 750
    canvas.height = 500
}

function principal() {
    borrarCanvas()
    dibujaEscenario()
    protagonista.dibuja()
}

function inicializa(){
    canvas= document.getElementById('canvas')
    ctx= canvas.getContext('2d')

    protagonista= new jugador()

    document.addEventListener('keydown', function(tecla) {

        if(tecla.keyCode == 38) {
            protagonista.arriba()
        }

        if(tecla.keyCode==37) {
            protagonista.izquierda()
        }

        if(tecla.keyCode==39) {
            protagonista.derecha()
        }

    })

    document.addEventListener('keyup', function(tecla) {

        if(tecla.keyCode == 37) {
            protagonista.sueltaIzquierda()
        }

        if(tecla.keyCode == 39) {
            protagonista.sueltaDerecha()
        }        
    })

    setInterval(function() {
        principal()
    }, 1000/fps)

}


