// ─── Health Calculation Engine ────────────────────────────────────────────────

export function getAgeGroup(age) {
  const a = parseInt(age) || 25;
  if (a < 13) return "kids";
  if (a < 18) return "teens";
  if (a < 65) return "adults";
  return "seniors";
}

/** Seeded PRNG — same user always gets same "random" data */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
function strToSeed(str) {
  return Array.from(str || "user").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

/**
 * BMR:
 *  Adults → Mifflin-St Jeor
 *  Kids   → Schofield equation
 */
export function calcBMR(weight, height, age, gender) {
  const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age);
  if (!w || !h || !a) return null;
  if (a < 18) {
    // Schofield (3–18 yrs)
    if (gender === "Female") {
      if (a < 10) return Math.round(16.97 * w + 1.618 * (h / 100) * 100 + 371.2);
      return Math.round(8.365 * w + 4.65 * (h / 100) * 100 + 200);
    }
    if (a < 10) return Math.round(19.59 * w + 1.303 * (h / 100) * 100 + 414.9);
    return Math.round(16.25 * w + 1.372 * (h / 100) * 100 + 515.5);
  }
  // Mifflin-St Jeor
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
  if (healthGoals.includes("Weight Loss")) return Math.max(tdee - 500, 1200);
  if (healthGoals.includes("Muscle Gain")) return tdee + 300;
  return tdee;
}

/** weight(kg) × 35ml, adjusted for activity */
export function calcWaterGoal(weight, activityLevel) {
  const w = parseFloat(weight);
  if (!w) return 2000;
  const base = w * 35;
  const bonus = { "Very Active": 500, "Athlete": 750 }[activityLevel] || 0;
  return Math.round(base + bonus);
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

/** 220 - age (Tanaka formula is slightly more accurate for adults) */
export function calcMaxHR(age) {
  const a = parseInt(age) || 25;
  if (a >= 18) return Math.round(208 - 0.7 * a); // Tanaka formula
  return 220 - a; // standard for kids/teens
}

/** Resting HR realistic average by age group */
export function getRestingHR(age, seed) {
  const rng = seededRandom(seed + 99);
  const a = parseInt(age) || 25;
  if (a < 13) return Math.round(80 + rng() * 20);   // kids: 80–100
  if (a < 18) return Math.round(65 + rng() * 15);   // teens: 65–80
  if (a < 65) return Math.round(60 + rng() * 20);   // adults: 60–80
  return Math.round(62 + rng() * 16);               // seniors: 62–78
}

/** Karvonen HR zones — more accurate, uses resting HR */
export function calcHRZones(maxHR, restingHR) {
  const hrr = maxHR - restingHR; // Heart Rate Reserve
  const zone = (lo, hi) => ({
    min: Math.round(lo * hrr + restingHR),
    max: Math.round(hi * hrr + restingHR),
  });
  return {
    warmUp:  { ...zone(0.5, 0.6),  label: "Warm Up",   desc: "Light activity, recovery" },
    fatBurn: { ...zone(0.6, 0.7),  label: "Fat Burn",   desc: "Optimal fat oxidation zone" },
    cardio:  { ...zone(0.7, 0.85), label: "Cardio",     desc: "Improves cardiovascular fitness" },
    peak:    { ...zone(0.85, 1.0), label: "Peak",       desc: "Max effort, short bursts only" },
  };
}

export function getSleepGoal(age) {
  const a = parseInt(age) || 25;
  if (a < 6)  return { min: 10, max: 13, label: "10–13 hrs" };
  if (a < 13) return { min: 9,  max: 12, label: "9–12 hrs"  };
  if (a < 18) return { min: 8,  max: 10, label: "8–10 hrs"  };
  if (a < 65) return { min: 7,  max: 9,  label: "7–9 hrs"   };
  return          { min: 7,  max: 8,  label: "7–8 hrs"  };
}

export function getStepGoal(age) {
  const a = parseInt(age) || 25;
  if (a < 13) return 12000;
  if (a < 18) return 10000;
  if (a < 65) return 8000;
  return 6000;
}

/** Daily protein target: g per kg body weight */
export function calcProteinGoal(weight, activityLevel, healthGoals = []) {
  const w = parseFloat(weight);
  if (!w) return null;
  let multiplier = 0.8; // sedentary baseline (WHO)
  if (activityLevel === "Lightly Active")    multiplier = 1.0;
  if (activityLevel === "Moderately Active") multiplier = 1.2;
  if (activityLevel === "Very Active")       multiplier = 1.5;
  if (activityLevel === "Athlete")           multiplier = 1.8;
  if (healthGoals.includes("Muscle Gain"))   multiplier = Math.max(multiplier, 1.6);
  return Math.round(w * multiplier);
}

/** Daily fiber target: 14g per 1000 kcal (Institute of Medicine) */
export function calcFiberGoal(tdee) {
  return tdee ? Math.round((tdee / 1000) * 14) : 25;
}

/** Daily sodium limit */
export function getSodiumLimit(age) {
  const a = parseInt(age) || 25;
  if (a < 9)  return 1500;
  if (a < 14) return 1900;
  if (a < 19) return 2200;
  return 2300; // WHO / AHA recommendation
}

/** Waist-to-height ratio risk assessment */
export function assessWaistHeight(waist, height) {
  if (!waist || !height) return null;
  const ratio = parseFloat(waist) / parseFloat(height);
  const val = parseFloat(ratio.toFixed(3));
  if (val < 0.4)  return { val, label: "Slim",           color: "text-blue-400",   risk: "Low" };
  if (val < 0.5)  return { val, label: "Healthy",        color: "text-lime-400",   risk: "Low" };
  if (val < 0.6)  return { val, label: "Overweight",     color: "text-yellow-400", risk: "Moderate" };
  return              { val, label: "High Risk",      color: "text-red-400",    risk: "High" };
}

/** Blood pressure category */
export function assessBloodPressure(systolic, diastolic) {
  const s = parseInt(systolic), d = parseInt(diastolic);
  if (!s || !d) return null;
  if (s < 120 && d < 80)  return { label: "Normal",           color: "text-lime-400",   detail: "Keep maintaining a heart-healthy lifestyle." };
  if (s < 130 && d < 80)  return { label: "Elevated",         color: "text-yellow-400", detail: "Reduce sodium, exercise more, monitor regularly." };
  if (s < 140 || d < 90)  return { label: "High (Stage 1)",   color: "text-orange-400", detail: "Consult a doctor. Lifestyle changes are essential." };
  if (s >= 140 || d >= 90) return { label: "High (Stage 2)",  color: "text-red-400",    detail: "See a doctor promptly. Medication may be needed." };
  return null;
}

/** SpO2 assessment */
export function assessSpO2(spo2) {
  const v = parseInt(spo2);
  if (!v) return null;
  if (v >= 95) return { label: "Normal",   color: "text-lime-400",   detail: "Healthy oxygen saturation level." };
  if (v >= 91) return { label: "Low",      color: "text-yellow-400", detail: "Mildly low. Rest and monitor closely." };
  return           { label: "Critical", color: "text-red-400",    detail: "Seek medical attention immediately." };
}

/**
 * MET-based calorie burn
 * Calories = MET × weight(kg) × duration(hours)
 */
const MET_VALUES = {
  "Morning Run":        9.8,
  "Strength Training":  5.0,
  "Yoga":               2.5,
  "Cycling":            7.5,
  "Swimming":           8.0,
  "HIIT":              12.0,
  "Brisk Walk":         3.5,
  "Jump Rope":         11.0,
  "Pilates":            3.0,
  "Dancing":            5.5,
};

export function calcWorkoutCalories(workoutName, durationMinutes, weightKg) {
  const met = MET_VALUES[workoutName] || 5.0;
  const w = parseFloat(weightKg) || 70;
  return Math.round(met * w * (durationMinutes / 60));
}

export function getAllWorkouts(weightKg) {
  return [
    { name:"Morning Run",       icon:"🏃", duration:30, type:"Cardio" },
    { name:"Strength Training", icon:"💪", duration:45, type:"Strength" },
    { name:"Yoga",              icon:"🧘", duration:60, type:"Flexibility" },
    { name:"Cycling",           icon:"🚴", duration:45, type:"Cardio" },
    { name:"Swimming",          icon:"🏊", duration:30, type:"Cardio" },
    { name:"HIIT",              icon:"⚡", duration:25, type:"Cardio" },
    { name:"Brisk Walk",        icon:"🚶", duration:30, type:"Cardio" },
    { name:"Jump Rope",         icon:"🪢", duration:20, type:"Cardio" },
    { name:"Pilates",           icon:"🤸", duration:45, type:"Flexibility" },
    { name:"Dancing",           icon:"💃", duration:30, type:"Cardio" },
  ].map(w => ({ ...w, calories: calcWorkoutCalories(w.name, w.duration, weightKg) }));
}

/** Health Score: 0–100 composite from available metrics */
export function calcHealthScore({ bmi, stepsToday, stepGoal, sleepHrs, sleepGoal, waterPct, bpSystolic, spo2, checkInStreak }) {
  let score = 0, factors = 0;

  if (bmi) {
    factors++;
    const b = parseFloat(bmi);
    if (b >= 18.5 && b < 25)      score += 100;
    else if (b >= 17 && b < 27)   score += 70;
    else if (b >= 15 && b < 30)   score += 40;
    else                           score += 10;
  }
  if (stepsToday && stepGoal) {
    factors++;
    score += Math.min((stepsToday / stepGoal) * 100, 100);
  }
  if (sleepHrs && sleepGoal) {
    factors++;
    const ideal = (sleepGoal.min + sleepGoal.max) / 2;
    const diff = Math.abs(sleepHrs - ideal);
    score += Math.max(0, 100 - diff * 20);
  }
  if (waterPct !== undefined) {
    factors++;
    score += Math.min(waterPct * 100, 100);
  }
  if (bpSystolic) {
    factors++;
    const s = parseInt(bpSystolic);
    if (s < 120)       score += 100;
    else if (s < 130)  score += 75;
    else if (s < 140)  score += 45;
    else               score += 15;
  }
  if (spo2) {
    factors++;
    const v = parseInt(spo2);
    score += v >= 95 ? 100 : v >= 91 ? 60 : 10;
  }
  if (checkInStreak) {
    factors++;
    score += Math.min(checkInStreak * 10, 100);
  }

  return factors > 0 ? Math.round(score / factors) : 0;
}

/** Seeded weekly step data — consistent per user */
export function generateWeeklySteps(stepGoal, userSeed = 42) {
  const rng = seededRandom(strToSeed(String(userSeed)));
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({
    day,
    steps: Math.round(stepGoal * (0.55 + rng() * 0.85)),
    goal: stepGoal,
  }));
}

/** Seeded weekly sleep data — consistent per user, deep sleep = 20-25% of total */
export function generateWeeklySleep(sleepGoal, userSeed = 42) {
  const rng = seededRandom(strToSeed(String(userSeed)) + 1);
  const target = (sleepGoal.min + sleepGoal.max) / 2;
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => {
    const sleep = parseFloat((target * (0.78 + rng() * 0.38)).toFixed(1));
    return {
      day,
      sleep,
      deep: parseFloat((sleep * (0.20 + rng() * 0.05)).toFixed(1)), // 20–25% deep
      target,
    };
  });
}
