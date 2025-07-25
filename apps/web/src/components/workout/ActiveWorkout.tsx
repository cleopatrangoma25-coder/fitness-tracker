import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@fitness-tracker/ui';
import { useWorkoutStore, useAuthStore } from '@fitness-tracker/store';
import { WorkoutService } from '../../lib/workout';
import { WorkoutTemplates, type WorkoutTemplate } from './WorkoutTemplates';
import { RestTimer } from './RestTimer';
import { ExerciseInstructions } from './ExerciseInstructions';
import { ExerciseTimer } from './ExerciseTimer';
import { useNotifications } from '../../hooks/useNotifications';
import type { Workout, Exercise } from '@fitness-tracker/shared';


export const ActiveWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { addWorkout, updateWorkout, currentWorkout, setCurrentWorkout } = useWorkoutStore();
  const { user } = useAuthStore();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('ALL');

  // Load exercises from database
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await WorkoutService.getExercises();
        // If no exercises in database, use fallback
        if (exercises.length === 0) {
          console.log('No exercises in database, using comprehensive fallback exercises');
          const fallbackExercises: Exercise[] = [
            // CHEST EXERCISES (8 exercises)
            { id: '1', name: 'Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Start in plank position, lower chest to ground, push back up', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Bench Press', muscleGroup: 'CHEST', equipment: ['Barbell', 'Bench'], instructions: 'Lie on bench, lower bar to chest, press up', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', name: 'Dumbbell Flyes', muscleGroup: 'CHEST', equipment: ['Dumbbells', 'Bench'], instructions: 'Lie on bench, lower dumbbells in arc motion', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', name: 'Incline Bench Press', muscleGroup: 'CHEST', equipment: ['Barbell', 'Incline Bench'], instructions: 'Lie on incline bench, press bar from upper chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', name: 'Dumbbell Press', muscleGroup: 'CHEST', equipment: ['Dumbbells', 'Bench'], instructions: 'Lie on bench, press dumbbells up from chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', name: 'Decline Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Feet elevated push-ups for lower chest focus', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', name: 'Diamond Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Hands in diamond shape, focus on triceps and inner chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '8', name: 'Wide Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Hands wider than shoulders for outer chest focus', createdAt: new Date(), updatedAt: new Date() },
            
            // BACK EXERCISES (8 exercises)
            { id: '9', name: 'Pull-ups', muscleGroup: 'BACK', equipment: ['Pull-up bar'], instructions: 'Hang from bar, pull body up until chin over bar', createdAt: new Date(), updatedAt: new Date() },
            { id: '10', name: 'Bent-over Rows', muscleGroup: 'BACK', equipment: ['Barbell'], instructions: 'Bend at waist, pull bar to lower chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '11', name: 'Lat Pulldowns', muscleGroup: 'BACK', equipment: ['Cable machine'], instructions: 'Pull bar down to upper chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '12', name: 'Chin-ups', muscleGroup: 'BACK', equipment: ['Pull-up bar'], instructions: 'Pull-ups with underhand grip, focus on biceps', createdAt: new Date(), updatedAt: new Date() },
            { id: '13', name: 'Single-Arm Rows', muscleGroup: 'BACK', equipment: ['Dumbbell'], instructions: 'Bend over, row dumbbell to hip, alternate arms', createdAt: new Date(), updatedAt: new Date() },
            { id: '14', name: 'T-Bar Rows', muscleGroup: 'BACK', equipment: ['T-Bar machine'], instructions: 'Stand over T-bar, pull handles to chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '15', name: 'Face Pulls', muscleGroup: 'BACK', equipment: ['Cable machine'], instructions: 'Pull rope to face, focus on rear delts', createdAt: new Date(), updatedAt: new Date() },
            { id: '16', name: 'Reverse Flyes', muscleGroup: 'BACK', equipment: ['Dumbbells'], instructions: 'Bend over, raise dumbbells out to sides', createdAt: new Date(), updatedAt: new Date() },
            
            // SHOULDER EXERCISES (6 exercises)
            { id: '17', name: 'Overhead Press', muscleGroup: 'SHOULDERS', equipment: ['Barbell'], instructions: 'Press barbell overhead until arms extended', createdAt: new Date(), updatedAt: new Date() },
            { id: '18', name: 'Lateral Raises', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Raise dumbbells out to sides to shoulder level', createdAt: new Date(), updatedAt: new Date() },
            { id: '19', name: 'Front Raises', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Raise dumbbells forward to shoulder level', createdAt: new Date(), updatedAt: new Date() },
            { id: '20', name: 'Arnold Press', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Rotate dumbbells as you press overhead', createdAt: new Date(), updatedAt: new Date() },
            { id: '21', name: 'Upright Rows', muscleGroup: 'SHOULDERS', equipment: ['Barbell'], instructions: 'Pull bar up to chin, elbows high', createdAt: new Date(), updatedAt: new Date() },
            { id: '22', name: 'Pike Push-ups', muscleGroup: 'SHOULDERS', equipment: [], instructions: 'Handstand position push-ups for shoulders', createdAt: new Date(), updatedAt: new Date() },
            
            // BICEP EXERCISES (6 exercises)
            { id: '23', name: 'Bicep Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells'], instructions: 'Curl dumbbells up toward shoulders', createdAt: new Date(), updatedAt: new Date() },
            { id: '24', name: 'Hammer Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells'], instructions: 'Curl with palms facing each other', createdAt: new Date(), updatedAt: new Date() },
            { id: '25', name: 'Concentration Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbell'], instructions: 'Sit, rest elbow on thigh, curl dumbbell', createdAt: new Date(), updatedAt: new Date() },
            { id: '26', name: 'Preacher Curls', muscleGroup: 'BICEPS', equipment: ['Barbell', 'Preacher bench'], instructions: 'Curl on preacher bench for strict form', createdAt: new Date(), updatedAt: new Date() },
            { id: '27', name: 'Cable Curls', muscleGroup: 'BICEPS', equipment: ['Cable machine'], instructions: 'Curl cable attachment for constant tension', createdAt: new Date(), updatedAt: new Date() },
            { id: '28', name: 'Incline Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells', 'Incline bench'], instructions: 'Curl on incline bench for full stretch', createdAt: new Date(), updatedAt: new Date() },
            
            // TRICEP EXERCISES (6 exercises)
            { id: '29', name: 'Tricep Dips', muscleGroup: 'TRICEPS', equipment: ['Dip bars'], instructions: 'Support on dip bars, lower body by bending elbows', createdAt: new Date(), updatedAt: new Date() },
            { id: '30', name: 'Skull Crushers', muscleGroup: 'TRICEPS', equipment: ['Barbell', 'Bench'], instructions: 'Lower bar toward forehead, extend arms back up', createdAt: new Date(), updatedAt: new Date() },
            { id: '31', name: 'Tricep Pushdowns', muscleGroup: 'TRICEPS', equipment: ['Cable machine'], instructions: 'Push cable down, focus on tricep contraction', createdAt: new Date(), updatedAt: new Date() },
            { id: '32', name: 'Overhead Extensions', muscleGroup: 'TRICEPS', equipment: ['Dumbbell'], instructions: 'Extend dumbbell overhead behind head', createdAt: new Date(), updatedAt: new Date() },
            { id: '33', name: 'Diamond Push-ups', muscleGroup: 'TRICEPS', equipment: [], instructions: 'Hands in diamond shape, focus on triceps', createdAt: new Date(), updatedAt: new Date() },
            { id: '34', name: 'Close-Grip Bench Press', muscleGroup: 'TRICEPS', equipment: ['Barbell', 'Bench'], instructions: 'Bench press with hands close together', createdAt: new Date(), updatedAt: new Date() },
            
            // LEG EXERCISES (8 exercises)
            { id: '35', name: 'Squats', muscleGroup: 'LEGS', equipment: [], instructions: 'Stand with feet shoulder-width, lower as if sitting back', createdAt: new Date(), updatedAt: new Date() },
            { id: '36', name: 'Deadlifts', muscleGroup: 'LEGS', equipment: ['Barbell'], instructions: 'Stand with barbell on ground, bend and grip, stand up straight', createdAt: new Date(), updatedAt: new Date() },
            { id: '37', name: 'Lunges', muscleGroup: 'LEGS', equipment: [], instructions: 'Step forward, lower until both knees bent at 90 degrees', createdAt: new Date(), updatedAt: new Date() },
            { id: '38', name: 'Leg Press', muscleGroup: 'LEGS', equipment: ['Leg press machine'], instructions: 'Sit in machine, press weight away with legs', createdAt: new Date(), updatedAt: new Date() },
            { id: '39', name: 'Jump Squats', muscleGroup: 'LEGS', equipment: [], instructions: 'Squat down, explode up into jump, land softly', createdAt: new Date(), updatedAt: new Date() },
            { id: '40', name: 'Bulgarian Split Squats', muscleGroup: 'LEGS', equipment: ['Dumbbells'], instructions: 'Back foot on bench, squat with front leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '41', name: 'Romanian Deadlifts', muscleGroup: 'LEGS', equipment: ['Barbell'], instructions: 'Hip hinge movement, bar slides down legs', createdAt: new Date(), updatedAt: new Date() },
            { id: '42', name: 'Calf Raises', muscleGroup: 'LEGS', equipment: [], instructions: 'Stand on edge, raise heels up and down', createdAt: new Date(), updatedAt: new Date() },
            
            // GLUTES EXERCISES (8 exercises)
            { id: '43', name: 'Glute Bridges', muscleGroup: 'GLUTES', equipment: [], instructions: 'Lie on back, lift hips up, squeeze glutes', createdAt: new Date(), updatedAt: new Date() },
            { id: '44', name: 'Single-Leg Glute Bridges', muscleGroup: 'GLUTES', equipment: [], instructions: 'Glute bridge with one leg extended, focus on glute activation', createdAt: new Date(), updatedAt: new Date() },
            { id: '45', name: 'Hip Thrusts', muscleGroup: 'GLUTES', equipment: ['Barbell'], instructions: 'Sit on ground, barbell on hips, thrust hips up', createdAt: new Date(), updatedAt: new Date() },
            { id: '46', name: 'Donkey Kicks', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, kick one leg up toward ceiling', createdAt: new Date(), updatedAt: new Date() },
            { id: '47', name: 'Fire Hydrants', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, lift leg out to side like a dog', createdAt: new Date(), updatedAt: new Date() },
            { id: '48', name: 'Clamshells', muscleGroup: 'GLUTES', equipment: [], instructions: 'Lie on side, knees bent, open and close legs like a clam', createdAt: new Date(), updatedAt: new Date() },
            { id: '49', name: 'Glute Kickbacks', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, kick leg back and up', createdAt: new Date(), updatedAt: new Date() },
            { id: '50', name: 'Sumo Squats', muscleGroup: 'GLUTES', equipment: [], instructions: 'Wide stance squats, focus on glute activation', createdAt: new Date(), updatedAt: new Date() },
            
            // HIPS EXERCISES (6 exercises)
            { id: '51', name: 'Hip Flexor Stretches', muscleGroup: 'HIPS', equipment: [], instructions: 'Kneel, lunge forward, feel stretch in front of hip', createdAt: new Date(), updatedAt: new Date() },
            { id: '52', name: 'Hip Circles', muscleGroup: 'HIPS', equipment: [], instructions: 'Stand, make circles with hips, both directions', createdAt: new Date(), updatedAt: new Date() },
            { id: '53', name: 'Hip Abductions', muscleGroup: 'HIPS', equipment: [], instructions: 'Lie on side, lift top leg up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '54', name: 'Hip Adductions', muscleGroup: 'HIPS', equipment: [], instructions: 'Lie on side, lift bottom leg up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '55', name: 'Hip Hinges', muscleGroup: 'HIPS', equipment: [], instructions: 'Stand, hinge at hips, keep back straight', createdAt: new Date(), updatedAt: new Date() },
            { id: '56', name: 'Lateral Lunges', muscleGroup: 'HIPS', equipment: [], instructions: 'Step to side, lunge, feel stretch in inner thigh', createdAt: new Date(), updatedAt: new Date() },
            
            // TUMMY EXERCISES (8 exercises)
            { id: '57', name: 'Crunches', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, lift shoulders off ground using abs', createdAt: new Date(), updatedAt: new Date() },
            { id: '58', name: 'Bicycle Crunches', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, alternate elbow to opposite knee', createdAt: new Date(), updatedAt: new Date() },
            { id: '59', name: 'Leg Raises', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, raise legs up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '60', name: 'Russian Twists', muscleGroup: 'TUMMY', equipment: [], instructions: 'Sit with feet off floor, rotate torso side to side', createdAt: new Date(), updatedAt: new Date() },
            { id: '61', name: 'Mountain Climbers', muscleGroup: 'TUMMY', equipment: [], instructions: 'In plank position, alternate bringing knees to chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '62', name: 'Plank to Downward Dog', muscleGroup: 'TUMMY', equipment: [], instructions: 'From plank, lift hips up and back', createdAt: new Date(), updatedAt: new Date() },
            { id: '63', name: 'Dead Bug', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, extend opposite arm and leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '64', name: 'Scissor Kicks', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, alternate lifting legs up and down', createdAt: new Date(), updatedAt: new Date() },
            
            // CORE EXERCISES (8 exercises)
            { id: '65', name: 'Plank', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank position with body in straight line', createdAt: new Date(), updatedAt: new Date() },
            { id: '66', name: 'Side Plank', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank on side, body in straight line', createdAt: new Date(), updatedAt: new Date() },
            { id: '67', name: 'Superman Holds', muscleGroup: 'CORE', equipment: [], instructions: 'Lie on stomach, lift chest and legs off ground', createdAt: new Date(), updatedAt: new Date() },
            { id: '68', name: 'Bird Dog', muscleGroup: 'CORE', equipment: [], instructions: 'On hands and knees, extend opposite arm and leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '69', name: 'Pallof Press', muscleGroup: 'CORE', equipment: ['Cable machine'], instructions: 'Stand sideways to cable, press weight out and back', createdAt: new Date(), updatedAt: new Date() },
            { id: '70', name: 'Anti-Rotation Press', muscleGroup: 'CORE', equipment: ['Cable machine'], instructions: 'Stand sideways to cable, resist rotation', createdAt: new Date(), updatedAt: new Date() },
            { id: '71', name: 'Plank with Leg Lift', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank, lift one leg up and hold', createdAt: new Date(), updatedAt: new Date() },
            { id: '72', name: 'Plank with Arm Reach', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank, reach one arm forward', createdAt: new Date(), updatedAt: new Date() },
            
            // CARDIO EXERCISES (6 exercises)
            { id: '73', name: 'Running', muscleGroup: 'CARDIO', equipment: [], instructions: 'Run at steady pace with good form', createdAt: new Date(), updatedAt: new Date() },
            { id: '74', name: 'Cycling', muscleGroup: 'CARDIO', equipment: ['Bicycle'], instructions: 'Pedal at consistent cadence', createdAt: new Date(), updatedAt: new Date() },
            { id: '75', name: 'Burpees', muscleGroup: 'CARDIO', equipment: [], instructions: 'Squat, jump back to plank, jump forward, jump up', createdAt: new Date(), updatedAt: new Date() },
            { id: '76', name: 'Jump Rope', muscleGroup: 'CARDIO', equipment: ['Jump rope'], instructions: 'Skip rope with consistent rhythm', createdAt: new Date(), updatedAt: new Date() },
            { id: '77', name: 'High Knees', muscleGroup: 'CARDIO', equipment: [], instructions: 'Run in place, bring knees up high', createdAt: new Date(), updatedAt: new Date() },
            { id: '78', name: 'Box Jumps', muscleGroup: 'CARDIO', equipment: ['Box'], instructions: 'Jump onto box, step down, repeat', createdAt: new Date(), updatedAt: new Date() },
          ];
          setAvailableExercises(fallbackExercises);
        } else {
          setAvailableExercises(exercises);
        }
      } catch (error) {
        console.error('Failed to load exercises:', error);
        // Fallback to comprehensive exercise library if database fails
        const fallbackExercises: Exercise[] = [
          // CHEST EXERCISES (8 exercises)
          { id: '1', name: 'Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Start in plank position, lower chest to ground, push back up', createdAt: new Date(), updatedAt: new Date() },
          { id: '2', name: 'Bench Press', muscleGroup: 'CHEST', equipment: ['Barbell', 'Bench'], instructions: 'Lie on bench, lower bar to chest, press up', createdAt: new Date(), updatedAt: new Date() },
          { id: '3', name: 'Dumbbell Flyes', muscleGroup: 'CHEST', equipment: ['Dumbbells', 'Bench'], instructions: 'Lie on bench, lower dumbbells in arc motion', createdAt: new Date(), updatedAt: new Date() },
          { id: '4', name: 'Incline Bench Press', muscleGroup: 'CHEST', equipment: ['Barbell', 'Incline Bench'], instructions: 'Lie on incline bench, press bar from upper chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '5', name: 'Dumbbell Press', muscleGroup: 'CHEST', equipment: ['Dumbbells', 'Bench'], instructions: 'Lie on bench, press dumbbells up from chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '6', name: 'Decline Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Feet elevated push-ups for lower chest focus', createdAt: new Date(), updatedAt: new Date() },
          { id: '7', name: 'Diamond Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Hands in diamond shape, focus on triceps and inner chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '8', name: 'Wide Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Hands wider than shoulders for outer chest focus', createdAt: new Date(), updatedAt: new Date() },
          
          // BACK EXERCISES (8 exercises)
          { id: '9', name: 'Pull-ups', muscleGroup: 'BACK', equipment: ['Pull-up bar'], instructions: 'Hang from bar, pull body up until chin over bar', createdAt: new Date(), updatedAt: new Date() },
          { id: '10', name: 'Bent-over Rows', muscleGroup: 'BACK', equipment: ['Barbell'], instructions: 'Bend at waist, pull bar to lower chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '11', name: 'Lat Pulldowns', muscleGroup: 'BACK', equipment: ['Cable machine'], instructions: 'Pull bar down to upper chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '12', name: 'Chin-ups', muscleGroup: 'BACK', equipment: ['Pull-up bar'], instructions: 'Pull-ups with underhand grip, focus on biceps', createdAt: new Date(), updatedAt: new Date() },
          { id: '13', name: 'Single-Arm Rows', muscleGroup: 'BACK', equipment: ['Dumbbell'], instructions: 'Bend over, row dumbbell to hip, alternate arms', createdAt: new Date(), updatedAt: new Date() },
          { id: '14', name: 'T-Bar Rows', muscleGroup: 'BACK', equipment: ['T-Bar machine'], instructions: 'Stand over T-bar, pull handles to chest', createdAt: new Date(), updatedAt: new Date() },
          { id: '15', name: 'Face Pulls', muscleGroup: 'BACK', equipment: ['Cable machine'], instructions: 'Pull rope to face, focus on rear delts', createdAt: new Date(), updatedAt: new Date() },
          { id: '16', name: 'Reverse Flyes', muscleGroup: 'BACK', equipment: ['Dumbbells'], instructions: 'Bend over, raise dumbbells out to sides', createdAt: new Date(), updatedAt: new Date() },
          
          // SHOULDER EXERCISES (6 exercises)
          { id: '17', name: 'Overhead Press', muscleGroup: 'SHOULDERS', equipment: ['Barbell'], instructions: 'Press barbell overhead until arms extended', createdAt: new Date(), updatedAt: new Date() },
          { id: '18', name: 'Lateral Raises', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Raise dumbbells out to sides to shoulder level', createdAt: new Date(), updatedAt: new Date() },
          { id: '19', name: 'Front Raises', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Raise dumbbells forward to shoulder level', createdAt: new Date(), updatedAt: new Date() },
          { id: '20', name: 'Arnold Press', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Rotate dumbbells as you press overhead', createdAt: new Date(), updatedAt: new Date() },
          { id: '21', name: 'Upright Rows', muscleGroup: 'SHOULDERS', equipment: ['Barbell'], instructions: 'Pull bar up to chin, elbows high', createdAt: new Date(), updatedAt: new Date() },
          { id: '22', name: 'Pike Push-ups', muscleGroup: 'SHOULDERS', equipment: [], instructions: 'Handstand position push-ups for shoulders', createdAt: new Date(), updatedAt: new Date() },
          
          // BICEP EXERCISES (6 exercises)
          { id: '23', name: 'Bicep Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells'], instructions: 'Curl dumbbells up toward shoulders', createdAt: new Date(), updatedAt: new Date() },
          { id: '24', name: 'Hammer Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells'], instructions: 'Curl with palms facing each other', createdAt: new Date(), updatedAt: new Date() },
          { id: '25', name: 'Concentration Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbell'], instructions: 'Sit, rest elbow on thigh, curl dumbbell', createdAt: new Date(), updatedAt: new Date() },
          { id: '26', name: 'Preacher Curls', muscleGroup: 'BICEPS', equipment: ['Barbell', 'Preacher bench'], instructions: 'Curl on preacher bench for strict form', createdAt: new Date(), updatedAt: new Date() },
          { id: '27', name: 'Cable Curls', muscleGroup: 'BICEPS', equipment: ['Cable machine'], instructions: 'Curl cable attachment for constant tension', createdAt: new Date(), updatedAt: new Date() },
          { id: '28', name: 'Incline Curls', muscleGroup: 'BICEPS', equipment: ['Dumbbells', 'Incline bench'], instructions: 'Curl on incline bench for full stretch', createdAt: new Date(), updatedAt: new Date() },
          
          // TRICEP EXERCISES (6 exercises)
          { id: '29', name: 'Tricep Dips', muscleGroup: 'TRICEPS', equipment: ['Dip bars'], instructions: 'Support on dip bars, lower body by bending elbows', createdAt: new Date(), updatedAt: new Date() },
          { id: '30', name: 'Skull Crushers', muscleGroup: 'TRICEPS', equipment: ['Barbell', 'Bench'], instructions: 'Lower bar toward forehead, extend arms back up', createdAt: new Date(), updatedAt: new Date() },
          { id: '31', name: 'Tricep Pushdowns', muscleGroup: 'TRICEPS', equipment: ['Cable machine'], instructions: 'Push cable down, focus on tricep contraction', createdAt: new Date(), updatedAt: new Date() },
          { id: '32', name: 'Overhead Extensions', muscleGroup: 'TRICEPS', equipment: ['Dumbbell'], instructions: 'Extend dumbbell overhead behind head', createdAt: new Date(), updatedAt: new Date() },
          { id: '33', name: 'Diamond Push-ups', muscleGroup: 'TRICEPS', equipment: [], instructions: 'Hands in diamond shape, focus on triceps', createdAt: new Date(), updatedAt: new Date() },
          { id: '34', name: 'Close-Grip Bench Press', muscleGroup: 'TRICEPS', equipment: ['Barbell', 'Bench'], instructions: 'Bench press with hands close together', createdAt: new Date(), updatedAt: new Date() },
          
                      // LEG EXERCISES (8 exercises)
            { id: '35', name: 'Squats', muscleGroup: 'LEGS', equipment: [], instructions: 'Stand with feet shoulder-width, lower as if sitting back', createdAt: new Date(), updatedAt: new Date() },
            { id: '36', name: 'Deadlifts', muscleGroup: 'LEGS', equipment: ['Barbell'], instructions: 'Stand with barbell on ground, bend and grip, stand up straight', createdAt: new Date(), updatedAt: new Date() },
            { id: '37', name: 'Lunges', muscleGroup: 'LEGS', equipment: [], instructions: 'Step forward, lower until both knees bent at 90 degrees', createdAt: new Date(), updatedAt: new Date() },
            { id: '38', name: 'Leg Press', muscleGroup: 'LEGS', equipment: ['Leg press machine'], instructions: 'Sit in machine, press weight away with legs', createdAt: new Date(), updatedAt: new Date() },
            { id: '39', name: 'Jump Squats', muscleGroup: 'LEGS', equipment: [], instructions: 'Squat down, explode up into jump, land softly', createdAt: new Date(), updatedAt: new Date() },
            { id: '40', name: 'Bulgarian Split Squats', muscleGroup: 'LEGS', equipment: ['Dumbbells'], instructions: 'Back foot on bench, squat with front leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '41', name: 'Romanian Deadlifts', muscleGroup: 'LEGS', equipment: ['Barbell'], instructions: 'Hip hinge movement, bar slides down legs', createdAt: new Date(), updatedAt: new Date() },
            { id: '42', name: 'Calf Raises', muscleGroup: 'LEGS', equipment: [], instructions: 'Stand on edge, raise heels up and down', createdAt: new Date(), updatedAt: new Date() },
            
            // GLUTES EXERCISES (8 exercises)
            { id: '43', name: 'Glute Bridges', muscleGroup: 'GLUTES', equipment: [], instructions: 'Lie on back, lift hips up, squeeze glutes', createdAt: new Date(), updatedAt: new Date() },
            { id: '44', name: 'Single-Leg Glute Bridges', muscleGroup: 'GLUTES', equipment: [], instructions: 'Glute bridge with one leg extended, focus on glute activation', createdAt: new Date(), updatedAt: new Date() },
            { id: '45', name: 'Hip Thrusts', muscleGroup: 'GLUTES', equipment: ['Barbell'], instructions: 'Sit on ground, barbell on hips, thrust hips up', createdAt: new Date(), updatedAt: new Date() },
            { id: '46', name: 'Donkey Kicks', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, kick one leg up toward ceiling', createdAt: new Date(), updatedAt: new Date() },
            { id: '47', name: 'Fire Hydrants', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, lift leg out to side like a dog', createdAt: new Date(), updatedAt: new Date() },
            { id: '48', name: 'Clamshells', muscleGroup: 'GLUTES', equipment: [], instructions: 'Lie on side, knees bent, open and close legs like a clam', createdAt: new Date(), updatedAt: new Date() },
            { id: '49', name: 'Glute Kickbacks', muscleGroup: 'GLUTES', equipment: [], instructions: 'On hands and knees, kick leg back and up', createdAt: new Date(), updatedAt: new Date() },
            { id: '50', name: 'Sumo Squats', muscleGroup: 'GLUTES', equipment: [], instructions: 'Wide stance squats, focus on glute activation', createdAt: new Date(), updatedAt: new Date() },
            
            // HIPS EXERCISES (6 exercises)
            { id: '51', name: 'Hip Flexor Stretches', muscleGroup: 'HIPS', equipment: [], instructions: 'Kneel, lunge forward, feel stretch in front of hip', createdAt: new Date(), updatedAt: new Date() },
            { id: '52', name: 'Hip Circles', muscleGroup: 'HIPS', equipment: [], instructions: 'Stand, make circles with hips, both directions', createdAt: new Date(), updatedAt: new Date() },
            { id: '53', name: 'Hip Abductions', muscleGroup: 'HIPS', equipment: [], instructions: 'Lie on side, lift top leg up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '54', name: 'Hip Adductions', muscleGroup: 'HIPS', equipment: [], instructions: 'Lie on side, lift bottom leg up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '55', name: 'Hip Hinges', muscleGroup: 'HIPS', equipment: [], instructions: 'Stand, hinge at hips, keep back straight', createdAt: new Date(), updatedAt: new Date() },
            { id: '56', name: 'Lateral Lunges', muscleGroup: 'HIPS', equipment: [], instructions: 'Step to side, lunge, feel stretch in inner thigh', createdAt: new Date(), updatedAt: new Date() },
            
            // TUMMY EXERCISES (8 exercises)
            { id: '57', name: 'Crunches', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, lift shoulders off ground using abs', createdAt: new Date(), updatedAt: new Date() },
            { id: '58', name: 'Bicycle Crunches', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, alternate elbow to opposite knee', createdAt: new Date(), updatedAt: new Date() },
            { id: '59', name: 'Leg Raises', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, raise legs up and down', createdAt: new Date(), updatedAt: new Date() },
            { id: '60', name: 'Russian Twists', muscleGroup: 'TUMMY', equipment: [], instructions: 'Sit with feet off floor, rotate torso side to side', createdAt: new Date(), updatedAt: new Date() },
            { id: '61', name: 'Mountain Climbers', muscleGroup: 'TUMMY', equipment: [], instructions: 'In plank position, alternate bringing knees to chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '62', name: 'Plank to Downward Dog', muscleGroup: 'TUMMY', equipment: [], instructions: 'From plank, lift hips up and back', createdAt: new Date(), updatedAt: new Date() },
            { id: '63', name: 'Dead Bug', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, extend opposite arm and leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '64', name: 'Scissor Kicks', muscleGroup: 'TUMMY', equipment: [], instructions: 'Lie on back, alternate lifting legs up and down', createdAt: new Date(), updatedAt: new Date() },
          
                      // CORE EXERCISES (8 exercises)
            { id: '65', name: 'Plank', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank position with body in straight line', createdAt: new Date(), updatedAt: new Date() },
            { id: '66', name: 'Side Plank', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank on side, body in straight line', createdAt: new Date(), updatedAt: new Date() },
            { id: '67', name: 'Superman Holds', muscleGroup: 'CORE', equipment: [], instructions: 'Lie on stomach, lift chest and legs off ground', createdAt: new Date(), updatedAt: new Date() },
            { id: '68', name: 'Bird Dog', muscleGroup: 'CORE', equipment: [], instructions: 'On hands and knees, extend opposite arm and leg', createdAt: new Date(), updatedAt: new Date() },
            { id: '69', name: 'Pallof Press', muscleGroup: 'CORE', equipment: ['Cable machine'], instructions: 'Stand sideways to cable, press weight out and back', createdAt: new Date(), updatedAt: new Date() },
            { id: '70', name: 'Anti-Rotation Press', muscleGroup: 'CORE', equipment: ['Cable machine'], instructions: 'Stand sideways to cable, resist rotation', createdAt: new Date(), updatedAt: new Date() },
            { id: '71', name: 'Plank with Leg Lift', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank, lift one leg up and hold', createdAt: new Date(), updatedAt: new Date() },
            { id: '72', name: 'Plank with Arm Reach', muscleGroup: 'CORE', equipment: [], instructions: 'Hold plank, reach one arm forward', createdAt: new Date(), updatedAt: new Date() },
            
            // CARDIO EXERCISES (6 exercises)
            { id: '73', name: 'Running', muscleGroup: 'CARDIO', equipment: [], instructions: 'Run at steady pace with good form', createdAt: new Date(), updatedAt: new Date() },
            { id: '74', name: 'Cycling', muscleGroup: 'CARDIO', equipment: ['Bicycle'], instructions: 'Pedal at consistent cadence', createdAt: new Date(), updatedAt: new Date() },
            { id: '75', name: 'Burpees', muscleGroup: 'CARDIO', equipment: [], instructions: 'Squat, jump back to plank, jump forward, jump up', createdAt: new Date(), updatedAt: new Date() },
            { id: '76', name: 'Jump Rope', muscleGroup: 'CARDIO', equipment: ['Jump rope'], instructions: 'Skip rope with consistent rhythm', createdAt: new Date(), updatedAt: new Date() },
            { id: '77', name: 'High Knees', muscleGroup: 'CARDIO', equipment: [], instructions: 'Run in place, bring knees up high', createdAt: new Date(), updatedAt: new Date() },
            { id: '78', name: 'Box Jumps', muscleGroup: 'CARDIO', equipment: ['Box'], instructions: 'Jump onto box, step down, repeat', createdAt: new Date(), updatedAt: new Date() },
        ];
        setAvailableExercises(fallbackExercises);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  const handleStartWorkout = async (timerSettings?: { exerciseDuration: number; restDuration: number }) => {
    if (!user) {
      alert('Please log in to start a workout');
      navigate('/auth');
      return;
    }

    if (!workoutName.trim() || selectedExercises.length === 0) {
      alert('Please enter a workout name and select at least one exercise');
      return;
    }

    setIsCreating(true);
    try {
      const workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.userId,
        name: workoutName,
        date: new Date(),
        durationMinutes: 0,
        exercises: selectedExercises.map(exercise => ({
          exerciseId: exercise.id,
          name: exercise.name,
          sets: [
            { reps: 10, completed: false },
            { reps: 10, completed: false },
            { reps: 10, completed: false },
          ],
        })),
      };

      const newWorkout = await WorkoutService.createWorkout(workoutData);
      
      // Store timer settings in the workout store or pass them to the workout tracker
      if (timerSettings) {
        // You could store these in the workout object or in a separate state
        console.log('Timer settings:', timerSettings);
      }
      
      addWorkout(newWorkout);
      setCurrentWorkout(newWorkout);
      navigate(`/workout/active/${newWorkout.id}`);
    } catch (error) {
      console.error('Failed to start workout:', error);
      alert('Failed to start workout. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleExerciseToggle = (exercise: Exercise) => {
    setSelectedExercises(prev => 
      prev.find(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    // Find matching exercises from available exercises
    const templateExercises = template.exercises
      .map(templateExercise => {
        const matchingExercise = availableExercises.find(available => 
          available.name.toLowerCase().includes(templateExercise.exerciseName.toLowerCase()) ||
          templateExercise.exerciseName.toLowerCase().includes(available.name.toLowerCase())
        );
        return matchingExercise;
      })
      .filter(Boolean) as Exercise[];

    setSelectedExercises(templateExercises);
    setWorkoutName(template.name);
    setShowTemplates(false);
  };

  // Filter exercises based on selected muscle group
  const filteredExercises = availableExercises.filter(exercise => {
    if (selectedMuscleGroup === 'ALL') return true;
    return exercise.muscleGroup === selectedMuscleGroup;
  });

  // Handle muscle group filter selection
  const handleMuscleGroupSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  if (currentWorkout) {
    return <WorkoutTracker workout={currentWorkout} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Authentication Required</h1>
            <p className="text-xl text-neutral-600 mb-8">Please log in to start your fitness journey</p>
            <div className="space-y-4">
              <Button
                title="🚪 Go to Login"
                variant="primary"
                onClick={() => navigate('/auth')}
                className="px-8 py-3 text-lg"
              />
              <div>
                <button
                  onClick={() => navigate('/workout')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← Back to Workout Log
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingExercises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-pulse">🏋️</div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Loading Your Workout Builder</h1>
            <p className="text-xl text-neutral-600 mb-8">Preparing your exercise library...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-workout-50">
      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-40 h-40 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
                🚀 Start New Workout
              </h1>
              <p className="text-xl text-white mb-6 drop-shadow-xl">
                Create your perfect workout routine and crush your fitness goals
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{availableExercises.length}</div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Available Exercises</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{selectedExercises.length}</div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Selected Exercises</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">
                    {selectedExercises.reduce((total, exercise) => total + 3, 0)}
                  </div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Total Sets</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 mt-6 lg:mt-0">
              <Button
                title={showTemplates ? "🎯 Custom Workout" : "📋 Use Template"}
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10"
                onClick={() => setShowTemplates(!showTemplates)}
              />
              <button
                onClick={() => navigate('/workout')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30 shadow-lg"
              >
                ← Back to Workout Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">

      {showTemplates ? (
        <WorkoutTemplates
          onSelectTemplate={handleTemplateSelect}
          availableExercises={availableExercises}
        />
      ) : (
        <Card variant="elevated" className="p-8 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 drop-shadow-lg">🎯 Create Custom Workout</h2>
              <p className="text-neutral-700 drop-shadow-md">Build your perfect workout routine</p>
            </div>
            <div className="text-3xl">💪</div>
          </div>
          
          <div className="space-y-6 relative z-10">
            {/* Workout Name Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">📝</div>
                <h3 className="text-xl font-bold text-neutral-900 drop-shadow-sm">Workout Details</h3>
              </div>
              
              <div>
                <label htmlFor="workoutName" className="block text-sm font-medium text-neutral-700 mb-2 drop-shadow-sm">
                  🏷️ Workout Name
                </label>
                <input
                  id="workoutName"
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength, Leg Day, Full Body Blast"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-lg bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Exercise Selection Section */}
            <div className="space-y-6">
              {/* Exercise Selection Header */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 relative overflow-hidden bg-workout-pattern bg-repeat">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-2 right-2 w-16 h-16 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-12 bg-purple-400 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-400 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                      <span className="text-2xl">🏋️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Select Your Exercises</h3>
                      <p className="text-gray-600 dark:text-gray-300">Build your perfect workout routine</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{selectedExercises.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Selected</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4 relative z-10">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(selectedExercises.length / Math.min(availableExercises.length, 10)) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm relative z-10">
                  <span className="text-gray-600 dark:text-gray-300">{selectedExercises.length} selected</span>
                  <span className="text-blue-600 font-medium">Recommended: 5-8 exercises</span>
                                      <span className="text-gray-600 dark:text-gray-300">{filteredExercises.length} available</span>
                </div>
              </div>
              
              {/* Enhanced Muscle Group Filter */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  Filter by Muscle Group
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {[
                    { id: 'ALL', icon: '🏃‍♂️', label: 'All', color: 'from-blue-500 to-cyan-500' },
                    { id: 'CHEST', icon: '💪', label: 'Chest', color: 'from-red-500 to-pink-500' },
                    { id: 'BACK', icon: '💪', label: 'Back', color: 'from-green-500 to-emerald-500' },
                    { id: 'SHOULDERS', icon: '💪', label: 'Shoulders', color: 'from-yellow-500 to-orange-500' },
                    { id: 'BICEPS', icon: '💪', label: 'Biceps', color: 'from-purple-500 to-indigo-500' },
                    { id: 'TRICEPS', icon: '💪', label: 'Triceps', color: 'from-pink-500 to-rose-500' },
                    { id: 'LEGS', icon: '💪', label: 'Legs', color: 'from-indigo-500 to-blue-500' },
                    { id: 'GLUTES', icon: '🍑', label: 'Glutes', color: 'from-fuchsia-500 to-pink-500' },
                    { id: 'HIPS', icon: '🦵', label: 'Hips', color: 'from-teal-500 to-cyan-500' },
                    { id: 'TUMMY', icon: '🤰', label: 'Tummy', color: 'from-orange-500 to-red-500' },
                    { id: 'CORE', icon: '💪', label: 'Core', color: 'from-emerald-500 to-green-500' },
                    { id: 'CARDIO', icon: '🏃‍♂️', label: 'Cardio', color: 'from-rose-500 to-red-500' }
                  ].map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleMuscleGroupSelect(group.id)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 overflow-hidden ${
                        selectedMuscleGroup === group.id
                          ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-1 right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                      
                      <div className="text-center relative z-10">
                        <div className={`text-2xl mb-2 group-hover:scale-110 transition-transform ${group.id === 'ALL' ? 'animate-pulse' : ''}`}>
                          {group.icon}
                        </div>
                        <div className={`text-xs font-semibold ${
                          group.id === 'ALL' ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {group.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Enhanced Exercise Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="text-xl mr-2">💪</span>
                    Available Exercises
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                      <option>Name A-Z</option>
                      <option>Muscle Group</option>
                      <option>Difficulty</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExercises.map((exercise, index) => {
                    const isSelected = selectedExercises.find(e => e.id === exercise.id);
                    const muscleGroupColors = {
                      'CHEST': 'from-red-500 to-pink-500',
                      'BACK': 'from-green-500 to-emerald-500',
                      'SHOULDERS': 'from-yellow-500 to-orange-500',
                      'BICEPS': 'from-purple-500 to-indigo-500',
                      'TRICEPS': 'from-pink-500 to-rose-500',
                      'LEGS': 'from-indigo-500 to-blue-500',
                      'GLUTES': 'from-fuchsia-500 to-pink-500',
                      'HIPS': 'from-teal-500 to-cyan-500',
                      'TUMMY': 'from-orange-500 to-red-500',
                      'CORE': 'from-emerald-500 to-green-500',
                      'CARDIO': 'from-rose-500 to-red-500'
                    };
                    
                    return (
                      <div
                        key={exercise.id}
                        className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          isSelected
                            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-gray-50 to-white'
                        }`}
                        onClick={() => handleExerciseToggle(exercise)}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            ✓ SELECTED
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {exercise.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className={`px-3 py-1 bg-gradient-to-r ${muscleGroupColors[exercise.muscleGroup as keyof typeof muscleGroupColors] || 'from-gray-500 to-gray-600'} text-white rounded-full text-xs font-semibold capitalize`}>
                                {exercise.muscleGroup.toLowerCase()}
                              </span>
                              {exercise.equipment.length > 0 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                  {exercise.equipment[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ml-3 transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent scale-110'
                              : 'border-gray-300 group-hover:border-blue-400'
                          }`}>
                            {isSelected && (
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {exercise.instructions}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Click to {isSelected ? 'remove' : 'add'}</span>
                          <span className="font-medium">{isSelected ? '✓ Added' : '+ Add Exercise'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Workout Summary */}
            {selectedExercises.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-200 shadow-lg relative overflow-hidden bg-goals-pattern bg-repeat">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">Your Workout Summary</h3>
                    <p className="text-green-700">Ready to crush this workout!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-1">{selectedExercises.length}</div>
                    <div className="text-sm text-green-700 font-medium">Exercises</div>
                    <div className="text-xs text-green-500 mt-1">Selected</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {selectedExercises.reduce((total, exercise) => total + 3, 0)}
                    </div>
                    <div className="text-sm text-blue-700 font-medium">Total Sets</div>
                    <div className="text-xs text-blue-500 mt-1">3 sets each</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.round(selectedExercises.length * 3 * 2.5)}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Est. Minutes</div>
                    <div className="text-xs text-purple-500 mt-1">Including rest</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {selectedExercises.length * 3 * 10}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Total Reps</div>
                    <div className="text-xs text-orange-500 mt-1">10 reps/set</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-lg mr-2">🎯</span>
                    Muscle Groups Targeted
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(selectedExercises.map(e => e.muscleGroup))).map(group => (
                      <span key={group} className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium">
                        {group.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Button
                variant="success"
                onClick={() => handleStartWorkout()}
                disabled={isCreating || !workoutName.trim() || selectedExercises.length === 0}
                className="flex-1 py-4 text-lg font-bold">
                {isCreating ? '⏳ Starting Workout...' : '🚀 Start Workout'}
              </Button>
              {selectedExercises.length === 0 && (
                <div className="text-center text-neutral-500 text-sm">
                  Please select at least one exercise to start your workout
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      </div>
    </div>
  );
};

interface WorkoutTrackerProps {
  workout: Workout;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ workout }) => {
  const navigate = useNavigate();
  const { updateWorkout } = useWorkoutStore();
  const { sendWorkoutCompletionNotification } = useNotifications();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weightInputs, setWeightInputs] = useState<{ [key: string]: number }>({});
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(90); // 90 seconds default
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExerciseTimer, setShowExerciseTimer] = useState(false);
  const [exerciseTimerPaused, setExerciseTimerPaused] = useState(false);
  const [exerciseDuration, setExerciseDuration] = useState(120); // 2 minutes default

  const handleSetComplete = async (exerciseIndex: number, setIndex: number) => {
    if (!workout.exercises[exerciseIndex] || !workout.exercises[exerciseIndex].sets[setIndex]) {
      return;
    }
    
    setIsUpdating(true);
    try {
      const updatedWorkout = { ...workout };
      const exercise = updatedWorkout.exercises[exerciseIndex];
      const set = exercise?.sets[setIndex];
      
      if (exercise && set) {
        set.completed = true;
        
        // Add weight if provided
        const weightKey = `${exerciseIndex}-${setIndex}`;
        if (weightInputs[weightKey]) {
          set.weight = weightInputs[weightKey];
        }
        
        await WorkoutService.updateWorkout(workout.id, updatedWorkout);
        
        // Show rest timer before moving to next set/exercise
        if (setIndex < exercise.sets.length - 1 || exerciseIndex < updatedWorkout.exercises.length - 1) {
          setShowRestTimer(true);
        } else {
          // Workout completed
          sendWorkoutCompletionNotification(workout.name);
          alert('Congratulations! Workout completed!');
          navigate('/workout');
        }
      }
    } catch (error) {
      console.error('Failed to update workout:', error);
      alert('Failed to update workout. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, weight: number) => {
    const weightKey = `${exerciseIndex}-${setIndex}`;
    setWeightInputs(prev => ({
      ...prev,
      [weightKey]: weight
    }));
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    // Move to next set or exercise
    if (currentExercise && currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    }
  };

  const handleRestSkip = () => {
    setShowRestTimer(false);
    // Move to next set or exercise
    if (currentExercise && currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    }
  };

  const handleExerciseTimerComplete = () => {
    setShowExerciseTimer(false);
    setExerciseTimerPaused(false);
    // Continue with the workout - user can complete sets manually
  };

  const handleExerciseTimerSkip = () => {
    setShowExerciseTimer(false);
    setExerciseTimerPaused(false);
    // Continue with the workout
  };

  const handleExerciseTimerPause = () => {
    setExerciseTimerPaused(!exerciseTimerPaused);
  };

  const handleFinishWorkout = () => {
    navigate('/workout');
  };

  const currentExercise = workout.exercises[currentExerciseIndex];

  if (!currentExercise) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No exercises found</h2>
          <p className="text-gray-600">This workout doesn't have any exercises.</p>
        </div>
      </div>
    );
  }

  // Show exercise instructions if active
  if (showInstructions) {
    return (
      <ExerciseInstructions
        exerciseName={currentExercise.name}
        onClose={() => setShowInstructions(false)}
      />
    );
  }

  // Show exercise timer if active
  if (showExerciseTimer) {
    return (
      <ExerciseTimer
        exerciseName={currentExercise.name}
        recommendedDuration={exerciseDuration}
        onComplete={handleExerciseTimerComplete}
        onSkip={handleExerciseTimerSkip}
        onPause={handleExerciseTimerPause}
        isPaused={exerciseTimerPaused}
        currentSet={currentSetIndex + 1}
        totalSets={currentExercise.sets.length}
      />
    );
  }

  // Show rest timer if active
  if (showRestTimer) {
    const nextExercise = currentSetIndex < currentExercise.sets.length - 1 
      ? currentExercise.name 
      : workout.exercises[currentExerciseIndex + 1]?.name || undefined;
    
    return (
      <RestTimer
        duration={restDuration}
        onComplete={handleRestComplete}
        onSkip={handleRestSkip}
        exerciseName={currentExercise.name}
        nextExercise={nextExercise}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-workout-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-workout-600 via-workout-500 to-workout-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                🏋️ {workout.name}
              </h1>
              <p className="text-xl text-workout-100 mb-6">
                Keep pushing! You're doing great!
              </p>
              
              {/* Workout Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{workout.exercises.length}</div>
                  <div className="text-sm text-workout-100">Total Exercises</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)}
                  </div>
                  <div className="text-sm text-workout-100">Total Sets</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {workout.exercises.reduce((total, exercise) => 
                      total + exercise.sets.filter(set => set.completed).length, 0
                    )}
                  </div>
                  <div className="text-sm text-workout-100">Completed Sets</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {Math.round((workout.exercises.reduce((total, exercise) => 
                      total + exercise.sets.filter(set => set.completed).length, 0
                    ) / workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)) * 100)}%
                  </div>
                  <div className="text-sm text-workout-100">Progress</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 mt-6 lg:mt-0">
              <Button
                title="🏁 Finish Workout"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={handleFinishWorkout}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-2xl">📊</div>
              <h2 className="text-xl font-bold text-neutral-900">Workout Progress</h2>
            </div>
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 font-medium">Overall Progress</span>
                  <span className="font-bold text-workout-600 text-lg">
                    {Math.round((workout.exercises.reduce((total, exercise) => 
                      total + exercise.sets.filter(set => set.completed).length, 0
                    ) / workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-workout-500 to-workout-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${(workout.exercises.reduce((total, exercise) => 
                        total + exercise.sets.filter(set => set.completed).length, 0
                      ) / workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Exercise Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 font-medium">Exercise Progress</span>
                  <span className="font-bold text-workout-600 text-lg">
                    {currentExerciseIndex + 1} of {workout.exercises.length}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-workout-400 to-workout-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Exercise Info */}
              <div className="bg-gradient-to-r from-workout-50 to-workout-100 p-4 rounded-lg border border-workout-200">
                <div className="text-center">
                  <div className="text-2xl mb-2">💪</div>
                  <h3 className="font-bold text-workout-900 mb-1">{currentExercise.name}</h3>
                  <p className="text-sm text-workout-700">
                    Set {currentSetIndex + 1} of {currentExercise.sets.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Exercise */}
          <Card variant="elevated" className="p-6 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💪</div>
                <h2 className="text-2xl font-bold text-neutral-900">{currentExercise.name}</h2>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  title="⏱️ Start Exercise Timer"
                  variant="outline"
                  onClick={() => setShowExerciseTimer(true)}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                />
                <Button
                  title="📖 View Instructions"
                  variant="outline"
                  onClick={() => setShowInstructions(true)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {currentExercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                    set.completed 
                      ? 'bg-gradient-to-r from-success-50 to-success-100 border-success-200 shadow-lg' 
                      : setIndex === currentSetIndex
                      ? 'bg-gradient-to-r from-workout-50 to-workout-100 border-workout-300 shadow-lg ring-2 ring-workout-400'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          set.completed 
                            ? 'bg-success-500 text-white' 
                            : setIndex === currentSetIndex
                            ? 'bg-workout-500 text-white'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {setIndex + 1}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-lg text-neutral-900">{set.reps} reps</span>
                          {set.weight && (
                            <span className="text-workout-600 font-bold text-lg">{set.weight}kg</span>
                          )}
                        </div>
                        {set.completed && (
                          <span className="text-success-600 font-bold">✅ Completed</span>
                        )}
                        {!set.completed && setIndex === currentSetIndex && (
                          <span className="text-workout-600 font-bold">🔥 Current Set</span>
                        )}
                      </div>
                      
                      {/* Weight input for current set */}
                      {!set.completed && setIndex === currentSetIndex && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-workout-200">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-neutral-700">Weight (kg):</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="0"
                              className="w-24 px-3 py-2 border border-workout-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-workout-500 focus:border-workout-500"
                              value={weightInputs[`${currentExerciseIndex}-${setIndex}`] || ''}
                              onChange={(e) => handleWeightChange(currentExerciseIndex, setIndex, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-neutral-500">kg</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {set.completed && (
                        <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {!set.completed && setIndex === currentSetIndex && (
                        <Button
                          title={isUpdating ? "⏳ Updating..." : "✅ Complete Set"}
                          variant="success"
                          onClick={() => handleSetComplete(currentExerciseIndex, setIndex)}
                          disabled={isUpdating}
                          className="px-6 py-3 text-lg font-bold"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 