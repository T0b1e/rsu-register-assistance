// src/events.js
import { planSelection, savePlanButton } from './domElements.js';
import { handlePlanChange, saveCurrentPlan } from './functions.js';

planSelection.addEventListener('change', handlePlanChange);
savePlanButton.addEventListener('click', saveCurrentPlan);
