import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';

interface LessonWithPdf {
  moduleId: string;
  moduleTitle: string;
  sectionTitle: string;
  lessonId: string;
  lessonTitle: string;
  pdfPath: string;
  uploaded: boolean;
  uploading: boolean;
}

export default function PdfTab() {
  const [lessons, setLessons] = useState<LessonWithPdf[]>([]);
  const [existingFiles, setExistingFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [uploadingAll, setUploadingAll] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingConfirm, setDeletingConfirm] = useState<string | null>(null);

  // Build flat list of all lessons
  useEffect(() => {
    const all: LessonWithPdf[] = [];
    LEARNING_SECTIONS.forEach((section) => {
      section.modules.forEach((mod) => {
        mod.lessons.forEach((lesson) => {
          all.push({
            moduleId: mod.id,
            moduleTitle: `${mod.number}. ${mod.title}`,
            sectionTitle: section.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            pdfPath: lesson.pdfPath || `${mod.id}/${lesson.id}.pdf`,
            uploaded: false,
            uploading: false,
          });
        });
      });
    });
    setLessons(all);
  }, []);

  // List existing files in the bucket
  const fetchExisting = useCallback(async () => {
    setLoading(true);
    const files = new Set<string>();

    // List all folders/modules
    const moduleIds = [...new Set(lessons.map((l) => l.moduleId))];
    for (const modId of moduleIds) {
      const { data } = await supabase.storage.from('course-pdfs').list(modId);
      if (data) {
        data.forEach((f) => files.add(`${modId}/${f.name}`));
      }
    }

    setExistingFiles(files);
    setLoading(false);
  }, [lessons]);

  useEffect(() => {
    if (lessons.length > 0) fetchExisting();
  }, [lessons.length, fetchExisting]);

  const handleUpload = async (lesson: LessonWithPdf, file: File) => {
    setLessons((prev) =>
      prev.map((l) => (l.lessonId === lesson.lessonId && l.moduleId === lesson.moduleId ? { ...l, uploading: true } : l))
    );

    const { error } = await supabase.storage
      .from('course-pdfs')
      .upload(lesson.pdfPath, file, { upsert: true, contentType: 'application/pdf' });

    if (error) {
      setMessage({ type: 'error', text: `Грешка при качване на ${lesson.lessonTitle}: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: `${lesson.lessonTitle} — качен успешно!` });
      setExistingFiles((prev) => new Set(prev).add(lesson.pdfPath));
    }

    setLessons((prev) =>
      prev.map((l) => (l.lessonId === lesson.lessonId && l.moduleId === lesson.moduleId ? { ...l, uploading: false } : l))
    );

    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (lesson: LessonWithPdf) => {
    const { error } = await supabase.storage.from('course-pdfs').remove([lesson.pdfPath]);
    if (error) {
      setMessage({ type: 'error', text: `Грешка при изтриване: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: `${lesson.lessonTitle} — изтрит!` });
      setExistingFiles((prev) => {
        const next = new Set(prev);
        next.delete(lesson.pdfPath);
        return next;
      });
    }
    setDeletingConfirm(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const sections = LEARNING_SECTIONS;
  const totalLessons = lessons.length;
  const uploadedCount = lessons.filter((l) => existingFiles.has(l.pdfPath)).length;

  const filteredLessons = search
    ? lessons.filter(
        (l) =>
          l.lessonTitle.toLowerCase().includes(search.toLowerCase()) ||
          l.moduleTitle.toLowerCase().includes(search.toLowerCase()) ||
          l.sectionTitle.toLowerCase().includes(search.toLowerCase())
      )
    : lessons;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Общо уроци', value: totalLessons, icon: 'ri-file-pdf-2-line' },
          { label: 'Качени PDF', value: uploadedCount, icon: 'ri-check-double-line' },
          { label: 'Остават', value: totalLessons - uploadedCount, icon: 'ri-upload-cloud-2-line' },
          {
            label: 'Процент',
            value: totalLessons > 0 ? Math.round((uploadedCount / totalLessons) * 100) + '%' : '0%',
            icon: 'ri-pie-chart-line',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <i className={`${s.icon} text-[#0A2540]/65 text-sm`} />
              <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="text-2xl font-light text-[#0A2540]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#1C1C1E]/65">Прогрес на качване</span>
          <span className="text-xs text-[#0A2540] font-medium">
            {uploadedCount}/{totalLessons}
          </span>
        </div>
        <div className="w-full h-2 bg-[#F7F6F3] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
            style={{ width: totalLessons > 0 ? `${(uploadedCount / totalLessons) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg border text-xs ${
            message.type === 'success'
              ? 'bg-[#1B4332]/5 border-[#1B4332]/20 text-[#1B4332]'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/70 text-sm pointer-events-none" />
        <input
          type="text"
          placeholder="Търси урок или модул..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => {
            const isSectionExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => setExpandedSection(isSectionExpanded ? null : section.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F7F6F3]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: section.color + '12' }}
                    >
                      <i className={`${section.icon} text-sm`} style={{ color: section.color }} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-[#1C1C1E]">{section.title}</h3>
                      <p className="text-[10px] text-[#1C1C1E]/65">
                        {section.totalModules} модула ·{' '}
                        {
                          section.modules.reduce((sum, m) => sum + m.lessons.filter((l) => existingFiles.has(l.pdfPath || `${m.id}/${l.id}.pdf`)).length, 0)
                        }
                        /{section.totalLessons} качени
                      </p>
                    </div>
                  </div>
                  <i
                    className={`ri-arrow-down-s-line text-[#1C1C1E]/65 transition-transform duration-200 ${
                      isSectionExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isSectionExpanded && (
                  <div className="border-t border-[#1C1C1E]/6">
                    {section.modules.map((mod) => {
                      const isModExpanded = expandedModule === mod.id;
                      const modUploaded = mod.lessons.filter((l) =>
                        existingFiles.has(l.pdfPath || `${mod.id}/${l.id}.pdf`)
                      ).length;

                      return (
                        <div key={mod.id} className="border-b border-[#1C1C1E]/6 last:border-b-0">
                          {/* Module header */}
                          <button
                            onClick={() => setExpandedModule(isModExpanded ? null : mod.id)}
                            className="w-full flex items-center justify-between px-5 pl-12 py-3 hover:bg-[#F7F6F3]/30 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-left">
                              <span className="text-[10px] text-[#0A2540]/65 font-medium w-5">
                                {mod.number}
                              </span>
                              <span className="text-sm text-[#1C1C1E]">{mod.title}</span>
                              <span className="text-[10px] text-[#1C1C1E]/65">
                                ({modUploaded}/{mod.lessons.length})
                              </span>
                            </div>
                            <i
                              className={`ri-arrow-down-s-line text-[#1C1C1E]/65 text-sm transition-transform duration-200 ${
                                isModExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isModExpanded && (
                            <div className="border-t border-[#1C1C1E]/4 bg-[#F7F6F3]/30">
                              {mod.lessons.map((lesson) => {
                                const pdfPath = lesson.pdfPath || `${mod.id}/${lesson.id}.pdf`;
                                const isUploaded = existingFiles.has(pdfPath);
                                const lessonData = lessons.find(
                                  (l) => l.lessonId === lesson.id && l.moduleId === mod.id
                                );
                                const isUploading = lessonData?.uploading || false;

                                return (
                                  <div
                                    key={lesson.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 pl-16 py-3 border-b border-[#1C1C1E]/4 last:border-b-0"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          isUploaded ? 'bg-[#1B4332]' : 'bg-[#1C1C1E]/25'
                                        }`}
                                      />
                                      <div className="min-w-0">
                                        <span className="text-xs text-[#1C1C1E] block truncate">
                                          {lesson.title}
                                        </span>
                                        <span className="text-[10px] text-[#1C1C1E]/65">
                                          {pdfPath}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 ml-6 sm:ml-0">
                                      {isUploaded ? (
                                        <>
                                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center gap-1 whitespace-nowrap">
                                            <i className="ri-check-line text-xs" />
                                            Качен
                                          </span>
                                          {deletingConfirm === `${mod.id}-${lesson.id}` ? (
                                            <div className="flex items-center gap-1">
                                              <button
                                                onClick={() => handleDelete({ ...lessonData!, pdfPath } as LessonWithPdf)}
                                                className="text-[10px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                                              >
                                                Потвърди
                                              </button>
                                              <button
                                                onClick={() => setDeletingConfirm(null)}
                                                className="text-[10px] px-2 py-1 border border-[#1C1C1E]/10 text-[#1C1C1E]/65 rounded hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap"
                                              >
                                                Отказ
                                              </button>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => setDeletingConfirm(`${mod.id}-${lesson.id}`)}
                                              className="w-7 h-7 flex items-center justify-center rounded border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                              title="Изтрий PDF"
                                            >
                                              <i className="ri-delete-bin-line text-xs" />
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <label
                                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A2540]/20 text-[10px] text-[#0A2540] hover:bg-[#0A2540]/5 transition-all cursor-pointer whitespace-nowrap ${
                                            isUploading ? 'opacity-50 pointer-events-none' : ''
                                          }`}
                                        >
                                          {isUploading ? (
                                            <>
                                              <div className="w-3 h-3 border border-[#0A2540]/30 border-t-[#0A2540] rounded-full animate-spin" />
                                              Качва...
                                            </>
                                          ) : (
                                            <>
                                              <i className="ri-upload-cloud-2-line text-xs" />
                                              Качи PDF
                                            </>
                                          )}
                                          <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleUpload(
                                                  {
                                                    ...lessonData!,
                                                    pdfPath,
                                                  } as LessonWithPdf,
                                                  file
                                                );
                                              }
                                              e.target.value = '';
                                            }}
                                          />
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}