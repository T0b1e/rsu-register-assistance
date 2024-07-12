// src/components/filter.js
import { data } from '../data.js';
import { createCourseTable } from './courseTable.js';

const courseSelect = document.getElementById('courseSelect');
const daySelect = document.getElementById('daySelect');
const timeRangeSelect = document.getElementById('timeRangeSelect');

export function populateCourseDropdown() {
    const checkboxes = courseSelect.querySelector('.checkboxes');
    data.courses.forEach(course => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = course.code;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${course.code} - ${course.name}`));
        checkboxes.appendChild(label);
    });
    // console.log("Course dropdown populated");

    // Attach event listeners to dynamically created checkboxes
    document.querySelectorAll('#courseSelect .checkboxes input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
        // console.log(`${checkbox.value} checkbox change listener added`);
    });
}

function getSelectedValues(container) {
    const selectedValues = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    // console.log(`Selected values from ${container.id}:`, selectedValues);
    return selectedValues;
}

export function handleFilterChange() {
    // console.log("Filter change triggered");
    const selectedCourses = getSelectedValues(courseSelect);
    const selectedDays = getSelectedValues(daySelect);
    const selectedTimeRanges = getSelectedValues(timeRangeSelect);

    let filteredCourses = data.courses;
    // console.log("Initial courses:", filteredCourses);

    if (selectedCourses.length > 0) {
        filteredCourses = filteredCourses.filter(course => selectedCourses.includes(course.code));
        // console.log("Filtered by courses:", filteredCourses);
    }

    if (selectedDays.length > 0) {
        filteredCourses = filteredCourses.map(course => {
            return {
                ...course,
                schedule: course.schedule.filter(schedule => selectedDays.includes(schedule.day))
            };
        }).filter(course => course.schedule.length > 0);
        // console.log("Filtered by days:", filteredCourses);
    }

    if (selectedTimeRanges.length > 0) {
        filteredCourses = filteredCourses.map(course => {
            return {
                ...course,
                schedule: course.schedule.filter(schedule => {
                    const timeParts = schedule.time.split(' - ');
                    const startTime = timeParts[0];
                    return selectedTimeRanges.some(range => {
                        if (range === 'เช้า') return startTime < '11:50';
                        if (range === 'บ่าย') return startTime >= '12:00' && startTime <= '14:50';
                        if (range === 'เย็น') return startTime > '14:50';
                    });
                })
            };
        }).filter(course => course.schedule.length > 0);
        // console.log("Filtered by time ranges:", filteredCourses);
    }

    createCourseTable(filteredCourses);
}

function toggleDropdown(event) {
    const selectBox = event.currentTarget.parentElement;
    selectBox.classList.toggle('open');
    // console.log(`${selectBox.id} dropdown toggled`);
}

courseSelect.querySelector('select').addEventListener('click', toggleDropdown);
daySelect.querySelector('select').addEventListener('click', toggleDropdown);
timeRangeSelect.querySelector('select').addEventListener('click', toggleDropdown);

document.querySelectorAll('.custom-select input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleFilterChange);
    // console.log(`${checkbox.value} checkbox change listener added`);
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (!event.target.matches('.custom-select, .custom-select *')) {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.classList.remove('open');
        });
    }
});

// Ensure event listeners for all dynamically created checkboxes
document.addEventListener('DOMContentLoaded', () => {
    populateCourseDropdown();
});
