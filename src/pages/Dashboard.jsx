import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  getAgeGroup, calcBMR, calcTDEE, calcCaloricGoal, calcWaterGoal,
  calcMaxHR, calcHRZones, getSleepGoal, getStepGoal, calcBMI,
  generateWeeklySteps, generateWeeklySleep,
} from "../utils/health";

// ─── Static Data ──────────────────────────────────────────────────────────────

const MEALS = [
  { name:"Avocado Toast",         cal:320, protein:9,  img:"🥑", tags:["Vegan","Quick","Breakfast"],      keywords:"avocado toast vegan quick breakfast plant",
    recipe:["2 slices whole-grain bread, toasted","1 ripe avocado, mashed","Salt, pepper, chili flakes","Optional: poached egg on top","Prep: 5 min · Cook: 5 min"] },
  { name:"Grilled Salmon",        cal:480, protein:42, img:"🐟", tags:["High Protein","Omega-3","Dinner"], keywords:"salmon fish seafood protein omega dinner keto",
    recipe:["180g salmon fillet","1 tbsp olive oil, lemon juice","Garlic, dill, salt & pepper","Grill 4 min each side on high heat","Serve with steamed greens or quinoa"] },
  { name:"Berry Smoothie Bowl",   cal:280, protein:7,  img:"🫐", tags:["Vegan","Antioxidants","Breakfast"],keywords:"berry smoothie vegan breakfast antioxidant fruit",
    recipe:["1 cup frozen mixed berries","½ banana","¼ cup almond milk — blend thick","Top: granola, chia seeds, fresh fruit","Prep: 5 min — no cook needed"] },
  { name:"Chicken Stir Fry",      cal:420, protein:38, img:"🍗", tags:["High Protein","Low Carb","Dinner"],keywords:"chicken stir fry protein low carb keto dinner meat",
    recipe:["200g chicken breast, sliced thin","2 cups mixed vegetables","2 tbsp low-sodium soy sauce + sesame oil","Stir-fry on high heat 8-10 min","Serve over cauliflower rice or brown rice"] },
  { name:"Quinoa Power Bowl",     cal:350, protein:14, img:"🥗", tags:["Vegan","Fiber","Lunch"],           keywords:"quinoa bowl vegan lunch fiber plant protein",
    recipe:["½ cup quinoa, cooked","Roasted chickpeas, cucumber, tomato","Tahini dressing: tahini, lemon, garlic","Top with pumpkin seeds","Prep: 10 min · Cook: 15 min"] },
  { name:"Egg White Omelette",    cal:200, protein:28, img:"🍳", tags:["Low Cal","High Protein","Breakfast"],keywords:"egg omelette breakfast protein low calorie",
    recipe:["4 egg whites","Spinach, mushrooms, cherry tomatoes","1 tbsp olive oil, salt, pepper","Cook on medium heat 3-4 min each side","Optional: sprinkle feta on top"] },
  { name:"Sweet Potato Bowl",     cal:390, protein:8,  img:"🍠", tags:["Vegan","Complex Carbs","Lunch"],   keywords:"sweet potato bowl vegan lunch complex carbs",
    recipe:["1 large sweet potato, cubed & roasted","Black beans, avocado, corn salsa","Lime juice, cumin, smoked paprika","Roast potato 25 min at 200°C","Assemble and top with fresh cilantro"] },
  { name:"Tuna Poke Bowl",        cal:440, protein:36, img:"🐠", tags:["High Protein","Omega-3","Lunch"],  keywords:"tuna poke bowl fish seafood protein omega lunch",
    recipe:["150g sushi-grade tuna, cubed","Soy sauce, sesame oil, sriracha marinade","Brown rice, edamame, cucumber, avocado","Marinate tuna 10 min","Assemble over rice, top with sesame seeds"] },
  { name:"Overnight Oats",        cal:300, protein:11, img:"🌾", tags:["Fiber","Breakfast","Vegan"],       keywords:"oats overnight breakfast fiber vegan prep",
    recipe:["½ cup rolled oats","½ cup almond milk + ½ cup yogurt","1 tbsp chia seeds, 1 tsp honey","Mix in jar, refrigerate overnight","Top with berries and nuts in the morning"] },
  { name:"Greek Yogurt Parfait",  cal:250, protein:18, img:"🫙", tags:["Probiotic","Calcium","Snack"],     keywords:"yogurt parfait dairy probiotic calcium snack protein",
    recipe:["1 cup Greek yogurt (full fat or 0%)","Layer: granola, mixed berries, honey","Optional: nuts or dark chocolate chips","No cooking needed — prep: 3 min","Best consumed fresh — don't store assembled"] },
  { name:"Lentil Soup",           cal:310, protein:18, img:"🍲", tags:["Vegan","High Fiber","Dinner"],     keywords:"lentil soup vegan fiber dinner plant protein",
    recipe:["1 cup red lentils, rinsed","Onion, carrot, celery, garlic — sauté first","1 can diced tomatoes + 4 cups veggie broth","Cumin, turmeric, paprika, salt, pepper","Simmer 25 min · Squeeze lemon before serving"] },
  { name:"Turkey Wrap",           cal:380, protein:32, img:"🌯", tags:["High Protein","Lunch"],            keywords:"turkey wrap protein lunch sandwich",
    recipe:["1 whole-wheat tortilla","100g sliced turkey breast","Lettuce, tomato, avocado, mustard","Optional: low-fat Swiss cheese","Prep: 5 min — ideal for meal prep"] },
];

const EDUCATION = {
  kids: {
    label:"Kids Zone 👶", color:"text-yellow-400", border:"border-yellow-400/30", bg:"bg-yellow-400/10",
    fact:"🌟 Did you know? Your body has 206 bones and they keep growing until you're about 25!",
    articles:[
      { title:"Eat the Rainbow 🌈", icon:"🥦", readTime:"3 min", body:"Eating colorful fruits and vegetables gives your body the vitamins and minerals it needs to grow strong. Try to have at least 3 different colors on your plate every day! Red tomatoes, orange carrots, green broccoli, and purple grapes all help different parts of your body in unique ways." },
      { title:"Why Exercise is Your Superpower 💪", icon:"🤸", readTime:"3 min", body:"Kids need 60 minutes of active play every day. Running, jumping, swimming, and dancing all count! Exercise makes your bones stronger, your heart healthier, and your brain smarter. It also helps you sleep better at night and feel happier during the day." },
      { title:"Sleep = Grow Taller & Smarter 😴", icon:"😴", readTime:"2 min", body:"Your brain and body do their most important growing while you sleep. Kids aged 6-12 need 9-12 hours of sleep each night. Put screens away 30 minutes before bed, and your body will thank you by helping you grow taller, think faster, and remember things better!" },
      { title:"Water is Your Body's Best Friend 💧", icon:"💧", readTime:"2 min", body:"Your body is 60% water! Drinking 6-8 glasses daily helps you think clearly, move faster, and stay energized. Feeling tired or getting headaches? You might just be thirsty. Carry a water bottle everywhere and sip throughout the day." },
    ],
  },
  teens: {
    label:"Teen Health 🧑", color:"text-blue-400", border:"border-blue-400/30", bg:"bg-blue-400/10",
    fact:"🧠 Teen brains are still developing until age 25 — sleep and nutrition are critical right now!",
    articles:[
      { title:"Mental Health & Social Media 📱", icon:"📱", readTime:"5 min", body:"Social media can affect mood and self-esteem. Teens who limit social media to 30 min/day report significantly lower anxiety and depression. Try phone-free mornings, turn off notifications after 9pm, and remember: what people post is their highlight reel, not their whole life. Real connections matter more." },
      { title:"Building Muscle & Strong Bones 💪", icon:"💪", readTime:"4 min", body:"Your teenage years are the most important time for building bone density — 90% of peak bone mass is built by age 18. Strength training 2-3 times a week, getting enough calcium (1300mg/day), and vitamin D from sunlight all contribute to bones that will stay strong for life." },
      { title:"Nutrition for Your Growing Body 🥦", icon:"🥦", readTime:"5 min", body:"Teens need more nutrients than adults because your body is growing rapidly. Iron is crucial for girls after puberty — get it from lean meats, spinach, and beans. All teens need protein (0.85g per kg bodyweight) for muscle development. Avoid crash diets — your brain needs glucose to function properly." },
      { title:"Sleep & Your Academic Performance 📚", icon:"📚", readTime:"4 min", body:"Teens biologically fall asleep and wake up later than adults — this is science, not laziness. You need 8-10 hours. Sleep consolidates memory; pulling all-nighters before exams reduces retention by up to 40%. Blue light from screens suppresses melatonin. Stop screen use 1 hour before bed." },
    ],
  },
  adults: {
    label:"Adult Wellness 🧑", color:"text-lime-400", border:"border-lime-400/30", bg:"bg-lime-400/10",
    fact:"❤️ The heart beats ~100,000 times per day. Regular cardio makes each beat more efficient.",
    articles:[
      { title:"Cardiovascular Health Over 30 🫀", icon:"🫀", readTime:"7 min", body:"After 30, cardiovascular risk gradually increases. 150 minutes per week of moderate exercise reduces heart disease risk by 35%. Limit sodium to under 2300mg/day, maintain a healthy weight, and monitor blood pressure regularly. LDL cholesterol should stay under 100 mg/dL for optimal heart health." },
      { title:"Stress Management That Works 🧘", icon:"🧘", readTime:"6 min", body:"Chronic stress elevates cortisol, promoting fat storage, weakening immunity, and disrupting sleep. Evidence-backed techniques: diaphragmatic breathing (5 min/day reduces cortisol 15%), progressive muscle relaxation, and nature walks. Exercise is the most effective stress reducer — it converts cortisol to positive neurochemicals within 20 minutes." },
      { title:"Understanding Intermittent Fasting ⏱️", icon:"⏱️", readTime:"5 min", body:"The popular 16:8 method (eat in an 8-hour window) has shown benefits for insulin sensitivity and modest weight loss. IF is not appropriate for everyone — pregnant women, people with certain medical conditions, and those with a history of disordered eating should avoid it. Benefits come from caloric restriction, not magic timing." },
      { title:"Building a Sleep Routine 😴", icon:"😴", readTime:"5 min", body:"Adults need 7-9 hours. Poor sleep is linked to obesity, type 2 diabetes, cardiovascular disease, and depression. Key tips: keep your bedroom cool (18-19°C), dark, and quiet. Maintain a consistent wake time even on weekends. Avoid caffeine after 2pm. Consistent sleep times train your circadian rhythm within 2-3 weeks." },
    ],
  },
  seniors: {
    label:"Senior Vitality 🧓", color:"text-orange-400", border:"border-orange-400/30", bg:"bg-orange-400/10",
    fact:"🦴 After 65, resistance training twice a week can reverse up to 10 years of muscle loss.",
    articles:[
      { title:"Joint Health & Low-Impact Exercise 🦴", icon:"🦴", readTime:"6 min", body:"Osteoarthritis affects over 30% of people over 65. Low-impact activities like swimming, cycling, and water aerobics maintain cardiovascular fitness without joint stress. Tai Chi reduces fall risk by 47% and improves balance significantly. Aim for 150 minutes/week of movement, split into manageable sessions." },
      { title:"Heart Health After 65 ❤️", icon:"❤️", readTime:"6 min", body:"Cardiovascular disease is the leading cause of death in seniors, but largely preventable. Target blood pressure below 130/80 mmHg. The DASH diet reduces blood pressure as effectively as medication in some studies. Limit alcohol, quit smoking, and maintain a healthy weight." },
      { title:"Keeping Your Brain Sharp 🧠", icon:"🧠", readTime:"5 min", body:"Cognitive decline is not inevitable. Regular aerobic exercise increases BDNF, protecting neurons. Learning new skills — a language, instrument, or craft — builds new neural pathways. Social engagement powerfully protects against dementia. Aim for at least 3 social interactions per week. Mediterranean diet adherence is associated with 35% lower Alzheimer's risk." },
      { title:"Nutrition for Healthy Aging 🥗", icon:"🥗", readTime:"5 min", body:"Protein needs increase after 65 (1.0-1.2g per kg bodyweight) to prevent muscle loss. Calcium needs: 1200mg/day. Vitamin D: 800-1000 IU/day. Vitamin B12 absorption decreases with age — fortified foods or supplements may be needed. Reduce sodium, increase potassium-rich foods for blood pressure." },
    ],
  },
};

const BODY_PARTS = {
  head:    { label:"Head & Brain", icon:"🧠", info:{ kids:"Your brain is growing fast! Reading, play, and good sleep make it develop strong.", teens:"Protect your mental health. Reduce screen time before bed — blue light disrupts brain recovery.", adults:"Brain health: stay hydrated, get 7-9h sleep, and challenge your mind with new skills.", seniors:"Cognitive exercises like puzzles and learning new skills reduce dementia risk significantly." } },
  heart:   { label:"Heart", icon:"❤️", info:{ kids:"Your heart beats about 100 times per minute. Running and active play keep it strong!", teens:"Normal resting heart rate: 60-100 bpm. Aim for 60 min of cardio daily for long-term heart health.", adults:"Target resting HR under 80. 150 min/week moderate cardio + low-sodium diet protects your heart.", seniors:"Monitor blood pressure weekly. Walking 30 min/day is ideal for heart health." } },
  lungs:   { label:"Lungs", icon:"🫁", info:{ kids:"Your lungs are still growing! Breathe fresh air and try deep breathing exercises.", teens:"Avoid smoking and vaping — lungs are still developing until your mid-20s.", adults:"Optimal oxygen: 95-100%. Regular cardio improves lung capacity. Never smoke.", seniors:"Lung capacity decreases naturally. Deep breathing exercises and walking maintain respiratory health." } },
  stomach: { label:"Stomach & Gut", icon:"🫃", info:{ kids:"Your tummy breaks down food for energy! Eat fiber-rich veggies and drink water.", teens:"Gut health affects mood and energy. Eat diverse whole foods and probiotics.", adults:"Gut microbiome health is linked to immunity, mood, and weight. Eat 30+ different plant foods/week.", seniors:"Digestive enzymes decrease with age. Eat smaller, frequent meals and increase fiber." } },
  spine:   { label:"Spine & Posture", icon:"🦴", info:{ kids:"Sit up straight and carry your backpack properly — your spine is still forming!", teens:"Check your posture when using your phone. Forward head posture puts 27kg of stress on your spine.", adults:"Core strength protects the spine. Avoid prolonged sitting — stand every 60-90 minutes.", seniors:"Osteoporosis affects 1 in 3 women over 65. Weight-bearing exercise and calcium are essential." } },
  legs:    { label:"Legs & Knees", icon:"🦵", info:{ kids:"Strong legs help you run and jump! Playing outside every day builds healthy bones.", teens:"Warm up before sport and cool down after — most teen injuries come from skipping these steps.", adults:"Squats and lunges improve metabolism, balance, and protect knees long-term.", seniors:"Swimming and cycling preserve cartilage. Ensure adequate Vitamin D for bone strength." } },
};

const WELLNESS_TIPS = {
  kids:    ["Drink a glass of water first thing when you wake up! 💧","Try to play outside for 60 minutes today — your bones will grow stronger! 🏃","Eat 3 different colored vegetables at dinner tonight 🥦🥕🌽","Put your phone away 30 minutes before bedtime — your brain needs to rest! 😴","Challenge yourself: do 10 jumping jacks right now! 💪"],
  teens:   ["Put the phone down 1 hour before sleep — your brain will thank you. 📱","Do 20 push-ups right now. Building the habit is more important than the reps. 💪","Eat a protein-rich breakfast — it improves focus and concentration all morning. 🍳","Check in on a friend today. Social connection is a key part of mental health. 🤝","Hydrate before you feel thirsty — thirst means you're already 1-2% dehydrated."],
  adults:  ["Take a 5-minute walk after every 90 minutes of sitting. Movement resets focus. 🚶","Sleep 7-9 hours tonight. Recovery is when your body actually improves. 😴","Eat fiber-rich foods today: beans, oats, or vegetables to improve gut health. 🥗","Take 5 minutes to breathe deeply — proven to lower cortisol and reduce stress. 🧘","Track your meals for just 3 days — awareness alone reduces intake by ~10%."],
  seniors: ["Start your morning with 10 minutes of gentle stretching for joint flexibility. 🤸","Stay socially connected today — even a short call with a friend reduces cognitive decline.","Focus on calcium-rich foods: yogurt, cheese, or leafy greens. 🥛","Practice standing on one foot for 10 seconds — a simple balance exercise. ⚖️","Take a 20-30 minute walk at a comfortable pace. Your heart and brain will thank you. 🌳"],
};

const PODCASTS = [
  { title:"Huberman Lab",           ep:"Sleep & Recovery Science",        dur:"1h 23m", icon:"🔬" },
  { title:"ZOE Science & Nutrition",ep:"Foods that heal your gut",         dur:"45m",    icon:"🥗" },
  { title:"Feel Better, Live More", ep:"Move more, stress less",           dur:"52m",    icon:"🏃" },
  { title:"Diary of a CEO",         ep:"The science of longevity",         dur:"1h 10m", icon:"🧬" },
  { title:"10% Happier",            ep:"Meditation for skeptics",          dur:"38m",    icon:"🧘" },
];

const RECOMMENDED = {
  kids:    [{ title:"Kids Health Podcast",  ep:"Why sleep helps you grow",     icon:"😴" }, { title:"Tiny Chefs",         ep:"Healthy lunchbox ideas",     icon:"🥪" }, { title:"Move It!",          ep:"Fun exercises for kids",   icon:"🤸" }],
  teens:   [{ title:"Teen Mental Health",   ep:"Handling exam stress",         icon:"📚" }, { title:"Body Positive",      ep:"Self image & fitness",       icon:"💙" }, { title:"Fuel Your Future",  ep:"Sports nutrition basics",  icon:"🏅" }],
  adults:  [{ title:"Found My Fitness",     ep:"Optimizing your metabolism",   icon:"🔥" }, { title:"Model Health Show",  ep:"Eat smarter, not less",      icon:"🍽️" }, { title:"Mind Pump",         ep:"Strength training myths",  icon:"💪" }],
  seniors: [{ title:"Aging Well",           ep:"Strength at any age",          icon:"🦾" }, { title:"Brain Science",      ep:"Preventing cognitive decline",icon:"🧠"}, { title:"Silver Sneakers",   ep:"Low-impact routines",      icon:"🚶" }],
};

const WORKOUTS = [
  { name:"Morning Run",       icon:"🏃", duration:30, calories:280, type:"Cardio" },
  { name:"Strength Training", icon:"💪", duration:45, calories:320, type:"Strength" },
  { name:"Yoga",              icon:"🧘", duration:60, calories:180, type:"Flexibility" },
  { name:"Cycling",           icon:"🚴", duration:45, calories:350, type:"Cardio" },
  { name:"Swimming",          icon:"🏊", duration:30, calories:300, type:"Cardio" },
  { name:"HIIT",              icon:"⚡", duration:25, calories:380, type:"Cardio" },
];

const TABS = [
  { id:"dashboard", icon:"📊", label:"Dashboard" },
  { id:"body",      icon:"🧬", label:"Body" },
  { id:"meals",     icon:"🥗", label:"Meals" },
  { id:"workout",   icon:"💪", label:"Workout" },
  { id:"education", icon:"📚", label:"Education" },
  { id:"social",    icon:"👥", label:"Social" },
  { id:"podcasts",  icon:"🎙️", label:"Podcasts" },
  { id:"profile",   icon:"👤", label:"Profile" },
];

// ─── Tooltip Components ───────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 80, color = "#a3e635", label, value }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 1) * circ);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#374151" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:"stroke-dashoffset 0.6s ease" }} />
        <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={size * 0.18} fontWeight="bold">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <p className="text-white font-bold text-sm">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({ user, onLogout, onUpdateUser }) {
  const age      = parseInt(user?.age) || 25;
  const ageGroup = getAgeGroup(age);

  // Personalized calculations
  const bmr       = useMemo(() => calcBMR(user?.weight, user?.height, age, user?.gender), [user]);
  const tdee      = useMemo(() => calcTDEE(bmr, user?.activityLevel), [bmr, user?.activityLevel]);
  const caloricGoal = useMemo(() => calcCaloricGoal(tdee, user?.healthGoals), [tdee, user?.healthGoals]);
  const waterGoal = useMemo(() => calcWaterGoal(user?.weight), [user?.weight]);
  const maxHR     = useMemo(() => calcMaxHR(age), [age]);
  const hrZones   = useMemo(() => calcHRZones(maxHR), [maxHR]);
  const sleepGoal = useMemo(() => getSleepGoal(age), [age]);
  const stepGoal  = useMemo(() => getStepGoal(age), [age]);
  const weeklySteps = useMemo(() => generateWeeklySteps(stepGoal), [stepGoal]);
  const weeklySleep = useMemo(() => generateWeeklySleep(sleepGoal), [sleepGoal]);

  const todaySteps = weeklySteps[6]?.steps || stepGoal * 0.8;
  const todaySleep = weeklySleep[6]?.sleep || sleepGoal.min;
  const restingHR  = Math.round(60 + Math.random() * 20);

  const [tab, setTab]                 = useState("dashboard");
  const [selected, setSelected]       = useState(null);
  const [bmiForm, setBmiForm]         = useState({ weight: user?.weight || "", height: user?.height || "" });
  const [bmiResult, setBmiResult]     = useState(() => user?.weight && user?.height ? calcBMI(user.weight, user.height, age, user.gender) : null);
  const [waterConsumed, setWaterConsumed] = useState(Math.round(waterGoal * 0.5));
  const [foodSearch, setFoodSearch]   = useState("");
  const [expandedArt, setExpandedArt] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [friendInput, setFriendInput] = useState("");
  const [friends, setFriends]         = useState([
    { name:"Alex", relation:"Brother", active:true },
    { name:"Sarah", relation:"Friend", active:true },
    { name:"Dr. Johnson", relation:"Doctor", active:false },
    { name:"Mom", relation:"Family", active:true },
  ]);
  const [shareMsg, setShareMsg]       = useState("");
  const [tipIdx, setTipIdx]           = useState(0);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
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

  const filteredMeals = foodSearch.trim()
    ? MEALS.filter(m => m.keywords.includes(foodSearch.toLowerCase().trim()))
    : MEALS;

  const edu  = EDUCATION[ageGroup];
  const tips = WELLNESS_TIPS[ageGroup];

  const ageGroupColors = { kids:"text-yellow-400", teens:"text-blue-400", adults:"text-lime-400", seniors:"text-orange-400" };
  const ageGroupLabels = { kids:"Kid Mode 👶", teens:"Teen Mode 🧑", adults:"Adult Mode 🧑", seniors:"Senior Mode 🧓" };
  const inputCls = "w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition";

  const addFriend = () => {
    if (!friendInput.trim()) return;
    setFriends([...friends, { name: friendInput.trim(), relation:"Friend", active:false }]);
    setFriendInput("");
  };

  const logWorkout = (w) => setLoggedWorkouts([{ ...w, date: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }, ...loggedWorkouts]);

  const saveProfile = () => {
    onUpdateUser(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const togglePref = (field, item) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter(x => x !== item) : [...prev[field], item],
    }));
  };

  const totalLoggedCal = loggedWorkouts.reduce((s, w) => s + w.calories, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">

      {/* ── Sidebar ── */}
      <div className="hidden md:flex w-56 bg-gray-900 border-r border-gray-800 flex-col py-6 gap-1 shrink-0">
        <div className="px-4 mb-6 flex items-center gap-2">
          <span className="text-xl">🫶</span>
          <span className="font-black text-lime-400">Happy2Live</span>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition text-sm ${tab === t.id ? "bg-lime-400 text-black font-bold" : "text-gray-400 hover:bg-gray-800"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
        <div className="mt-auto px-4 pt-4 border-t border-gray-800 mx-2">
          <button onClick={onLogout} className="text-gray-500 hover:text-red-400 flex items-center gap-2 text-sm transition">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-black">
              {tab === "dashboard" ? `Good day, ${user?.name?.split(" ")[0] || "there"} 👋` : TABS.find(t => t.id === tab)?.icon + " " + TABS.find(t => t.id === tab)?.label}
            </h1>
            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden md:block text-xs font-bold px-2 py-1 rounded-full bg-gray-800 ${ageGroupColors[ageGroup]}`}>{ageGroupLabels[ageGroup]}</span>
            <div className="w-9 h-9 bg-lime-400 rounded-full flex items-center justify-center text-black font-black text-sm">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* ════ DASHBOARD ════ */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            {/* Tip */}
            <div className="bg-lime-400/10 border border-lime-400/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <p className="text-lime-300 font-medium text-sm">{tips[tipIdx]}</p>
              <button onClick={() => setTipIdx((tipIdx + 1) % tips.length)} className="text-lime-400 text-sm shrink-0 hover:text-lime-300 transition font-medium">Next →</button>
            </div>

            {/* Today's Goal Rings */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-4 text-sm">Today's Goals</h3>
              <div className="grid grid-cols-4 gap-2">
                <ProgressRing pct={todaySteps / stepGoal} label="Steps" value={todaySteps.toLocaleString()} />
                <ProgressRing pct={waterConsumed / waterGoal} color="#60a5fa" label="Hydration" value={`${waterConsumed}ml`} />
                <ProgressRing pct={todaySleep / sleepGoal.max} color="#a78bfa" label="Sleep" value={`${todaySleep}h`} />
                {caloricGoal
                  ? <ProgressRing pct={Math.min(totalLoggedCal / caloricGoal, 1)} color="#f97316" label="Cal Burned" value={`${totalLoggedCal} kcal`} />
                  : <ProgressRing pct={0} color="#f97316" label="Cal Burned" value="Log workout" />
                }
              </div>
            </div>

            {/* Personalized Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:"Resting HR",   value:`${restingHR} bpm`, icon:"❤️", sub:`Max HR: ${maxHR} bpm` },
                { label:"Step Goal",    value:stepGoal.toLocaleString(), icon:"👟", sub:`Age-adjusted target` },
                { label:"Daily Water",  value:`${waterGoal} ml`, icon:"💧", sub:`Based on your weight` },
                { label:"BMI",          value: bmiResult ? bmiResult.val : "--", icon:"⚖️", sub: bmiResult ? bmiResult.category : "Calculate in Body tab" },
              ].map(s => (
                <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">{s.label}</span>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <p className="text-xl font-black">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Steps Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-1 text-sm">Weekly Steps</h3>
              <p className="text-gray-500 text-xs mb-4">Goal: {stepGoal.toLocaleString()} steps/day</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklySteps} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" tick={{ fill:"#9ca3af", fontSize:12 }} />
                  <YAxis tick={{ fill:"#9ca3af", fontSize:11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={stepGoal} stroke="#a3e635" strokeDasharray="4 4" label={{ value:"Goal", fill:"#a3e635", fontSize:11 }} />
                  <Bar dataKey="steps" fill="#a3e635" radius={[4,4,0,0]} name="Steps" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep + Hydration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Sleep */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm">Sleep Tracking</h3>
                  <span>😴</span>
                </div>
                <p className="text-gray-500 text-xs mb-3">Recommended: {sleepGoal.label}</p>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={weeklySleep} margin={{ top:0, right:0, left:-25, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" tick={{ fill:"#9ca3af", fontSize:11 }} />
                    <YAxis tick={{ fill:"#9ca3af", fontSize:11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={sleepGoal.min} stroke="#a78bfa" strokeDasharray="4 4" />
                    <Area dataKey="sleep" stroke="#a78bfa" fill="#a78bfa33" strokeWidth={2} name="Hours" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Hydration Logger */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm">Hydration Tracker</h3>
                  <span>💧</span>
                </div>
                <p className="text-gray-500 text-xs mb-3">Goal: {waterGoal.toLocaleString()} ml (based on your weight)</p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                  <div className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width:`${Math.min((waterConsumed / waterGoal) * 100, 100)}%` }} />
                </div>
                <p className="text-white font-bold mb-4">{waterConsumed.toLocaleString()} / {waterGoal.toLocaleString()} ml</p>
                <div className="flex gap-2">
                  <button onClick={() => setWaterConsumed(Math.max(0, waterConsumed - 250))}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-bold text-lg hover:bg-gray-600 transition">−</button>
                  <span className="flex-1 text-center py-2 text-gray-400 text-sm self-center">250 ml</span>
                  <button onClick={() => setWaterConsumed(waterConsumed + 250)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-bold text-lg hover:bg-blue-400 transition">+</button>
                </div>
              </div>
            </div>

            {/* Calorie & HR info */}
            {(bmr || maxHR) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bmr && (
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                    <h3 className="font-bold text-sm mb-3">Your Caloric Needs</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-900 rounded-xl p-3">
                        <p className="text-lg font-black text-lime-400">{bmr?.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">BMR</p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3">
                        <p className="text-lg font-black text-blue-400">{tdee?.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">TDEE</p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3">
                        <p className="text-lg font-black text-orange-400">{caloricGoal?.toLocaleString() ?? "—"}</p>
                        <p className="text-gray-400 text-xs">Daily Goal</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-3">Mifflin-St Jeor equation · adjusted for activity & goals</p>
                  </div>
                )}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">Heart Rate Zones</h3>
                  <p className="text-gray-500 text-xs mb-3">Max HR: {maxHR} bpm (220 − age)</p>
                  {Object.values(hrZones).map((z) => (
                    <div key={z.label} className="flex items-center justify-between py-1.5 border-b border-gray-700 last:border-0 text-sm">
                      <span className="text-gray-300">{z.label}</span>
                      <span className="text-white font-bold">{z.min}–{z.max} bpm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ BODY ════ */}
        {tab === "body" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <p className={`text-sm font-bold mb-4 ${ageGroupColors[ageGroup]}`}>{ageGroupLabels[ageGroup]} — Tap a body part for insights</p>
              <div className="flex flex-col items-center">
                <div className={`text-8xl select-none transition-all ${ageGroup === "kids" ? "text-6xl" : ageGroup === "seniors" ? "text-7xl" : "text-8xl"}`}>
                  {ageGroup === "kids" ? "🧒" : ageGroup === "seniors" ? "🧓" : user?.gender === "Female" ? "🧍‍♀️" : "🧍"}
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {Object.entries(BODY_PARTS).map(([key, val]) => (
                    <button key={key} onClick={() => setSelected(key === selected ? null : key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${selected === key ? "bg-lime-400 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                      {val.icon} {val.label}
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

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-1">BMI Calculator</h3>
              <p className="text-gray-500 text-xs mb-4">
                {ageGroup === "kids" ? "Note: Kids use BMI-for-age percentile. Consult a pediatrician for full assessment." : "Uses standard adult BMI formula."}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 70" value={bmiForm.weight}
                    onChange={e => setBmiForm({ ...bmiForm, weight: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Height (cm)</label>
                  <input type="number" placeholder="e.g. 172" value={bmiForm.height}
                    onChange={e => setBmiForm({ ...bmiForm, height: e.target.value })} className={inputCls} />
                </div>
                <button onClick={() => setBmiResult(calcBMI(bmiForm.weight, bmiForm.height, age, user?.gender))}
                  className="w-full bg-lime-400 text-black font-bold py-3 rounded-xl hover:bg-lime-300 transition">
                  Calculate BMI
                </button>
              </div>
              {bmiResult && (
                <div className={`mt-4 p-4 rounded-xl border ${bmiResult.borderClass}`}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-4xl font-black">{bmiResult.val}</p>
                    <p className={`font-bold text-lg ${bmiResult.colorClass}`}>{bmiResult.category}</p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{bmiResult.advice}</p>
                  <ul className="space-y-1.5">
                    {bmiResult.tips.map((tip, i) => (
                      <li key={i} className="text-gray-400 text-sm flex gap-2"><span className="text-lime-400 shrink-0">→</span>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ MEALS ════ */}
        {tab === "meals" && (
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <div className="flex gap-3">
                <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)}
                  placeholder="Search meals... (e.g. chicken, vegan, breakfast, keto)"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
                {foodSearch && <button onClick={() => setFoodSearch("")} className="bg-gray-700 text-gray-300 px-4 rounded-xl hover:bg-gray-600 transition text-sm">Clear</button>}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Vegan","Protein","Breakfast","Low Carb","Keto","Fish","Quick"].map(tag => (
                  <button key={tag} onClick={() => setFoodSearch(foodSearch === tag.toLowerCase() ? "" : tag.toLowerCase())}
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
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map((m, idx) => (
                <div key={m.name} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-lime-400/40 transition">
                  <div className="flex items-start gap-3">
                    <span className="text-5xl">{m.img}</span>
                    <div className="flex-1">
                      <h3 className="font-bold">{m.name}</h3>
                      <p className="text-gray-400 text-sm">{m.cal} cal · {m.protein}g protein</p>
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {m.tags.map(t => <span key={t} className="bg-lime-400/15 text-lime-300 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setExpandedRecipe(expandedRecipe === idx ? null : idx)}
                    className="mt-3 w-full border border-lime-400/40 text-lime-400 py-2 rounded-xl text-sm hover:bg-lime-400/10 transition">
                    {expandedRecipe === idx ? "▲ Hide Recipe" : "▼ View Recipe"}
                  </button>
                  {expandedRecipe === idx && (
                    <ul className="mt-3 bg-gray-900 rounded-xl p-4 space-y-1.5">
                      {m.recipe.map((step, i) => (
                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-lime-400 shrink-0">{i + 1}.</span>{step}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ WORKOUT ════ */}
        {tab === "workout" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:"Workouts Today", value: loggedWorkouts.length, icon:"💪" },
                { label:"Cal Burned", value: totalLoggedCal, icon:"🔥" },
                { label:"Active Min", value: loggedWorkouts.reduce((s,w) => s + w.duration, 0), icon:"⏱️" },
              ].map(s => (
                <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-sm text-gray-400">Quick Log a Workout</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WORKOUTS.map(w => (
                <button key={w.name} onClick={() => logWorkout(w)}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-left hover:border-lime-400/50 transition active:scale-95">
                  <div className="text-3xl mb-2">{w.icon}</div>
                  <p className="font-bold text-sm">{w.name}</p>
                  <p className="text-gray-400 text-xs">{w.duration} min · {w.calories} cal</p>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full mt-2 inline-block">{w.type}</span>
                </button>
              ))}
            </div>

            {loggedWorkouts.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">Today's Log</h3>
                {loggedWorkouts.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-700 last:border-0">
                    <span className="text-2xl">{w.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-gray-400 text-xs">{w.duration} min · {w.calories} cal burned</p>
                    </div>
                    <span className="text-gray-500 text-xs">{w.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ EDUCATION ════ */}
        {tab === "education" && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 border ${edu.border} ${edu.bg}`}>
              <p className={`font-bold text-lg ${edu.color}`}>{edu.label}</p>
              <p className="text-gray-300 text-sm mt-1">{edu.fact}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {edu.articles.map((art, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{art.icon}</span>
                    <div>
                      <h3 className="font-bold leading-tight">{art.title}</h3>
                      <span className="text-gray-500 text-xs bg-gray-700 px-2 py-0.5 rounded-full mt-1 inline-block">{art.readTime} read</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{expandedArt === idx ? art.body : art.body.slice(0, 100) + "..."}</p>
                  <button onClick={() => setExpandedArt(expandedArt === idx ? null : idx)}
                    className={`mt-2 text-sm font-medium transition ${edu.color} hover:opacity-70`}>
                    {expandedArt === idx ? "Read less ▲" : "Read more ▼"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ SOCIAL ════ */}
        {tab === "social" && (
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Add Friends & Family</h3>
              <div className="flex gap-3">
                <input value={friendInput} onChange={e => setFriendInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addFriend()}
                  placeholder="Enter name or email..." className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
                <button onClick={addFriend} className="bg-lime-400 text-black font-bold px-5 rounded-xl hover:bg-lime-300 transition">Invite</button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Share Your Progress</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label:"BMI",         value: bmiResult ? bmiResult.val : "--",        icon:"⚖️" },
                  { label:"Steps Today", value: todaySteps.toLocaleString(),              icon:"👟" },
                  { label:"Day Streak",  value: "12 🔥",                                  icon:"🏆" },
                ].map(s => (
                  <div key={s.label} className="text-center bg-gray-900 rounded-xl p-3">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              {shareMsg && <p className="text-lime-400 text-sm mb-3 font-medium">{shareMsg}</p>}
              <button onClick={() => { setShareMsg("Progress shared! 🎉"); setTimeout(() => setShareMsg(""), 3000); }}
                className="w-full bg-lime-400 text-black font-bold py-2.5 rounded-xl hover:bg-lime-300 transition">
                Share Progress with Friends
              </button>
            </div>

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
                </div>
              ))}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Friend Activity</h3>
              {[
                { name:"Alex",  action:"completed a 5km run",       time:"2 hrs ago",     icon:"🏃" },
                { name:"Sarah", action:"hit their water goal",       time:"4 hrs ago",     icon:"💧" },
                { name:"Mom",   action:"logged 8 hours of sleep",    time:"This morning",  icon:"😴" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-700 last:border-0">
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm"><span className={`font-bold ${ageGroupColors[ageGroup]}`}>{a.name}</span> {a.action}</p>
                    <p className="text-gray-500 text-xs">{a.time}</p>
                  </div>
                  <button className="text-gray-400 text-sm hover:text-white transition">👏</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PODCASTS ════ */}
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
              <h3 className="font-bold mb-3">Recommended for <span className={ageGroupColors[ageGroup]}>{edu.label}</span></h3>
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

        {/* ════ PROFILE ════ */}
        {tab === "profile" && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-black font-black text-2xl">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold">{user?.name || "User"}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className={`text-xs mt-1 ${ageGroupColors[ageGroup]}`}>{ageGroupLabels[ageGroup]}</p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold">Health Profile</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-gray-400 text-xs mb-1 block">Age</label>
                  <input type="number" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age:e.target.value})} className={inputCls} /></div>
                <div><label className="text-gray-400 text-xs mb-1 block">Gender</label>
                  <select value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender:e.target.value})} className={inputCls + " cursor-pointer"}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select></div>
                <div><label className="text-gray-400 text-xs mb-1 block">Height (cm)</label>
                  <input type="number" value={profileForm.height} onChange={e => setProfileForm({...profileForm, height:e.target.value})} className={inputCls} /></div>
                <div><label className="text-gray-400 text-xs mb-1 block">Weight (kg)</label>
                  <input type="number" value={profileForm.weight} onChange={e => setProfileForm({...profileForm, weight:e.target.value})} className={inputCls} /></div>
              </div>
              <div><label className="text-gray-400 text-xs mb-1 block">Activity Level</label>
                <select value={profileForm.activityLevel} onChange={e => setProfileForm({...profileForm, activityLevel:e.target.value})} className={inputCls + " cursor-pointer"}>
                  {["Sedentary","Lightly Active","Moderately Active","Very Active","Athlete"].map(l => <option key={l}>{l}</option>)}
                </select></div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Food Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {["Vegan","Vegetarian","Pescatarian","Gluten-Free","Dairy-Free","Keto","Low-Carb","High-Protein"].map(p => (
                  <button key={p} onClick={() => togglePref("foodPrefs", p)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${profileForm.foodPrefs.includes(p) ? "bg-lime-400 text-black border-lime-400 font-bold" : "border-gray-600 text-gray-300 hover:border-lime-400/50"}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Health Goals</h3>
              <div className="flex flex-wrap gap-2">
                {["Weight Loss","Muscle Gain","Maintain Weight","Improve Fitness","Better Sleep","Stress Reduction"].map(g => (
                  <button key={g} onClick={() => togglePref("healthGoals", g)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${profileForm.healthGoals.includes(g) ? "bg-lime-400 text-black border-lime-400 font-bold" : "border-gray-600 text-gray-300 hover:border-lime-400/50"}`}>{g}</button>
                ))}
              </div>
            </div>

            {profileSaved && <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3 text-lime-300 font-medium text-sm">✅ Profile saved! Your stats will update across the dashboard.</div>}
            <button onClick={saveProfile} className="w-full bg-lime-400 text-black font-black py-3 rounded-xl hover:bg-lime-300 transition">Save Profile</button>
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 border-t border-gray-800 flex justify-around py-2 z-50 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition shrink-0 ${tab === t.id ? "text-lime-400" : "text-gray-500"}`}>
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs mt-0.5">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
