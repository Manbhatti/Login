import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Course, CourseTopic } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Layers,
  ChevronRight,
  X,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, students, resources, quizzes } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseForTopics, setSelectedCourseForTopics] = useState<Course | null>(courses[0] || null);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');

  // Topic Addition State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  const handleOpenAdd = () => {
    setCode('');
    setTitle('');
    setDepartment('Computer Science');
    setInstructor('');
    setDescription('');
    setEditingCourse(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setCode(c.code);
    setTitle(c.title);
    setDepartment(c.department);
    setInstructor(c.instructor);
    setDescription(c.description);
    setIsAddModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        department: department.trim(),
        instructor: instructor.trim(),
        description: description.trim(),
      });
      setIsAddModalOpen(false);
      setEditingCourse(null);
    } else {
      const newCourse = addCourse({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        department: department.trim(),
        instructor: instructor.trim(),
        description: description.trim(),
        topics: [
          {
            id: `topic-${Date.now()}-1`,
            courseId: '',
            title: 'Foundational Introduction',
            description: 'Core concepts, definitions, and syllabus overview.',
            order: 1,
          },
        ],
      });
      setSelectedCourseForTopics(newCourse);
      setIsAddModalOpen(false);
    }
  };

  // Add a topic to currently selected course
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForTopics || !newTopicTitle.trim()) return;

    const newTopic: CourseTopic = {
      id: `topic-${Date.now()}`,
      courseId: selectedCourseForTopics.id,
      title: newTopicTitle.trim(),
      description: newTopicDesc.trim() || 'Comprehensive course syllabus topic.',
      order: selectedCourseForTopics.topics.length + 1,
    };

    const updatedTopics = [...selectedCourseForTopics.topics, newTopic];
    updateCourse(selectedCourseForTopics.id, { topics: updatedTopics });
    setSelectedCourseForTopics({ ...selectedCourseForTopics, topics: updatedTopics });
    setNewTopicTitle('');
    setNewTopicDesc('');
  };

  const handleRemoveTopic = (topicId: string) => {
    if (!selectedCourseForTopics) return;
    const updatedTopics = selectedCourseForTopics.topics.filter((t) => t.id !== topicId);
    updateCourse(selectedCourseForTopics.id, { topics: updatedTopics });
    setSelectedCourseForTopics({ ...selectedCourseForTopics, topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Courses & Subject Curricula
          </h1>
          <p className="text-sm text-slate-500">
            Define institutional subjects, syllabi topics, and instructor assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Courses list */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Courses ({courses.length})
          </h2>

          <div className="space-y-2.5">
            {courses.map((c) => {
              const isSelected = selectedCourseForTopics?.id === c.id;
              const studentCount = students.filter((s) => s.assignedCourses.includes(c.id)).length;
              const resCount = resources.filter((r) => r.courseId === c.id).length;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourseForTopics(c)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-indigo-700 border border-slate-200">
                      {c.code}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(c);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600"
                        title="Edit course"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete course ${c.code}?`)) deleteCourse(c.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.instructor}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{c.topics.length} Topics</span>
                    <span>{studentCount} Students</span>
                    <span>{resCount} Resources</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Topics for Selected Course */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourseForTopics ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">
                      {selectedCourseForTopics.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedCourseForTopics.department}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-serif">
                    {selectedCourseForTopics.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCourseForTopics.description}
                  </p>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Syllabus Topics ({selectedCourseForTopics.topics.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Topic order reflects study progression
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedCourseForTopics.topics.map((topic, index) => {
                    const topicResources = resources.filter(
                      (r) =>
                        r.courseId === selectedCourseForTopics.id && r.topicId === topic.id
                    );
                    const topicQuizzes = quizzes.filter(
                      (q) =>
                        q.courseId === selectedCourseForTopics.id && q.topicId === topic.id
                    );

                    return (
                      <div
                        key={topic.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{topic.description}</p>
                            <div className="mt-2 flex items-center gap-3 text-[11px] text-indigo-600 font-medium">
                              <span>{topicResources.length} Materials</span>
                              <span>•</span>
                              <span>{topicQuizzes.length} Quizzes</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveTopic(topic.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Topic Form */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  + Add Topic to {selectedCourseForTopics.code}
                </h4>
                <form onSubmit={handleAddTopic} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      placeholder="Topic Title (e.g. Graph Algorithms)"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newTopicDesc}
                      onChange={(e) => setNewTopicDesc(e.target.value)}
                      placeholder="Brief description or focus areas..."
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Save New Topic
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
              Select a course to view and edit topics.
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS205"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Operating Systems"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Instructor
                </label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. Robert Chen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course goals and syllabus focus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
