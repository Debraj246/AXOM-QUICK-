import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase.ts';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  updatedAt: any;
}

export const userService = {
  async syncUserProfile() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      const docSnap = await getDoc(userRef);
      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp(),
      };

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          ...profileData,
          createdAt: serverTimestamp(),
        });
        console.log('User profile created in Firestore');
      } else {
        await setDoc(userRef, profileData, { merge: true });
        console.log('User profile synced in Firestore');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }
};
