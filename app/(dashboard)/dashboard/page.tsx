"use client";

import { useState, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Room {
  roomNumber: string;
  status: "available" | "waiting" | "in-progress" | "completed";
  patientName?: string;
  doctorName?: string;
  timeWaiting?: number; // in minutes
  appointmentTime?: string;
  checkInTime?: string;
}

export default function DoctorDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initialize with sample room data
    setRooms([
      {
        roomNumber: "101",
        status: "waiting",
        patientName: "John Smith",
        doctorName: "Dr. Johnson",
        appointmentTime: "09:00 AM",
        checkInTime: new Date(Date.now() - 8 * 60000).toISOString(),
        timeWaiting: 8,
      },
      {
        roomNumber: "102",
        status: "in-progress",
        patientName: "Jane Doe",
        doctorName: "Dr. Williams",
        appointmentTime: "09:30 AM",
        checkInTime: new Date(Date.now() - 15 * 60000).toISOString(),
        timeWaiting: 15,
      },
      {
        roomNumber: "103",
        status: "waiting",
        patientName: "Bob Wilson",
        doctorName: "Dr. Johnson",
        appointmentTime: "10:00 AM",
        checkInTime: new Date(Date.now() - 3 * 60000).toISOString(),
        timeWaiting: 3,
      },
      {
        roomNumber: "104",
        status: "available",
        doctorName: "Dr. Chen",
      },
      {
        roomNumber: "105",
        status: "waiting",
        patientName: "Sarah Martinez",
        doctorName: "Dr. Chen",
        appointmentTime: "10:30 AM",
        checkInTime: new Date(Date.now() - 12 * 60000).toISOString(),
        timeWaiting: 12,
      },
      {
        roomNumber: "106",
        status: "available",
        doctorName: "Dr. Williams",
      },
      {
        roomNumber: "107",
        status: "waiting",
        patientName: "Michael Brown",
        doctorName: "Dr. Johnson",
        appointmentTime: "11:00 AM",
        checkInTime: new Date(Date.now() - 5 * 60000).toISOString(),
        timeWaiting: 5,
      },
      {
        roomNumber: "108",
        status: "available",
        doctorName: "Dr. Williams",
      },
      {
        roomNumber: "109",
        status: "completed",
        patientName: "Lisa Anderson",
        doctorName: "Dr. Chen",
        appointmentTime: "08:30 AM",
      },
      {
        roomNumber: "110",
        status: "available",
        doctorName: "Dr. Johnson",
      },
    ]);

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Update waiting times
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.status === "waiting" && room.checkInTime) {
            const checkIn = new Date(room.checkInTime);
            const minutesWaiting = Math.floor(
              (Date.now() - checkIn.getTime()) / 60000,
            );
            return { ...room, timeWaiting: minutesWaiting };
          }
          return room;
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getStatusColor(status: Room["status"]) {
    switch (status) {
      case "waiting":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-slate-300";
    }
  }

  function getStatusIcon(status: Room["status"]) {
    switch (status) {
      case "waiting":
        return <AlertCircle className="w-8 h-8" />;
      case "in-progress":
        return <Stethoscope className="w-8 h-8" />;
      case "completed":
        return <CheckCircle2 className="w-8 h-8" />;
      default:
        return <XCircle className="w-8 h-8" />;
    }
  }

  function getStatusText(status: Room["status"]) {
    switch (status) {
      case "waiting":
        return "Patient Ready";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Available";
    }
  }

  function getPriorityClass(timeWaiting?: number) {
    if (!timeWaiting) return "";
    if (timeWaiting > 15) return "priority-urgent";
    if (timeWaiting > 10) return "priority-high";
    return "";
  }

  const waitingRooms = rooms
    .filter((r) => r.status === "waiting")
    .sort((a, b) => (b.timeWaiting || 0) - (a.timeWaiting || 0));
  const inProgressRooms = rooms.filter((r) => r.status === "in-progress");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Room Dashboard
                </h1>
                <p className="text-slate-600 text-lg mt-1">Status Monitor</p>
              </div>
            </div>

            {/* Current Time */}
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-900">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-slate-600 text-lg mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-semibold uppercase tracking-wide">
                  Waiting for Doctor
                </p>
                <p className="text-6xl font-bold text-yellow-600 mt-2">
                  {waitingRooms.length}
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-400 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide">
                  In Progress
                </p>
                <p className="text-6xl font-bold text-blue-600 mt-2">
                  {inProgressRooms.length}
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-8 py-6">
        {/* Waiting Rooms - Priority */}
        {waitingRooms.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-yellow-600" />
              Patients Waiting
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {waitingRooms.map((room) => (
                <div
                  key={room.roomNumber}
                  className={`bg-white rounded-2xl p-6 shadow-lg transition-all border-2 ${
                    getPriorityClass(room.timeWaiting) === "priority-urgent"
                      ? "border-red-500 animate-pulse-border"
                      : getPriorityClass(room.timeWaiting) === "priority-high"
                      ? "border-orange-400"
                      : "border-yellow-400"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-20 h-20 rounded-xl ${
                          getPriorityClass(room.timeWaiting) ===
                          "priority-urgent"
                            ? "bg-red-500"
                            : getPriorityClass(room.timeWaiting) ===
                              "priority-high"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        } flex items-center justify-center text-white shadow-lg`}
                      >
                        <span className="text-3xl font-bold">
                          {room.roomNumber}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                          Room {room.roomNumber}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">
                          {room.patientName}
                        </div>
                        <div className="text-slate-600 mt-1 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {room.doctorName}
                        </div>
                      </div>
                    </div>

                    {/* Waiting Time */}
                    <div className="text-right">
                      <div
                        className={`text-5xl font-bold ${
                          (room.timeWaiting || 0) > 15
                            ? "text-red-600"
                            : (room.timeWaiting || 0) > 10
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {room.timeWaiting}m
                      </div>
                      <div className="text-slate-500 text-sm mt-1 font-medium">
                        waiting
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Scheduled: {room.appointmentTime}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg font-bold ${
                        (room.timeWaiting || 0) > 15
                          ? "bg-red-100 text-red-700"
                          : (room.timeWaiting || 0) > 10
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      READY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-slate-600 text-lg">
              No patients currently waiting
            </p>
          </div>
        )}

        {/* In Progress Rooms */}
        {inProgressRooms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Stethoscope className="w-7 h-7 text-blue-600" />
              Currently in Progress
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {inProgressRooms.map((room) => (
                <div
                  key={room.roomNumber}
                  className="bg-white border-2 border-blue-400 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
                      <span className="text-2xl font-bold">
                        {room.roomNumber}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Room {room.roomNumber}
                      </div>
                      <div className="text-xl font-bold text-slate-900 truncate">
                        {room.patientName}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{room.doctorName}</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm text-center">
                      In Progress • {room.timeWaiting}m
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse-border {
          0%,
          100% {
            border-color: rgb(239 68 68);
          }
          50% {
            border-color: rgb(239 68 68 / 0.5);
          }
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
