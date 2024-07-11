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

export function createCourseTable() {
    data.courses.forEach(course => {
        const subjectColor = subjectColors[colorIndex % subjectColors.length];
        subjectColorMapping[course.code] = subjectColor;
        colorIndex++;

        course.schedule.forEach((schedule, index) => {
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

            if (index === 0) {
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

            if (index === 0) {
                const typeCell = document.createElement('td');
                typeCell.textContent = course.type;
                typeCell.rowSpan = course.schedule.length;
                row.appendChild(typeCell);

                const creditsCell = document.createElement('td');
                creditsCell.textContent = course.credits;
                creditsCell.rowSpan = course.schedule.length;

                creditsCell.classList.add('last-column');
                row.appendChild(creditsCell);
            }

            courseTableBody.appendChild(row);
        });
    });
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
