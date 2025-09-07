import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployeeForm() {
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    department: "",
    supervisor: "",
    country: "",
    state: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [dRes, eRes] = await Promise.all([
          api.get("/departments"),
          api.get("/employees", { params: { page: 1, limit: 100 } }),
        ]);
        setDepartments(dRes.data);
        setSupervisors(eRes.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handle = (k) => (e) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim()) return alert("First name required");
    try {
      setLoading(true);
      // strip empty strings to avoid sending empty fields
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== "")
      );
      await api.post("/employees", payload);
      alert("Employee created");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        department: "",
        supervisor: "",
        country: "",
        state: "",
        city: "",
      });
      // optional: emit event or reload employee list — quick approach: refresh page
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  // simple states stub: optionally fetch from countries endpoint.
  const statesByCountry = {
    "United States": ["California", "Texas", "New York"],
    "United Kingdom": ["England", "Scotland", "Wales"],
    India: ["Maharashtra", "Karnataka", "Delhi"],
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          className="p-2 border rounded"
          placeholder="First name"
          value={form.first_name}
          onChange={handle("first_name")}
        />
        <input
          className="p-2 border rounded"
          placeholder="Last name"
          value={form.last_name}
          onChange={handle("last_name")}
        />
        <input
          className="p-2 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={handle("email")}
        />
        <input
          className="p-2 border rounded"
          placeholder="Role"
          value={form.role}
          onChange={handle("role")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <select
          className="p-2 border rounded"
          value={form.department}
          onChange={handle("department")}
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={form.supervisor}
          onChange={handle("supervisor")}
        >
          <option value="">No supervisor</option>
          {supervisors.map((s) => (
            <option key={s._id} value={s._id}>
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={form.country}
          onChange={(e) => {
            handle("country")(e);
            setForm((prev) => ({ ...prev, state: "", city: "" }));
          }}
        >
          <option value="">Select country</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>India</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          className="p-2 border rounded"
          value={form.state}
          onChange={handle("state")}
        >
          <option value="">Select state</option>
          {(statesByCountry[form.country] || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          className="p-2 border rounded"
          placeholder="City"
          value={form.city}
          onChange={handle("city")}
        />
      </div>

      <div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
