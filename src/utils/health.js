// ─── Health Calculation Engine ────────────────────────────────────────────────

export function getAgeGroup(age) {
  const a = parseInt(age) || 25;
  if (a < 13) return "kids";
  if (a < 18) return "teens";
  if (a < 65) return "adults";
  return "seniors";
}

/** Mifflin-St Jeor BMR */
export function calcBMR(weight, height, age, gender) {
  const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age);
  if (!w || !h || !a) return null;
  const base = 10 * w + 6.25 * h - 5 * a;
  return Math.round(gender === "Female" ? base - 161 : base + 5);
}

const ACTIVITY_MULTIPLIERS = {
  "Sedentary": 1.2,
  "Lightly Active": 1.375,
  "Moderately Active": 1.55,
  "Very Active": 1.725,
  "Athlete": 1.9,
};

export function calcTDEE(bmr, activityLevel) {
  return bmr ? Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55)) : null;
}

export function calcCaloricGoal(tdee, healthGoals = []) {
  if (!tdee) return null;
  if (healthGoals.includes("Weight Loss")) return tdee - 500;
  if (healthGoals.includes("Muscle Gain")) return tdee + 300;
  return tdee;
}

/** weight(kg) × 35ml */
export function calcWaterGoal(weight) {
  const w = parseFloat(weight);
  return w ? Math.round(w * 35) : 2000;
}

/** 220 - age */
export function calcMaxHR(age) {
  return 220 - (parseInt(age) || 25);
}

export function calcHRZones(maxHR) {
  return {
    fatBurn: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), label: "Fat Burn" },
    cardio:  { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.85), label: "Cardio" },
    peak:    { min: Math.round(maxHR * 0.85), max: maxHR, label: "Peak" },
  };
}

export function getSleepGoal(age) {
  const a = parseInt(age) || 25;
  if (a < 6)  return { min: 10, max: 13, label: "10–13 hrs" };
  if (a < 13) return { min: 9,  max: 12, label: "9–12 hrs" };
  if (a < 18) return { min: 8,  max: 10, label: "8–10 hrs" };
  if (a < 65) return { min: 7,  max: 9,  label: "7–9 hrs" };
  return          { min: 7,  max: 8,  label: "7–8 hrs" };
}

export function getStepGoal(age) {
  const a = parseInt(age) || 25;
  if (a < 13) return 12000;
  if (a < 18) return 10000;
  if (a < 65) return 8000;
  return 6000;
}

export function calcBMI(weight, height, age, gender) {
  if (!weight || !height) return null;
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  const val = parseFloat((w / (h * h)).toFixed(1));
  const ageGroup = getAgeGroup(parseInt(age) || 25);

  let category, colorClass, borderClass, band;
  if (val < 18.5)    { band="under";  category="Underweight";  colorClass="text-blue-400";   borderClass="border-blue-400/40 bg-blue-400/10"; }
  else if (val < 25) { band="normal"; category="Normal Weight"; colorClass="text-lime-400";   borderClass="border-lime-400/40 bg-lime-400/10"; }
  else if (val < 30) { band="over";   category="Overweight";    colorClass="text-yellow-400"; borderClass="border-yellow-400/40 bg-yellow-400/10"; }
  else               { band="obese";  category="Obese";         colorClass="text-red-400";    borderClass="border-red-400/40 bg-red-400/10"; }

  const ADVICE = {
    under: { kids:"Your child may need extra calories from wholesome foods. Consult a pediatrician.", teens:"Focus on nutrient-dense foods: nuts, avocado, whole-milk dairy, and lean proteins.", adults:"Gradually increase caloric intake with whole foods and strength training.", seniors:"Unintentional weight loss needs medical review. Prioritize protein at every meal." },
    normal:{ kids:"Great balance! Keep eating colorful foods and staying active every day.", teens:"You're in a healthy range. Maintain with consistent activity and balanced meals.", adults:"Excellent. Maintain with 150 min/week of moderate exercise and a whole-food diet.", seniors:"Well maintained. Focus on preserving muscle mass with resistance training 2×/week." },
    over:  { kids:"Focus on reducing sugary drinks and processed snacks. Add 60 min of active play daily.", teens:"Small consistent changes work best — cut processed foods, drink water instead of juice.", adults:"A 500 kcal daily deficit through diet + exercise leads to ~0.5kg/week sustainable loss.", seniors:"Low-impact activity like swimming or walking is safest. Avoid crash diets." },
    obese: { kids:"Please consult a pediatrician for a structured, age-appropriate plan.", teens:"Medical guidance is recommended. Focus on gradual lifestyle changes, not quick fixes.", adults:"Consult a doctor to rule out metabolic conditions. Small, consistent steps compound.", seniors:"Medical supervision is strongly advised. Prioritize mobility and muscle preservation." },
  };

  const TIPS = {
    under: { kids:["Add nut butter to oatmeal or toast daily","Eat 5-6 smaller meals throughout the day","Include dairy: milk, cheese, and yogurt regularly"], teens:["Try a protein smoothie after workouts","Add avocado or olive oil to meals for healthy calories","Track meals briefly to understand where gaps are"], adults:["Eat every 3-4 hours with a protein source each time","Strength train 3x/week to build lean muscle mass","Add olive oil, nuts, and seeds to everyday meals"], seniors:["Include protein at every meal: eggs, fish, or legumes","Try resistance band exercises 3x/week","If appetite is low, speak to your doctor"] },
    normal:{ kids:["Keep eating 3 main meals + 2 healthy snacks daily","Stay active: sports, swimming, or playground time","Limit processed food and sugary treats"], teens:["Maintain with 60 min of activity daily","Stay hydrated, especially around sports","Prioritize consistent sleep — it regulates metabolism"], adults:["Maintain with 150 min/week of moderate exercise","Prioritize 7-9 hours of quality sleep","Schedule an annual health check-up"], seniors:["Strength train 2x/week to prevent muscle loss","Take daily calcium and Vitamin D supplements","Walk 20-30 minutes every day"] },
    over:  { kids:["Replace sugary drinks with water or milk","Play outside for at least 1 hour every day","Fill half your plate with vegetables"], teens:["Cutting sugary drinks alone can reduce 500+ cal/day","Start with 30-min walks 5 days a week","Cook more at home where you control ingredients"], adults:["A 500 kcal daily deficit = ~0.5 kg/week loss safely","High-protein diet preserves muscle while losing fat","Poor sleep increases hunger hormones — prioritize 7-9h"], seniors:["Walk 20-30 minutes daily at a comfortable pace","Reduce sodium and ultra-processed food","Drink water before meals to naturally reduce intake"] },
    obese: { kids:["Work with a pediatric dietitian for a family plan","Focus on family meals with whole unprocessed foods","Reduce screen time and increase active play"], teens:["See a doctor for a structured plan","Find a physical activity you genuinely enjoy","Focus on healthy habits, not just weight numbers"], adults:["Medical supervision and blood work is recommended","Fill half your plate with non-starchy vegetables","Start with 7,000 steps/day and build from there"], seniors:["Chair-based exercises are safe and effective","Monitor blood pressure and blood sugar regularly","Protein is especially critical to prevent muscle loss"] },
  };

  const genderNote = gender === "Female" && band === "normal" ? " Monitor iron and calcium intake." : gender === "Male" && band === "over" ? " Waist circumference is an additional risk indicator for men." : "";

  return { val, category, colorClass, borderClass, advice: ADVICE[band][ageGroup] + genderNote, tips: TIPS[band][ageGroup] };
}

/** Generate realistic 7-day step data based on step goal */
export function generateWeeklySteps(stepGoal) {
  const base = stepGoal;
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return days.map((day, i) => ({
    day,
    steps: Math.round(base * (0.6 + Math.random() * 0.8)),
    goal: base,
  }));
}

/** Generate realistic 7-day sleep data based on age */
export function generateWeeklySleep(sleepGoal) {
  const target = (sleepGoal.min + sleepGoal.max) / 2;
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return days.map((day) => ({
    day,
    sleep: parseFloat((target * (0.75 + Math.random() * 0.4)).toFixed(1)),
    target: target,
    deep: parseFloat((target * (0.15 + Math.random() * 0.1)).toFixed(1)),
  }));
}
