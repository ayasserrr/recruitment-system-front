import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, Plus, Trash2, Save, Check, X,
  Wrench, AlertCircle, Loader2, Edit2, BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../contexts/DarkModeContext';
import * as api from '../api/knowledgeService';

const LEVELS = ['beginner', 'mid', 'high'];
const LEVEL_LABELS = { beginner: 'Beginner', mid: 'Mid', high: 'High' };

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function validateTool(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Required';
  else if (form.name.length > 100) errors.name = 'Max 100 characters';
  if (!form.slug.trim()) errors.slug = 'Required';
  else if (form.slug.length > 100) errors.slug = 'Max 100 characters';
  else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = 'Lowercase letters, numbers, hyphens only';
  if (!form.category_id) errors.category_id = 'Required';
  return errors;
}

const EMPTY_TOOL = { name: '', slug: '', description: '', category_id: '' };

export default function ToolManager({ onBack }) {
  const { isDarkMode } = useDarkMode();

  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('beginner');
  const [isCreating, setIsCreating] = useState(false);

  const [loadingTools, setLoadingTools] = useState(false);
  const [loadingTool, setLoadingTool] = useState(false);
  const [savingTool, setSavingTool] = useState(false);

  const [toolForm, setToolForm] = useState(EMPTY_TOOL);
  const [formErrors, setFormErrors] = useState({});
  const [slugManual, setSlugManual] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingVals, setEditingVals] = useState({ name: '', notes: '' });
  const [savingConceptId, setSavingConceptId] = useState(null);
  const [addingDraft, setAddingDraft] = useState(null);

  const [banner, setBanner] = useState(null);

  // ─── styling helpers ────────────────────────────────────────────────────────
  const surface = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200';
  const divider  = isDarkMode ? 'border-slate-700' : 'border-base-200';
  const textPri  = isDarkMode ? 'text-white' : 'text-base-900';
  const textMut  = isDarkMode ? 'text-gray-400' : 'text-base-500';
  const inputCls = [
    'w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent-400',
    isDarkMode
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-base-300 text-base-900 placeholder-base-400',
  ].join(' ');
  const rowBg = isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200';

  // ─── data loading ───────────────────────────────────────────────────────────
  const loadTools = useCallback(async (catId) => {
    setLoadingTools(true);
    try {
      setTools(await api.getTools(catId || undefined));
    } catch {
      toast.error('Failed to load tools');
    } finally {
      setLoadingTools(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setCategories(await api.getCategories());
      } catch {
        toast.error('Failed to load categories');
      }
    })();
    loadTools();
  }, [loadTools]);

  // ─── tool selection ─────────────────────────────────────────────────────────
  async function selectTool(tool) {
    setIsCreating(false);
    setAddingDraft(null);
    setEditingId(null);
    setFormErrors({});
    setBanner(null);
    setActiveTab('beginner');
    setLoadingTool(true);
    try {
      const full = await api.getTool(tool.id);
      setSelectedTool(full);
      setToolForm({ name: full.name, slug: full.slug, description: full.description || '', category_id: String(full.category_id) });
      setSlugManual(true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingTool(false);
    }
  }

  function startCreate() {
    setSelectedTool(null);
    setIsCreating(true);
    setFormErrors({});
    setBanner(null);
    setAddingDraft(null);
    setEditingId(null);
    setToolForm(EMPTY_TOOL);
    setSlugManual(false);
  }

  // ─── tool form ──────────────────────────────────────────────────────────────
  function onNameChange(name) {
    setToolForm(f => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
    setFormErrors(e => ({ ...e, name: undefined }));
  }

  function onSlugChange(slug) {
    setSlugManual(true);
    setToolForm(f => ({ ...f, slug }));
    setFormErrors(e => ({ ...e, slug: undefined }));
  }

  async function saveTool() {
    const errors = validateTool(toolForm);
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSavingTool(true);
    try {
      const payload = { name: toolForm.name, slug: toolForm.slug, description: toolForm.description, category_id: Number(toolForm.category_id) };
      if (isCreating) {
        const created = await api.createTool(payload);
        toast.success('Tool created');
        await loadTools(categoryFilter || undefined);
        const full = await api.getTool(created.id);
        setSelectedTool(full);
        setIsCreating(false);
        setSlugManual(true);
      } else {
        await api.updateTool(selectedTool.id, payload);
        toast.success('Tool updated');
        await loadTools(categoryFilter || undefined);
        const full = await api.getTool(selectedTool.id);
        setSelectedTool(full);
      }
      setFormErrors({});
    } catch (err) {
      handleError(err, true);
    } finally {
      setSavingTool(false);
    }
  }

  async function deleteTool() {
    if (!selectedTool) return;
    if (!window.confirm(`Delete "${selectedTool.name}" and all its concepts?`)) return;
    try {
      await api.deleteTool(selectedTool.id);
      toast.success('Tool deleted');
      setSelectedTool(null);
      setIsCreating(false);
      await loadTools(categoryFilter || undefined);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error('Remove all tools in this category first.');
      } else {
        handleError(err);
      }
    }
  }

  // ─── concepts ───────────────────────────────────────────────────────────────
  const conceptsForTab = selectedTool?.concepts?.filter(c => c.level === activeTab) ?? [];

  function startEdit(concept) {
    setAddingDraft(null);
    setEditingId(concept.id);
    setEditingVals({ name: concept.name, notes: concept.notes || '' });
  }

  function cancelEdit() { setEditingId(null); }

  async function saveEdit(id) {
    if (!editingVals.name.trim()) { toast.error('Concept name is required'); return; }
    if (editingVals.name.length > 200) { toast.error('Name: max 200 characters'); return; }
    setSavingConceptId(id);
    try {
      await api.updateConcept(id, { name: editingVals.name, notes: editingVals.notes });
      setSelectedTool(await api.getTool(selectedTool.id));
      setEditingId(null);
      toast.success('Concept saved');
    } catch (err) {
      handleError(err);
    } finally {
      setSavingConceptId(null);
    }
  }

  async function deleteConcept(id) {
    try {
      await api.deleteConcept(id);
      setSelectedTool(await api.getTool(selectedTool.id));
    } catch (err) {
      handleError(err);
    }
  }

  function startAdd() {
    setEditingId(null);
    setAddingDraft({ name: '', notes: '' });
  }

  function cancelAdd() { setAddingDraft(null); }

  async function confirmAdd() {
    if (!addingDraft.name.trim()) { toast.error('Concept name is required'); return; }
    if (addingDraft.name.length > 200) { toast.error('Name: max 200 characters'); return; }
    try {
      await api.createConcept({ tool_id: selectedTool.id, level: activeTab, name: addingDraft.name, notes: addingDraft.notes });
      setSelectedTool(await api.getTool(selectedTool.id));
      setAddingDraft(null);
      toast.success('Concept added');
    } catch (err) {
      handleError(err);
    }
  }

  // ─── error handler ──────────────────────────────────────────────────────────
  function handleError(err, setFields = false) {
    if (!err.response) {
      setBanner('Network error — check your connection and try again.');
      toast.error('Network error');
      return;
    }
    const { status, data } = err.response;
    if (status === 404) {
      setBanner('Resource not found.');
      toast.error('Not found');
    } else if (status === 422 && setFields) {
      const detail = data?.detail;
      if (Array.isArray(detail)) {
        const fe = {};
        detail.forEach(d => {
          const field = d.loc?.[d.loc.length - 1];
          if (field) fe[field] = d.msg;
        });
        setFormErrors(fe);
        toast.error('Validation error — check highlighted fields');
      } else {
        toast.error(detail || 'Validation error');
      }
    } else {
      toast.error(data?.detail || `Error ${status}`);
    }
  }

  // ─── render ─────────────────────────────────────────────────────────────────
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div className={`flex flex-col h-[calc(100vh-65px)] ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>

      {/* Sub-header */}
      <div className={`flex items-center gap-4 px-6 py-3 border-b flex-shrink-0 ${surface}`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-base-500 hover:text-base-900'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className={`text-sm ${isDarkMode ? 'text-slate-600' : 'text-base-300'}`}>/</span>
        <div className="flex items-center gap-2">
          <BookOpen className={`w-4 h-4 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
          <span className={`text-sm font-semibold ${textPri}`}>Tool Manager</span>
        </div>
      </div>

      {/* Banner */}
      {banner && (
        <div className="mx-6 mt-3 flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{banner}</span>
          <button onClick={() => setBanner(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <aside className={`w-72 flex-shrink-0 flex flex-col border-r ${surface}`}>
          <div className={`p-4 space-y-3 border-b flex-shrink-0 ${divider}`}>
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                loadTools(e.target.value || undefined);
                setSelectedTool(null);
                setIsCreating(false);
              }}
              className={inputCls}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <button
              onClick={startCreate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Tool
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingTools ? (
              <div className="flex justify-center py-10">
                <Loader2 className={`w-5 h-5 animate-spin ${textMut}`} />
              </div>
            ) : tools.length === 0 ? (
              <p className={`text-center py-10 text-sm ${textMut}`}>No tools found</p>
            ) : (
              <ul className={`divide-y ${divider}`}>
                {tools.map(tool => {
                  const cat = catMap[tool.category_id];
                  const active = selectedTool?.id === tool.id;
                  return (
                    <li key={tool.id}>
                      <button
                        onClick={() => selectTool(tool)}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          active
                            ? isDarkMode ? 'bg-slate-700 border-l-2 border-accent-400' : 'bg-accent-50 border-l-2 border-accent-500'
                            : isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-50'
                        }`}
                      >
                        <p className={`text-sm font-medium ${textPri}`}>{tool.name}</p>
                        {cat && (
                          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-base-100 text-base-600'}`}>
                            {cat.label}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedTool && !isCreating ? (
            <div className={`flex flex-col items-center justify-center h-full gap-3 ${textMut}`}>
              <Wrench className="w-10 h-10 opacity-25" />
              <p className="text-sm">Select a tool to edit, or click "Add New Tool"</p>
            </div>
          ) : loadingTool ? (
            <div className="flex justify-center py-20">
              <Loader2 className={`w-7 h-7 animate-spin ${isDarkMode ? 'text-accent-400' : 'text-accent-500'}`} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">

              {/* ── Tool form card ── */}
              <section className={`rounded-xl border p-6 space-y-4 ${surface}`}>
                <h2 className={`text-base font-semibold flex items-center gap-2 ${textPri}`}>
                  <Wrench className="w-4 h-4" />
                  {isCreating ? 'New Tool' : 'Edit Tool'}
                </h2>

                {/* Category */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textMut}`}>Category <span className="text-red-500">*</span></label>
                  <select
                    value={toolForm.category_id}
                    onChange={e => { setToolForm(f => ({ ...f, category_id: e.target.value })); setFormErrors(er => ({ ...er, category_id: undefined })); }}
                    className={`${inputCls} ${formErrors.category_id ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select a category…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  {formErrors.category_id && <p className="text-red-500 text-xs mt-1">{formErrors.category_id}</p>}
                </div>

                {/* Name */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textMut}`}>Tool Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={toolForm.name}
                    onChange={e => onNameChange(e.target.value)}
                    placeholder="e.g. FastAPI"
                    maxLength={100}
                    className={`${inputCls} ${formErrors.name ? 'border-red-400' : ''}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textMut}`}>Slug <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={toolForm.slug}
                    onChange={e => onSlugChange(e.target.value)}
                    placeholder="e.g. fastapi"
                    maxLength={100}
                    className={`${inputCls} font-mono ${formErrors.slug ? 'border-red-400' : ''}`}
                  />
                  {formErrors.slug && <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textMut}`}>Description</label>
                  <textarea
                    value={toolForm.description}
                    onChange={e => setToolForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                    className={inputCls}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={saveTool}
                    disabled={savingTool}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {savingTool ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isCreating ? 'Create Tool' : 'Save Changes'}
                  </button>
                  {!isCreating && selectedTool && (
                    <button
                      onClick={deleteTool}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </section>

              {/* ── Concepts editor ── */}
              {!isCreating && selectedTool && (
                <section className={`rounded-xl border overflow-hidden ${surface}`}>
                  <div className={`px-6 py-4 border-b ${divider}`}>
                    <h3 className={`text-base font-semibold ${textPri}`}>Concepts</h3>
                    <p className={`text-xs mt-0.5 ${textMut}`}>Knowledge items used to generate assessment questions</p>
                  </div>

                  {/* Level tabs */}
                  <div className={`flex border-b ${divider}`}>
                    {LEVELS.map(level => {
                      const count = selectedTool.concepts?.filter(c => c.level === level).length ?? 0;
                      const active = activeTab === level;
                      return (
                        <button
                          key={level}
                          onClick={() => { setActiveTab(level); setEditingId(null); setAddingDraft(null); }}
                          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            active
                              ? isDarkMode ? 'border-accent-400 text-accent-400' : 'border-accent-500 text-accent-600'
                              : isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-base-500 hover:text-base-800'
                          }`}
                        >
                          {LEVEL_LABELS[level]}
                          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-base-100 text-base-500'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Concept rows */}
                  <div className="p-4 space-y-2">
                    {conceptsForTab.length === 0 && !addingDraft && (
                      <p className={`text-sm text-center py-4 ${textMut}`}>No {activeTab} concepts yet</p>
                    )}

                    {conceptsForTab.map(concept => {
                      const isEditing = editingId === concept.id;
                      const isSaving = savingConceptId === concept.id;

                      return (
                        <div key={concept.id} className={`rounded-lg border p-3 transition-colors ${rowBg}`}>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingVals.name}
                                onChange={e => setEditingVals(v => ({ ...v, name: e.target.value }))}
                                placeholder="Concept name"
                                maxLength={200}
                                className={inputCls}
                                autoFocus
                              />
                              <textarea
                                value={editingVals.notes}
                                onChange={e => setEditingVals(v => ({ ...v, notes: e.target.value }))}
                                placeholder="Notes to guide the AI (optional)"
                                rows={2}
                                className={inputCls}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(concept.id)}
                                  disabled={isSaving}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                                >
                                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-base-200 hover:bg-base-300 text-base-700'}`}
                                >
                                  <X className="w-3 h-3" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex items-start gap-3 cursor-pointer group"
                              onClick={() => startEdit(concept)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${textPri}`}>{concept.name}</p>
                                {concept.notes && (
                                  <p className={`text-xs mt-1 line-clamp-2 ${textMut}`}>{concept.notes}</p>
                                )}
                              </div>
                              <div
                                className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={e => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => startEdit(concept)}
                                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-600' : 'text-base-400 hover:text-base-900 hover:bg-base-200'}`}
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteConcept(concept.id)}
                                  className={`p-1.5 rounded-lg transition-colors text-red-400 hover:text-red-600 ${isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-red-50'}`}
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Draft new concept row */}
                    {addingDraft && (
                      <div className={`rounded-lg border-2 p-3 space-y-2 ${isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-400 bg-accent-50'}`}>
                        <input
                          type="text"
                          value={addingDraft.name}
                          onChange={e => setAddingDraft(a => ({ ...a, name: e.target.value }))}
                          placeholder="Concept name (required)"
                          maxLength={200}
                          className={inputCls}
                          autoFocus
                        />
                        <textarea
                          value={addingDraft.notes}
                          onChange={e => setAddingDraft(a => ({ ...a, notes: e.target.value }))}
                          placeholder="Notes to guide the AI (optional)"
                          rows={2}
                          className={inputCls}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={confirmAdd}
                            className="flex items-center gap-1 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Confirm
                          </button>
                          <button
                            onClick={cancelAdd}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-base-200 hover:bg-base-300 text-base-700'}`}
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Add button */}
                    {!addingDraft && (
                      <button
                        onClick={startAdd}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
                          isDarkMode
                            ? 'border-slate-600 text-gray-500 hover:border-accent-500 hover:text-accent-400'
                            : 'border-base-300 text-base-400 hover:border-accent-400 hover:text-accent-600'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Concept
                      </button>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
