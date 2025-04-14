// js/reports.js
/**
 * Renders the Reports page inside the provided container element.
 * @param {HTMLElement} container - The DOM element where the Reports page is rendered.
 */
export function renderReportsPage(container) {
    const stored = localStorage.getItem('tasks');
    let tasks = [];
    if (stored) {
        tasks = JSON.parse(stored);
    }
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    container.innerHTML = `
      <div class="reports-page">
        <h2>Reports</h2>
        <div class="report-summary">
          <p>Total Tasks: ${total}</p>
          <p>Active Tasks: ${active}</p>
          <p>Completed Tasks: ${completed}</p>
        </div>
      </div>
    `;
}
