// src/components/MoodCards.jsx
import React from "react";

export const moods = [
  { name: "Happy", image: "/assets/moods/moodcards_happy.webp", category: "Joy" },
  { name: "Chill", image: "/assets/moods/moodcards_chill.webp", category: "Relax" },
  { name: "Sad", image: "/assets/moods/moodcards_sad.webp", category: "Sad" },
  { name: "Focus", image: "/assets/moods/moodcards_focus.webp", category: "Study" },
  { name: "Energy", image: "/assets/moods/moodcards_energy.webp", category: "Workout" },
  { name: "Love", image: "/assets/moods/moodcards_love.webp", category: "Romance" },
  { name: "Party", image: "/assets/moods/moodcards_party.webp", category: "Fun" },
  { name: "Calm", image: "/assets/moods/moodcards_calm.webp", category: "Relax" },
  { name: "Motivation", image: "/assets/moods/moodcards_motivation.webp", category: "Workout" },
  { name: "Sleepy", image: "/assets/moods/moodcards_sleepy.webp", category: "Chill" },
  { name: "Epic", image: "/assets/moods/moodcards_epic.webp", category: "Adventure" },
  { name: "Romantic", image: "/assets/moods/moodcards_romantic.webp", category: "Romance" },
  { name: "Melancholic", image: "/assets/moods/moodcards_melancholic.webp", category: "Sad" },
  { name: "Summer", image: "/assets/moods/moodcards_summer.webp", category: "Joy" },
  { name: "Winter", image: "/assets/moods/moodcards_winter.webp", category: "Chill" },
  { name: "Nature", image: "/assets/moods/moodcards_nature.webp", category: "Relax" },
  { name: "Workout", image: "/assets/moods/moodcards_workout.webp", category: "Workout" },
  { name: "Gaming", image: "/assets/moods/moodcards_gaming.webp", category: "Fun" },
  { name: "Happy Vibes", image: "/assets/moods/moodcards_happyvibes.webp", category: "Joy" },
  { name: "Late Night", image: "/assets/moods/moodcards_latenight.webp", category: "Chill" },
  { name: "Morning", image: "/assets/moods/moodcards_morning.webp", category: "Joy" },
  { name: "Drive", image: "/assets/moods/moodcards_drive.webp", category: "Adventure" },
  { name: "Mystery", image: "/assets/moods/moodcards_mystery.webp", category: "Adventure" },
  { name: "Relaxing Piano", image: "/assets/moods/moodcards_piano.webp", category: "Relax" },
  { name: "Rock", image: "/assets/moods/moodcards_rock.webp", category: "Fun" },
  { name: "Indie", image: "/assets/moods/moodcards_indie.webp", category: "Chill" },
  { name: "Classical", image: "/assets/moods/moodcards_classical.webp", category: "Study" },
  { name: "Jazz", image: "/assets/moods/moodcards_jazz.webp", category: "Relax" },
  { name: "Electronic", image: "/assets/moods/moodcards_electronic.webp", category: "Fun" },
  { name: "Meditation", image: "/assets/moods/moodcards_meditation.webp", category: "Relax" }
];

function MoodCards({ onSelectMood, selectedCategory, selectedMood }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  const filteredMoods = selectedCategory
    ? moods.filter((m) => m.category === selectedCategory)
    : moods;

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6 px-4">
      {filteredMoods.map((mood, i) => (
        <div
          key={i}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          onClick={() => onSelectMood(mood.name)}
          className={`relative w-40 sm:w-52 h-64 sm:h-80 rounded-2xl cursor-pointer overflow-hidden
                     shadow-[0_0_25px_#a855f7aa] hover:shadow-[0_0_50px_#c084fc]
                     bg-gradient-to-br from-neon-purple to-neon-dark
                     transition-transform duration-150 ease-out transform-gpu ${
                       selectedMood === mood.name
                         ? "ring-4 ring-neon-glow shadow-[0_0_50px_#c084fc]"
                         : ""
                     }`}
        >
          <img
            src={mood.image}
            alt={mood.name}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-sm rounded-b-2xl flex flex-col items-center">
            <h2 className="text-white text-lg sm:text-2xl font-bold drop-shadow-lg tracking-wide">
              {mood.name}
            </h2>
            <span className="text-neon-purple/80 font-semibold drop-shadow-md text-xs sm:text-sm mt-1">
              {mood.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoodCards;
