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

const tableBody = document.querySelector('#courseTable tbody');

data.courses.forEach(course => {
    course.schedule.forEach(schedule => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = course.name;
        row.appendChild(nameCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = course.code;
        row.appendChild(codeCell);

        const secCell = document.createElement('td');
        secCell.textContent = schedule.sec;
        row.appendChild(secCell);

        const dayCell = document.createElement('td');
        dayCell.textContent = schedule.day;
        row.appendChild(dayCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = schedule.time;
        row.appendChild(timeCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = course.type;
        row.appendChild(typeCell);

        const creditsCell = document.createElement('td');
        creditsCell.textContent = course.credits;
        row.appendChild(creditsCell);

        tableBody.appendChild(row);
    });
});