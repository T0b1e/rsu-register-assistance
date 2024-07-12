// src/components/modal.js
import { days, newTableBody } from '../domElements.js';
import { data, subjectColors } from '../data.js';
import { createCourseTable, subjectColorMapping } from './courseTable.js'; // Import subjectColorMapping

let currentEditIndex = null;

export function openAddSubjectModal() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'block';
}

export function closeAddSubjectModal() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'none';
}

export function addNewSubject() {
    if (!validateFormInputs()) {
        return;
    }

    const titleInput = document.getElementById('subjectTitle');
    const codeInput = document.getElementById('subjectCode');
    const creditInput = document.getElementById('subjectCredit');
    const priceInput = document.getElementById('subjectPrice');
    const sectionsContainer = document.getElementById('sectionsContainer');
    const sections = sectionsContainer.querySelectorAll('.section');
    const subjectType = document.querySelector('input[name="subjectType"]:checked').value;

    const newSubject = {
        name: titleInput.value,
        code: codeInput.value,
        credits: parseInt(creditInput.value),
        price: parseInt(priceInput.value),
        type: subjectType,
        schedule: []
    };

    sections.forEach(section => {
        const daySelect = section.querySelector('.day-select');
        const startTimeInput = section.querySelector('.start-time');
        const endTimeInput = section.querySelector('.end-time');
        const sectionNumberInput = section.querySelector('.section-number');

        newSubject.schedule.push({
            day: daySelect.value,
            time: `${startTimeInput.value} - ${endTimeInput.value}`,
            sec: sectionNumberInput.value
        });
    });

    if (currentEditIndex !== null) {
        data.courses[currentEditIndex] = newSubject;
        currentEditIndex = null;
    } else {
        data.courses.push(newSubject);
    }

    createCourseTable();
    closeAddSubjectModal();
}

export function editSubject(index) {
    currentEditIndex = index;
    const course = data.courses[index];

    const titleInput = document.getElementById('subjectTitle');
    const codeInput = document.getElementById('subjectCode');
    const creditInput = document.getElementById('subjectCredit');
    const priceInput = document.getElementById('subjectPrice');
    const sectionsContainer = document.getElementById('sectionsContainer');
    sectionsContainer.innerHTML = '';
    const subjectType = document.querySelector(`input[name="subjectType"][value="${course.type}"]`);

    titleInput.value = course.name;
    codeInput.value = course.code;
    creditInput.value = course.credits;
    priceInput.value = course.price;
    if (subjectType) {
        subjectType.checked = true;
    }

    course.schedule.forEach(schedule => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');
        sectionDiv.innerHTML = `
            <label>Day:
                <select class="day-select" required>
                    <option value="" disabled>Select day</option>
                    <option value="จันทร์" ${schedule.day === 'จันทร์' ? 'selected' : ''}>จันทร์</option>
                    <option value="อังคาร" ${schedule.day === 'อังคาร' ? 'selected' : ''}>อังคาร</option>
                    <option value="พุธ" ${schedule.day === 'พุธ' ? 'selected' : ''}>พุธ</option>
                    <option value="พฤหัส" ${schedule.day === 'พฤหัส' ? 'selected' : ''}>พฤหัส</option>
                    <option value="ศุกร์" ${schedule.day === 'ศุกร์' ? 'selected' : ''}>ศุกร์</option>
                </select>
            </label>
            <label>Time Start:
                <select class="start-time" required>
                    <option value="" disabled>Select start time</option>
                    <option value="08:30" ${schedule.time.split(' - ')[0] === '08:30' ? 'selected' : ''}>08:30</option>
                    <option value="09:00" ${schedule.time.split(' - ')[0] === '09:00' ? 'selected' : ''}>09:00</option>
                    <option value="11:50" ${schedule.time.split(' - ')[0] === '11:50' ? 'selected' : ''}>11:50</option>
                    <option value="13:00" ${schedule.time.split(' - ')[0] === '13:00' ? 'selected' : ''}>13:00</option>
                    <option value="12:50" ${schedule.time.split(' - ')[0] === '12:50' ? 'selected' : ''}>12:50</option>
                    <option value="14:50" ${schedule.time.split(' - ')[0] === '14:50' ? 'selected' : ''}>14:50</option>
                    <option value="15:00" ${schedule.time.split(' - ')[0] === '15:00' ? 'selected' : ''}>15:00</option>
                    <option value="16:00" ${schedule.time.split(' - ')[0] === '16:00' ? 'selected' : ''}>16:00</option>
                    <option value="16:50" ${schedule.time.split(' - ')[0] === '16:50' ? 'selected' : ''}>16:50</option>
                    <option value="17:50" ${schedule.time.split(' - ')[0] === '17:50' ? 'selected' : ''}>17:50</option>
                    <option value="18:50" ${schedule.time.split(' - ')[0] === '18:50' ? 'selected' : ''}>18:50</option>
                </select>
            </label>
            <label>Time End:
                <select class="end-time" required>
                    <option value="" disabled>Select end time</option>
                    <option value="08:30" ${schedule.time.split(' - ')[1] === '08:30' ? 'selected' : ''}>08:30</option>
                    <option value="09:00" ${schedule.time.split(' - ')[1] === '09:00' ? 'selected' : ''}>09:00</option>
                    <option value="11:50" ${schedule.time.split(' - ')[1] === '11:50' ? 'selected' : ''}>11:50</option>
                    <option value="13:00" ${schedule.time.split(' - ')[1] === '13:00' ? 'selected' : ''}>13:00</option>
                    <option value="12:50" ${schedule.time.split(' - ')[1] === '12:50' ? 'selected' : ''}>12:50</option>
                    <option value="14:50" ${schedule.time.split(' - ')[1] === '14:50' ? 'selected' : ''}>14:50</option>
                    <option value="15:00" ${schedule.time.split(' - ')[1] === '15:00' ? 'selected' : ''}>15:00</option>
                    <option value="16:00" ${schedule.time.split(' - ')[1] === '16:00' ? 'selected' : ''}>16:00</option>
                    <option value="16:50" ${schedule.time.split(' - ')[1] === '16:50' ? 'selected' : ''}>16:50</option>
                    <option value="17:50" ${schedule.time.split(' - ')[1] === '17:50' ? 'selected' : ''}>17:50</option>
                    <option value="18:50" ${schedule.time.split(' - ')[1] === '18:50' ? 'selected' : ''}>18:50</option>
                </select>
            </label>
            <label>Section Number: <input type="number" class="section-number" min="1" max="100" value="${schedule.sec}" required></label>
            <button type="button" class="delete-button delete-section">Delete Section</button>
        `;
        sectionsContainer.appendChild(sectionDiv);

        // Add event listener for delete section button
        sectionDiv.querySelector('.delete-section').addEventListener('click', () => {
            sectionDiv.remove();
        });
    });

    openAddSubjectModal();
}

export function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject?')) {
        data.courses.splice(index, 1);
        createCourseTable();
    }
}

export function addNewSection() {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    sectionDiv.innerHTML = `
        <label>Day:
            <select class="day-select" required>
                <option value="" disabled>Select day</option>
                <option value="จันทร์">จันทร์</option>
                <option value="อังคาร">อังคาร</option>
                <option value="พุธ">พุธ</option>
                <option value="พฤหัส">พฤหัส</option>
                <option value="ศุกร์">ศุกร์</option>
            </select>
        </label>
        <label>Time Start:
            <select class="start-time" required>
                <option value="" disabled>Select start time</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="11:50">11:50</option>
                <option value="13:00">13:00</option>
                <option value="12:50">12:50</option>
                <option value="14:50">14:50</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="16:50">16:50</option>
                <option value="17:50">17:50</option>
                <option value="18:50">18:50</option>
            </select>
        </label>
        <label>Time End:
            <select class="end-time" required>
                <option value="" disabled>Select end time</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="11:50">11:50</option>
                <option value="13:00">13:00</option>
                <option value="12:50">12:50</option>
                <option value="14:50">14:50</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="16:50">16:50</option>
                <option value="17:50">17:50</option>
                <option value="18:50">18:50</option>
            </select>
        </label>
        <label>Section Number: <input type="number" class="section-number" min="1" max="100" required></label>
        <button type="button" class="delete-button delete-section">Delete Section</button>
    `;
    sectionsContainer.appendChild(sectionDiv);

    // Add event listener for delete section button
    sectionDiv.querySelector('.delete-section').addEventListener('click', () => {
        sectionDiv.remove();
    });
}

export function addCourseToNewTable(course, schedule) {
    let dayIndex = days.indexOf(schedule.day);
    if (dayIndex === -1) {
        console.log(`Unknown day: ${schedule.day}`);
        return;
    }
    const rows = newTableBody.querySelectorAll('tr');
    const row1 = rows[dayIndex * 2];
    const row2 = rows[dayIndex * 2 + 1];

    const timeParts = schedule.time.split(' - ');
    const startTime = timeParts[0];
    const endTime = timeParts[1];

    let timeCell, codeCell;
    if (startTime < "12:00") {
        timeCell = row1.children[1];
        codeCell = row2.children[0];
    } else if (startTime >= "12:00" && endTime <= "14:50") {
        timeCell = row1.children[2];
        codeCell = row2.children[1];
    } else if (startTime >= "09:00" && endTime <= "12:50") {
        timeCell = row1.children[2];
        timeCell = row1.children[3];
        codeCell = row2.children[1];
        codeCell = row2.children[2];
    } else {
        timeCell = row1.children[3];
        codeCell = row2.children[2];
    }

    const subjectColor = subjectColorMapping[course.code];

    // console.log(`Setting subject color for ${course.code}: ${subjectColor}`);

    if (timeCell && !timeCell.textContent && codeCell && !codeCell.textContent) {
        timeCell.textContent = schedule.time;
        timeCell.style.backgroundColor = subjectColor;
        codeCell.textContent = `${course.code} (${schedule.sec})`;
        codeCell.style.backgroundColor = subjectColor;
    } else {
        console.warn(`Time overlap detected for ${course.code} on ${schedule.day} at ${schedule.time}`);

        const warningDiv = document.createElement('div');
        warningDiv.textContent = `Time overlap detected for ${course.code} on ${schedule.day} at ${schedule.time}`;
        warningDiv.classList.add('overlap-warning');

        document.body.appendChild(warningDiv);

        setTimeout(() => {
            warningDiv.classList.add('show');
        }, 10);

        setTimeout(() => {
            warningDiv.classList.remove('show');
        }, 1500);

        setTimeout(() => {
            warningDiv.remove();
        }, 3000);
    }
}

export function removeCourseFromNewTable(course, schedule) {
    let dayIndex = days.indexOf(schedule.day);
    if (dayIndex === -1) {
        console.log(`Unknown day: ${schedule.day}`);
        return;
    }

    const rows = newTableBody.querySelectorAll('tr');
    const row1 = rows[dayIndex * 2];
    const row2 = rows[dayIndex * 2 + 1];

    for (let i = 1; i <= 3; i++) {
        if (row2.children[i - 1].textContent === `${course.code} (${schedule.sec})`) {
            row1.children[i].textContent = '';
            row1.children[i].style.backgroundColor = '';
            row2.children[i - 1].textContent = '';
            row2.children[i - 1].style.backgroundColor = '';
            break;
        }
    }
}

function validateFormInputs() {
    const titleInput = document.getElementById('subjectTitle');
    const codeInput = document.getElementById('subjectCode');
    const creditInput = document.getElementById('subjectCredit');
    const priceInput = document.getElementById('subjectPrice');
    const sectionsContainer = document.getElementById('sectionsContainer');
    const sections = sectionsContainer.querySelectorAll('.section');

    if (!titleInput.value || !codeInput.value || !creditInput.value || !priceInput.value || sections.length === 0) {
        alert('Please fill in all required fields.');
        return false;
    }

    for (const section of sections) {
        const daySelect = section.querySelector('.day-select');
        const startTimeInput = section.querySelector('.start-time');
        const endTimeInput = section.querySelector('.end-time');
        const sectionNumberInput = section.querySelector('.section-number');

        if (!daySelect.value || !startTimeInput.value || !endTimeInput.value || !sectionNumberInput.value) {
            alert('Please fill in all required fields for each section.');
            return false;
        }

        if (startTimeInput.value === endTimeInput.value) {
            alert('Start time and end time cannot be the same.');
            return false;
        }
    }

    return true;
}

document.getElementById('addSectionBtn').addEventListener('click', addNewSection);
document.getElementById('saveSubjectBtn').addEventListener('click', addNewSubject);
document.getElementById('closeModalBtn').addEventListener('click', closeAddSubjectModal);
