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
const selectedCourses = {};

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
      console.warn(`Time overlap detected for ${course.name} on ${schedule.day} at ${schedule.time}`);

      // Show overlap warning
      const warningDiv = document.createElement('div');
      warningDiv.textContent = `Time overlap detected for ${course.code} at ${schedule.time}`;
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

// Initialize tables

updateSubjectCounter();

createCourseTable();
createNewTable();