
/* =====================================================
   GATO CIRCULAR - MOTOR UNIFICADO FINAL (v1.0 CLEAN)
   ===================================================== */

// =========================
// ESTADO GLOBAL
// =========================

const sistema = {
    partida: null,
    ia: null,
    pesos: null,
    eventBus: null
};

// =========================
// CASILLAS Y TABLERO
// =========================

const todasLasCasillas = [
"A0","A1","A2","A3","A4","A5","A6","A7",
"B0","B1","B2","B3","B4","B5","B6","B7",
"C0","C1","C2","C3","C4","C5","C6","C7",
"D0","D1","D2","D3","D4","D5","D6","D7"
];

function crearEstadoInicialTablero() {
    const tablero = {};
    todasLasCasillas.forEach(c => tablero[c] = null);
    return tablero;
}

function obtenerCasillasLibres(tablero) {
    return Object.keys(tablero).filter(k => tablero[k] === null);
}

// =========================
// GRAFO (CONEXIONES)
// =========================

const vecinosCasillas = {
    A0:["A1","A7","B0","B1","B7"],
    A1:["A0","A2","B1","B0","B2"],
    A2:["A1","A3","B2","B1","B3"],
    A3:["A2","A4","B3","B2","B4"],
    A4:["A3","A5","B4","B3","B5"],
    A5:["A4","A6","B5","B4","B6"],
    A6:["A5","A7","B6","B5","B7"],
    A7:["A6","A0","B7","B6","B0"]
};

Object.assign(vecinosCasillas, {

B0:["B1","B7","A0","A1","A7","C0","C1","C7"],
B1:["B0","B2","A1","A0","A2","C1","C2","C0"],
B2:["B1","B3","A2","A1","A3","C2","C3","C1"],
B3:["B2","B4","A3","A2","A4","C3","C4","C2"],
B4:["B3","B5","A4","A3","A5","C4","C5","C3"],
B5:["B4","B6","A5","A4","A6","C5","C6","C4"],
B6:["B5","B7","A6","A5","A7","C6","C7","C5"],
B7:["B6","B0","A7","A6","A0","C7","C0","C6"],

C0:["C1","C7","B0","B1","B7","D0","D1","D7"],
C1:["C0","C2","B1","B2","B0","D1","D2","D0"],
C2:["C1","C3","B2","B3","B1","D2","D3","D1"],
C3:["C2","C4","B3","B4","B2","D3","D4","D2"],
C4:["C3","C5","B4","B5","B3","D4","D5","D3"],
C5:["C4","C6","B5","B6","B4","D5","D6","D4"],
C6:["C5","C7","B6","B7","B5","D6","D7","D5"],
C7:["C6","C0","B7","B0","B6","D7","D0","D6"],

D0:["D1","D7","C0","C1","C7"],
D1:["D0","D2","C1","C2","C0"],
D2:["D1","D3","C2","C3","C1"],
D3:["D2","D4","C3","C4","C2"],
D4:["D3","D5","C4","C5","C3"],
D5:["D4","D6","C5","C6","C4"],
D6:["D5","D7","C6","C7","C5"],
D7:["D6","D0","C7","C0","C6"]

});

// =========================
// EVENT BUS
// =========================

function crearEventBus() {
    return { eventos: {} };
}

function emitirEvento(bus, tipo, data) {
    if (!bus.eventos[tipo]) return;
    bus.eventos[tipo].forEach(fn => fn(data));
}

function suscribirEvento(bus, tipo, fn) {
    if (!bus.eventos[tipo]) bus.eventos[tipo] = [];
    bus.eventos[tipo].push(fn);
}

// =========================
// JUGADAS
// =========================

function jugar(tablero, casilla, jugador) {
    if (tablero[casilla]) return false;
    tablero[casilla] = jugador;
    return true;
}

// =========================
// VICTORIA (BASE EXTENSIBLE)
// =========================

function detectarVictoria(tablero, jugador) {
    const ocupadas = Object.keys(tablero)
        .filter(k => tablero[k] === jugador);

    return ocupadas.length >= 4;
}

// =========================
// IA (BASE SIMPLE INICIAL)
// =========================

function IA(tablero) {
    const libres = obtenerCasillasLibres(tablero);
    return libres[0] || null;
}

// =========================
// SISTEMA PRINCIPAL
// =========================

function iniciarJuego() {

    const tablero = crearEstadoInicialTablero();

    sistema.partida = {
        tablero,
        turno: "X",
        terminado: false,
        ganador: null
    };

    sistema.eventBus = crearEventBus();

    return sistema;
}

// =========================
// CONTROL DE TURNO
// =========================

function procesarJugadaConEventos(casilla) {

    const p = sistema.partida;
    if (p.terminado) return;

    jugar(p.tablero, casilla, p.turno);

    if (detectarVictoria(p.tablero, p.turno)) {
        p.terminado = true;
        p.ganador = p.turno;
        return;
    }

    p.turno = (p.turno === "X") ? "O" : "X";

    emitirEvento(sistema.eventBus, "JUGADA", p);
}

// =========================
// INICIALIZACIÓN VISUAL
// =========================

function crearTableroVisual() {

    const contenedor =
        document.getElementById(
            "tablero"
        );

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const anillos = ["A","B","C","D"];

    const radios = {
        A: 160,
        B: 120,
        C: 80,
        D: 40
    };

    const centroX = 200;
    const centroY = 200;

    anillos.forEach(anillo => {

        for(let i = 0; i < 8; i++) {

            const casilla =
                document.createElement("div");

            const nombre =
                anillo + i;

            casilla.classList.add(
                "casilla"
            );

            casilla.id =
                nombre;

            casilla.dataset.posicion =
                nombre;

            casilla.innerText =
                nombre;

            const angulo =
                ((360 / 8) * i - 90)
                * Math.PI / 180;

            const radio =
                radios[anillo];

            const x =
                centroX +
                Math.cos(angulo) * radio;

            const y =
                centroY +
                Math.sin(angulo) * radio;

            casilla.style.left =
                x + "px";

            casilla.style.top =
                y + "px";

            contenedor.appendChild(
                casilla
            );

        }

    });

}

// =========================
// API PÚBLICA
// =========================

const GatoCircular = {

    iniciar: iniciarJuego,
    jugar: procesarJugadaConEventos,
    estado: () => sistema,
    ia: () => IA

};

// =========================
// BOOTSTRAP
// =========================

(function bootstrap() {

    iniciarJuego();

    crearTableroVisual();

    window.GatoCircular = GatoCircular;

    console.log(
        "Gato Circular listo"
    );

})();

