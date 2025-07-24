'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { Card, Button, Input } from '@fitness-tracker/ui';

export function AuthDebugger() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
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
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResult(`✅ Sign in successful! User ID: ${userCredential.user.uid}`);
    } catch (error: any) {
      setResult(`❌ Sign in failed: ${error.code} - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Authentication Debugger</h2>
      
      <div className="space-y-4">
        <Button 
          title="Test Firebase Connection" 
          onClick={testFirebaseConnection}
          disabled={isLoading}
        />
        
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
        
        <div className="flex gap-2">
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
        </div>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </Card>
  );
} 