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
          "credits": 3
      },
      {
          "name": "ENGINEERING MANAGEMENT",
          "code": "IEN301",
          "schedule": [
              { "sec": "1", "day": "อังคาร", "time": "09:00 - 11:50" },
              { "sec": "2", "day": "อังคาร", "time": "12:00 - 14:50" }
          ],
          "type": "ปฎิบัติ",
          "credits": 3
      },
      {
          "name": "DATA COMMUNICATION LABORATORY",
          "code": "CPE327",
          "schedule": [
              { "sec": "11", "day": "พุธ", "time": "09:00 - 11:51" },
              { "sec": "12", "day": "พุธ", "time": "12:00 - 14:51" },
              { "sec": "13", "day": "พฤหัส", "time": "09:00 - 11:52" },
              { "sec": "14", "day": "จันทร์", "time": "15:00 - 17:50" },
              { "sec": "15", "day": "พฤหัส", "time": "16:00 - 18:50" }
          ],
          "type": "ทฤษฎี",
          "credits": 1
      }
  ]
};

const courseTableBody = document.querySelector('#courseTable tbody');
const newTableBody = document.querySelector('#newTable tbody');
const days = ["วันจันทร์", "วันอังคาร", "พุธ", "พฤหัส", "ศุกร์"];
const numRowsPerDay = 2;

// Object to track selected courses
let selectedCourses = {};

function createCourseTable() {
    data.courses.forEach(course => {
        course.schedule.forEach((schedule, index) => {
            const row = document.createElement('tr');
            row.classList.add('subject-row');
            
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => handleCheckboxChange(course, schedule, checkbox));
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);
            
            if (index === 0) {
                const nameCell = document.createElement('td');
                nameCell.textContent = course.name;
                nameCell.rowSpan = course.schedule.length;
                row.appendChild(nameCell);

                const codeCell = document.createElement('td');
                codeCell.textContent = course.code;
                codeCell.rowSpan = course.schedule.length;
                row.appendChild(codeCell);
            }

            const secCell = document.createElement('td');
            secCell.textContent = schedule.sec;
            row.appendChild(secCell);

            const dayCell = document.createElement('td');
            dayCell.textContent = schedule.day;
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
                row.appendChild(creditsCell);
            }

            courseTableBody.appendChild(row);
        });
    });
}

let selectedSubjectsCount = 0;

function updateSubjectCounter() {
    const counterElement = document.getElementById('subjectCounter');
    counterElement.textContent = `${selectedSubjectsCount} / 7 subjects selected`;
}

function createNewTable() {
  days.forEach((day, index) => {
      // Create the day row
      const dayRow = document.createElement('tr');
      const dayCell = document.createElement('td');
      dayCell.textContent = day;
      dayCell.rowSpan = 2;  // Span two rows
      dayCell.classList.add(day.toLowerCase());
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
      // Add four cells to the second row
      for (let j = 0; j < 3; j++) {
          const cell = document.createElement('td');
          cell.classList.add(`row2`, `col${j}`);
          secondRow.appendChild(cell);
      }
      newTableBody.appendChild(secondRow);
  });
}

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
  


function addCourseToNewTable(course, schedule) {
  console.log(schedule);
  let dayIndex;
  if (schedule.day == 'จันทร์') {dayIndex = 0;}
  else if (schedule.day == 'อังคาร') {dayIndex = 1;}
  else if (schedule.day == 'พุธ') {dayIndex = 2;}
  else if (schedule.day == 'พฤหัส') {dayIndex = 3;}
  else if (schedule.day == 'ศุกร์') {dayIndex = 4;}
  else {
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

  if (timeCell && !timeCell.textContent && codeCell && !codeCell.textContent) {
    
      timeCell.textContent = schedule.time;
      codeCell.textContent = course.code;
  } else {
      console.warn(`Time overlap detected for ${codeCell.textContent} on ${schedule.day} at ${schedule.time}`);

      // Show overlap warning
      const warningDiv = document.createElement('div');
      warningDiv.textContent = `Time overlap detected for ${codeCell.textContent} on ${schedule.day} at ${schedule.time}`;
      warningDiv.classList.add('overlap-warning');

      document.body.appendChild(warningDiv);

        // Remove the warning after the animation completes
        setTimeout(() => {
            warningDiv.remove();
        }, 3000);
  }
}

function removeCourseFromNewTable(course, schedule) {
  let dayIndex;
  if (schedule.day == 'จันทร์') {dayIndex = 0;}
  else if (schedule.day == 'อังคาร') {dayIndex = 1;}
  else if (schedule.day == 'พุธ') {dayIndex = 2;}
  else if (schedule.day == 'พฤหัส') {dayIndex = 3;}
  else if (schedule.day == 'ศุกร์') {dayIndex = 4;}
  else {
      console.log(`Unknown day: ${schedule.day}`);
      return;
  }

  const rows = newTableBody.querySelectorAll('tr');
  const row1 = rows[dayIndex * 2];
  const row2 = rows[dayIndex * 2 + 1];
  
  for (let i = 1; i <= 3; i++) {
      if (row2.children[i-1].textContent === course.code) {
          row1.children[i].textContent = '';
          row2.children[i-1].textContent = '';
          break;
      }
  }
}


// Filter Logic

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
    const searchQuery = searchInput.value.toLowerCase();

    document.querySelectorAll('.subject-row').forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)');
        const codeCell = row.querySelector('td:nth-child(3)');

        if (nameCell && codeCell) {
            const name = nameCell.textContent.toLowerCase();
            const code = codeCell.textContent.toLowerCase();

            const matchesSearch = !searchQuery || name.startsWith(searchQuery) || code.startsWith(searchQuery);

            if (matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});


// Save and load plans

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


// Initialize tables
document.addEventListener('DOMContentLoaded', () => {
    loadPlansFromLocalStorage();
    updateSubjectCounter();
    createCourseTable();
    createNewTable();
});


/*
TODO

Adding filter bar on top of table
searching name startwith can find both name.lowercase and code.lowercase and filter day checkbox dropdown จันทร์ อังคาร พุธ พฤหัส ศุกร์ and day range checkbox dropdown เช้า บ่าย เย็น

Adding Filter Searching

Adding Plan and Saving plan

adding function plan saving
like an button for switching plan
default plan had 3 plan and fourth is + for adding more

ส่วนของ python
ทำหน้าส่วนจอแสดงผลเป็นตาราง tab แรก มีปุ่มกด refresh มุมขวา
ละอีกหน้าเป็นส่วนใ่ข้อมูล คล้่ยๆ TODO add delete edit
*/