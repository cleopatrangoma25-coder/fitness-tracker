'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { Card, Button, Input } from '@fitness-tracker/ui';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@fitness-tracker/store';
import { GoalsService } from '@/lib/goals';
import { PlansService } from '@/lib/plans';
import { WorkoutService } from '@/lib/workout';


export function AuthDebugger() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { user, isAuthenticated } = useAuthStore();

  // Auto-update debug info when auth state changes
  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        authStore: {
          user: user ? {
            userId: user.userId,
            email: user.email,
            displayName: user.displayName,
            isAuthenticated
          } : null,
          isAuthenticated
        },
        firebaseAuth: {
          currentUser: auth.currentUser ? {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName
          } : null
        },
        timestamp: new Date().toISOString()
      });
    };

    updateDebugInfo();
    const unsubscribe = onAuthStateChanged(auth, updateDebugInfo);
    return unsubscribe;
  }, [user, isAuthenticated]);

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    setResult('Testing Firebase connection...');
    
    try {
      // Test if Firebase is initialized
      if (!auth) {
        setResult('❌ Firebase auth is not initialized');
        return;
      }

      // Test if we can access Firebase config
      const config = auth.app.options;
      setResult(`✅ Firebase connected to project: ${config.projectId}`);
      
    } catch (error) {
      setResult(`❌ Firebase connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignUp = async () => {
    if (!email || !password) {
      setResult('❌ Please enter email and password');
      return;
    }

    setIsLoading(true);
    setResult('Testing sign up...');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResult(`✅ Sign up successful! User ID: ${userCredential.user.uid}`);
    } catch (error: any) {
      setResult(`❌ Sign up failed: ${error.code} - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignIn = async () => {
    if (!email || !password) {
      setResult('❌ Please enter email and password');
      return;
    }

    setIsLoading(true);
    setResult('Testing sign in...');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResult(`✅ Sign in successful! User ID: ${userCredential.user.uid}`);
    } catch (error: any) {
      setResult(`❌ Sign in failed: ${error.code} - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDataAccess = async () => {
    if (!user?.userId) {
      setResult('❌ No authenticated user found');
      return;
    }

    setIsLoading(true);
    setResult('Testing data access...');
    
    try {
      // Test each service individually with detailed error reporting
      let goalsResult = 'Goals: ';
      let plansResult = 'Plans: ';
      let workoutsResult = 'Workouts: ';

      
      try {
        const goals = await GoalsService.getGoals(user.userId);
        goalsResult += `${goals.length} found`;
      } catch (error: any) {
        goalsResult += `ERROR: ${error.message}`;
        console.error('Goals error details:', error);
      }
      
      try {
        const plans = await PlansService.getPlans(user.userId);
        plansResult += `${plans.length} found`;
      } catch (error: any) {
        plansResult += `ERROR: ${error.message}`;
        console.error('Plans error details:', error);
      }
      
      try {
        const workouts = await WorkoutService.getUserWorkouts(user.userId);
        workoutsResult += `${workouts.length} found`;
      } catch (error: any) {
        workoutsResult += `ERROR: ${error.message}`;
        console.error('Workouts error details:', error);
      }
      


      setResult(`Data Access Results:
${goalsResult}
${plansResult}
${workoutsResult}

User ID: ${user.userId}
Firebase UID: ${auth.currentUser?.uid || 'Not set'}

Check browser console for detailed error information.`);

    } catch (error: any) {
      setResult(`❌ Data access failed: ${error.message}
      
Error details: ${JSON.stringify(error, null, 2)}
User ID: ${user.userId}`);
      console.error('Full error object:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestData = async () => {
    if (!user?.userId) {
      setResult('❌ No authenticated user found');
      return;
    }

    setIsLoading(true);
    setResult('Creating test data...');
    
    try {
      // Create a test goal
      const testGoal = await GoalsService.createGoal({
        userId: user.userId,
        type: 'WEIGHT',
        title: 'Test Goal - Lose 5kg',
        description: 'This is a test goal created by the debugger',
        targetValue: 70,
        currentValue: 75,
        unit: 'kg',
        status: 'ACTIVE',
        startDate: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      // Create a test plan
      const testPlan = await PlansService.createPlan({
        userId: user.userId,
        title: 'Test Plan - Beginner Strength',
        description: 'This is a test plan created by the debugger',
        duration: 8,
        difficulty: 'beginner',
        focus: 'strength',
        isActive: false,
        phases: [{
          id: 'phase1',
          name: 'Foundation',
          duration: 4,
          description: 'Build basic strength',
          goals: ['Improve form', 'Build endurance'],
          exercises: []
        }]
      });

      setResult(`✅ Test data created successfully!
Goal ID: ${testGoal.id}
Plan ID: ${testPlan.id}

User ID: ${user.userId}`);

    } catch (error: any) {
      setResult(`❌ Failed to create test data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createComprehensiveTestData = async () => {
    if (!user?.userId) {
      setResult('❌ No authenticated user found');
      return;
    }

    setIsLoading(true);
    setResult('Creating comprehensive test data...');
    
    try {
      const results = [];
      
      // Create multiple test goals
      const goalTypes = [
        {
          type: 'WEIGHT' as const,
          title: 'Lose 5kg',
          description: 'Reduce body weight for better health',
          targetValue: 70,
          currentValue: 75,
          unit: 'kg'
        },
        {
          type: 'ENDURANCE' as const,
          title: 'Run 5km in 25 minutes',
          description: 'Improve running endurance and speed',
          targetValue: 25,
          currentValue: 30,
          unit: 'minutes'
        },
        {
          type: 'STRENGTH' as const,
          title: 'Bench Press 100kg',
          description: 'Build upper body strength',
          targetValue: 100,
          currentValue: 80,
          unit: 'kg'
        },
        {
          type: 'FREQUENCY' as const,
          title: 'Touch toes while standing',
          description: 'Improve flexibility and mobility',
          targetValue: 1,
          currentValue: 0,
          unit: 'reps'
        }
      ];

      for (const goalData of goalTypes) {
        const goal = await GoalsService.createGoal({
          userId: user.userId,
          ...goalData,
          status: 'ACTIVE',
          startDate: new Date(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });
        results.push(`Goal: ${goal.title} (ID: ${goal.id})`);
      }

      // Create multiple test plans
      const planTypes = [
        {
          title: 'Beginner Strength Program',
          description: '8-week program to build basic strength',
          duration: 8,
          difficulty: 'beginner' as const,
          focus: 'strength' as const,
          phases: [{
            id: 'phase1',
            name: 'Foundation',
            duration: 4,
            description: 'Build basic strength and form',
            goals: ['Improve form', 'Build endurance'],
            exercises: []
          }, {
            id: 'phase2',
            name: 'Progression',
            duration: 4,
            description: 'Increase weights and complexity',
            goals: ['Increase strength', 'Add variety'],
            exercises: []
          }]
        },
        {
          title: 'Cardio Fitness Plan',
          description: '12-week cardio improvement program',
          duration: 12,
          difficulty: 'intermediate' as const,
          focus: 'cardio' as const,
          phases: [{
            id: 'phase1',
            name: 'Endurance Building',
            duration: 6,
            description: 'Build cardiovascular endurance',
            goals: ['Increase stamina', 'Improve heart health'],
            exercises: []
          }, {
            id: 'phase2',
            name: 'Speed Training',
            duration: 6,
            description: 'Improve speed and performance',
            goals: ['Increase speed', 'Reduce times'],
            exercises: []
          }]
        }
      ];

      for (const planData of planTypes) {
        const plan = await PlansService.createPlan({
          userId: user.userId,
          ...planData,
          isActive: false,
        });
        results.push(`Plan: ${plan.title} (ID: ${plan.id})`);
      }



      setResult(`✅ Comprehensive test data created successfully!

Created:
${results.join('\n')}

User ID: ${user.userId}

Now go to /goals to see your data!`);

    } catch (error: any) {
      setResult(`❌ Failed to create comprehensive test data: ${error.message}
      
Error details: ${JSON.stringify(error, null, 2)}`);
      console.error('Comprehensive test data error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const testSimpleFirestore = async () => {
    if (!user?.userId) {
      setResult('❌ No authenticated user found');
      return;
    }

    setIsLoading(true);
    setResult('Testing simple Firestore operations...');
    
    try {
      // Test basic Firestore connection by trying to get all documents (without filters)
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      // Try to get all goals (this should work with our updated rules)
      const goalsSnapshot = await getDocs(collection(db, 'goals'));
      const allGoals = goalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter client-side to find user's goals
      const userGoals = allGoals.filter((goal: any) => goal.userId === user.userId);
      
      setResult(`Simple Firestore Test Results:
Total goals in database: ${allGoals.length}
Your goals: ${userGoals.length}
User ID: ${user.userId}

This test bypasses complex queries to check basic Firestore access.`);

    } catch (error: any) {
      setResult(`❌ Simple Firestore test failed: ${error.message}
      
Error details: ${JSON.stringify(error, null, 2)}`);
      console.error('Simple Firestore error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Authentication & Data Debugger</h2>
      
      <div className="space-y-6">
        {/* Firebase Connection Test */}
        <div>
          <Button 
            title="Test Firebase Connection" 
            onClick={testFirebaseConnection}
            disabled={isLoading}
          />
        </div>
        
        {/* Authentication Tests */}
        <div className="space-y-2">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            title="Test Sign Up" 
            onClick={testSignUp}
            disabled={isLoading}
            variant="outline"
          />
          <Button 
            title="Test Sign In" 
            onClick={testSignIn}
            disabled={isLoading}
            variant="outline"
          />
          <Button 
            title="Test Data Access" 
            onClick={testDataAccess}
            disabled={isLoading}
            variant="outline"
          />
          <Button 
            title="Create Test Data" 
            onClick={createTestData}
            disabled={isLoading}
            variant="outline"
          />
          <Button 
            title="Create Comprehensive Test Data" 
            onClick={createComprehensiveTestData}
            disabled={isLoading}
            variant="outline"
          />

          <Button 
            title="Test Simple Firestore" 
            onClick={testSimpleFirestore}
            disabled={isLoading}
            variant="outline"
          />
        </div>
        
        {/* Results */}
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Current State</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
} 