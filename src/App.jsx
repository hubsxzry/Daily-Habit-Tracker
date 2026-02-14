import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const characters = [
  {
    name: "Tanjiro",
    unlock: 1,
    img: "https://images.alphacoders.com/100/1008474.jpg",
    sound: "https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3",
    quotes: [
      "Keep breathing. Keep moving.",
      "Small steps matter.",
      "You are becoming stronger."
    ]
  },
  {
    name: "Inosuke",
    unlock: 3,
    img: "https://images.alphacoders.com/104/1049895.jpg",
    sound: "https://www.myinstants.com/media/sounds/punch.mp3",
    quotes: [
      "HAHA! TOO EASY!",
      "NEXT TASK!",
      "DON’T GET WEAK!"
    ]
  },
  {
    name: "Rengoku",
    unlock: 5,
    img: "https://images.alphacoders.com/110/1100905.jpg",
    sound: "https://www.myinstants.com/media/sounds/fire.mp3",
    quotes: [
      "SET YOUR HEART ABLAZE!",
      "Magnificent effort!",
      "Honor your potential!"
    ]
  }
];

export default function App() {
  const [month, setMonth] = useState(0);
  const [days, setDays] = useState([]);
  const [xp, setXp] = useState(() =>
    parseInt(localStorage.getItem("xp") || 0)
  );
  const [popup, setPopup] = useState(null);

  const level = Math.floor(xp / 200) + 1;

  useEffect(() => {
    generateDays(month);
  }, [month]);

  const generateDays = (m) => {
    const total = new Date(2026, m + 1, 0).getDate();
    const saved = JSON.parse(localStorage.getItem("month" + m)) || [];
    setDays(Array.from({ length: total }, (_, i) => saved[i] || false));
  };

  const toggleDay = (index) => {
    const updated = [...days];
    updated[index] = !updated[index];
    setDays(updated);
    localStorage.setItem("month" + month, JSON.stringify(updated));

    if (updated[index]) {
      const newXP = xp + 10;
      setXp(newXP);
      localStorage.setItem("xp", newXP);
      triggerCharacter(newXP);
    }
  };

  const triggerCharacter = (currentXP) => {
    const currentLevel = Math.floor(currentXP / 200) + 1;
    const unlocked = characters.filter(c => currentLevel >= c.unlock);
    const chosen = unlocked[Math.floor(Math.random() * unlocked.length)];
    const quote = chosen.quotes[Math.floor(Math.random() * chosen.quotes.length)];

    new Audio(chosen.sound).play();
    setPopup({ ...chosen, quote });
    setTimeout(() => setPopup(null), 4000);
  };

  const completed = days.filter(d => d).length;
  const percent = days.length ? (completed / days.length) * 100 : 0;

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        ⚔ Demon Slayer Productivity ⚔
      </h1>

      <div className="text-center mb-4 text-lg">
        XP: {xp} | Level: {level}
      </div>

      <div className="w-full bg-white/20 h-4 rounded-full mb-6">
        <div
          className="bg-emerald-400 h-4 rounded-full transition-all"
          style={{ width: percent + "%" }}
        />
      </div>

      <div className="flex justify-center mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="text-black p-2 rounded-xl"
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {days.map((checked, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            className="bg-white/10 backdrop-blur-lg p-3 rounded-xl text-center"
          >
            <div>Day {i + 1}</div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleDay(i)}
              className="scale-150 mt-2"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl mb-3">Weekly Stats</h2>
        {[0,1,2,3,4].map(week => {
          const start = week*7;
          const weekDays = days.slice(start,start+7);
          const weekCompleted = weekDays.filter(d=>d).length;
          const weekPercent = weekDays.length ? (weekCompleted/weekDays.length)*100 : 0;
          return (
            <div key={week} className="mb-3">
              Week {week+1}
              <div className="w-full bg-white/20 h-3 rounded-full">
                <div
                  className="bg-pink-400 h-3 rounded-full"
                  style={{width: weekPercent+"%"}}
                />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 right-10 bg-black/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-xs"
          >
            <img src={popup.img} className="rounded-xl mb-3" />
            <h2 className="font-bold">{popup.name}</h2>
            <p className="mt-2">{popup.quote}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
