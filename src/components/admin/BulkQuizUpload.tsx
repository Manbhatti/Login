import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BulkUploadRow } from '../../types';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  Layers,
  Sparkles,
  FileText,
  Trash2,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface BulkQuizUploadProps {
  onImportComplete: () => void;
}

export const BulkQuizUpload: React.FC<BulkQuizUploadProps> = ({ onImportComplete }) => {
  const { courses, bulkImportQuestions } = useData();

  // 5-step workflow: 'upload' -> 'preview' -> 'validate' -> 'assign' -> 'imported'
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'validate' | 'assign' | 'imported'>('upload');

  // Input raw data & parsed rows
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<BulkUploadRow[]>([]);

  // Selected target course & topic
  const [targetCourseId, setTargetCourseId] = useState<string>(courses[0]?.id || '');
  const [targetTopicId, setTargetTopicId] = useState<string>(courses[0]?.topics[0]?.id || '');
  const [customQuizTitle, setCustomQuizTitle] = useState('');

  // Result summary
  const [importSummary, setImportSummary] = useState<{ count: number; title: string } | null>(null);

  // Sample CSV Template Generator
  const handleDownloadTemplate = () => {
    const csvContent =
      'Course,Subject,Topic,Question,QuestionType,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,Marks\n' +
      'CS101,Computer Science,Data Structures,What is the time complexity of searching in a balanced BST?,multiple_choice,O(1),O(log n),O(n),O(n^2),B,Balanced trees split elements logarithmically,2\n' +
      'CS101,Computer Science,Data Structures,A stack follows First-In-First-Out (FIFO) ordering.,true_false,True,False,,,B,A stack is LIFO (Last-In-First-Out),1\n' +
      'BIO202,Cellular Biology,Genetics,Which nitrogenous base is found in RNA but not DNA?,multiple_choice,Thymine,Uracil,Cytosine,Guanine,B,RNA substitutes Uracil for Thymine,2\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'quiz_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV / TSV text parser
  const parseCSV = (content: string) => {
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) return [];

    // Detect delimiter: comma, tab, semicolon
    const headerLine = lines[0];
    const delimiter = headerLine.includes('\t')
      ? '\t'
      : headerLine.includes(';')
      ? ';'
      : ',';

    const headers = headerLine.split(delimiter).map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

    const rows: BulkUploadRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Simple regex for quoted CSV columns or standard split
      const rawCols = lines[i].split(delimiter);
      if (rawCols.length < 4) continue;

      const getVal = (possibleHeaders: string[]) => {
        for (const ph of possibleHeaders) {
          const idx = headers.indexOf(ph);
          if (idx !== -1 && rawCols[idx] !== undefined) {
            return rawCols[idx].trim().replace(/^["']|["']$/g, '');
          }
        }
        return '';
      };

      const course = getVal(['course', 'coursecode', 'courseid']) || 'General';
      const subject = getVal(['subject', 'coursesubject']) || 'General';
      const topic = getVal(['topic', 'topictitle']) || 'Topic';
      const question = getVal(['question', 'questiontext', 'q']);
      const questionType = getVal(['questiontype', 'type', 'qtype']) || 'multiple_choice';
      const optionA = getVal(['optiona', 'opta', 'a']);
      const optionB = getVal(['optionb', 'optb', 'b']);
      const optionC = getVal(['optionc', 'optc', 'c']);
      const optionD = getVal(['optiond', 'optd', 'd']);
      const correctAnswer = (getVal(['correctanswer', 'answer', 'correct']) || 'A').toUpperCase();
      const explanation = getVal(['explanation', 'reason', 'notes']) || '';
      const marks = parseInt(getVal(['marks', 'points', 'mark']) || '1', 10) || 1;

      // Validation
      const errors: string[] = [];
      if (!question) errors.push('Missing question text');
      if (!optionA) errors.push('Missing Option A');
      if (!optionB) errors.push('Missing Option B');
      if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        errors.push(`Invalid correct answer '${correctAnswer}' (must be A, B, C, or D)`);
      }

      rows.push({
        course,
        subject,
        topic,
        question,
        questionType,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        marks,
        isValid: errors.length === 0,
        errors,
      });
    }

    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      const parsed = parseCSV(text);
      setParsedRows(parsed);
      setCurrentStep('preview');
    };
    reader.readAsText(file);
  };

  const handleProcessPastedText = () => {
    if (!rawText.trim()) return;
    setFileName('Pasted_Questions_Dataset.csv');
    const parsed = parseCSV(rawText);
    setParsedRows(parsed);
    setCurrentStep('preview');
  };

  const handleLoadDemoDataset = () => {
    const demoData =
      'Course,Subject,Topic,Question,QuestionType,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,Marks\n' +
      'CS101,Computer Science,Data Structures,Which data structure provides constant O(1) amortized queue enqueue and dequeue?,multiple_choice,Array,Doubly Linked List Queue,Binary Tree,Heap,B,Doubly linked queues maintain head and tail pointers for O(1) operations,2\n' +
      'CS101,Computer Science,Data Structures,Hash collisions can be resolved using open addressing or chaining.,true_false,True,False,,,A,Both chaining with linked lists and linear probing are standard collision resolution schemes,1\n' +
      'CS101,Computer Science,Data Structures,What is the maximum number of children a binary tree node can possess?,multiple_choice,1,2,3,Unlimited,B,Binary tree nodes have at most two children: left and right,2\n' +
      'CS101,Computer Science,Data Structures,A binary search tree guarantees O(log n) search even without balancing.,true_false,True,False,,,B,Degenerate BSTs can skew into linked lists with O(n) search time,1\n';

    setRawText(demoData);
    setFileName('Demo_Data_Structures_Batch.csv');
    const parsed = parseCSV(demoData);
    setParsedRows(parsed);
    setCurrentStep('preview');
  };

  const handleImportNow = () => {
    const selectedCourse = courses.find((c) => c.id === targetCourseId);
    const selectedTopic = selectedCourse?.topics.find((t) => t.id === targetTopicId);

    const res = bulkImportQuestions(
      parsedRows,
      targetCourseId,
      targetTopicId,
      customQuizTitle || `${selectedTopic?.title || 'Topic'} Assessment`
    );

    setImportSummary({ count: res.importedCount, title: res.quizTitle });
    setCurrentStep('imported');
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  const currentCourse = courses.find((c) => c.id === targetCourseId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Bulk Quiz Question Upload
          </h1>
          <p className="text-sm text-slate-500">
            Import hundreds of quiz questions and answers instantly via CSV or Excel tabular format.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>Download CSV Template</span>
        </button>
      </div>

      {/* 5-Step Workflow Stepper Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { id: 'upload', label: '1. Upload File' },
            { id: 'preview', label: '2. Preview Questions' },
            { id: 'validate', label: '3. Validate Data' },
            { id: 'assign', label: '4. Assign Course/Topic' },
            { id: 'imported', label: '5. Import Complete' },
          ].map((step, idx) => {
            const stepOrder = ['upload', 'preview', 'validate', 'assign', 'imported'];
            const currentIndex = stepOrder.indexOf(currentStep);
            const thisIndex = stepOrder.indexOf(step.id);
            const isDone = thisIndex < currentIndex;
            const isCurrent = thisIndex === currentIndex;

            return (
              <div
                key={step.id}
                className={`py-2 px-1 rounded-xl transition-all font-semibold ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : isDone
                    ? 'text-emerald-700 bg-emerald-50/60'
                    : 'text-slate-400 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span className="truncate">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD FILE / PASTE DATA */}
      {currentStep === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Dropzone */}
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Upload CSV / Excel File</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Drag and drop your spreadsheet or click to browse files on your computer.
              </p>

              <label className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs">
                <span>Select File from Computer</span>
                <input
                  type="file"
                  accept=".csv, .tsv, .txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-slate-400 mt-3">Supports .csv, .tsv, UTF-8 text</span>
            </div>

            {/* Quick Demo or Paste Area */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Paste Tabular / CSV Data</h3>
                  <button
                    type="button"
                    onClick={handleLoadDemoDataset}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Demo 4-Question Set</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste CSV rows here (Course, Subject, Topic, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Marks)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  disabled={!rawText.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Parse & Preview Questions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW QUESTIONS */}
      {currentStep === 'preview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Preview Questions ({parsedRows.length} detected)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Source: {fileName || 'Imported dataset'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Upload Different File
              </button>
              <button
                onClick={() => setCurrentStep('validate')}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>Proceed to Validate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Options</th>
                  <th className="py-2.5 px-3">Answer</th>
                  <th className="py-2.5 px-3">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate">
                      {row.question || <span className="text-rose-500 italic">Empty Question</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{row.questionType}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      A: {row.optionA || '-'} | B: {row.optionB || '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {row.correctAnswer}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{row.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 3: VALIDATE DATA */}
      {currentStep === 'validate' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Data Validation Report</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifying question completeness, options mapping, and valid correct answer keys.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep('preview')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                disabled={validCount === 0}
                onClick={() => setCurrentStep('assign')}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>Continue to Assignment ({validCount} Ready)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Validation Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800">Valid & Importable</span>
                <p className="text-xl font-bold text-emerald-950">{validCount} Questions</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-rose-800">Issues Detected</span>
                <p className="text-xl font-bold text-rose-950">{invalidCount} Questions</p>
              </div>
            </div>
          </div>

          {/* Validation Item Breakdown */}
          <div className="space-y-3">
            {parsedRows.map((row, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  row.isValid
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-700">Q{idx + 1}:</span>
                    <span className="font-bold text-slate-900">{row.question || 'Missing question'}</span>
                  </div>
                  <span className="text-slate-500">
                    Ans: <strong>{row.correctAnswer}</strong> • Marks: <strong>{row.marks}</strong>
                  </span>
                </div>

                <div>
                  {row.isValid ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-100 px-2.5 py-1 rounded-full text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> {row.errors.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: ASSIGN COURSE / TOPIC */}
      {currentStep === 'assign' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Assign to Course & Topic</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which course and syllabus topic will host these imported questions.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Course
              </label>
              <select
                value={targetCourseId}
                onChange={(e) => {
                  setTargetCourseId(e.target.value);
                  const found = courses.find((c) => c.id === e.target.value);
                  if (found && found.topics.length > 0) {
                    setTargetTopicId(found.topics[0].id);
                  }
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {currentCourse && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Topic
                </label>
                <select
                  value={targetTopicId}
                  onChange={(e) => setTargetTopicId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {currentCourse.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quiz Title (Optional)
              </label>
              <input
                type="text"
                value={customQuizTitle}
                onChange={(e) => setCustomQuizTitle(e.target.value)}
                placeholder="e.g. Midterm Comprehensive Assessment"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('validate')}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleImportNow}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Ingest {validCount} Questions</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: IMPORT COMPLETE */}
      {currentStep === 'imported' && importSummary && (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Import Succeeded!
          </h3>
          <p className="text-sm text-slate-600">
            Successfully imported <strong>{importSummary.count} questions</strong> and created new quiz:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-xs text-indigo-700">
            {importSummary.title}
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setRawText('');
                setFileName(null);
                setParsedRows([]);
                setCurrentStep('upload');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Upload Another Batch
            </button>
            <button
              onClick={onImportComplete}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              View Quizzes Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
