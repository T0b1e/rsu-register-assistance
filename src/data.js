// data.js
export const data = {
    "courses": [
        {
            "name": "COMPUTER ORGANIZATION AND ARCHITECTURE",
            "code": "CPE432",
            "schedule": [
                { "sec": "01", "day": "อังคาร", "time": "12:00 - 14:50" },
                { "sec": "02", "day": "พฤหัส", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "FUNDAMENTAL OF DATABASE SYSTEMS",
            "code": "CPE361",
            "schedule": [
                { "sec": "01", "day": "อังคาร", "time": "15:00 - 17:50" },
                { "sec": "02", "day": "ศุกร์", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "SIGNALS AND SYSTEMS",
            "code": "CPE308",
            "schedule": [
                { "sec": "01", "day": "พุธ", "time": "09:00 - 11:50" },
                { "sec": "02", "day": "ศุกร์", "time": "12:00 - 14:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "COMPUTER ENGINEERING MATHEMATICS II",
            "code": "CPE332",
            "schedule": [
                { "sec": "01", "day": "จันทร์", "time": "12:00 - 14:50" },
                { "sec": "02", "day": "อังคาร", "time": "09:00 - 11:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "DATA COMMUNICATION AND DATA NETWORKS",
            "code": "CPE326",
            "schedule": [
                { "sec": "01", "day": "พุธ", "time": "15:00 - 17:50" },
                { "sec": "02", "day": "พฤหัส", "time": "15:00 - 17:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "ENGINEERING MANAGEMENT",
            "code": "IEN301",
            "schedule": [
                { "sec": "01", "day": "จันทร์", "time": "15:00 - 17:50" },
                { "sec": "02", "day": "พฤหัส", "time": "16:00 - 18:50" }
            ],
            "type": "ทฤษฎี",
            "price": 7200,
            "credits": 3
        },
        {
            "name": "DATA COMMUNICATION LABORATORY",
            "code": "CPE327",
            "schedule": [
                { "sec": "11", "day": "อังคาร", "time": "09:00 - 11:50" },
                { "sec": "12", "day": "อังคาร", "time": "12:00 - 14:50" },
                { "sec": "13", "day": "พุธ", "time": "09:00 - 11:50" },
                { "sec": "14", "day": "พุธ", "time": "12:00 - 14:50" },
                { "sec": "15", "day": "พฤหัส", "time": "09:00 - 11:50" }
            ],
            "type": "ปฎิบัติ",
            "price": 6400,
            "credits": 1
        },
        {
            "name": "DIGITAL MEDIA LITERACY",
            "code": "RSU160",
            "schedule": [
                { "sec": "01", "day": "จันทร์", "time": "08:30 - 11:50" },
                { "sec": "02", "day": "จันทร์", "time": "08:30 - 11:50" },
                { "sec": "03", "day": "จันทร์", "time": "08:30 - 11:50" },
                { "sec": "04", "day": "จันทร์", "time": "08:30 - 11:50" },
                { "sec": "05", "day": "จันทร์", "time": "08:30 - 11:50" },
                { "sec": "06", "day": "จันทร์", "time": "12:00 - 15:30" }
            ],
            "type": "ทฤษฎี",
            "price":4200,
            "credits": 3
        },
        {
            "name": "INTERNET OF THINGS",
            "code": "CPE241",
            "schedule": [
                { "sec": "01", "day": "จันทร์", "time": "13:00 - 16:50" },
                { "sec": "02", "day": "อังคาร", "time": "09:00 - 12:50" },
                { "sec": "03", "day": "อังคาร", "time": "13:00 - 16:50" },
                { "sec": "04", "day": "ศุกร์", "time": "09:00 - 12:50" },
                { "sec": "05", "day": "ศุกร์", "time": "13:00 - 16:50" }
            ],
            "type": "ทฤษฎี",
            "price":7200,
            "credits": 3
        },
        {
            "name": "OBJECT-ORIENTED PROGRAMMING",
            "code": "CPE263",
            "schedule": [
                { "sec": "01", "day": "จันทร์", "time": "09:00 - 12:50" },
                { "sec": "02", "day": "จันทร์", "time": "13:00 - 16:50" },
                { "sec": "03", "day": "อังคาร", "time": "09:00 - 12:50" },
                { "sec": "04", "day": "พุธ", "time": "09:00 - 12:50" },
                { "sec": "05", "day": "พุธ", "time": "13:00 - 16:50" }
            ],
            "type": "ทฤษฎี",
            "price":7200,
            "credits": 3
        },
        {
            "name": "COMPUTER ENGINEERING MATHEMATICS 1",
            "code": "CPE231",
            "schedule": [
                { "sec": "01", "day": "อังคาร", "time": "13:00 - 15:50" },
                { "sec": "02", "day": "พฤหัส", "time": "12:00 - 14:50" },
                { "sec": "03", "day": "ศุกร์", "time": "13:00 - 16:50" }
            ],
            "type": "ทฤษฎี",
            "price":7200,
            "credits": 3
        }
    ]
};

export const dayColors = {
    'จันทร์': '#B0A695',
    'อังคาร': '#E7D4B5',
    'พุธ': '#F6E6CB',
    'พฤหัส': '#B6C7AA',
    'ศุกร์': '#A0937D'
};

export const subjectColors = [
    '#5AB2FF',
    '#A0DEFF',
    '#CAF4FF',
    '#B3C8CF',
    '#BED7DC',
    '#F1EEDC',
    '#FFF9D0'
];
