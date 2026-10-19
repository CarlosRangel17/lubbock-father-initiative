import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface IntakePayload {
  applicant: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    zipCode: string;
  };
  metadata: {
    submissionLanguage: 'en' | 'es';
    version: string;
  };
}

interface PipelineResponse {
  success: boolean;
  documentId?: string;
  error?: string;
}

/**
 * Pushes validated intake forms into Firestore.
 * Triggers upstream pipeline triggers cleanly.
 */
export const submitIntakeForm = async (payload: IntakePayload): Promise<PipelineResponse> => {
  try {
    // Explicitly validate fields to prevent malformed injections into the administrative records
    if (!payload.applicant.email || !payload.applicant.lastName) {
      throw new Error('Missing high-priority demographic information.');
    }

    const targetCollection = collection(db, 'fatherhood_intakes');
    
    const enrichedPayload = {
      ...payload,
      status: 'pending_review',
      createdAt: serverTimestamp(), // Secure server-side clock mapping
    };

    const docRef = await addDoc(targetCollection, enrichedPayload);

    return {
      success: true,
      documentId: docRef.id,
    };
  } catch (error: any) {
    console.error('Data pipeline ingestion error:', error);
    return {
      success: false,
      error: error?.message || 'Internal database write failure.',
    };
  }
};
