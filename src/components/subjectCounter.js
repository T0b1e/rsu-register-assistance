// src/subjectCounter.js
import { data } from '../data.js';

let selectedCourses = {};
let selectedSubjectsCount = 0;

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

    counterElement.innerHTML = 
        `<div class="counter-text">
            <span class="selected-subjects">${selectedSubjectsText}</span>
            <span class="sum-price">${sumPriceText}</span>
            <span class="sum-credits">${sumCreditsText}</span>
        </div>`;
}
