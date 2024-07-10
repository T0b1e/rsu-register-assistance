// Data and Configuration
const data = {
    "courses": [
        {
            "name": "COMPUTER ORGANIZATION AND ARCHITECTURE",
            "code": "CPE432",
            "schedule": [
                { "sec": "1", "day": "อังคาร", "time": "12:00 - 14:50" },
                { "sec": "2", "day": "พฤหัส", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "FUNDAMENTAL OF DATABASE SYSTEMS",
            "code": "CPE361",
            "schedule": [
                { "sec": "1", "day": "อังคาร", "time": "15:00 - 17:50" },
                { "sec": "2", "day": "ศุกร์", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "SIGNALS AND SYSTEMS",
            "code": "CPE308",
            "schedule": [
                { "sec": "1", "day": "พุธ", "time": "09:00 - 11:50" },
                { "sec": "2", "day": "ศุกร์", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "COMPUTER ENGINEERING MATHEMATICS II",
            "code": "CPE332",
            "schedule": [
                { "sec": "1", "day": "จันทร์", "time": "12:00 - 14:50" },
                { "sec": "2", "day": "อังคาร", "time": "09:00 - 11:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "DATA COMMUNICATION AND DATA NETWORKS",
            "code": "CPE326",
            "schedule": [
                { "sec": "1", "day": "พุธ", "time": "15:00 - 17:50" },
                { "sec": "2", "day": "พฤหัส", "time": "15:00 - 17:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "ENGINEERING MANAGEMENT",
            "code": "IEN301",
            "schedule": [
                { "sec": "1", "day": "จันทร์", "time": "15:00  -  17:50" },
                { "sec": "2", "day": "พฤหัส", "time": "16:00  -  18:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "DATA COMMUNICATION LABORATORY",
            "code": "CPE327",
            "schedule": [
                { "sec": "11", "day": "อังคาร", "time": "09:00 - 11:51" },
                { "sec": "12", "day": "อังคาร", "time": "12:00 - 14:51" },
                { "sec": "13", "day": "พุธ", "time": "09:00 - 11:52" },
                { "sec": "14", "day": "พุธ", "time": " 12:00  -  14:50" },
                { "sec": "15", "day": "พฤหัส", "time": "09:00  -  11:50" }
            ],
            "type": "ปฎิบัติ",
            "price": 6400,
            "credits": 1
        }
    ]
};

const dayColors = {
    'จันทร์': '#B0A695',
    'อังคาร': '#E7D4B5',
    'พุธ': '#F6E6CB',
    'พฤหัส': '#B6C7AA',
    'ศุกร์': '#A0937D'  
};

const subjectColors = [
    '#5AB2FF',
    '#A0DEFF',
    '#CAF4FF',
    '#B3C8CF',
    '#BED7DC',
    '#F1EEDC',
    '#FFF9D0'
];

// DOM Elements
const courseTableBody = document.querySelector('#courseTable tbody');
const newTableBody = document.querySelector('#newTable tbody');
const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];
const numRowsPerDay = 2;

let colorIndex = 0;
const subjectColorMapping = {};

// Object to track selected courses
let selectedCourses = {};
let selectedSubjectsCount = 0;

// Functions

// Create Course Table
function createCourseTable() {
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
            checkbox.style.width = '20px'; // Increase the width of the checkbox
            checkbox.style.height = '20px'; // Increase the height of the checkbox
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

// Update Subject Counter
function updateSubjectCounter() {
    const counterElement = document.getElementById('subjectCounter');
    let totalSumPrice = 0;
    let totalCredits = 0;
    Object.values(selectedCourses).forEach(courseInfo => {
        const course = data.courses.find(c => c.code);
        if (course) {
            totalSumPrice += course.price;
            totalCredits += course.credits;
        } else {
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

// Create New Table
function createNewTable() {
    days.forEach((day, index) => {
        // Create the day row
        const dayRow = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = day;
        dayCell.rowSpan = 2;  // Span two rows
        dayCell.classList.add(day.toLowerCase());
        dayCell.style.backgroundColor = dayColors[day];
        dayRow.appendChild(dayCell);

        // Add three more cells to the day row
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.classList.add(`row1`, `col${j + 1}`);
            dayRow.appendChild(cell);
        }
        newTableBody.appendChild(dayRow);

        // Create the second row for this day
        const secondRow = document.createElement('tr');
        // Add three cells to the second row
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.classList.add(`row2`, `col${j}`);
            secondRow.appendChild(cell);
        }
        newTableBody.appendChild(secondRow);
    });
}

// Handle Checkbox Change
function handleCheckboxChange(course, schedule, checkbox) {
    const courseKey = `${course.code}-${schedule.sec}`;

    if (checkbox.checked) {
        // Uncheck any previously selected section for this course
        if (selectedCourses[course.code]) {
            const prevCheckbox = document.querySelector(`input[type="checkbox"][data-course="${course.code}"][data-section="${selectedCourses[course.code].section}"]`);
            if (prevCheckbox) prevCheckbox.checked = false;
            removeCourseFromNewTable(course, selectedCourses[course.code].schedule);
        } else {
            // Only increment if it's a new course, not just a different section
            selectedSubjectsCount++;
        }

        selectedCourses[course.code] = { section: schedule.sec, schedule: schedule };
        addCourseToNewTable(course, schedule);
    } else {
        delete selectedCourses[course.code];
        removeCourseFromNewTable(course, schedule);
        selectedSubjectsCount--;
    }

    // Set data attributes for easy selection later
    checkbox.setAttribute('data-course', course.code);
    checkbox.setAttribute('data-section', schedule.sec);

    updateSubjectCounter();
}

// Add Course to New Table
function addCourseToNewTable(course, schedule) {
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
    } else {
        timeCell = row1.children[3];
        codeCell = row2.children[2];
    }

    const subjectColor = subjectColorMapping[course.code];

    if (timeCell && !timeCell.textContent && codeCell && !codeCell.textContent) {
        timeCell.textContent = schedule.time;
        timeCell.style.backgroundColor = subjectColor;
        codeCell.textContent = course.code;
        codeCell.style.backgroundColor = subjectColor;
    } else {
        console.warn(`Time overlap detected for ${codeCell.textContent} on ${schedule.day} at ${schedule.time}`);

        // Show overlap warning
        const warningDiv = document.createElement('div');
        warningDiv.textContent = `Time overlap detected for ${codeCell.textContent} on ${schedule.day} at ${schedule.time}`;
        warningDiv.classList.add('overlap-warning');
        
        document.body.appendChild(warningDiv);
        
        // Add the 'show' class to trigger the fade-in effect
        setTimeout(() => {
            warningDiv.classList.add('show');
        }, 10);
        
        // Remove the 'show' class to trigger the fade-out effect after 1.5 seconds
        setTimeout(() => {
            warningDiv.classList.remove('show');
        }, 1500);
        
        // Remove the warningDiv from the DOM after the fade-out completes
        setTimeout(() => {
            warningDiv.remove();
        }, 3000);
        
    }
}

// Remove Course from New Table
function removeCourseFromNewTable(course, schedule) {
    let dayIndex = days.indexOf(schedule.day);
    if (dayIndex === -1) {
        console.log(`Unknown day: ${schedule.day}`);
        return;
    }

    const rows = newTableBody.querySelectorAll('tr');
    const row1 = rows[dayIndex * 2];
    const row2 = rows[dayIndex * 2 + 1];

    for (let i = 1; i <= 3; i++) {
        if (row2.children[i - 1].textContent === course.code) {
            row1.children[i].textContent = '';
            row1.children[i].style.backgroundColor = '';
            row2.children[i - 1].textContent = '';
            row2.children[i - 1].style.backgroundColor = '';
            break;
        }
    }
}

// Plan Management
let currentPlan = "plan-1";
let plans = {
    "plan-1": { courses: {}, checkboxes: {} },
    "plan-2": { courses: {}, checkboxes: {} },
    "plan-3": { courses: {}, checkboxes: {} }
};

const planSelection = document.getElementById('planSelection');
const savePlanButton = document.getElementById('savePlanButton');

planSelection.addEventListener('change', handlePlanChange);
savePlanButton.addEventListener('click', saveCurrentPlan);

function handlePlanChange() {
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

// Save Current Plan
function saveCurrentPlan() {
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

// Load Plan
function loadPlan(plan) {
    // Clear current selections
    Object.keys(selectedCourses).forEach(code => {
        const schedule = selectedCourses[code].schedule;
        removeCourseFromNewTable(data.courses.find(course => course.code === code), schedule);
    });

    const planData = plans[plan] || { courses: {}, checkboxes: {} }; // Ensure planData is always an object
    selectedCourses = JSON.parse(JSON.stringify(planData.courses || {})); // Ensure courses is always an object
    selectedSubjectsCount = Object.keys(selectedCourses).length;
    updateSubjectCounter();

    // Clear all checkboxes first
    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Restore checkboxes
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

// Local Storage Operations
function savePlansToLocalStorage() {
    localStorage.setItem('plans', JSON.stringify(plans));
}

function loadPlansFromLocalStorage() {
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
        try {
            const parsedPlans = JSON.parse(storedPlans);
            Object.assign(plans, parsedPlans);
            // Populate plan selection dropdown with saved plans
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
        savePlansToLocalStorage(); // Save default plans if no plans found in local storage
    }
}

// Initialize tables on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadPlansFromLocalStorage();
    updateSubjectCounter();
    createCourseTable();
    createNewTable();
});
