"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Terminal, Layout, Clock, 
  CheckCircle2, Circle, GitBranch, Globe, 
  Edit3, ThumbsUp, Eye, Target, Share2, Users 
} from "lucide-react";
import { useUser } from "@/components/UserProvider";
import GitHubStatsDetailed from "@/components/projects/GitHubStatsDetailed";
import ProjectComments from "@/components/projects/ProjectComments";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingUrls, setEditingUrls] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setRepoUrl(data.project.repoUrl || "");
        setDemoUrl(data.project.demoUrl || "");
      } else {
        router.push("/projects");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthor = user?.id === project?.authorId;
  const isTeamMember = project?.team && (project.team.ownerId === user?.id || project.team.members.some((m: any) => m.id === user?.id));
  const canEdit = isAuthor || isTeamMember;

  const updateFeatureStatus = async (index: number, newStatus: string) => {
    if (!canEdit || !project.features) return;
    
    const updatedFeatures = [...project.features];
    updatedFeatures[index].status = newStatus;
    
    // Legacy support for 'completed' flag
    if (newStatus === 'completed') updatedFeatures[index].completed = true;
    else updatedFeatures[index].completed = false;
    
    // Optimistic UI update
    const previousProject = { ...project };
    setProject({ ...project, features: updatedFeatures });
    
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updatedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
      } else {
        setProject(previousProject);
      }
    } catch (error) {
      setProject(previousProject);
    }
  };

  const reviewTask = async (index: number, rating: 'bad'|'good'|'excellent') => {
    if (!isAuthor || !project.features || !project.team) return;

    const feature = project.features[index];
    const assignees = feature.assignees || (feature.assigneeId ? [{ id: feature.assigneeId, name: feature.assigneeName }] : []);
    if (assignees.length === 0) return;

    let points = 1;
    if (rating === 'bad') points = -1;
    if (rating === 'excellent') points = 5;

    // Award points to all assignees
    try {
      await Promise.all(assignees.map((assignee: any) => 
        fetch(`/api/teams/${project.team.id}/points`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiverId: assignee.id, points })
        }).then(res => res.json())
      ));
    } catch (e) {
      alert("Failed to award points to some members");
    }

    // Update feature
    const updatedFeatures = [...project.features];
    updatedFeatures[index].status = 'completed';
    updatedFeatures[index].completed = true;
    updatedFeatures[index].feedback = rating;

    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updatedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        alert(`Task reviewed! ${feature.assigneeName} received ${points > 0 ? '+'+points : points} points.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignFeature = async (index: number, assigneeId: string, assigneeName: string) => {
    if (!canEdit || !project.features) return;
    
    const updatedFeatures = [...project.features];
    let assignees = updatedFeatures[index].assignees || [];
    
    if (updatedFeatures[index].assigneeId && assignees.length === 0) {
      assignees = [{ id: updatedFeatures[index].assigneeId, name: updatedFeatures[index].assigneeName }];
      delete updatedFeatures[index].assigneeId;
      delete updatedFeatures[index].assigneeName;
    }

    if (!assigneeId) {
      // clear all
      assignees = [];
    } else {
      const exists = assignees.find((a: any) => a.id === assigneeId);
      if (exists) {
        // remove
        assignees = assignees.filter((a: any) => a.id !== assigneeId);
      } else {
        // add
        assignees.push({ id: assigneeId, name: assigneeName });
      }
    }
    
    updatedFeatures[index].assignees = assignees;
    
    // Optimistic UI update
    const previousProject = { ...project };
    setProject({ ...project, features: updatedFeatures });
    
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updatedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
      } else {
        setProject(previousProject);
      }
    } catch (error) {
      setProject(previousProject);
    }
  };

  const saveUrls = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, demoUrl })
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setEditingUrls(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const addTask = async () => {
    if (!canEdit || !newTaskTitle.trim()) return;

    const updatedFeatures = [
      ...(project.features || []), 
      { title: newTaskTitle, completed: false, status: 'pending', deadline: newTaskDeadline }
    ];

    const previousProject = { ...project };
    setProject({ ...project, features: updatedFeatures });
    
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updatedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setNewTaskTitle("");
        setNewTaskDeadline("");
      } else {
        setProject(previousProject);
      }
    } catch (error) {
      setProject(previousProject);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-800/50">
                  {project.category}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                  project.status === 'Planning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800' :
                  'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800'
                }`}>
                  {project.status || "In Progress"}
                </span>
                {project.difficulty && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-700">
                    {project.difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                {project.description}
              </p>
              
              <div className="flex items-center gap-3 mt-4">
                {project.team ? (
                  <Link href={`/teams/${project.team.id}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium">
                    <Users className="w-4 h-4" /> Team Project: {project.team.name}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <img src={project.author?.profileImage || `https://ui-avatars.com/api/?name=${project.author?.fullName}`} className="w-5 h-5 rounded-full" />
                    By {project.author?.fullName}
                  </span>
                )}
              </div>
            </div>
            
            {/* Quick Actions / Stats */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-blue-500" /> {project.likes}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Likes</div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-500" /> {project.views}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Views</div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-xl transition-colors">
                <Share2 className="w-5 h-5" /> Share Project
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* Main Content Area */}
          <div className="col-span-2 p-8 space-y-8">
            
              {project.repoUrl && (
                <div className="mb-10">
                  <GitHubStatsDetailed repoUrl={project.repoUrl} />
                </div>
              )}

            {/* Task/Features List */}
            {(canEdit || (project.features && Array.isArray(project.features) && project.features.length > 0)) && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-500" /> Project Tasks
                  </h3>
                </div>

                {canEdit && (
                  <div className="flex gap-2 mb-6">
                    <input 
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                    <input 
                      type="date"
                      value={newTaskDeadline}
                      onChange={e => setNewTaskDeadline(e.target.value)}
                      className="w-36 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                    <button onClick={addTask} disabled={!newTaskTitle.trim()} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg disabled:opacity-50">
                      Add
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {project.features && Array.isArray(project.features) && project.features.map((feature: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${
                        canEdit ? 'hover:shadow-sm' : ''
                      } ${
                        feature.completed 
                          ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/50' 
                          : 'bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div 
                          className={`flex items-start gap-4 flex-1`}
                        >
                          <div className="mt-0.5">
                            {feature.status === 'completed' || feature.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : feature.status === 'in-review' ? (
                              <Clock className="w-6 h-6 text-amber-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>
                          <div>
                            <span className={`text-base font-medium ${feature.status === 'completed' || feature.completed ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                              {feature.title}
                            </span>
                            {feature.deadline && (
                              <p className="text-xs text-slate-500 mt-1">Deadline: {feature.deadline}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Task Workflow Actions */}
                        <div className="flex items-center gap-3">
                          {feature.status === 'in-review' ? (
                            isAuthor ? (
                              <div className="flex gap-2">
                                <button onClick={() => reviewTask(index, 'bad')} className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded hover:bg-red-200">Bad (-1)</button>
                                <button onClick={() => reviewTask(index, 'good')} className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Good (+1)</button>
                                <button onClick={() => reviewTask(index, 'excellent')} className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded hover:bg-amber-200">Excellent (+5)</button>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">In Review</span>
                            )
                          ) : (feature.status === 'completed' || feature.completed) ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                              Done {feature.feedback && `(${feature.feedback})`}
                            </span>
                          ) : (
                            ((feature.assignees && feature.assignees.some((a: any) => a.id === user?.id)) || feature.assigneeId === user?.id) && (
                              <button onClick={() => updateFeatureStatus(index, 'in-review')} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800">
                                Submit for Review
                              </button>
                            )
                          )}
                        </div>
                        
                        {/* Task Assignment (Only if team project) */}
                        {project.team && (
                            <div className="relative flex flex-wrap gap-1 items-center max-w-[200px]">
                              {(feature.assignees || (feature.assigneeId ? [{ id: feature.assigneeId, name: feature.assigneeName }] : [])).map((a: any) => (
                                <span key={a.id} onClick={() => assignFeature(index, a.id, a.name)} className="text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity" title="Click to remove">
                                  {a.name.split(' ')[0]}
                                </span>
                              ))}
                              <select
                                disabled={!canEdit}
                                value=""
                                onChange={(e) => {
                                  const assigneeId = e.target.value;
                                  if (assigneeId) {
                                    const member = [project.team.owner, ...project.team.members].find(m => m.id === assigneeId);
                                    if (member) assignFeature(index, member.id, member.fullName);
                                  }
                                }}
                                className="text-[10px] font-bold rounded-lg px-2 py-1 appearance-none cursor-pointer border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                              >
                                <option value="">+ Assign</option>
                                <option value={project.team.owner.id}>{project.team.owner.fullName}</option>
                                {project.team.members.map((m: any) => (
                                  <option key={m.id} value={m.id}>{m.fullName}</option>
                                ))}
                              </select>
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProjectComments projectId={params.id as string} />
          </div>

          {/* Sidebar */}
          <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
            
            {/* Tech Stack */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Demonstrated */}
            {project.skillsDemonstrated && project.skillsDemonstrated.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Skills Verified</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skillsDemonstrated.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Project Links</h3>
                {isAuthor && !editingUrls && (
                  <button onClick={() => setEditingUrls(true)} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    <Edit3 className="w-3 h-3" /> Edit Links
                  </button>
                )}
              </div>
              
              {editingUrls ? (
                <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">GitHub Repo URL</label>
                    <input type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Live Demo URL</label>
                    <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="https://..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setEditingUrls(false)} className="flex-1 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg font-medium">Cancel</button>
                    <button onClick={saveUrls} disabled={saving} className="flex-1 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Save</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
                      <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <GitBranch className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">Source Code</div>
                        <div className="text-xs text-slate-500 truncate">{new URL(project.repoUrl).hostname}</div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 border-dashed dark:border-slate-700 text-slate-400">
                      <GitBranch className="w-5 h-5" />
                      <span className="text-sm">No repository linked</span>
                    </div>
                  )}

                  {project.demoUrl ? (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">Live Demo</div>
                        <div className="text-xs text-slate-500 truncate">{new URL(project.demoUrl).hostname}</div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 border-dashed dark:border-slate-700 text-slate-400">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">No live demo linked</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
