import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { LearningResource, ResourceType } from '../../types';
import {
  FolderOpen,
  FilePlus,
  FileText,
  Video,
  Presentation,
  FileCode,
  Search,
  Filter,
  Edit2,
  Trash2,
  Upload,
  Plus,
  X,
  CheckCircle2,
  Layers,
  Download,
} from 'lucide-react';

export const ResourceManagement: React.FC = () => {
  const { courses, resources, addResource, updateResource, deleteResource } = useData();

  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [deleteConfirmResource, setDeleteConfirmResource] = useState<LearningResource | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courses[0]?.id || '',
    subject: courses[0]?.title || '',
    topicId: courses[0]?.topics[0]?.id || '',
    type: 'pdf' as ResourceType,
    fileSize: '2.5 MB',
    duration: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: '',
  });

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (selectedCourseFilter !== 'all' && res.courseId !== selectedCourseFilter) return false;
      if (selectedTypeFilter !== 'all' && res.type !== selectedTypeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(query) ||
          res.description.toLowerCase().includes(query) ||
          res.subject.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [resources, selectedCourseFilter, selectedTypeFilter, searchQuery]);

  const handleOpenAdd = () => {
    const defaultCourse = courses[0];
    setFormData({
      title: '',
      description: '',
      courseId: defaultCourse?.id || '',
      subject: defaultCourse?.title || '',
      topicId: defaultCourse?.topics[0]?.id || '',
      type: 'pdf',
      fileSize: '3.2 MB',
      duration: '',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      contentNotes: '',
    });
    setEditingResource(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (res: LearningResource) => {
    setEditingResource(res);
    setFormData({
      title: res.title,
      description: res.description,
      courseId: res.courseId,
      subject: res.subject,
      topicId: res.topicId,
      type: res.type,
      fileSize: res.fileSize || '1.5 MB',
      duration: res.duration || '',
      url: res.url,
      contentNotes: res.contentNotes || '',
    });
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseId || !formData.topicId) return;

    const courseObj = courses.find((c) => c.id === formData.courseId);

    if (editingResource) {
      updateResource(editingResource.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        courseId: formData.courseId,
        subject: courseObj?.title || formData.subject,
        topicId: formData.topicId,
        type: formData.type,
        fileSize: formData.fileSize,
        duration: formData.duration,
        url: formData.url,
        contentNotes: formData.contentNotes,
      });
      setEditingResource(null);
    } else {
      addResource({
        title: formData.title.trim(),
        description: formData.description.trim(),
        courseId: formData.courseId,
        subject: courseObj?.title || formData.subject,
        topicId: formData.topicId,
        type: formData.type,
        fileSize: formData.fileSize,
        duration: formData.duration,
        url: formData.url,
        contentNotes: formData.contentNotes,
        assignedCourses: [formData.courseId],
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirmResource) {
      deleteResource(deleteConfirmResource.id);
      setDeleteConfirmResource(null);
    }
  };

  const currentFormCourse = courses.find((c) => c.id === formData.courseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Learning Resources Management
          </h1>
          <p className="text-sm text-slate-500">
            Upload and organize lecture documents, slide decks, and instructional videos into topics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>+ Upload Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, or description..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Course filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Resource Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="presentation">Presentations / Slides</option>
            <option value="video">Lecture Videos</option>
            <option value="document">Study Guides</option>
            <option value="material">Course Materials</option>
          </select>
        </div>
      </div>

      {/* Resources Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Catalogued Resources ({filteredResources.length})
          </span>
          <span className="text-xs text-slate-400">
            Organized hierarchically: Course → Subject → Topic → Resource
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Course & Topic</th>
                <th className="py-3 px-4">Size / Duration</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No learning resources found matching your current filters.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => {
                  const course = courses.find((c) => c.id === res.courseId);
                  const topic = course?.topics.find((t) => t.id === res.topicId);

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{res.title}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {res.description}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {res.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {course?.code || 'Course'}
                        </span>
                        <span className="text-[11px] text-slate-500">{topic?.title || 'Topic'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {res.fileSize || res.duration || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(res.uploadedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(res)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors"
                            title="Edit / Replace Resource"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmResource(res)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD / EDIT RESOURCE MODAL */}
      {(isAddModalOpen || editingResource) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingResource ? 'Edit Learning Resource' : 'Upload Learning Resource'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingResource(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chapter 4: Matrix Operations & Determinants"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of learning outcomes and key concepts..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Assign Course */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => {
                      const cId = e.target.value;
                      const matchCourse = courses.find((c) => c.id === cId);
                      setFormData({
                        ...formData,
                        courseId: cId,
                        subject: matchCourse?.title || '',
                        topicId: matchCourse?.topics[0]?.id || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign Topic */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Topic
                  </label>
                  <select
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                  >
                    {currentFormCourse?.topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as ResourceType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="presentation">Presentation / Slide Deck</option>
                    <option value="video">Lecture Video</option>
                    <option value="document">Study Guide / Notes</option>
                    <option value="material">Course Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    File Size / Duration
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g. 3.4 MB or 25 mins"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Attachment URL / Embed Link
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interactive Study Notes (Markdown format)
                </label>
                <textarea
                  rows={4}
                  value={formData.contentNotes}
                  onChange={(e) => setFormData({ ...formData, contentNotes: e.target.value })}
                  placeholder="Key concepts, formulas, definitions for students to read directly in the app..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingResource(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingResource ? 'Update Resource' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Resource?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to remove <strong className="text-slate-900">{deleteConfirmResource.title}</strong>? Students will no longer be able to access this material.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmResource(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
