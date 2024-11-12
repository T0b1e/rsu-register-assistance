// src/main.js
import { createCourseTable, createNewTable, updateSubjectCounter, loadPlansFromLocalStorage } from './functions.js';
import { populateCourseDropdown, handleFilterChange } from './components/filter.js';
// import { startClock } from './functions.js';
import './events.js';

document.addEventListener('DOMContentLoaded', () => {
    // startClock();
    loadPlansFromLocalStorage();
    updateSubjectCounter();
    populateCourseDropdown();
    createCourseTable();
    handleFilterChange();
    createNewTable();
});

