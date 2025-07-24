const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: './apps/web/.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initial exercises data
const exercises = [
  // Chest exercises
  {
    name: 'Push-ups',
    muscleGroup: 'CHEST',
    equipment: [],
    instructions: 'Start in a plank position with hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor, then push back up.',
    userId: 'system', // Shared exercises owned by system
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bench Press',
    muscleGroup: 'CHEST',
    equipment: ['Barbell', 'Bench'],
    instructions: 'Lie on a bench with feet flat on the ground. Grip the barbell slightly wider than shoulder width and lower it to your chest, then press it back up.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dumbbell Flyes',
    muscleGroup: 'CHEST',
    equipment: ['Dumbbells', 'Bench'],
    instructions: 'Lie on a bench with dumbbells held above your chest. Lower the weights in an arc motion, then return to the starting position.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Back exercises
  {
    name: 'Pull-ups',
    muscleGroup: 'BACK',
    equipment: ['Pull-up bar'],
    instructions: 'Hang from a pull-up bar with hands slightly wider than shoulders. Pull your body up until your chin is over the bar, then lower back down.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bent-over Rows',
    muscleGroup: 'BACK',
    equipment: ['Barbell'],
    instructions: 'Stand with feet shoulder-width apart, bend at the waist, and hold a barbell. Pull the bar up to your lower chest, then lower it back down.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lat Pulldowns',
    muscleGroup: 'BACK',
    equipment: ['Cable machine'],
    instructions: 'Sit at a lat pulldown machine and grip the bar. Pull the bar down to your upper chest, then slowly return to the starting position.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Shoulder exercises
  {
    name: 'Overhead Press',
    muscleGroup: 'SHOULDERS',
    equipment: ['Barbell'],
    instructions: 'Stand with feet shoulder-width apart and hold a barbell at shoulder level. Press the bar overhead until your arms are fully extended.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lateral Raises',
    muscleGroup: 'SHOULDERS',
    equipment: ['Dumbbells'],
    instructions: 'Stand with dumbbells at your sides. Raise the weights out to the sides until they are at shoulder level, then lower them back down.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Bicep exercises
  {
    name: 'Bicep Curls',
    muscleGroup: 'BICEPS',
    equipment: ['Dumbbells'],
    instructions: 'Stand with dumbbells at your sides. Curl the weights up toward your shoulders, then lower them back down.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Hammer Curls',
    muscleGroup: 'BICEPS',
    equipment: ['Dumbbells'],
    instructions: 'Hold dumbbells with palms facing each other. Curl the weights up while maintaining the neutral grip position.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Tricep exercises
  {
    name: 'Tricep Dips',
    muscleGroup: 'TRICEPS',
    equipment: ['Dip bars'],
    instructions: 'Support yourself on dip bars with arms extended. Lower your body by bending your elbows, then push back up.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Skull Crushers',
    muscleGroup: 'TRICEPS',
    equipment: ['Barbell', 'Bench'],
    instructions: 'Lie on a bench and hold a barbell above your chest. Lower the bar toward your forehead, then extend your arms back up.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Leg exercises
  {
    name: 'Squats',
    muscleGroup: 'LEGS',
    equipment: [],
    instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair, then stand back up.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Deadlifts',
    muscleGroup: 'LEGS',
    equipment: ['Barbell'],
    instructions: 'Stand with feet shoulder-width apart and a barbell on the ground. Bend at the hips and knees to grip the bar, then stand up straight.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lunges',
    muscleGroup: 'LEGS',
    equipment: [],
    instructions: 'Step forward with one leg and lower your body until both knees are bent at 90 degrees. Push back to the starting position.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Core exercises
  {
    name: 'Plank',
    muscleGroup: 'CORE',
    equipment: [],
    instructions: 'Hold a plank position with your body in a straight line from head to heels. Keep your core engaged and breathe steadily.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Crunches',
    muscleGroup: 'CORE',
    equipment: [],
    instructions: 'Lie on your back with knees bent. Lift your shoulders off the ground using your abdominal muscles, then lower back down.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Russian Twists',
    muscleGroup: 'CORE',
    equipment: [],
    instructions: 'Sit on the ground with knees bent and feet off the floor. Rotate your torso from side to side while keeping your core engaged.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Cardio exercises
  {
    name: 'Running',
    muscleGroup: 'CARDIO',
    equipment: [],
    instructions: 'Run at a steady pace, maintaining good form with arms relaxed and feet landing mid-foot.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cycling',
    muscleGroup: 'CARDIO',
    equipment: ['Bicycle'],
    instructions: 'Pedal at a consistent cadence, maintaining proper posture and engaging your leg muscles.',
    userId: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedExercises() {
  try {
    console.log('Starting exercise seeding...');
    
    // Check if exercises already exist
    const existingExercises = await getDocs(collection(db, 'exercises'));
    if (!existingExercises.empty) {
      console.log('Exercises already exist in the database. Skipping seeding.');
      return;
    }

    // Add exercises to Firestore
    const exercisesRef = collection(db, 'exercises');
    const promises = exercises.map(exercise => addDoc(exercisesRef, exercise));
    
    await Promise.all(promises);
    
    console.log(`Successfully seeded ${exercises.length} exercises to the database!`);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedExercises(); 