
import { useState, useEffect } from 'react';
import { AuthLogin } from '@/components/AuthLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { FacultyDashboard } from '@/components/FacultyDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { Sidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  program?: string;
  department?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  program: string;
  year: number;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  program: string;
  year: number;
  faculty: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedStudents = localStorage.getItem('attendance_students');
    const savedSubjects = localStorage.getItem('attendance_subjects');
    const savedAttendance = localStorage.getItem('attendance_records');
    
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    localStorage.setItem('attendance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendance_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('attendance_records', JSON.stringify(attendance));
  }, [attendance]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents([...students, newStudent]);
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    setSubjects([...subjects, newSubject]);
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setAttendance([...attendance, newRecord]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthLogin onLogin={setCurrentUser} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <AdminDashboard
            students={students}
            subjects={subjects}
            attendance={attendance}
            onAddStudent={addStudent}
            onAddSubject={addSubject}
          />
        );
      case 'faculty':
        return (
          <FacultyDashboard
            user={currentUser}
            students={students}
            subjects={subjects}
            attendance={attendance}
            onMarkAttendance={markAttendance}
          />
        );
      case 'student':
        return (
          <StudentDashboard
            user={currentUser}
            subjects={subjects}
            attendance={attendance}
          />
        );
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar user={currentUser} onLogout={logout} />
        <main className="flex-1 overflow-hidden">
          {renderDashboard()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
