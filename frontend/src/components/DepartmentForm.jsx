import React, { useState } from "react";
import api from "../api";

export default function DepartmentForm() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");
    try {
      setLoading(true);
      await api.post("/departments", { name, description: desc });
      alert("Department created");
      setName("");
      setDesc("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        className="w-full p-2 border rounded"
        placeholder="Department name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Description (optional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div>
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
