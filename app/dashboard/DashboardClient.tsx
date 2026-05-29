"use client";

import { useState } from "react";
import { Film, FileText, CheckCircle, Clock, CheckSquare, BarChart3, AlertCircle, Sparkles, Laptop } from "lucide-react";
import { DemoRequestWithPlatform, Platform } from "@/types";

interface DashboardClientProps {
  initialRequests: DemoRequestWithPlatform[];
  platforms: Platform[];
}

export default function DashboardClient({ initialRequests, platforms }: DashboardClientProps) {
  const [requests, setRequests] = useState<DemoRequestWithPlatform[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<"requests" | "upload">("requests");
  
  // Video upload states
  const [selectedPlatformId, setSelectedPlatformId] = useState(platforms[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Analytics Metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const respondedCount = requests.filter((r) => r.status === "responded").length;
  const fulfilledCount = requests.filter((r) => r.status === "fulfilled").length;

  // Status updates (Pending -> Responded -> Fulfilled)
  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/demo-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(
          requests.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to patch status:", error);
    }
  };

  // Video Upload Handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedPlatformId) {
      setErrorMsg("Please select a platform to upload this video to.");
      return;
    }

    setUploading(true);
    setProgress(10);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video");
      formData.append("platformId", selectedPlatformId);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      const responsePromise = new Promise<{ url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const err = JSON.parse(xhr.responseText || '{"error":"Upload failed"}');
            reject(new Error(err.error || "Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network upload error"));
      });

      xhr.send(formData);

      const result = await responsePromise;
      setSuccessMsg(`Success! Walkthrough video uploaded. Access URL: ${result.url}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "File upload failed.";
      setErrorMsg(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 capitalize">Pending</span>;
      case "responded":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 capitalize">Responded</span>;
      case "fulfilled":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 capitalize">Fulfilled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-sans">
          Vendor Control Panel
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage inbound demo requests, upload walkthrough videos, and audit buyer pipelines.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total requests */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-secondary rounded-lg text-muted-foreground">
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Total Requests</span>
            <strong className="text-2xl font-bold text-foreground">{totalCount}</strong>
          </div>
        </div>

        {/* Pending requests */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Pending Requests</span>
            <strong className="text-2xl font-bold text-foreground">{pendingCount}</strong>
          </div>
        </div>

        {/* Responded */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <CheckSquare size={20} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Responded</span>
            <strong className="text-2xl font-bold text-foreground">{respondedCount}</strong>
          </div>
        </div>

        {/* Fulfilled */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Fulfilled</span>
            <strong className="text-2xl font-bold text-foreground">{fulfilledCount}</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-all ${
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText size={16} />
            <span>Demo Requests ({totalCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-all ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Film size={16} />
            <span>Upload Demo Video</span>
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {/* REQUESTS LIST TAB */}
        {activeTab === "requests" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
                <Laptop size={32} className="mx-auto text-muted-foreground" />
                <p className="font-semibold text-foreground">No demo requests yet</p>
                <p className="text-xs max-w-xs mx-auto">Demo request cards submitted by users in the marketplace will show up here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                      <th className="p-4">Requester / Company</th>
                      <th className="p-4">Platform Target</th>
                      <th className="p-4">Use Case Profile</th>
                      <th className="p-4">Format</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs sm:text-sm">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-foreground">{req.requesterName}</div>
                          <div className="text-xs text-muted-foreground">{req.requesterEmail}</div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-primary">
                            {req.company} ({req.teamSize} staff)
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          {req.platform?.name}
                        </td>
                        <td className="p-4 max-w-xs text-xs text-muted-foreground leading-relaxed">
                          {req.useCase}
                        </td>
                        <td className="p-4 capitalize text-xs font-semibold text-foreground">
                          {req.preferredFormat}
                        </td>
                        <td className="p-4">{getStatusBadge(req.status)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end items-center space-x-1.5">
                            {req.status === "pending" && (
                              <button
                                onClick={() => handleUpdateStatus(req.id, "responded")}
                                className="px-2.5 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-semibold rounded-lg transition-all"
                              >
                                Mark Responded
                              </button>
                            )}
                            {req.status !== "fulfilled" && (
                              <button
                                onClick={() => handleUpdateStatus(req.id, "fulfilled")}
                                className="px-2.5 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 text-xs font-semibold rounded-lg transition-all"
                              >
                                Mark Fulfilled
                              </button>
                            )}
                            {req.status === "fulfilled" && (
                              <span className="text-xs text-muted-foreground font-semibold">Done ✓</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* UPLOAD DEMO VIDEO TAB */}
        {activeTab === "upload" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-xl mx-auto space-y-6">
            <h3 className="font-bold text-foreground text-sm border-b border-border pb-2 flex items-center space-x-1.5">
              <Film size={16} className="text-primary" />
              <span>Publish Product Walkthrough</span>
            </h3>

            {successMsg && (
              <div className="p-4 bg-primary/10 text-primary text-xs rounded-lg flex items-start space-x-2 leading-relaxed">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-destructive/10 text-destructive text-xs rounded-lg flex items-start space-x-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Select Target Platform */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Platform Profile
              </label>
              <select
                value={selectedPlatformId}
                onChange={(e) => setSelectedPlatformId(e.target.value)}
                className="w-full px-3 py-2.5 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            {/* Browse & Upload */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Browse Walkthrough Video (.mp4, .webm, .mov)
              </label>
              
              <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-8 bg-secondary/5 text-center relative hover:border-primary/50 transition-colors">
                <Film size={40} className="text-muted-foreground mb-3 animate-pulse" />
                <label className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all">
                  <span>{uploading ? `Uploading (${progress}%)` : "Select File"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <span className="text-[10px] text-muted-foreground mt-2">Maximum file size: 500MB</span>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground block text-right font-medium">{progress}% uploaded</span>
                </div>
              )}
            </div>

            <div className="p-4 border border-primary/10 rounded-lg bg-primary/5 flex items-start space-x-3 text-xs leading-relaxed text-muted-foreground">
              <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span>
                Uploading a video links it to the chosen platform details page. The demo tab will dynamically display the native HTML5 player.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
