import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ECGReport } from "@/services/ecgService";
import { 
  Activity, 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Stethoscope
} from "lucide-react";

interface DoctorReportProps {
  report: ECGReport;
}

const DoctorReport = ({ report }: DoctorReportProps) => {
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

  const getDataQualityMetrics = () => {
    if (!report.raw_data || !Array.isArray(report.raw_data)) {
      return { totalPoints: 0, samplingRate: 0, duration: report.duration };
    }

    const totalPoints = report.raw_data.length;
    const samplingRate = totalPoints / report.duration;
    
    return { totalPoints, samplingRate: Math.round(samplingRate), duration: report.duration };
  };

  const metrics = getDataQualityMetrics();

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Clinical Header */}
      <Card className="shadow-card">
        <CardHeader className="bg-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Stethoscope className="w-6 h-6 mr-3 text-primary" />
              ECG Clinical Report
            </CardTitle>
            <Badge variant="outline" className="px-3 py-1">
              Report ID: {report.id.slice(0, 8)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Patient</span>
              </div>
              <p className="font-semibold">{report.patients?.name}</p>
              <p className="text-sm text-muted-foreground">
                {report.patients?.age} yo {report.patients?.gender}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Date & Time</span>
              </div>
              <p className="font-semibold">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(report.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="font-semibold">{report.duration}s</p>
              <p className="text-sm text-muted-foreground">Single-lead</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Data Quality</span>
              </div>
              <p className="font-semibold">{metrics.samplingRate} Hz</p>
              <p className="text-sm text-muted-foreground">{metrics.totalPoints} points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinical Measurements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Clinical Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Heart Rate</span>
                <span className="text-lg font-bold text-primary">
                  {report.heart_rate || 'N/A'} {report.heart_rate && 'bpm'}
                </span>
              </div>
              {report.heart_rate && (
                <div className="text-xs text-muted-foreground">
                  {report.heart_rate >= 60 && report.heart_rate <= 100
                    ? "Normal range (60-100 bpm)"
                    : report.heart_rate < 60
                    ? "Bradycardic (<60 bpm)"
                    : "Tachycardic (>100 bpm)"
                  }
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Rhythm Analysis</span>
                {report.risk_level && (
                  <Badge className={getRiskLevelColor(report.risk_level)}>
                    {report.risk_level.toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {report.rhythm_analysis || 'Analysis pending'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Abnormalities */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Clinical Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.abnormalities && report.abnormalities.length > 0 ? (
              <ul className="space-y-3">
                {report.abnormalities.map((abnormality, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2" />
                    <div>
                      <span className="text-sm font-medium">{abnormality}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">No abnormalities detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Doctor's Notes */}
      {report.doctor_notes && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Clinical Notes & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none font-mono text-sm bg-slate-50 p-4 rounded-lg">
              {report.doctor_notes.split('\n').map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium capitalize">{report.status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Lead Configuration:</span>
              <p className="font-medium">Single-lead</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sampling Rate:</span>
              <p className="font-medium">{metrics.samplingRate} Hz</p>
            </div>
            <div>
              <span className="text-muted-foreground">Data Points:</span>
              <p className="font-medium">{metrics.totalPoints}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Disclaimer */}
      <Card className="shadow-card border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-slate-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-700">
              <p className="font-medium mb-1">Clinical Disclaimer</p>
              <p>
                This single-lead ECG analysis is for screening purposes only. A full 12-lead ECG and clinical 
                correlation are recommended for comprehensive cardiac assessment. Results should be interpreted 
                in the context of patient history, physical examination, and other relevant clinical data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorReport;