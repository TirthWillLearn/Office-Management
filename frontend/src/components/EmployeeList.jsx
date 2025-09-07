import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployeeList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (p = page) => {
    try {
      setLoading(true);
      const res = await api.get("/employees", {
        params: { page: p, limit, q },
      });
      setData(res.data.data);
      setTotal(res.data.total);
      setPage(res.data.page);
    } catch (err) {
      console.error(err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []); // initial load

  const onSearch = () => load(1);
  const onDelete = async (id) => {
    if (!confirm("Delete employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Employees</h2>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="px-3 py-1 border rounded"
          />
          <button
            onClick={onSearch}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="space-y-3">
            {data.length === 0 && (
              <div className="p-4 text-sm text-slate-600">
                No employees found.
              </div>
            )}
            {data.map((emp) => (
              <div
                key={emp._id}
                className="p-3 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {emp.first_name} {emp.last_name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {emp.email || "—"} • {emp.role || "—"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {emp.department?.name || ""}{" "}
                    {emp.city ? ` • ${emp.city}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => {
                      navigator.clipboard?.writeText(emp._id);
                      alert("ID copied");
                    }}
                  >
                    Copy ID
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-red-600"
                    onClick={() => onDelete(emp._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Total: {total}</div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button
                disabled={page * limit >= total}
                onClick={() => load(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
