// js/calendar.js
/**
 * Renders the Calendar page inside the provided container element.
 * @param {HTMLElement} container - The DOM element where the Calendar page is rendered.
 */
export function renderCalendarPage(container) {
    container.innerHTML = `
      <div class="calendar-page">
        <h2>Calendar</h2>
        <div id="calendarContainer" class="calendar-container">
          <!-- The calendar grid will be generated here -->
        </div>
      </div>
    `;

    const calendarContainer = document.getElementById('calendarContainer');
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Calculate the first day and the number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendarHTML = '<div class="calendar-grid">';
    // Render day names
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHTML += `<div class="calendar-cell header-cell">${day}</div>`;
    });
    // Render empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="calendar-cell empty-cell"></div>`;
    }
    // Render day cells
    for (let d = 1; d <= daysInMonth; d++) {
        calendarHTML += `<div class="calendar-cell day-cell">${d}</div>`;
    }
    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;

    // Add fade-in animation class for a smooth appearance
    calendarContainer.classList.add('fade-in');
    setTimeout(() => calendarContainer.classList.remove('fade-in'), 500);
}
