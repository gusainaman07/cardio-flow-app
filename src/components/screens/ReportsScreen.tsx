import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Activity, Download, Calendar } from "lucide-react";

interface ReportsScreenProps {
  onStartRecording: () => void;
}

const ReportsScreen = ({ onStartRecording }: ReportsScreenProps) => {
  // For now, showing empty state as specified in requirements
  const reports: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-light pb-20">
      <div className="max-w-md mx-auto px-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">ECG Reports</h1>
          <p className="text-muted-foreground">Your heart monitoring history</p>
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="shadow-card w-full text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Take your first ECG recording to see reports here
                </p>
                
                <Button 
                  onClick={onStartRecording} 
                  variant="hero" 
                  size="lg"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports List (for future implementation) */}
        {reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      ECG Report
                    </CardTitle>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {report.date}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient:</span>
                      <div className="font-medium">{report.patientName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="font-medium text-success">{report.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsScreen;