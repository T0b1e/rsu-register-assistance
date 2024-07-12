// src/main.js
import { createCourseTable, createNewTable, updateSubjectCounter, loadPlansFromLocalStorage } from './functions.js';
import { populateCourseDropdown, handleFilterChange } from './components/filter.js';
import './events.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPlansFromLocalStorage();
    updateSubjectCounter();
    populateCourseDropdown();
    createCourseTable();
    handleFilterChange();
    createNewTable();
});
