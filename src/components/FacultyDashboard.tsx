
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, AttendanceRecord, User } from '@/pages/Index';
import { Calendar, Book, Users, CheckCircle } from 'lucide-react';

interface FacultyDashboardProps {
  user: User;
  students: Student[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export const FacultyDashboard = ({
  user,
  students,
  subjects,
  attendance,
  onMarkAttendance,
}: FacultyDashboardProps) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter subjects taught by this faculty
  const mySubjects = subjects.filter(subject => 
    subject.faculty.toLowerCase().includes(user.name.toLowerCase()) ||
    subject.faculty === user.name
  );

  // Get students for selected subject
  const getStudentsForSubject = () => {
    if (!selectedSubject) return [];
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return [];
    
    return students.filter(student => 
      student.program === subject.program && 
      student.year === subject.year
    );
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedSubject) return;

    // Check if attendance already marked for this student, subject, and date
    const existingRecord = attendance.find(record => 
      record.studentId === studentId &&
      record.subjectId === selectedSubject &&
      record.date === attendanceDate
    );

    if (existingRecord) {
      alert('Attendance already marked for this student today');
      return;
    }

    onMarkAttendance({
      studentId,
      subjectId: selectedSubject,
      date: attendanceDate,
      status,
      markedBy: user.id,
    });
  };

  const getAttendanceForStudent = (studentId: string) => {
    return attendance.find(record => 
      record.studentId === studentId &&
      record.subjectId === selectedSubject &&
      record.date === attendanceDate
    );
  };

  const studentsForSubject = getStudentsForSubject();
  const todayAttendance = attendance.filter(record => record.date === attendanceDate).length;
  const mySubjectsCount = mySubjects.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mySubjectsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Marking Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select a subject and date to mark student attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mySubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code}) - {subject.program} Year {subject.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {selectedSubject && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsForSubject.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No students found for this subject
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentsForSubject.map((student) => {
                      const attendanceRecord = getAttendanceForStudent(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {attendanceRecord ? (
                              <Badge 
                                variant={attendanceRecord.status === 'present' ? 'default' : 'destructive'}
                                className={
                                  attendanceRecord.status === 'present' 
                                    ? 'bg-green-100 text-green-800' 
                                    : attendanceRecord.status === 'late'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {attendanceRecord.status}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not marked</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!attendanceRecord ? (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAttendance(student.id, 'present')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Present
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id, 'late')}
                                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                >
                                  Late
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleMarkAttendance(student.id, 'absent')}
                                >
                                  Absent
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Marked
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>My Subjects</CardTitle>
          <CardDescription>Subjects you are assigned to teach</CardDescription>
        </CardHeader>
        <CardContent>
          {mySubjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No subjects assigned yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySubjects.map((subject) => (
                <Card key={subject.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{subject.code}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline">{subject.program}</Badge>
                      <span className="text-sm text-gray-500">Year {subject.year}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
