// src/main.js
import { createCourseTable, createNewTable, updateSubjectCounter, loadPlansFromLocalStorage } from './functions.js';
import './events.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPlansFromLocalStorage();
    updateSubjectCounter();
    createCourseTable();
    createNewTable();
});
