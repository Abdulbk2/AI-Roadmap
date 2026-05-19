import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { BookOpen, Plus, FileDown, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { collection, query, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

export default function AcademicRoadmap() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    grade: '',
    credits: 3,
    semester: 'Fall',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const q = query(collection(db, `students/${user!.uid}/academic_records`));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `students/${user!.uid}/academic_records`);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const courseId = editingCourse ? editingCourse.id : Date.now().toString();
      await setDoc(doc(db, `students/${user.uid}/academic_records`, courseId), {
        studentId: user.uid,
        ...formData,
        createdAt: editingCourse ? editingCourse.createdAt : Date.now(),
        credits: parseInt(formData.credits as any, 10),
        year: parseInt(formData.year as any, 10)
      });
      loadCourses();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingCourse ? OperationType.UPDATE : OperationType.CREATE, `students/${user.uid}/academic_records/${editingCourse?.id || 'new'}`);
    }
  };

  const handleDeleteCourse = async () => {
    if (!user || !courseToDelete) return;
    try {
      await deleteDoc(doc(db, `students/${user.uid}/academic_records`, courseToDelete.id));
      loadCourses();
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `students/${user.uid}/academic_records/${courseToDelete.id}`);
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      courseName: '',
      grade: '',
      credits: 3,
      semester: 'Fall',
      year: new Date().getFullYear()
    });
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      grade: course.grade,
      credits: course.credits,
      semester: course.semester,
      year: course.year
    });
    setIsDialogOpen(true);
  };

  const openDelete = (course: any) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const printRoadmap = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:w-full print:bg-white print:text-black">
      <div className="flex justify-between items-center print-hide">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Roadmap</h1>
          <p className="text-muted-foreground mt-1">Track your course progression and plan your semesters.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={printRoadmap} variant="outline" className="text-muted-foreground border-border">
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogContent className="bg-card text-card-foreground border-border focus:outline-none">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveCourse} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Input 
                      required 
                      value={formData.courseCode}
                      onChange={e => setFormData({...formData, courseCode: e.target.value})}
                      placeholder="e.g. CS101" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Course Name</Label>
                    <Input 
                      required 
                      value={formData.courseName}
                      onChange={e => setFormData({...formData, courseName: e.target.value})}
                      placeholder="e.g. Intro to CS" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Input 
                      value={formData.grade}
                      onChange={e => setFormData({...formData, grade: e.target.value})}
                      placeholder="e.g. A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credits</Label>
                    <Input 
                      required 
                      type="number"
                      value={formData.credits}
                      onChange={e => setFormData({...formData, credits: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Input 
                      required 
                      value={formData.semester}
                      onChange={e => setFormData({...formData, semester: e.target.value})}
                      placeholder="e.g. Fall" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input 
                      required 
                      type="number"
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 2024})}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                  {editingCourse ? 'Update Course' : 'Save Course'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-card text-card-foreground border-border focus:outline-none max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center text-destructive">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Delete Course
                </DialogTitle>
                <DialogDescription className="text-muted-foreground pt-3">
                  Are you sure you want to delete <span className="font-bold text-foreground">{courseToDelete?.courseName}</span>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCourse}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="hidden print:block print:mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">My Academic Roadmap</h1>
        <p className="text-sm text-gray-500">Generated by AI Academic Advisor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2">
        {courses.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-card/50 border border-border rounded-xl border-dashed print:bg-transparent">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground print:text-black">No courses yet</h3>
            <p className="text-muted-foreground text-sm mt-1 print:text-gray-500">Add your completed or currently planning courses to build your roadmap.</p>
          </div>
        ) : (
          courses.map(course => (
            <Card key={course.id} className="bg-card border-border text-card-foreground group relative print:break-inside-avoid print:bg-white print:border-gray-300">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 print-hide z-10">
                <Button 
                  onClick={() => openEdit(course)}
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => openDelete(course)}
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 print:text-black print:border-gray-400 print:bg-transparent">{course.courseCode}</Badge>
                  <span className="font-bold text-lg print:text-black">{course.grade || 'Planned'}</span>
                </div>
                <CardTitle className="text-lg mt-2 print:text-black pr-16">{course.courseName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground print:text-gray-600">{course.semester} {course.year} • {course.credits} Credits</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
