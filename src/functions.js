// src/functions.js
import { data, dayColors, subjectColors } from './data.js';
import { courseTableBody, newTableBody, days } from './domElements.js';

let colorIndex = 0;
const subjectColorMapping = {};
let selectedCourses = {};
let selectedSubjectsCount = 0;
let plans = {
    "plan-1": { courses: {}, checkboxes: {} },
    "plan-2": { courses: {}, checkboxes: {} },
    "plan-3": { courses: {}, checkboxes: {} }
};
let currentPlan = "plan-1";

let currentEditIndex = null; // Store the index of the course being edited

// Updated createCourseTable to include Edit button
export function createCourseTable() {
    // Clear existing table content
    courseTableBody.innerHTML = '';

    data.courses.forEach((course, index) => {
        const subjectColor = subjectColors[colorIndex % subjectColors.length];
        subjectColorMapping[course.code] = subjectColor;
        colorIndex++;

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


export function updateSubjectCounter() {
    const counterElement = document.getElementById('subjectCounter');
    let totalSumPrice = 0;
    let totalCredits = 0;
    Object.values(selectedCourses).forEach(courseInfo => {
        const course = data.courses.find(c => c.code);
        if (course) {
            totalSumPrice += course.price;
            totalCredits += course.credits;
        }
    });

    const selectedSubjectsText = `${selectedSubjectsCount} / 7 subjects selected`;
    const sumPriceText = `Sum Price: ${totalSumPrice.toLocaleString()} / Sum`;
    const sumCreditsText = `Sum Credits: ${totalCredits} / 21`;

    counterElement.innerHTML = `
        <div class="counter-text">
            <span class="selected-subjects">${selectedSubjectsText}</span>
            <span class="sum-price">${sumPriceText}</span>
            <span class="sum-credits">${sumCreditsText}</span>
        </div>
    `;
}

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

export function handleCheckboxChange(course, schedule, checkbox) {
    const courseKey = `${course.code}-${schedule.sec}`;

    if (checkbox.checked) {
        if (selectedCourses[course.code]) {
            const prevCheckbox = document.querySelector(`input[type="checkbox"][data-course="${course.code}"][data-section="${selectedCourses[course.code].section}"]`);
            if (prevCheckbox) prevCheckbox.checked = false;
            removeCourseFromNewTable(course, selectedCourses[course.code].schedule);
        } else {
            selectedSubjectsCount++;
        }

        selectedCourses[course.code] = { section: schedule.sec, schedule: schedule };
        addCourseToNewTable(course, schedule);
    } else {
        delete selectedCourses[course.code];
        removeCourseFromNewTable(course, schedule);
        selectedSubjectsCount--;
    }

    checkbox.setAttribute('data-course', course.code);
    checkbox.setAttribute('data-section', schedule.sec);

    updateSubjectCounter();
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

export function handlePlanChange() {
    const selectedPlan = planSelection.value;
    if (selectedPlan === 'new-plan') {
        const newPlanName = prompt('Enter the name of the new plan:');
        if (newPlanName) {
            plans[newPlanName] = { courses: {}, checkboxes: {} };
            const newOption = document.createElement('option');
            newOption.value = newPlanName;
            newOption.textContent = newPlanName;
            planSelection.insertBefore(newOption, planSelection.querySelector('option[value="new-plan"]'));
            planSelection.value = newPlanName;
            currentPlan = newPlanName;
        }
    } else {
        currentPlan = selectedPlan;
        loadPlan(currentPlan);
    }
}

export function saveCurrentPlan() {
    const savedSelectedCourses = {};
    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            const courseCode = checkbox.getAttribute('data-course');
            const section = checkbox.getAttribute('data-section');
            savedSelectedCourses[courseCode] = section;
        }
    });
    plans[currentPlan] = {
        courses: JSON.parse(JSON.stringify(selectedCourses)),
        checkboxes: savedSelectedCourses
    };
    savePlansToLocalStorage();
    alert(`Plan "${currentPlan}" saved successfully!`);
}

export function loadPlan(plan) {
    Object.keys(selectedCourses).forEach(code => {
        const schedule = selectedCourses[code].schedule;
        removeCourseFromNewTable(data.courses.find(course => course.code === code), schedule);
    });

    const planData = plans[plan] || { courses: {}, checkboxes: {} };
    selectedCourses = JSON.parse(JSON.stringify(planData.courses || {}));
    selectedSubjectsCount = Object.keys(selectedCourses).length;
    updateSubjectCounter();

    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    if (planData.checkboxes) {
        Object.keys(planData.checkboxes).forEach(courseCode => {
            const section = planData.checkboxes[courseCode];
            const checkbox = document.querySelector(`input[type="checkbox"][data-course="${courseCode}"][data-section="${section}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    Object.keys(selectedCourses).forEach(code => {
        const course = data.courses.find(course => course.code === code);
        const schedule = selectedCourses[code].schedule;
        addCourseToNewTable(course, schedule);
    });
}

export function savePlansToLocalStorage() {
    localStorage.setItem('plans', JSON.stringify(plans));
}

export function loadPlansFromLocalStorage() {
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
        try {
            const parsedPlans = JSON.parse(storedPlans);
            Object.assign(plans, parsedPlans);
            Object.keys(plans).forEach(planName => {
                if (!document.querySelector(`#planSelection option[value="${planName}"]`)) {
                    const newOption = document.createElement('option');
                    newOption.value = planName;
                    newOption.textContent = planName;
                    planSelection.appendChild(newOption);
                }
            });
        } catch (e) {
            console.error('Error parsing saved plans:', e);
        }
    } else {
        savePlansToLocalStorage();
    }
}

// Open Modal to Add Subject
function openAddSubjectModal() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'block';
}

// Close Modal
function closeAddSubjectModal() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'none';
}

// Add New Subject
function addNewSubject() {
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

// Edit subject
function editSubject(index) {
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
        `;
        sectionsContainer.appendChild(sectionDiv);
    });

    openAddSubjectModal();
}

// Add New Section
function addNewSection() {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    sectionDiv.innerHTML = `
        <label>Day:
            <select class="day-select" required>
                <option value="" disabled selected>Select day</option>
                <option value="จันทร์">จันทร์</option>
                <option value="อังคาร">อังคาร</option>
                <option value="พุธ">พุธ</option>
                <option value="พฤหัส">พฤหัส</option>
                <option value="ศุกร์">ศุกร์</option>
            </select>
        </label>
        <label>Time Start:
            <select class="start-time" required>
                <option value="" disabled selected>Select start time</option>
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
                <option value="" disabled selected>Select end time</option>
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
    `;
    sectionsContainer.appendChild(sectionDiv);
}

// Validate form inputs
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