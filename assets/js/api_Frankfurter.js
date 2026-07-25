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

/* Obtener los ultimos tipos de cambio de divisas*/
/* https://api.frankfurter.dev/v2/rates  */

/**
 * Obtiene la tasa de un par específico
 */
async function getRate(base, quote) {
    const response = await fetch(`${api}/rate/${base}/${quote}`);
    if (!response.ok) return null;
    return response.json();
}
/**
 * Obtiene varios pares de divisas y sus tasas
 */
async function getTickerRates() {
    const promises = PAIRS.map(([base, quote]) => getRate(base, quote));
    const results = await Promise.all(promises);

    // Filtramos los que fallaron
    return results.filter(item => item !== null);
}
/**
 * Muestra el ticker
 */
async function mostrarTicker() {
    try {
    const data = await getTickerRates();
    const tickerTrack = document.getElementById("tickerTrack");
    tickerTrack.innerHTML = "";

    data.forEach(item => {
        const span = document.createElement("span");
        span.classList.add("tickerItem");

        // Formato: USD/JPY 157.91
        span.textContent = `${item.base}/${item.quote} ${item.rate.toFixed(4)}`;

        tickerTrack.appendChild(span);
    });



    } catch (error) {
        console.error(error);
    }
}

mostrarTicker();

// Llamamos la función cuando cargue la página
mostrarTicker();