import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ECGReport } from "@/services/ecgService";
import { Heart, Activity, Calendar, User, AlertCircle, CheckCircle2 } from "lucide-react";

interface PatientReportProps {
  report: ECGReport;
}

const PatientReport = ({ report }: PatientReportProps) => {
  const getRiskLevelColor = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelIcon = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'medium':
      case 'high':
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header */}
      <Card className="shadow-card border-primary/20">
        <CardHeader className="bg-gradient-hero text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <Heart className="w-6 h-6 mr-3" />
            Your ECG Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Patient:</span>
              <span className="ml-2 font-medium">{report.patients?.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2 font-medium">
                {new Date(report.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Heart Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {report.heart_rate || 'N/A'}
              {report.heart_rate && <span className="text-xl ml-1">bpm</span>}
            </div>
            <p className="text-muted-foreground">
              {report.heart_rate ? (
                report.heart_rate >= 60 && report.heart_rate <= 100
                  ? "Normal resting heart rate"
                  : report.heart_rate < 60
                  ? "Below normal range"
                  : "Above normal range"
              ) : (
                "Heart rate data not available"
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      {report.risk_level && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              {getRiskLevelIcon(report.risk_level)}
              <span className="ml-2">Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <Badge className={`px-4 py-2 text-sm font-medium ${getRiskLevelColor(report.risk_level)}`}>
                {report.risk_level.charAt(0).toUpperCase() + report.risk_level.slice(1)} Risk
              </Badge>
            </div>
            {report.rhythm_analysis && (
              <p className="text-center text-muted-foreground">
                {report.rhythm_analysis}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Abnormalities */}
      {report.abnormalities && report.abnormalities.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.abnormalities.map((abnormality, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                  <span className="text-sm">{abnormality}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Patient Summary */}
      {report.patient_summary && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Summary & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {report.patient_summary.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 last:mb-0 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="shadow-card border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-orange-800 mb-1">Important Notice</p>
              <p className="text-orange-700">
                This report is for informational purposes only and should not replace professional medical advice. 
                Please consult with your healthcare provider to discuss these results and any concerns you may have.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientReport;