import { useState } from "react";

// ─── Static Data ─────────────────────────────────────────────────────────────

const STEPS = [3200, 5100, 7800, 6200, 9893, 4300, 8100, 7200, 5600, 6800, 9200, 7500];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MEALS = [
  { name:"Avocado Toast", cal:320, protein:9, img:"🥑", tags:["Vegan","Quick","Breakfast"], keywords:"avocado toast vegan quick breakfast plant" },
  { name:"Grilled Salmon", cal:480, protein:42, img:"🐟", tags:["High Protein","Omega-3","Dinner"], keywords:"salmon fish seafood protein omega dinner keto" },
  { name:"Berry Smoothie Bowl", cal:280, protein:7, img:"🫐", tags:["Vegan","Antioxidants","Breakfast"], keywords:"berry smoothie vegan breakfast antioxidant fruit" },
  { name:"Chicken Stir Fry", cal:420, protein:38, img:"🍗", tags:["High Protein","Low Carb","Dinner"], keywords:"chicken stir fry protein low carb keto dinner meat" },
  { name:"Quinoa Power Bowl", cal:350, protein:14, img:"🥗", tags:["Vegan","Fiber","Lunch"], keywords:"quinoa bowl vegan lunch fiber plant protein" },
  { name:"Egg White Omelette", cal:200, protein:28, img:"🍳", tags:["Low Cal","High Protein","Breakfast"], keywords:"egg omelette breakfast protein low calorie" },
  { name:"Sweet Potato Bowl", cal:390, protein:8, img:"🍠", tags:["Vegan","Complex Carbs","Lunch"], keywords:"sweet potato bowl vegan lunch complex carbs" },
  { name:"Tuna Poke Bowl", cal:440, protein:36, img:"🐠", tags:["High Protein","Omega-3","Lunch"], keywords:"tuna poke bowl fish seafood protein omega lunch" },
  { name:"Overnight Oats", cal:300, protein:11, img:"🌾", tags:["Fiber","Breakfast","Vegan"], keywords:"oats overnight breakfast fiber vegan prep" },
  { name:"Greek Yogurt Parfait", cal:250, protein:18, img:"🫙", tags:["Probiotic","Calcium","Snack"], keywords:"yogurt parfait dairy probiotic calcium snack protein" },
  { name:"Lentil Soup", cal:310, protein:18, img:"🍲", tags:["Vegan","High Fiber","Dinner"], keywords:"lentil soup vegan fiber dinner plant protein" },
  { name:"Turkey Wrap", cal:380, protein:32, img:"🌯", tags:["High Protein","Lunch"], keywords:"turkey wrap protein lunch sandwich" },
  { name:"Acai Bowl", cal:340, protein:6, img:"🍇", tags:["Vegan","Antioxidants","Breakfast"], keywords:"acai bowl vegan breakfast antioxidant fruit" },
  { name:"Baked Cod & Veggies", cal:330, protein:35, img:"🐡", tags:["Pescatarian","Low Cal","Dinner"], keywords:"cod fish baked vegetables pescatarian low calorie dinner" },
  { name:"Peanut Butter Banana Toast", cal:360, protein:12, img:"🥜", tags:["Quick","Breakfast","Energy"], keywords:"peanut butter banana toast breakfast quick energy" },
  { name:"Tofu Veggie Stir Fry", cal:290, protein:16, img:"🫘", tags:["Vegan","High Protein","Dinner"], keywords:"tofu vegetable stir fry vegan protein dinner plant" },
];

const EDUCATION = {
  kids: {
    label:"Kids Zone", color:"text-yellow-400", border:"border-yellow-400/30", bg:"bg-yellow-400/10",
    fact:"🌟 Did you know? Your body has 206 bones and they keep growing until you're about 25!",
    articles:[
      { title:"Eat the Rainbow 🌈", icon:"🥦", readTime:"3 min", body:"Eating colorful fruits and vegetables gives your body vitamins and minerals it needs to grow strong and healthy. Try to have at least 3 different colors on your plate every day! Red tomatoes, orange carrots, green broccoli, and purple grapes all help different parts of your body." },
      { title:"Why Exercise is Your Superpower 💪", icon:"🤸", readTime:"3 min", body:"Kids need 60 minutes of active play every day. Running, jumping, swimming, and dancing all count! Exercise makes your bones stronger, your heart healthier, and your brain smarter. It also helps you sleep better at night and feel happier during the day." },
      { title:"Sleep = Grow Taller & Smarter 😴", icon:"😴", readTime:"2 min", body:"Your brain and body do their most important growing while you sleep. Kids aged 6-12 need 9-11 hours of sleep each night. Put screens away 30 minutes before bed, and your body will thank you by helping you grow taller, think faster, and remember things better!" },
      { title:"Water is Your Body's Best Friend 💧", icon:"💧", readTime:"2 min", body:"Your body is 60% water! Drinking 6-8 glasses daily helps you think clearly, move faster, and stay energized. Feeling tired or getting headaches? You might just be thirsty. Carry a water bottle everywhere and sip throughout the day." },
    ],
  },
  teens: {
    label:"Teen Health", color:"text-blue-400", border:"border-blue-400/30", bg:"bg-blue-400/10",
    fact:"🧠 Teen brains are still developing until age 25 — sleep and good nutrition are critical right now!",
    articles:[
      { title:"Mental Health & Social Media 📱", icon:"📱", readTime:"5 min", body:"Social media can affect your mood and self-esteem. Studies show teens who limit social media to 30 minutes/day report significantly lower anxiety and depression. Try phone-free mornings, turn off notifications after 9pm, and remember: what people post is their highlight reel, not their whole life. Real connections matter more." },
      { title:"Building Muscle & Strong Bones 💪", icon:"💪", readTime:"4 min", body:"Your teenage years are the most important time for building bone density — up to 90% of peak bone mass is built by age 18. Strength training 2-3 times a week, getting enough calcium (1300mg/day from dairy, leafy greens, tofu), and vitamin D from sunlight all contribute to bones that will stay strong for life." },
      { title:"Nutrition for Your Growing Body 🥦", icon:"🥦", readTime:"6 min", body:"Teens need more nutrients than adults because your body is growing rapidly. Iron is crucial for girls after puberty — get it from lean meats, spinach, and beans. All teens need protein (0.85g per kg bodyweight) for muscle development. Avoid crash diets; your brain needs glucose to function, and severe restriction can harm long-term metabolism." },
      { title:"Sleep & Your Academic Performance 📚", icon:"📚", readTime:"5 min", body:"Teens biologically fall asleep and wake up later than adults — this is real science, not laziness. You need 8-10 hours of sleep. Sleep consolidates memory and learning; pulling all-nighters before exams actually reduces retention by up to 40%. Blue light from screens suppresses melatonin. Try stopping screen use 1 hour before bed." },
    ],
  },
  adults: {
    label:"Adult Wellness", color:"text-lime-400", border:"border-lime-400/30", bg:"bg-lime-400/10",
    fact:"❤️ The heart beats about 100,000 times per day. Regular cardio makes each beat more efficient.",
    articles:[
      { title:"Cardiovascular Health Over 30 🫀", icon:"🫀", readTime:"8 min", body:"After 30, cardiovascular risk gradually increases. The good news: 150 minutes per week of moderate-intensity exercise (brisk walking counts) reduces heart disease risk by up to 35%. Limit sodium to under 2300mg/day, maintain a healthy weight, and monitor your blood pressure regularly. LDL cholesterol should stay under 100 mg/dL for optimal heart health." },
      { title:"Stress Management That Actually Works 🧘", icon:"🧘", readTime:"7 min", body:"Chronic stress elevates cortisol, which promotes fat storage, weakens immunity, and disrupts sleep. Evidence-backed techniques include diaphragmatic breathing (5 minutes/day reduces cortisol by 15%), progressive muscle relaxation, and nature walks. Exercise is the most effective stress reducer — it converts cortisol to positive neurochemicals within 20 minutes." },
      { title:"Understanding Intermittent Fasting ⏱️", icon:"⏱️", readTime:"6 min", body:"Intermittent fasting (IF) involves cycling between eating and fasting windows. The popular 16:8 method (eat in an 8-hour window) has shown benefits for insulin sensitivity, inflammation markers, and modest weight loss. IF is not appropriate for everyone — pregnant women, people with certain medical conditions, and those with a history of disordered eating should avoid it. The benefits come from the caloric restriction, not magic." },
      { title:"Building a Sleep Routine for Better Health 😴", icon:"😴", readTime:"5 min", body:"Adults need 7-9 hours. Poor sleep is linked to obesity, type 2 diabetes, cardiovascular disease, and depression. Key sleep hygiene tips: keep your bedroom cool (18-19°C), dark, and quiet. Maintain a consistent wake time — even on weekends. Avoid caffeine after 2pm. Regular sleep times train your circadian rhythm to improve sleep quality dramatically over 2-3 weeks." },
    ],
  },
  seniors: {
    label:"Senior Vitality", color:"text-orange-400", border:"border-orange-400/30", bg:"bg-orange-400/10",
    fact:"🦴 After 65, resistance training twice a week can reverse up to 10 years of muscle loss.",
    articles:[
      { title:"Joint Health & Low-Impact Exercise 🦴", icon:"🦴", readTime:"6 min", body:"Osteoarthritis affects over 30% of people over 65. Low-impact activities like swimming, cycling, and water aerobics maintain cardiovascular fitness without joint stress. Tai Chi has been clinically proven to reduce fall risk by 47% and improve balance significantly. Aim for 150 minutes/week of movement, split into manageable sessions. Listen to your body and rest on painful days." },
      { title:"Heart Health After 65 ❤️", icon:"❤️", readTime:"7 min", body:"Cardiovascular disease is the leading cause of death in seniors, but it is largely preventable. After 65, blood pressure naturally rises due to arterial stiffness. Target below 130/80 mmHg. The DASH diet (rich in fruits, vegetables, and low-fat dairy) reduces blood pressure as effectively as medication in some studies. Limit alcohol, quit smoking, and maintain a healthy weight." },
      { title:"Keeping Your Brain Sharp 🧠", icon:"🧠", readTime:"5 min", body:"Cognitive decline is not inevitable. Regular aerobic exercise increases BDNF (brain-derived neurotrophic factor), protecting neurons. Learning new skills — a language, instrument, or craft — builds new neural pathways. Social engagement is a powerful protector against dementia. Aim for at least 3 social interactions per week. Mediterranean diet adherence is associated with 35% lower Alzheimer's risk." },
      { title:"Nutrition for Healthy Aging 🥗", icon:"🥗", readTime:"6 min", body:"Appetite often decreases with age, making nutrient density critical. Protein needs actually increase after 65 (1.0-1.2g per kg bodyweight) to prevent sarcopenia (muscle loss). Calcium needs: 1200mg/day. Vitamin D: 800-1000 IU/day. Vitamin B12 absorption decreases with age — fortified foods or supplements may be needed. Reduce sodium, increase potassium-rich foods (bananas, sweet potatoes, beans) for blood pressure." },
    ],
  },
};

const BODY_PARTS = {
  head:    { label:"Head & Brain", icon:"🧠", info:{ kids:"Your brain is growing fast! Reading, play, and good sleep make it develop strong and healthy.", teens:"Protect your mental health. Reduce screen time before bed — blue light disrupts sleep and brain recovery.", adults:"Brain health: stay hydrated, get 7-9h of sleep, and challenge your mind with new skills regularly.", seniors:"Cognitive exercises like puzzles, reading, and learning new skills reduce dementia risk significantly." } },
  heart:   { label:"Heart", icon:"❤️", info:{ kids:"Your heart beats about 100 times per minute. Running and active play keep it strong and healthy!", teens:"Normal resting heart rate: 60-100 bpm. Aim for 60 min of cardio daily for long-term heart health.", adults:"Target resting HR under 80. 150 min/week of moderate cardio + a low-sodium diet protects your heart.", seniors:"Monitor blood pressure weekly. Low-impact cardio like walking 30 min/day is ideal for heart health." } },
  lungs:   { label:"Lungs", icon:"🫁", info:{ kids:"Your lungs are still growing! Avoid smoke, breathe fresh air, and try deep breathing exercises.", teens:"Avoid smoking and vaping — lungs are still developing until your mid-20s and damage now is permanent.", adults:"Optimal oxygen level: 95-100%. Regular cardio improves lung capacity. Never smoke. Avoid air pollution.", seniors:"Lung capacity decreases naturally with age. Deep breathing exercises and walking maintain respiratory health." } },
  stomach: { label:"Stomach & Gut", icon:"🫃", info:{ kids:"Your tummy breaks down food for energy! Eat fiber-rich veggies, drink water, and avoid too much sugar.", teens:"Gut health affects mood and energy. Eat diverse whole foods and probiotics (yogurt, kefir) regularly.", adults:"Gut microbiome health is linked to immunity, mood, and weight. Eat 30+ different plant foods per week.", seniors:"Digestive enzymes decrease with age. Eat smaller, frequent meals. Increase fiber and stay well hydrated." } },
  spine:   { label:"Spine & Posture", icon:"🦴", info:{ kids:"Sit up straight and carry your backpack properly — your spine is still forming important curves!", teens:"Check your posture when using your phone. Forward head posture puts 27kg of stress on your spine.", adults:"Core strength protects the spine. Avoid prolonged sitting — stand and stretch every 60-90 minutes.", seniors:"Osteoporosis affects 1 in 3 women over 65. Weight-bearing exercise and calcium are essential protection." } },
  legs:    { label:"Legs & Knees", icon:"🦵", info:{ kids:"Strong legs help you run and jump! Playing outside every day builds healthy bones and muscles.", teens:"Warm up before sport and cool down after — most teen injuries are from skipping these steps.", adults:"Leg day matters: squats and lunges improve metabolism, balance, and protect knees long-term.", seniors:"Joint health is key. Swimming and cycling preserve cartilage. Ensure adequate Vitamin D for bone strength." } },
};

const WELLNESS_TIPS = {
  kids:[
    "Drink a glass of water first thing when you wake up! 💧",
    "Try to play outside for 60 minutes today — your bones will grow stronger! 🏃",
    "Eat 3 different colored vegetables at dinner tonight 🥦🥕🌽",
    "Put your phone or tablet away 30 minutes before bedtime — your brain needs to rest! 😴",
    "Challenge yourself: do 10 jumping jacks right now! 💪",
  ],
  teens:[
    "Put the phone down 1 hour before sleep — your brain will thank you in the morning. 📱",
    "Drink 2 liters of water today. More if you trained or it's warm.",
    "Do 20 push-ups right now. Building the habit is more important than the reps. 💪",
    "Eat a protein-rich breakfast today — it improves focus and concentration all morning. 🍳",
    "Check in on a friend today. Social connection is a key part of mental health. 🤝",
  ],
  adults:[
    "Take a 5-minute walk after every 90 minutes of sitting. Movement resets your focus. 🚶",
    "Drink 8 glasses of water today — most people are chronically mildly dehydrated.",
    "Sleep 7-9 hours tonight. Recovery is when your body actually improves. 😴",
    "Eat fiber-rich foods today: beans, oats, or vegetables to improve gut health. 🥗",
    "Take 5 minutes to breathe deeply — proven to lower cortisol and reduce stress. 🧘",
  ],
  seniors:[
    "Start your morning with 10 minutes of gentle stretching for joint flexibility. 🤸",
    "Stay socially connected today — even a short call with a friend reduces cognitive decline.",
    "Focus on calcium-rich foods at lunch: yogurt, cheese, or leafy greens. 🥛",
    "Practice standing on one foot for 10 seconds — a simple balance exercise. ⚖️",
    "Take a 20-30 minute walk at a comfortable pace. Your heart and brain will benefit greatly. 🌳",
  ],
};

const PODCASTS = [
  { title:"Huberman Lab", ep:"Sleep & Recovery Science", dur:"1h 23m", icon:"🔬" },
  { title:"ZOE Science & Nutrition", ep:"Foods that heal your gut", dur:"45m", icon:"🥗" },
  { title:"Feel Better, Live More", ep:"Move more, stress less", dur:"52m", icon:"🏃" },
  { title:"Diary of a CEO", ep:"The science of longevity", dur:"1h 10m", icon:"🧬" },
  { title:"10% Happier", ep:"Meditation for skeptics", dur:"38m", icon:"🧘" },
];

const RECOMMENDED = {
  kids:    [{ title:"Kids Health Podcast", ep:"Why sleep helps you grow", icon:"😴" }, { title:"Tiny Chefs", ep:"Healthy lunchbox ideas", icon:"🥪" }, { title:"Move It!", ep:"Fun exercises for kids", icon:"🤸" }],
  teens:   [{ title:"Teen Mental Health Talk", ep:"Handling exam stress", icon:"📚" }, { title:"Body Positive", ep:"Self image & fitness", icon:"💙" }, { title:"Fuel Your Future", ep:"Sports nutrition basics", icon:"🏅" }],
  adults:  [{ title:"Found My Fitness", ep:"Optimizing your metabolism", icon:"🔥" }, { title:"The Model Health Show", ep:"Eat smarter, not less", icon:"🍽️" }, { title:"Mind Pump", ep:"Strength training myths debunked", icon:"💪" }],
  seniors: [{ title:"Aging Well", ep:"Strength at any age", icon:"🦾" }, { title:"Brain Science Podcast", ep:"Preventing cognitive decline", icon:"🧠" }, { title:"Silver Sneakers", ep:"Low-impact fitness routines", icon:"🚶" }],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getAgeGroup(age) {
  if (age < 13) return "kids";
  if (age < 18) return "teens";
  if (age < 65) return "adults";
  return "seniors";
}

function calcBMI(weight, height, age, gender) {
  if (!weight || !height) return null;
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  const val = parseFloat((w / (h * h)).toFixed(1));
  const ageGroup = getAgeGroup(parseInt(age) || 25);

  let category, colorClass, borderClass, band;
  if (val < 18.5)      { band = "under";  category = "Underweight";   colorClass = "text-blue-400";   borderClass = "border-blue-400/40 bg-blue-400/10"; }
  else if (val < 25)   { band = "normal"; category = "Normal Weight";  colorClass = "text-lime-400";   borderClass = "border-lime-400/40 bg-lime-400/10"; }
  else if (val < 30)   { band = "over";   category = "Overweight";     colorClass = "text-yellow-400"; borderClass = "border-yellow-400/40 bg-yellow-400/10"; }
  else                 { band = "obese";  category = "Obese";          colorClass = "text-red-400";    borderClass = "border-red-400/40 bg-red-400/10"; }

  const ADVICE = {
    under: { kids:"Your child may need extra calories from wholesome foods. A pediatrician can create a safe plan.", teens:"Focus on nutrient-dense foods: nuts, avocado, whole-milk dairy, and lean proteins. See a doctor if this persists.", adults:"Gradually increase caloric intake with whole foods and strength training. Consider a dietician consultation.", seniors:"Unintentional weight loss in seniors needs medical review. Prioritize protein at every single meal." },
    normal: { kids:"Great balance! Keep eating colorful foods and staying active every day.", teens:"You're in a healthy range. Maintain it with consistent activity and balanced, varied meals.", adults:"Excellent. Maintain with 150 min/week of moderate exercise and a balanced whole-food diet.", seniors:"Well maintained. Focus on preserving muscle mass with resistance training at least twice a week." },
    over: { kids:"Focus on reducing sugary drinks and processed snacks. Add 60 min of active play daily.", teens:"Small consistent changes work best — cut processed foods, drink water instead of juice, add a sport you enjoy.", adults:"A 500 kcal daily deficit through diet + exercise leads to roughly 0.5 kg/week of sustainable weight loss.", seniors:"Low-impact activity like swimming or daily walking is safest. Avoid crash diets — they cause muscle loss." },
    obese: { kids:"Please consult a pediatrician for a structured, age-appropriate plan. Avoid restrictive dieting.", teens:"Medical guidance is recommended. Focus on gradual lifestyle changes, not quick fixes or elimination diets.", adults:"Consult a doctor to rule out metabolic conditions. Small, consistent steps compound into significant results.", seniors:"Medical supervision is strongly advised. Prioritize mobility and muscle preservation, not just the scale." },
  };

  const TIPS = {
    under: { kids:["Add nut butter to oatmeal or toast daily","Eat 5-6 smaller meals throughout the day","Include dairy: milk, cheese, and yogurt regularly"], teens:["Try a protein smoothie after workouts","Add avocado or olive oil to meals for healthy calories","Track meals briefly to understand where gaps are"], adults:["Eat every 3-4 hours with a protein source each time","Strength train 3x/week to build lean muscle mass","Add olive oil, nuts, and seeds to your everyday meals"], seniors:["Include protein at every meal: eggs, fish, or legumes","Try resistance band exercises 3x/week","If appetite is low, speak to your doctor — it may need medical attention"] },
    normal: { kids:["Keep eating 3 main meals + 2 healthy snacks daily","Stay active: sports, swimming, or playground time","Limit processed food and sugary treats to occasional treats"], teens:["Maintain with 60 min of activity daily","Stay hydrated, especially around sports and exercise","Prioritize consistent sleep — it regulates your metabolism"], adults:["Maintain with 150 min/week of moderate exercise","Prioritize 7-9 hours of quality sleep nightly","Schedule an annual health check-up"], seniors:["Strength train 2x/week to prevent age-related muscle loss","Take daily calcium and Vitamin D supplements","Walk 20-30 minutes every day for cardiovascular and bone health"] },
    over: { kids:["Replace sugary drinks with water or milk","Play outside for at least 1 hour every day","Fill half your plate with vegetables at every meal"], teens:["Cutting sugary drinks alone can reduce 500+ calories/day","Start with 30-minute walks 5 days a week — it's enough","Cook more at home where you control ingredients"], adults:["A 500 kcal daily deficit equals ~0.5 kg/week loss safely","High-protein diet preserves muscle while losing fat","Poor sleep increases hunger hormones — prioritize 7-9 hours"], seniors:["Walk 20-30 minutes daily at a comfortable, sustainable pace","Reduce sodium and ultra-processed food intake","Drinking water before meals naturally reduces caloric intake"] },
    obese: { kids:["Work with a pediatric dietitian for a family-friendly plan","Focus on family meals with whole, unprocessed foods","Reduce screen time and increase active outdoor play"], teens:["See a doctor for a structured, medically sound plan","Find a physical activity you genuinely enjoy — consistency matters","Focus on healthy habits and energy levels, not weight numbers"], adults:["Medical supervision and blood work is recommended","Fill half your plate with non-starchy vegetables at every meal","Start with a step goal of 7,000/day and build from there"], seniors:["Chair-based exercises are safe, effective, and accessible","Monitor blood pressure and blood sugar with your doctor regularly","Protein is especially critical to prevent dangerous muscle loss"] },
  };

  const genderNote = gender === "Female" && band === "normal" ? " Women should also monitor iron and calcium intake." : gender === "Male" && band === "over" ? " Men tend to carry excess weight abdominally — waist circumference is an additional risk indicator." : "";

  return { val, category, colorClass, borderClass, advice: ADVICE[band][ageGroup] + genderNote, tips: TIPS[band][ageGroup] };
}

const TABS = [
  { id:"dashboard", icon:"📊", label:"Dashboard" },
  { id:"body",      icon:"🧬", label:"Body" },
  { id:"meals",     icon:"🥗", label:"Meals" },
  { id:"education", icon:"📚", label:"Education" },
  { id:"social",    icon:"👥", label:"Social" },
  { id:"podcasts",  icon:"🎙️", label:"Podcasts" },
  { id:"profile",   icon:"👤", label:"Profile" },
];

const TAB_TITLES = {
  dashboard: "Dashboard",
  body:      "Body Analysis 🧬",
  meals:     "Meal Planner 🥗",
  education: "Health Education 📚",
  social:    "Connect 👥",
  podcasts:  "Podcasts 🎙️",
  profile:   "My Profile 👤",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard({ user, onLogout, onUpdateUser }) {
  const age      = parseInt(user?.age) || 25;
  const ageGroup = getAgeGroup(age);
  const maxStep  = Math.max(...STEPS);

  const [tab, setTab]                 = useState("dashboard");
  const [selected, setSelected]       = useState(null);
  const [bmiForm, setBmiForm]         = useState({ weight: user?.weight || "", height: user?.height || "" });
  const [bmiResult, setBmiResult]     = useState(() => user?.weight && user?.height ? calcBMI(user.weight, user.height, age, user.gender) : null);
  const [foodSearch, setFoodSearch]   = useState("");
  const [expandedArt, setExpandedArt] = useState(null);
  const [friendInput, setFriendInput] = useState("");
  const [friends, setFriends]         = useState([
    { name:"Alex", relation:"Brother", active:true },
    { name:"Sarah", relation:"Friend", active:true },
    { name:"Dr. Johnson", relation:"Doctor", active:false },
    { name:"Mom", relation:"Family", active:true },
  ]);
  const [shareMsg, setShareMsg]       = useState("");
  const [tipIdx, setTipIdx]           = useState(0);
  const [profileForm, setProfileForm] = useState({
    name:          user?.name          || "",
    age:           user?.age           || "",
    weight:        user?.weight        || "",
    height:        user?.height        || "",
    gender:        user?.gender        || "",
    activityLevel: user?.activityLevel || "Moderately Active",
    foodPrefs:     user?.foodPrefs     || [],
    healthGoals:   user?.healthGoals   || [],
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const filteredMeals = foodSearch.trim()
    ? MEALS.filter(m => m.keywords.includes(foodSearch.toLowerCase().trim()))
    : MEALS;

  const edu = EDUCATION[ageGroup];
  const tips = WELLNESS_TIPS[ageGroup];

  const handleCalcBmi = () => {
    const result = calcBMI(bmiForm.weight, bmiForm.height, age, user?.gender);
    setBmiResult(result);
  };

  const addFriend = () => {
    if (!friendInput.trim()) return;
    setFriends([...friends, { name: friendInput.trim(), relation: "Friend", active: false }]);
    setFriendInput("");
  };

  const saveProfile = () => {
    onUpdateUser(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const togglePref = (list, item, setter) => {
    setter(prev => ({
      ...prev,
      [list]: prev[list].includes(item) ? prev[list].filter(x => x !== item) : [...prev[list], item]
    }));
  };

  const shareProgress = () => {
    setShareMsg("Progress shared with your connections! 🎉");
    setTimeout(() => setShareMsg(""), 3000);
  };

  const ageGroupColors = { kids:"text-yellow-400", teens:"text-blue-400", adults:"text-lime-400", seniors:"text-orange-400" };
  const ageGroupLabels = { kids:"Kid Mode 👶", teens:"Teen Mode 🧑", adults:"Adult Mode 🧑", seniors:"Senior Mode 🧓" };

  const inputCls = "w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">

      {/* ── Sidebar (desktop) ── */}
      <div className="hidden md:flex w-56 bg-gray-900 border-r border-gray-800 flex-col py-6 gap-1 shrink-0">
        <div className="px-4 mb-6">
          <span className="text-xl">🫶</span>
          <span className="font-black text-lime-400 ml-2">Happy2Live</span>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition ${tab === t.id ? "bg-lime-400 text-black font-bold" : "text-gray-400 hover:bg-gray-800"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
        <div className="mt-auto px-4 pt-4 border-t border-gray-800 mx-2">
          <button onClick={onLogout} className="text-gray-500 hover:text-red-400 flex items-center gap-2 transition text-sm">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-black">
              {tab === "dashboard" ? `Good day, ${user?.name?.split(" ")[0] || "there"} 👋` : TAB_TITLES[tab]}
            </h1>
            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-800 ${ageGroupColors[ageGroup]}`}>{ageGroupLabels[ageGroup]}</span>
            <div className="w-9 h-9 bg-lime-400 rounded-full flex items-center justify-center text-black font-black text-sm">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            {/* Wellness tip */}
            <div className="bg-lime-400/10 border border-lime-400/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <p className="text-lime-300 font-medium text-sm md:text-base">{tips[tipIdx]}</p>
              <button onClick={() => setTipIdx((tipIdx + 1) % tips.length)} className="text-lime-400 text-sm shrink-0 hover:text-lime-300 transition font-medium">
                Next →
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:"Heart Rate", value:"72 bpm", icon:"❤️", sub:"-3% from last week" },
                { label:"Oxygen Level", value:"95.6%", icon:"🫁", sub:"-0.1% from yesterday" },
                { label:"Daily Steps", value:"9,893", icon:"👟", sub:"+5% from yesterday" },
                { label:"BMI", value: bmiResult ? bmiResult.val : "--", icon:"⚖️", sub: bmiResult ? bmiResult.category : "Go to Body tab to calculate" },
              ].map(s => (
                <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">{s.label}</span>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Steps chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-4 text-sm md:text-base">Monthly Step Count</h3>
              <div className="flex items-end gap-1 h-28 md:h-36">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full rounded-t-md transition ${s === maxStep ? "bg-lime-400" : "bg-gray-600"}`} style={{ height:`${(s / maxStep) * 100}%` }} />
                    <span className="text-gray-500 text-xs hidden md:block">{MONTHS[i].slice(0,1)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-500 text-xs">Jan</span>
                <span className="text-gray-500 text-xs">Dec</span>
              </div>
            </div>

            {/* Hydration + Sleep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Hydration</h3><span className="text-2xl">💧</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">Goal: 2,000 ml · <span className="text-white font-bold">1,200 ml consumed</span></p>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-blue-400 h-3 rounded-full" style={{ width:"60%" }} />
                </div>
                <p className="text-gray-500 text-xs mt-2">60% of daily goal</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Sleep Tracking</h3><span className="text-2xl">😴</span>
                </div>
                <p className="text-gray-400 text-sm">Last night: <span className="text-white font-bold">8h 20m</span></p>
                <p className="text-gray-400 text-sm">Deep sleep: <span className="text-white font-bold">1.8 hours</span></p>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-purple-400 h-3 rounded-full" style={{ width:"83%" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BODY TAB ── */}
        {tab === "body" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Body model */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <p className={`text-sm font-bold mb-4 ${ageGroupColors[ageGroup]}`}>{ageGroupLabels[ageGroup]} — Click a body part for insights</p>
              <div className="flex flex-col items-center gap-3">
                <div className={`text-8xl select-none ${ageGroup === "kids" ? "scale-75" : ageGroup === "seniors" ? "scale-90" : "scale-100"} transition-all`}>🧍</div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {Object.entries(BODY_PARTS).map(([key, val]) => (
                    <button key={key} onClick={() => setSelected(key === selected ? null : key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${selected === key ? "bg-lime-400 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                      <span>{val.icon}</span>{val.label}
                    </button>
                  ))}
                </div>
              </div>
              {selected && (
                <div className="mt-5 bg-lime-400/10 border border-lime-400/30 rounded-xl p-4">
                  <p className="text-lime-300 font-bold mb-1">{BODY_PARTS[selected].icon} {BODY_PARTS[selected].label}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{BODY_PARTS[selected].info[ageGroup]}</p>
                </div>
              )}
            </div>

            {/* BMI Calculator */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">BMI Calculator</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 70" value={bmiForm.weight}
                    onChange={e => setBmiForm({ ...bmiForm, weight: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Height (cm)</label>
                  <input type="number" placeholder="e.g. 172" value={bmiForm.height}
                    onChange={e => setBmiForm({ ...bmiForm, height: e.target.value })} className={inputCls} />
                </div>
                <button onClick={handleCalcBmi} className="w-full bg-lime-400 text-black font-bold py-3 rounded-xl hover:bg-lime-300 transition">
                  Calculate BMI
                </button>
              </div>
              {bmiResult && (
                <div className={`mt-4 p-4 rounded-xl border ${bmiResult.borderClass}`}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <p className="text-4xl font-black">{bmiResult.val}</p>
                    <p className={`font-bold text-lg ${bmiResult.colorClass}`}>{bmiResult.category}</p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{bmiResult.advice}</p>
                  <ul className="space-y-1.5">
                    {bmiResult.tips.map((tip, i) => (
                      <li key={i} className="text-gray-400 text-sm flex gap-2">
                        <span className="text-lime-400 shrink-0">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MEALS TAB ── */}
        {tab === "meals" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <div className="flex gap-3">
                <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)}
                  placeholder="Search meals... (e.g. chicken, vegan, breakfast, keto)"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
                {foodSearch && (
                  <button onClick={() => setFoodSearch("")} className="bg-gray-700 text-gray-300 px-4 rounded-xl hover:bg-gray-600 transition text-sm">
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Vegan","Protein","Breakfast","Low Carb","Keto","Fish","Quick"].map(tag => (
                  <button key={tag} onClick={() => setFoodSearch(tag.toLowerCase())}
                    className={`text-xs px-3 py-1.5 rounded-full transition ${foodSearch === tag.toLowerCase() ? "bg-lime-400 text-black font-bold" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">No meals found for "{foodSearch}"</p>
                <p className="text-sm mt-1">Try: chicken, vegan, breakfast, salmon, egg...</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map((m, idx) => (
                <div key={m.name} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-lime-400/40 transition">
                  <div className="flex items-start gap-3">
                    <span className="text-5xl">{m.img}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{m.name}</h3>
                      <p className="text-gray-400 text-sm">{m.cal} cal · {m.protein}g protein</p>
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {m.tags.map(t => (
                          <span key={t} className="bg-lime-400/15 text-lime-300 text-xs px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setExpandedRecipe(expandedRecipe === idx ? null : idx)}
                    className="mt-3 w-full border border-lime-400/40 text-lime-400 py-2 rounded-xl text-sm hover:bg-lime-400/10 transition">
                    {expandedRecipe === idx ? "▲ Hide Recipe" : "▼ View Recipe"}
                  </button>
                  {expandedRecipe === idx && (
                    <div className="mt-3 text-gray-400 text-sm bg-gray-900 rounded-xl p-4 space-y-1">
                      <p className="text-white font-medium mb-2">Quick Prep</p>
                      <p>1. Gather fresh ingredients from the list above.</p>
                      <p>2. Prepare and cook using your preferred method (grill, steam, or bake).</p>
                      <p>3. Season with herbs and spices to taste.</p>
                      <p>4. Serve immediately for best nutrition and flavor.</p>
                      <p className="text-lime-400 mt-2">Tip: Meal prep on Sunday for a stress-free week!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EDUCATION TAB ── */}
        {tab === "education" && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${edu.border} ${edu.bg}`}>
              <p className={`font-bold text-lg ${edu.color}`}>{edu.label}</p>
              <p className="text-gray-300 text-sm mt-1">{edu.fact}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {edu.articles.map((art, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{art.icon}</span>
                      <div>
                        <h3 className="font-bold leading-tight">{art.title}</h3>
                        <span className="text-gray-500 text-xs bg-gray-700 px-2 py-0.5 rounded-full mt-1 inline-block">{art.readTime} read</span>
                      </div>
                    </div>
                  </div>
                  {expandedArt === idx ? (
                    <p className="text-gray-300 text-sm mt-3 leading-relaxed">{art.body}</p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">{art.body.slice(0, 90)}...</p>
                  )}
                  <button onClick={() => setExpandedArt(expandedArt === idx ? null : idx)}
                    className={`mt-3 text-sm font-medium transition ${edu.color} hover:opacity-70`}>
                    {expandedArt === idx ? "Read less ▲" : "Read more ▼"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOCIAL TAB ── */}
        {tab === "social" && (
          <div className="space-y-4">
            {/* Add friend */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Add Friends & Family</h3>
              <div className="flex gap-3">
                <input value={friendInput} onChange={e => setFriendInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addFriend()}
                  placeholder="Enter name or email..." className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
                <button onClick={addFriend} className="bg-lime-400 text-black font-bold px-5 rounded-xl hover:bg-lime-300 transition">Invite</button>
              </div>
            </div>

            {/* Share progress */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Share Your Progress</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label:"BMI", value: bmiResult ? bmiResult.val : "--", icon:"⚖️" },
                  { label:"Steps Today", value:"9,893", icon:"👟" },
                  { label:"Day Streak", value:"12 🔥", icon:"🏆" },
                ].map(s => (
                  <div key={s.label} className="text-center bg-gray-900 rounded-xl p-3">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              {shareMsg && <p className="text-lime-400 text-sm mb-3 font-medium">{shareMsg}</p>}
              <button onClick={shareProgress} className="w-full bg-lime-400 text-black font-bold py-2.5 rounded-xl hover:bg-lime-300 transition">
                Share Progress with Friends
              </button>
            </div>

            {/* Friends list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {friends.map((f, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black font-bold shrink-0">
                    {f.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-gray-400 text-sm">{f.relation} · {f.active ? "🟢 Active today" : "⚫ Offline"}</p>
                  </div>
                  <button className="text-lime-400 text-sm hover:underline transition">View</button>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Friend Activity</h3>
              {[
                { name:"Alex", action:"completed a 5km run", time:"2 hrs ago", icon:"🏃" },
                { name:"Sarah", action:"hit their water goal", time:"4 hrs ago", icon:"💧" },
                { name:"Mom", action:"logged 8 hours of sleep", time:"This morning", icon:"😴" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-700 last:border-0">
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-bold text-lime-400">{a.name}</span> {a.action}</p>
                    <p className="text-gray-500 text-xs">{a.time}</p>
                  </div>
                  <button className="text-gray-400 text-xs hover:text-white transition">👏</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PODCASTS TAB ── */}
        {tab === "podcasts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name:"Spotify",        icon:"🎵", color:"bg-green-500/20 border-green-500/40 text-green-400" },
                { name:"Apple Podcasts", icon:"🎙️", color:"bg-purple-500/20 border-purple-500/40 text-purple-400" },
                { name:"Apple Music",    icon:"🎶", color:"bg-red-500/20 border-red-500/40 text-red-400" },
              ].map(s => (
                <button key={s.name} className={`border rounded-2xl p-5 text-left hover:scale-105 transition ${s.color}`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="font-bold">Connect {s.name}</p>
                  <p className="text-sm opacity-70 mt-1">Tap to link your account</p>
                </button>
              ))}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-4">Featured Health Podcasts</h3>
              {PODCASTS.map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-700 last:border-0">
                  <div className="w-10 h-10 bg-lime-400/20 rounded-xl flex items-center justify-center text-xl shrink-0">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-gray-400 text-sm truncate">{p.ep}</p>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">{p.dur}</span>
                  <button className="text-lime-400 text-xl hover:scale-110 transition shrink-0">▶</button>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Recommended for <span className={ageGroupColors[ageGroup]}>{EDUCATION[ageGroup].label}</span></h3>
              {RECOMMENDED[ageGroup].map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-700 last:border-0">
                  <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-xl shrink-0">{p.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-gray-400 text-sm">{p.ep}</p>
                  </div>
                  <button className="text-lime-400 text-xl hover:scale-110 transition shrink-0">▶</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="space-y-4 max-w-2xl">
            {/* Read-only info */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-black font-black text-2xl">
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold">{user?.name || "User"}</p>
                  <p className="text-gray-400 text-sm">{user?.email || ""}</p>
                  <p className="text-gray-500 text-xs mt-1">Member since {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-US", { month:"long", year:"numeric" }) : "today"}</p>
                </div>
              </div>
            </div>

            {/* Edit profile */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold">Health Profile</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Age</label>
                  <input type="number" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age:e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Gender</label>
                  <select value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender:e.target.value})} className={inputCls + " cursor-pointer"}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Height (cm)</label>
                  <input type="number" value={profileForm.height} onChange={e => setProfileForm({...profileForm, height:e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Weight (kg)</label>
                  <input type="number" value={profileForm.weight} onChange={e => setProfileForm({...profileForm, weight:e.target.value})} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Activity Level</label>
                <select value={profileForm.activityLevel} onChange={e => setProfileForm({...profileForm, activityLevel:e.target.value})} className={inputCls + " cursor-pointer"}>
                  {["Sedentary","Lightly Active","Moderately Active","Very Active","Athlete"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Food preferences */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Food Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {["Vegan","Vegetarian","Pescatarian","Gluten-Free","Dairy-Free","Keto","Low-Carb","High-Protein"].map(p => (
                  <button key={p} onClick={() => togglePref("foodPrefs", p, setProfileForm)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${profileForm.foodPrefs.includes(p) ? "bg-lime-400 text-black border-lime-400 font-bold" : "border-gray-600 text-gray-300 hover:border-lime-400/50"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Health goals */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Health Goals</h3>
              <div className="flex flex-wrap gap-2">
                {["Weight Loss","Muscle Gain","Maintain Weight","Improve Fitness","Better Sleep","Stress Reduction"].map(g => (
                  <button key={g} onClick={() => togglePref("healthGoals", g, setProfileForm)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${profileForm.healthGoals.includes(g) ? "bg-lime-400 text-black border-lime-400 font-bold" : "border-gray-600 text-gray-300 hover:border-lime-400/50"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {profileSaved && (
              <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3 text-lime-300 font-medium text-sm">
                ✅ Profile saved successfully!
              </div>
            )}
            <button onClick={saveProfile} className="w-full bg-lime-400 text-black font-black py-3 rounded-xl hover:bg-lime-300 transition text-base">
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 border-t border-gray-800 flex justify-around py-2 z-50">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${tab === t.id ? "text-lime-400" : "text-gray-500"}`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs mt-0.5">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
