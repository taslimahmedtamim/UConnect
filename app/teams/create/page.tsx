"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Code, Plus, X } from "lucide-react";

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requiredSkills: [] as string[],
    newSkill: "",
  });

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.requiredSkills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, formData.newSkill.trim()],
        newSkill: "",
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.push("/login"); return; }

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          requiredSkills: formData.requiredSkills
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create team");

      router.push(`/teams/${data.team.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" /> Create a New Team
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Start a new project and use AI to match with the perfect teammates.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project/Team Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Cyber Security Analyzer App"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what your team is building and what you aim to achieve..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" /> Required Skills
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Our AI will use these skills to evaluate applicants.</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={formData.newSkill}
                onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. React, Python, Figma..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.requiredSkills.length === 0 && (
                <span className="text-sm text-slate-500 italic">No skills added yet.</span>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating Team..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
