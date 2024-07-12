// src/components/courseTable.js
import { data, dayColors, subjectColors } from '../data.js';
import { courseTableBody } from '../domElements.js';
import { handleCheckboxChange } from './checkboxHandler.js';
import { openAddSubjectModal, editSubject, deleteSubject } from './modal.js';

let colorIndex = 0;
export const subjectColorMapping = {}; // Export this to use in other files

export function createCourseTable() {
    // Clear existing table content
    courseTableBody.innerHTML = '';

    data.courses.forEach((course, index) => {
        const subjectColor = subjectColors[colorIndex % subjectColors.length];
        subjectColorMapping[course.code] = subjectColor; // Populate the mapping here
        colorIndex++;

        // console.log(`Setting color for ${course.name} (${course.code}): ${subjectColor}`);

        course.schedule.forEach((schedule, indexSchedule) => {
            const row = document.createElement('tr');
            row.classList.add('subject-row');

            const checkboxCell = document.createElement('td');
            checkboxCell.style.backgroundColor = subjectColor;

            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.addEventListener('change', () => handleCheckboxChange(course, schedule, checkbox));

            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkmark);
            checkboxCell.appendChild(checkboxContainer);
            row.appendChild(checkboxCell);

            if (indexSchedule === 0) {
                const nameCell = document.createElement('td');
                nameCell.textContent = course.name;
                nameCell.style.backgroundColor = subjectColor;
                nameCell.rowSpan = course.schedule.length;
                row.appendChild(nameCell);

                const codeCell = document.createElement('td');
                codeCell.textContent = course.code;
                codeCell.style.backgroundColor = subjectColor;
                codeCell.rowSpan = course.schedule.length;
                row.appendChild(codeCell);

                const typeCell = document.createElement('td');
                typeCell.textContent = course.type;
                typeCell.rowSpan = course.schedule.length;
                row.appendChild(typeCell);
            }

            const secCell = document.createElement('td');
            secCell.textContent = schedule.sec;
            row.appendChild(secCell);

            const dayCell = document.createElement('td');
            dayCell.textContent = schedule.day;
            dayCell.style.backgroundColor = dayColors[schedule.day];
            // console.log(`Setting day color for ${schedule.day}: ${dayColors[schedule.day]}`);
            row.appendChild(dayCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = schedule.time;
            row.appendChild(timeCell);

            if (indexSchedule === 0) {
                const creditsCell = document.createElement('td');
                creditsCell.textContent = course.credits;
                creditsCell.rowSpan = course.schedule.length;
                creditsCell.classList.add('last-column');
                row.appendChild(creditsCell);

                const editCell = document.createElement('td');
                editCell.rowSpan = course.schedule.length;
                editCell.classList.add('edit-column');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-button'; // Add class to button
                editButton.addEventListener('click', () => editSubject(index));
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                const deleteCell = document.createElement('td');
                deleteCell.rowSpan = course.schedule.length;
                deleteCell.classList.add('delete-column'); // Add class to cell
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Add class to button
                deleteButton.addEventListener('click', () => deleteSubject(index));
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);
            }

            courseTableBody.appendChild(row);
        });
    });

    // Add the last row for new subject
    const addRow = document.createElement('tr');
    const addCell = document.createElement('td');
    addCell.colSpan = 9;
    addCell.classList.add('add-new-subject');
    addCell.textContent = '+ Add New Subject';
    addCell.addEventListener('click', openAddSubjectModal);
    addRow.appendChild(addCell);
    courseTableBody.appendChild(addRow);
}
