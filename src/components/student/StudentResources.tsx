import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Course, LearningResource, ResourceType } from '../../types';
import {
  BookOpen,
  FileText,
  Video,
  Presentation,
  FileCode,
  Search,
  ChevronRight,
  Download,
  Eye,
  X,
  ExternalLink,
  Layers,
  FolderOpen,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface StudentResourcesProps {
  onBackToDashboard: () => void;
}

export const StudentResources: React.FC<StudentResourcesProps> = ({ onBackToDashboard }) => {
  const { currentStudent } = useAuth();
  const { courses, resources } = useData();

  // Filter courses assigned to this student
  const studentCourses = useMemo(() => {
    if (!currentStudent) return [];
    return courses.filter((c) => currentStudent.assignedCourses?.includes(c.id));
  }, [courses, currentStudent]);

  // Selected course state (defaults to first assigned course)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    studentCourses[0]?.id || ''
  );

  // Selected topic filter (optional, 'all' or specific topicId)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');

  // Resource type filter ('all' | 'pdf' | 'document' | 'presentation' | 'video' | 'material')
  const [selectedType, setSelectedType] = useState<string>('all');

  // Search keyword
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected resource for interactive modal viewer
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null);

  const currentCourse = studentCourses.find((c) => c.id === selectedCourseId);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Must match selected course
      if (res.courseId !== selectedCourseId) return false;

      // Filter topic
      if (selectedTopicId !== 'all' && res.topicId !== selectedTopicId) return false;

      // Filter type
      if (selectedType !== 'all' && res.type !== selectedType) return false;

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = res.title.toLowerCase().includes(query);
        const matchDesc = res.description.toLowerCase().includes(query);
        const matchSubject = res.subject.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchSubject;
      }

      return true;
    });
  }, [resources, selectedCourseId, selectedTopicId, selectedType, searchQuery]);

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'presentation':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'material':
      default:
        return <FileCode className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getResourceTypeBadge = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">PDF Document</span>;
      case 'video':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">Lecture Video</span>;
      case 'presentation':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">Slide Deck</span>;
      case 'document':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">Study Guide</span>;
      case 'material':
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Course Material</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={onBackToDashboard}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800">Student Resources</span>
            {currentCourse && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 font-semibold">{currentCourse.code}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Course Learning Resources
          </h1>
          <p className="text-sm text-slate-500">
            Access curriculum textbooks, lecture slides, video tutorials, and reference cheat sheets.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Course Selection Tabs (Course 1, Course 2, Course 3) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Select Your Course:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {studentCourses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            const courseResCount = resources.filter((r) => r.courseId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setSelectedTopicId('all');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{courseResCount} items</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Filter & Search Bar */}
      {currentCourse && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          {/* Topic Pills */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Filter by Topic:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTopicId('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTopicId === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Topics ({resources.filter((r) => r.courseId === currentCourse.id).length})
              </button>
              {currentCourse.topics.map((t) => {
                const topicResCount = resources.filter(
                  (r) => r.courseId === currentCourse.id && r.topicId === t.id
                ).length;
                const isSelected = selectedTopicId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{t.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-white' : 'bg-white text-slate-600'}`}>
                      {topicResCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Media Type filters */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, notes, or keyword..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {(['all', 'pdf', 'video', 'presentation', 'document'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    selectedType === type
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resources Cards Grid */}
      <div>
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No resources found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No learning materials match your current topic or search filter. Try clearing filters to view all course resources.
            </p>
            <button
              onClick={() => {
                setSelectedTopicId('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => {
              const topic = currentCourse?.topics.find((t) => t.id === res.topicId);
              return (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          {getResourceIcon(res.type)}
                        </div>
                        {getResourceTypeBadge(res.type)}
                      </div>
                      {res.fileSize && (
                        <span className="text-[11px] font-medium text-slate-400">
                          {res.fileSize}
                        </span>
                      )}
                      {res.duration && (
                        <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                          {res.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium text-slate-700">{topic?.title || 'General Topic'}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveResource(res)}
                      className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Study / Read In-App</span>
                    </button>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Download or open original"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Resource Viewer Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {getResourceIcon(activeResource.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    {getResourceTypeBadge(activeResource.type)}
                    <span className="text-xs text-slate-500 font-medium">
                      {activeResource.fileSize || activeResource.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {activeResource.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveResource(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Resource Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeResource.description}
                </p>
              </div>

              {/* Video embed if video type */}
              {activeResource.type === 'video' && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video flex items-center justify-center relative shadow-inner">
                  <iframe
                    src={activeResource.url}
                    title={activeResource.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Interactive In-App Study Notes & Cheatsheet */}
              {activeResource.contentNotes && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Curriculum Study Guide & Key Takeaways</span>
                  </h4>
                  <pre className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {activeResource.contentNotes}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <a
                href={activeResource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download / Open File Attachment</span>
              </a>

              <button
                onClick={() => setActiveResource(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
