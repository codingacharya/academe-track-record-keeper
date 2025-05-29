
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Subject, AttendanceRecord, User } from '@/pages/Index';
import { Calendar, Book, TrendingUp, Clock } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  subjects: Subject[];
  attendance: AttendanceRecord[];
}

export const StudentDashboard = ({
  user,
  subjects,
  attendance,
}: StudentDashboardProps) => {
  // Filter subjects for student's program
  const mySubjects = subjects.filter(subject => 
    subject.program === user.program
  );

  // Get attendance records for this student
  const myAttendance = attendance.filter(record => {
    // Since we're simulating, we'll assume the student ID matches the user ID
    // In a real system, you'd have proper student ID mapping
    return record.studentId === user.id;
  });

  // Calculate attendance statistics
  const totalClasses = myAttendance.length;
  const presentClasses = myAttendance.filter(record => record.status === 'present').length;
  const lateClasses = myAttendance.filter(record => record.status === 'late').length;
  const absentClasses = myAttendance.filter(record => record.status === 'absent').length;
  const attendancePercentage = totalClasses > 0 ? ((presentClasses + lateClasses * 0.5) / totalClasses * 100).toFixed(1) : '0';

  // Get attendance by subject
  const getAttendanceBySubject = (subjectId: string) => {
    const subjectAttendance = myAttendance.filter(record => record.subjectId === subjectId);
    const present = subjectAttendance.filter(record => record.status === 'present').length;
    const late = subjectAttendance.filter(record => record.status === 'late').length;
    const total = subjectAttendance.length;
    return {
      total,
      present,
      late,
      absent: total - present - late,
      percentage: total > 0 ? ((present + late * 0.5) / total * 100).toFixed(1) : '0'
    };
  };

  // Recent attendance (last 10 records)
  const recentAttendance = myAttendance
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
          <p className="text-sm text-gray-500">{user.program} Program</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {presentClasses + lateClasses} of {totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentClasses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Your attendance breakdown by subject</CardDescription>
        </CardHeader>
        <CardContent>
          {mySubjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No subjects available for your program</p>
          ) : (
            <div className="space-y-4">
              {mySubjects.map((subject) => {
                const stats = getAttendanceBySubject(subject.id);
                return (
                  <div key={subject.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-gray-600">{subject.code} • Faculty: {subject.faculty}</p>
                      </div>
                      <Badge 
                        className={
                          parseFloat(stats.percentage) >= 75 
                            ? 'bg-green-100 text-green-800' 
                            : parseFloat(stats.percentage) >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {stats.percentage}%
                      </Badge>
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">Present: {stats.present}</span>
                      <span className="text-yellow-600">Late: {stats.late}</span>
                      <span className="text-red-600">Absent: {stats.absent}</span>
                      <span className="text-gray-600">Total: {stats.total}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(parseFloat(stats.percentage), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your latest attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendance records yet</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.map((record) => {
                    const subject = subjects.find(s => s.id === record.subjectId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subject?.name || 'Unknown Subject'}</div>
                            <div className="text-sm text-gray-500">{subject?.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === 'present' ? 'default' : 'destructive'}
                            className={
                              record.status === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : record.status === 'late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
