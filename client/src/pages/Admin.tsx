import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, FilePlus2, Loader2, Pencil, Plus, Save, ShieldAlert, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

type ContentType = "event" | "achievement" | "topper" | "faculty" | "alumni" | "gallery";
type EditableItem = {
  id: number;
  type: ContentType;
  title: string;
  subtitle: string | null;
  detail: string | null;
  dateLabel: string | null;
  sectionGroup: string | null;
  imageUrl: string | null;
  color: string | null;
  sortOrder: number;
};
type FormState = Omit<EditableItem, "id">;

const tabs: Array<{ value: "all" | ContentType; label: string }> = [
  { value: "all", label: "All content" },
  { value: "faculty", label: "Faculty" },
  { value: "topper", label: "Toppers" },
  { value: "event", label: "Events" },
  { value: "achievement", label: "Achievements" },
  { value: "alumni", label: "Alumni" },
  { value: "gallery", label: "Gallery" },
];

const emptyForm: FormState = {
  type: "event",
  title: "",
  subtitle: "",
  detail: "",
  dateLabel: "",
  sectionGroup: "upcoming",
  imageUrl: "",
  color: "gallery-cyan",
  sortOrder: 0,
};

function toForm(item: EditableItem): FormState {
  return {
    type: item.type,
    title: item.title,
    subtitle: item.subtitle ?? "",
    detail: item.detail ?? "",
    dateLabel: item.dateLabel ?? "",
    sectionGroup: item.sectionGroup ?? "",
    imageUrl: item.imageUrl ?? "",
    color: item.color ?? "",
    sortOrder: item.sortOrder,
  };
}

function AdminContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, FormState>>({});
  const [newItem, setNewItem] = useState<FormState>(emptyForm);
  const [showNew, setShowNew] = useState(false);
  const utils = trpc.useUtils();
  const contentQuery = trpc.content.list.useQuery(undefined, { enabled: Boolean(user?.role === "admin") });
  const updateMutation = trpc.content.update.useMutation({ onSuccess: () => utils.content.list.invalidate() });
  const createMutation = trpc.content.create.useMutation({ onSuccess: () => { setShowNew(false); setNewItem(emptyForm); utils.content.list.invalidate(); } });
  const removeMutation = trpc.content.remove.useMutation({ onSuccess: () => utils.content.list.invalidate() });

  useEffect(() => {
    if (!contentQuery.data) return;
    setDrafts(Object.fromEntries(contentQuery.data.map(item => [item.id, toForm(item as EditableItem)])));
  }, [contentQuery.data]);

  const items = useMemo(() => {
    const all = (contentQuery.data ?? []) as EditableItem[];
    return activeTab === "all" ? all : all.filter(item => item.type === activeTab);
  }, [activeTab, contentQuery.data]);

  if (loading) {
    return <div className="admin-loading"><Loader2 className="animate-spin" /> Loading your workspace…</div>;
  }

  if (!user) {
    return <div className="admin-empty"><ShieldAlert size={36} /><h1>Sign in to edit the department site</h1><p>Use your Manus account to open the protected content editor.</p><Button onClick={() => startLogin()}>Sign in</Button></div>;
  }

  if (user.role !== "admin") {
    return <div className="admin-empty"><ShieldAlert size={36} /><h1>Admin access required</h1><p>Your account is signed in, but it does not have editor permissions yet.</p><Link href="/"><Button variant="outline">Back to website</Button></Link></div>;
  }

  const patchDraft = (id: number, key: keyof FormState, value: string | number) => {
    setDrafts(current => ({ ...current, [id]: { ...current[id], [key]: value } }));
  };

  const saveItem = (id: number) => {
    const draft = drafts[id];
    if (!draft?.title.trim()) return;
    updateMutation.mutate({ id, data: { ...draft, subtitle: draft.subtitle || null, detail: draft.detail || null, dateLabel: draft.dateLabel || null, sectionGroup: draft.sectionGroup || null, imageUrl: draft.imageUrl || null, color: draft.color || null } });
    setEditingId(null);
  };

  const createItem = () => {
    if (!newItem.title.trim()) return;
    createMutation.mutate({ ...newItem, title: newItem.title.trim(), subtitle: newItem.subtitle || null, detail: newItem.detail || null, dateLabel: newItem.dateLabel || null, sectionGroup: newItem.sectionGroup || null, imageUrl: newItem.imageUrl || null, color: newItem.color || null });
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div><div className="admin-eyebrow"><span>ECT / CONTENT STUDIO</span><span className="admin-live"><span /> LIVE EDITOR</span></div><h1>Manage your website</h1><p>Edit the content blocks that appear on the public department homepage.</p></div>
        <div className="admin-top-actions"><Link href="/"><Button variant="outline"><ArrowLeft size={15} /> View site</Button></Link><Button onClick={() => setShowNew(current => !current)}><FilePlus2 size={15} /> Add content</Button></div>
      </div>

      <div className="admin-stat-grid"><div><span>EDITOR</span><strong>{user.name || user.email || "Admin"}</strong></div><div><span>CONTENT BLOCKS</span><strong>{contentQuery.data?.length ?? 0}</strong></div><div><span>EDITABLE COLLECTIONS</span><strong>06</strong></div><div><span>ACCESS</span><strong className="admin-accent">ADMIN</strong></div></div>

      {showNew && <section className="admin-card admin-create-card"><div className="admin-card-heading"><div><span className="admin-card-kicker">NEW BLOCK</span><h2>Add a content item</h2></div><button className="icon-button" onClick={() => setShowNew(false)} aria-label="Close new content form"><X size={18} /></button></div><div className="admin-form-grid"><label>Collection<select value={newItem.type} onChange={event => setNewItem({ ...newItem, type: event.target.value as ContentType })}>{tabs.slice(1).map(tab => <option key={tab.value} value={tab.value}>{tab.label}</option>)}</select></label><label>Title<Input value={newItem.title} onChange={event => setNewItem({ ...newItem, title: event.target.value })} placeholder="Primary title" /></label><label>Subtitle<Input value={newItem.subtitle ?? ""} onChange={event => setNewItem({ ...newItem, subtitle: event.target.value })} placeholder="Name, role, position…" /></label><label>Detail<Input value={newItem.detail ?? ""} onChange={event => setNewItem({ ...newItem, detail: event.target.value })} placeholder="Score, batch, initials…" /></label><label>Date / label<Input value={newItem.dateLabel ?? ""} onChange={event => setNewItem({ ...newItem, dateLabel: event.target.value })} placeholder="04 Sept 2026" /></label><label>Group / status<Input value={newItem.sectionGroup ?? ""} onChange={event => setNewItem({ ...newItem, sectionGroup: event.target.value })} placeholder="upcoming or past" /></label><label>Image URL<Input value={newItem.imageUrl ?? ""} onChange={event => setNewItem({ ...newItem, imageUrl: event.target.value })} placeholder="Optional storage URL" /></label><label>Sort order<Input type="number" value={newItem.sortOrder} onChange={event => setNewItem({ ...newItem, sortOrder: Number(event.target.value) })} /></label></div><div className="admin-form-actions"><Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button><Button onClick={createItem} disabled={createMutation.isPending || !newItem.title.trim()}>{createMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Plus size={15} />} Create item</Button></div></section>}

      <div className="admin-tabs">{tabs.map(tab => <button className={activeTab === tab.value ? "active" : ""} key={tab.value} onClick={() => setActiveTab(tab.value)}>{tab.label}<span>{tab.value === "all" ? contentQuery.data?.length ?? 0 : contentQuery.data?.filter(item => item.type === tab.value).length ?? 0}</span></button>)}</div>

      <section className="admin-card admin-list-card"><div className="admin-card-heading"><div><span className="admin-card-kicker">{activeTab === "all" ? "ALL COLLECTIONS" : activeTab.toUpperCase()}</span><h2>{items.length} editable {items.length === 1 ? "item" : "items"}</h2></div><span className="admin-hint">Changes publish to the homepage after save.</span></div>{contentQuery.isLoading ? <div className="admin-empty-row"><Loader2 className="animate-spin" /> Loading content…</div> : items.length === 0 ? <div className="admin-empty-row"><FilePlus2 size={18} /> No items in this collection yet.</div> : <div className="admin-item-list">{items.map(item => { const draft = drafts[item.id] ?? toForm(item); const isEditing = editingId === item.id; return <div className={`admin-item ${isEditing ? "is-editing" : ""}`} key={item.id}><div className="admin-item-index">{String(item.sortOrder + 1).padStart(2, "0")}</div>{isEditing ? <div className="admin-edit-grid"><label>Title<Input value={draft.title} onChange={event => patchDraft(item.id, "title", event.target.value)} /></label><label>Subtitle<Input value={draft.subtitle ?? ""} onChange={event => patchDraft(item.id, "subtitle", event.target.value)} /></label><label>Detail<Input value={draft.detail ?? ""} onChange={event => patchDraft(item.id, "detail", event.target.value)} /></label><label>Date / label<Input value={draft.dateLabel ?? ""} onChange={event => patchDraft(item.id, "dateLabel", event.target.value)} /></label><label>Group / status<Input value={draft.sectionGroup ?? ""} onChange={event => patchDraft(item.id, "sectionGroup", event.target.value)} /></label><label>Image URL<Input value={draft.imageUrl ?? ""} onChange={event => patchDraft(item.id, "imageUrl", event.target.value)} /></label><div className="admin-inline-actions"><Button size="sm" onClick={() => saveItem(item.id)} disabled={updateMutation.isPending}><Save size={14} /> Save</Button><Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X size={14} /> Cancel</Button></div></div> : <><div className="admin-item-main"><div className="admin-item-type">{item.type} {item.sectionGroup ? <span>· {item.sectionGroup}</span> : null}</div><strong>{item.title}</strong><span>{item.subtitle || item.detail || item.dateLabel || "No secondary detail"}</span></div><div className="admin-item-meta"><span>{item.dateLabel || item.detail || "—"}</span><button className="icon-button" onClick={() => setEditingId(item.id)} aria-label={`Edit ${item.title}`}><Pencil size={15} /></button><button className="icon-button danger" onClick={() => removeMutation.mutate({ id: item.id })} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div></>}</div>; })}</div>}</section>
      <div className="admin-footer-note"><Check size={15} /> Your public homepage stays live while you edit. Use the left navigation to return here any time.</div>
    </div>
  );
}

export default function Admin() {
  return <DashboardLayout><AdminContent /></DashboardLayout>;
}
