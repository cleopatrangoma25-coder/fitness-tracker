import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserSchema } from '@fitness-tracker/shared';
import type { User, SignUpInput, SignInInput, UpdateProfileInput } from '@fitness-tracker/shared';

export class AuthService {
  // Helper method to convert Firebase auth errors to user-friendly messages
  private static getAuthErrorMessage(error: any): string {
    // Check if it's a Firebase auth error by checking for the code property
    if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'An account with this email already exists. Please try signing in instead.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.';
        case 'auth/user-not-found':
          return 'No account found with this email address.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.';
        default:
          return error.message || 'An unexpected error occurred. Please try again.';
      }
    }
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  // Sign up with email and password
  static async signUp(input: SignUpInput): Promise<User> {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );

      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const userData: Omit<User, 'userId'> = {
        email: input.email,
        displayName: input.displayName,
        firstName: input.firstName,
        lastName: input.lastName,
        role: 'USER',
        preferences: {
          units: 'METRIC',
          notifications: true,
          privacy: 'PRIVATE',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Update Firebase auth profile
      await updateProfile(firebaseUser, {
        displayName: input.displayName,
      });

      // Return the complete user object
      return {
        userId: firebaseUser.uid,
        ...userData,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  // Sign in with email and password
  static async signIn(input: SignInInput): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );

      const firebaseUser = userCredential.user;
      return await this.getUserProfile(firebaseUser.uid);
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  // Get user profile from Firestore
  static async getUserProfile(userId: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      
      // Convert Firestore timestamps to JavaScript Date objects
      const processedData = {
        ...userData,
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
        updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData.updatedAt,
        dateOfBirth: userData.dateOfBirth instanceof Timestamp ? userData.dateOfBirth.toDate() : userData.dateOfBirth,
      };

      return UserSchema.parse({
        userId,
        ...processedData,
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: UpdateProfileInput): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });

      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
} 