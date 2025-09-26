import { supabase } from '@/integrations/supabase/client';

export interface ECGReport {
  id: string;
  user_id: string;
  patient_id: string;
  duration: number;
  heart_rate: number | null;
  rhythm_analysis: string | null;
  abnormalities: string[] | null;
  risk_level: string | null;
  raw_data: any;
  doctor_notes: string | null;
  patient_summary: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Join with patient data
  patients?: {
    name: string;
    age: number;
    gender: string;
  };
}

export interface CreateECGReportData {
  patient_id: string;
  duration: number;
  heart_rate?: number;
  raw_data: any;
  status?: 'recording' | 'completed' | 'failed';
}

export interface ECGAnalysis {
  heart_rate: number;
  rhythm_analysis: string;
  abnormalities: string[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  doctor_notes: string;
  patient_summary: string;
}

class ECGService {
  async createECGReport(reportData: CreateECGReportData): Promise<{ data: ECGReport | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('ecg_reports')
        .insert({
          user_id: user.id,
          patient_id: reportData.patient_id,
          duration: reportData.duration,
          heart_rate: reportData.heart_rate,
          raw_data: reportData.raw_data,
          status: reportData.status || 'completed',
        })
        .select(`
          *,
          patients (
            name,
            age,
            gender
          )
        `)
        .single();

      if (error) {
        console.error('Error creating ECG report:', error);
        return { data: null, error: new Error('Failed to create ECG report') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('ECG report creation error:', error);
      return { data: null, error: error as Error };
    }
  }

  async getECGReports(): Promise<{ data: ECGReport[] | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('ecg_reports')
        .select(`
          *,
          patients (
            name,
            age,
            gender
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ECG reports:', error);
        return { data: null, error: new Error('Failed to fetch ECG reports') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('ECG reports fetch error:', error);
      return { data: null, error: error as Error };
    }
  }

  async getECGReportById(reportId: string): Promise<{ data: ECGReport | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('ecg_reports')
        .select(`
          *,
          patients (
            name,
            age,
            gender
          )
        `)
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching ECG report:', error);
        return { data: null, error: new Error('ECG report not found') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('ECG report fetch error:', error);
      return { data: null, error: error as Error };
    }
  }

  async updateECGReport(reportId: string, updates: Partial<ECGAnalysis>): Promise<{ data: ECGReport | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('ecg_reports')
        .update(updates)
        .eq('id', reportId)
        .eq('user_id', user.id)
        .select(`
          *,
          patients (
            name,
            age,
            gender
          )
        `)
        .single();

      if (error) {
        console.error('Error updating ECG report:', error);
        return { data: null, error: new Error('Failed to update ECG report') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('ECG report update error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Analyze ECG data using AI (simulated for now)
  async analyzeECGData(rawData: any, patientAge: number, patientGender: string): Promise<ECGAnalysis> {
    // In a real implementation, this would call an AI service or edge function
    // For now, we'll simulate analysis based on the raw data
    
    const heartRates = rawData.filter((d: any) => d.heartRate).map((d: any) => d.heartRate);
    const avgHeartRate = heartRates.length > 0 
      ? Math.round(heartRates.reduce((sum: number, hr: number) => sum + hr, 0) / heartRates.length)
      : 75;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let abnormalities: string[] = [];
    let rhythmAnalysis = 'Normal sinus rhythm';

    // Simple analysis based on heart rate
    if (avgHeartRate < 60) {
      abnormalities.push('Bradycardia');
      riskLevel = 'medium';
      rhythmAnalysis = 'Slow heart rate detected';
    } else if (avgHeartRate > 100) {
      abnormalities.push('Tachycardia');
      riskLevel = 'medium';
      rhythmAnalysis = 'Fast heart rate detected';
    }

    // Age-based considerations
    if (patientAge > 65 && avgHeartRate > 90) {
      riskLevel = 'high';
      abnormalities.push('Age-related tachycardia concern');
    }

    // Generate patient-friendly summary
    const patientSummary = this.generatePatientSummary(avgHeartRate, abnormalities, riskLevel);
    
    // Generate doctor notes
    const doctorNotes = this.generateDoctorNotes(avgHeartRate, abnormalities, patientAge, patientGender, rawData);

    return {
      heart_rate: avgHeartRate,
      rhythm_analysis: rhythmAnalysis,
      abnormalities,
      risk_level: riskLevel,
      doctor_notes: doctorNotes,
      patient_summary: patientSummary,
    };
  }

  private generatePatientSummary(heartRate: number, abnormalities: string[], riskLevel: string): string {
    let summary = `Your ECG recording shows an average heart rate of ${heartRate} beats per minute. `;

    if (abnormalities.length === 0) {
      summary += "Your heart rhythm appears normal. This is a good sign for your heart health. ";
      summary += "Continue maintaining a healthy lifestyle with regular exercise and a balanced diet.";
    } else {
      summary += "Some irregularities were detected in your heart rhythm. ";
      
      if (riskLevel === 'low') {
        summary += "These are typically minor and may not require immediate concern, but it's worth discussing with your doctor.";
      } else if (riskLevel === 'medium') {
        summary += "These findings warrant attention. Please schedule an appointment with your doctor to discuss these results.";
      } else {
        summary += "These findings require medical attention. Please contact your doctor promptly to discuss these results.";
      }
    }

    summary += "\n\nRemember: This is an initial screening. Always consult with a healthcare professional for proper medical advice.";

    return summary;
  }

  private generateDoctorNotes(heartRate: number, abnormalities: string[], age: number, gender: string, rawData: any): string {
    let notes = `ECG Analysis Summary:\n\n`;
    notes += `Patient: ${age}-year-old ${gender}\n`;
    notes += `Average Heart Rate: ${heartRate} bpm\n`;
    notes += `Recording Duration: 30 seconds\n`;
    notes += `Data Points: ${rawData.length}\n\n`;

    if (abnormalities.length > 0) {
      notes += `Abnormalities Detected:\n`;
      abnormalities.forEach((abnormality, index) => {
        notes += `${index + 1}. ${abnormality}\n`;
      });
      notes += `\n`;
    }

    notes += `Clinical Recommendations:\n`;
    
    if (abnormalities.length === 0) {
      notes += `- Normal ECG findings for age group\n`;
      notes += `- Recommend routine follow-up as per guidelines\n`;
      notes += `- Continue current cardiac health management\n`;
    } else {
      notes += `- Consider 12-lead ECG for comprehensive evaluation\n`;
      notes += `- Review patient medication list for potential causes\n`;
      notes += `- Assess for symptoms: chest pain, palpitations, dyspnea\n`;
      
      if (heartRate < 60) {
        notes += `- Consider evaluation for sick sinus syndrome or AV block\n`;
        notes += `- Review medications that may cause bradycardia\n`;
      } else if (heartRate > 100) {
        notes += `- Evaluate for underlying causes of tachycardia\n`;
        notes += `- Consider thyroid function tests\n`;
        notes += `- Assess hydration status and recent activities\n`;
      }
    }

    notes += `\nNote: This analysis is based on a 30-second single-lead recording. Full 12-lead ECG recommended for comprehensive cardiac assessment.`;

    return notes;
  }
}

export const ecgService = new ECGService();