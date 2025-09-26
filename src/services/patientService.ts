import { supabase } from '@/integrations/supabase/client';

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

class PatientService {
  async createPatient(patientData: CreatePatientData): Promise<{ data: Patient | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('patients')
        .insert({
          user_id: user.id,
          name: patientData.name,
          age: patientData.age,
          gender: patientData.gender,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        return { data: null, error: new Error('Failed to create patient record') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Patient creation error:', error);
      return { data: null, error: error as Error };
    }
  }

  async getPatients(): Promise<{ data: Patient[] | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return { data: null, error: new Error('Failed to fetch patients') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Patient fetch error:', error);
      return { data: null, error: error as Error };
    }
  }

  async getPatientById(patientId: string): Promise<{ data: Patient | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        return { data: null, error: new Error('Patient not found') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Patient fetch error:', error);
      return { data: null, error: error as Error };
    }
  }

  async updatePatient(patientId: string, updates: Partial<CreatePatientData>): Promise<{ data: Patient | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating patient:', error);
        return { data: null, error: new Error('Failed to update patient') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Patient update error:', error);
      return { data: null, error: error as Error };
    }
  }

  async deletePatient(patientId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting patient:', error);
        return { error: new Error('Failed to delete patient') };
      }

      return { error: null };
    } catch (error) {
      console.error('Patient deletion error:', error);
      return { error: error as Error };
    }
  }
}

export const patientService = new PatientService();