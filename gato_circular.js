// =========================
// MOTOR BASE
// =========================

const estado = {
    tablero: {},
    turno: "X",
    terminado: false
};

// vecinos simplificados (base A0-A7 etc.)
const vecinos = {
    A0: ["A1","A7"],
    A1: ["A0","A2"],
    A2: ["A1","A3"],
    A3: ["A2","A4"],
    A4: ["A3","A5"],
    A5: ["A4","A6"],
    A6: ["A5","A7"],
    A7: ["A6","A0"]
};

// =========================
// INICIALIZAR TABLERO
// =========================

function crearTablero() {
    const cont = document.getElementById("tablero");

    Object.keys(vecinos).forEach((k, i) => {
        const el = document.createElement("div");
        el.className = "casilla";
        el.id = k;

        const angle = (i / 8) * Math.PI * 2;
        const radius = 150;

        el.style.left = 180 + radius * Math.cos(angle) + "px";
        el.style.top = 180 + radius * Math.sin(angle) + "px";

        el.onclick = () => jugar(k);

        cont.appendChild(el);
    });
}

// =========================
// LÓGICA DE JUEGO
// =========================

function jugar(pos) {

    if (estado.terminado) return;
    if (estado.tablero[pos]) return;

    estado.tablero[pos] = estado.turno;

    document.getElementById(pos).innerText = estado.turno;

    if (verificarVictoria(estado.turno)) {
        alert("Ganó " + estado.turno);
        estado.terminado = true;
        return;
    }

    estado.turno = estado.turno === "X" ? "O" : "X";
}

// =========================
// VICTORIA (BÁSICA EXTENDIBLE)
// =========================

function verificarVictoria(jugador) {
    const ocupadas = Object.keys(estado.tablero)
        .filter(k => estado.tablero[k] === jugador);

    return ocupadas.length >= 4; // placeholder del sistema circular real
}

// =========================
// BOTONES
// =========================

document.addEventListener("DOMContentLoaded", () => {

    crearTablero();

    document.getElementById("btn-reinicio").onclick = () => location.reload();

    document.getElementById("btn-sorteo").onclick = () => {
        estado.turno = Math.random() > 0.5 ? "X" : "O";
        alert("Empieza: " + estado.turno);
    };

});