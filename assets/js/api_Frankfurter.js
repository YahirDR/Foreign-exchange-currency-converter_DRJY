//llamada a la api de Frankfurter para 
// obtener los tipos de cambio de divisas
const api = "https://api.frankfurter.dev/v2";

// Pares populares que quieres mostrar (puedes agregar o quitar)
const PAIRS = [
// ===== Majors (los más importantes) =====
    ["EUR", "USD"],   // El más negociado del mundo
    ["USD", "JPY"],   // Segundo más importante
    ["GBP", "USD"],   // Cable
    ["USD", "CHF"],   // Swissy
    ["AUD", "USD"],   // Aussie
    ["USD", "CAD"],   // Loonie
    ["NZD", "USD"],   // Kiwi

  // ===== Cruces principales (Crosses) =====
    ["EUR", "GBP"],
    ["EUR", "JPY"],
    ["GBP", "JPY"],
    ["EUR", "CHF"],
    ["AUD", "JPY"],

  // ===== Pares emergentes populares =====
    ["USD", "MXN"],   // Muy usado en Latinoamérica
    ["USD", "BRL"],   // Real brasileño
    ["USD", "CNY"],   // Yuan chino (opcional)
];

/**
 * Obtiene la tasa de un par en una fecha concreta (o la más reciente si no se pasa fecha)
 */
async function getRate(base, quote, date = null) {
    let url = `${api}/rate/${base}/${quote}`;
    if (date) url += `?date=${date}`;

    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
}

/**
 * Devuelve la fecha de ayer en formato YYYY-MM-DD
 */
function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
}

/**
 * Obtiene los pares con su cambio de 24h
 */
async function getTickerRates() {
    const yesterday = getYesterday();

    const promises = PAIRS.map(async ([base, quote]) => {
    const [today, previous] = await Promise.all([
        getRate(base, quote),
        getRate(base, quote, yesterday)
    ]);

    if (!today) return null;

    // Calculamos el cambio porcentual
    let change = 0;
    if (previous && previous.rate) {
        change = ((today.rate - previous.rate) / previous.rate) * 100;
    }

    return {
        base: today.base,
        quote: today.quote,
        rate: today.rate,
        change: change
    };
    });

    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
}

/**
 * Muestra el ticker con flechas
 */
async function mostrarTicker() {
    try {
    const data = await getTickerRates();
    const tickerTrack = document.getElementById("tickerTrack");
    tickerTrack.innerHTML = "";

    data.forEach(item => {
        const span = document.createElement("span");
        span.classList.add("tickerItem");

        const isPositive = item.change >= 0;
        const arrow = isPositive ? "▲" : "▼";
        const changeClass = isPositive ? "up" : "down";
        const changeText = `${arrow} ${Math.abs(item.change).toFixed(2)}%`;

        span.innerHTML = `
        <span class="pair">${item.base}/${item.quote}</span>
        <span class="rate">${item.rate.toFixed(4)}</span>
        <span class="change ${changeClass}">${changeText}</span>
        `;

        tickerTrack.appendChild(span);
    });

    // Duplicamos para la animación continua
    tickerTrack.innerHTML += tickerTrack.innerHTML;

    } catch (error) {
        console.error(error);
    }
}

mostrarTicker();