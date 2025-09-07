import React from "react";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import DepartmentForm from "./components/DepartmentForm";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Office Management — React Demo
          </h1>
          <div className="text-sm text-slate-600">
            API demo with React + Tailwind + axios
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EmployeeList />
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Create Employee</h2>
              <EmployeeForm />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Create Department</h2>
              <DepartmentForm />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
