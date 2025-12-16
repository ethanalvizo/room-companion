"use client";

import { useState, useEffect } from "react";

interface Assignment {
  doctorName: string;
  roomNumber: string;
  patientName: string;
  timeWaiting: number;
  appointmentTime: string;
}

export default function DoctorDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initialize with sample data
    setAssignments([
      {
        doctorName: "Dr. Johnson",
        roomNumber: "101",
        patientName: "John Smith",
        timeWaiting: 8,
        appointmentTime: "09:00 AM",
      },
      {
        doctorName: "Dr. Williams",
        roomNumber: "102",
        patientName: "Jane Doe",
        timeWaiting: 15,
        appointmentTime: "09:30 AM",
      },
      {
        doctorName: "Dr. Johnson",
        roomNumber: "103",
        patientName: "Bob Wilson",
        timeWaiting: 3,
        appointmentTime: "10:00 AM",
      },
      {
        doctorName: "Dr. Chen",
        roomNumber: "105",
        patientName: "Sarah Martinez",
        timeWaiting: 12,
        appointmentTime: "10:30 AM",
      },
    ]);

    // Update current time and waiting times every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setAssignments((prev) =>
        prev.map((a) => ({ ...a, timeWaiting: a.timeWaiting + 1 / 60 })),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold">Upcoming Appointments</h1>
          <div className="text-right">
            <div className="text-4xl font-bold">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-xl mt-1 opacity-90">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="p-12">
        {assignments.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b-4 border-slate-300">
                <th className="text-left py-6 px-8 text-3xl font-bold text-slate-700">
                  Doctor
                </th>
                <th className="text-left py-6 px-8 text-3xl font-bold text-slate-700">
                  Room
                </th>
                <th className="text-left py-6 px-8 text-3xl font-bold text-slate-700">
                  Patient
                </th>
                <th className="text-left py-6 px-8 text-3xl font-bold text-slate-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr
                  key={index}
                  className="border-b-2 border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-8 px-8 text-4xl font-semibold text-slate-900">
                    {assignment.doctorName}
                  </td>
                  <td className="py-8 px-8">
                    <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-5xl font-bold min-w-[150px] text-center">
                      {assignment.roomNumber}
                    </div>
                  </td>
                  <td className="py-8 px-8 text-4xl text-slate-700">
                    {assignment.patientName}
                  </td>
                  <td className="py-8 px-8 text-4xl font-semibold text-slate-600">
                    {assignment.appointmentTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-20">
            <div className="text-3xl font-bold text-slate-400">
              No patients waiting
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
