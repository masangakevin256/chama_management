// Basic Chart.js setup or helpers can go here
export function initChart(canvasId, type, data, options) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // This assumes Chart.js is loaded globally via CDN in the HTML
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: type,
            data: data,
            options: options || { responsive: true }
        });
    }
}
