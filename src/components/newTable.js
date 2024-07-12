// src/newTable.js
import { days, newTableBody } from '../domElements.js';
import { dayColors } from '../data.js';

export function createNewTable() {
    days.forEach((day, index) => {
        const dayRow = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = day;
        dayCell.rowSpan = 2;
        dayCell.classList.add(day.toLowerCase());
        dayCell.style.backgroundColor = dayColors[day];
        dayRow.appendChild(dayCell);

        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.classList.add(`row1`, `col${j + 1}`);
            dayRow.appendChild(cell);
        }
        newTableBody.appendChild(dayRow);

        const secondRow = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.classList.add(`row2`, `col${j}`);
            secondRow.appendChild(cell);
        }
        newTableBody.appendChild(secondRow);
    });
}
