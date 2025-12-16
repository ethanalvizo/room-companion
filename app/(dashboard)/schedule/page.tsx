"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  duration: number;
  roomNumber?: string;
  status: "unassigned" | "assigned";
}

interface RoomAssignment {
  id: string;
  appointmentId: string;
  roomNumber: string;
  startTime: string;
  duration: number;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [roomAssignments, setRoomAssignments] = useState<RoomAssignment[]>([]);
  const [draggedAppointment, setDraggedAppointment] =
    useState<Appointment | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{
    room: string;
    time: string;
  } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const rooms = [
    "Room 101",
    "Room 102",
    "Room 103",
    "Room 104",
    "Room 105",
    "Room 106",
    "Room 107",
    "Room 108",
    "Room 109",
    "Room 110",
  ];
  const timeSlots = generateTimeSlots(8, 18); // 8 AM to 6 PM

  useEffect(() => {
    // Use placeholder data only
    setAppointments([
      {
        id: "apt-1",
        patientName: "John Smith",
        doctorName: "Dr. Johnson",
        time: "09:00",
        duration: 30,
        status: "unassigned",
      },
      {
        id: "apt-2",
        patientName: "Jane Doe",
        doctorName: "Dr. Williams",
        time: "09:30",
        duration: 45,
        status: "unassigned",
      },
      {
        id: "apt-3",
        patientName: "Bob Wilson",
        doctorName: "Dr. Johnson",
        time: "10:00",
        duration: 30,
        status: "unassigned",
      },
      {
        id: "apt-4",
        patientName: "Sarah Martinez",
        doctorName: "Dr. Chen",
        time: "10:30",
        duration: 60,
        status: "unassigned",
      },
      {
        id: "apt-5",
        patientName: "Michael Brown",
        doctorName: "Dr. Williams",
        time: "11:00",
        duration: 30,
        status: "unassigned",
      },
    ]);
  }, []);

  function generateTimeSlots(startHour: number, endHour: number): string[] {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }

  function saveRoomAssignments(assignments: RoomAssignment[]) {
    setRoomAssignments(assignments);
  }

  function handleDragStart(appointment: Appointment) {
    setDraggedAppointment(appointment);
  }

  function handleDragStartFromCalendar(
    appointment: Appointment,
    assignmentId: string,
  ) {
    setDraggedAppointment({ ...appointment, assignmentId } as any);
  }

  function handleDragOver(e: React.DragEvent, room?: string, time?: string) {
    e.preventDefault();
    if (room && time) {
      setDragOverSlot({ room, time });
    }
  }

  function handleDragLeave() {
    setDragOverSlot(null);
  }

  function handleDrop(room: string, time: string) {
    if (!draggedAppointment) return;

    setDragOverSlot(null);

    // Check if this is being dragged from an existing assignment
    const existingAssignmentId = (draggedAppointment as any).assignmentId;

    // Check if slot is already occupied
    const isOccupied = roomAssignments.some(
      (assignment) =>
        assignment.roomNumber === room &&
        assignment.startTime === time &&
        assignment.id !== existingAssignmentId, // Allow dropping in same slot
    );

    if (isOccupied) {
      alert("This time slot is already occupied");
      setDraggedAppointment(null);
      return;
    }

    if (existingAssignmentId) {
      // Moving an existing assignment to a new slot
      const updatedAssignments = roomAssignments.map((assignment) =>
        assignment.id === existingAssignmentId
          ? { ...assignment, roomNumber: room, startTime: time }
          : assignment,
      );
      saveRoomAssignments(updatedAssignments);

      // Update appointment's room number
      const updatedAppointments = appointments.map((apt) =>
        apt.id === draggedAppointment.id ? { ...apt, roomNumber: room } : apt,
      );
      setAppointments(updatedAppointments);
    } else {
      // Creating a new assignment from unassigned list
      const newAssignment: RoomAssignment = {
        id: `assign-${Date.now()}`,
        appointmentId: draggedAppointment.id,
        roomNumber: room,
        startTime: time,
        duration: draggedAppointment.duration,
      };

      const updatedAssignments = [...roomAssignments, newAssignment];
      saveRoomAssignments(updatedAssignments);

      // Update appointment status
      const updatedAppointments = appointments.map((apt) =>
        apt.id === draggedAppointment.id
          ? { ...apt, status: "assigned" as const, roomNumber: room }
          : apt,
      );
      setAppointments(updatedAppointments);
    }

    setDraggedAppointment(null);
  }

  function getAssignmentForSlot(
    room: string,
    time: string,
  ): RoomAssignment | undefined {
    return roomAssignments.find(
      (assignment) =>
        assignment.roomNumber === room && assignment.startTime === time,
    );
  }

  function getAppointmentById(id: string): Appointment | undefined {
    return appointments.find((apt) => apt.id === id);
  }

  function calculateSlotHeight(duration: number): number {
    // Each 30-min slot is 60px, so 1 minute = 2px
    return (duration / 30) * 60;
  }

  const unassignedAppointments = appointments.filter(
    (apt) => apt.status === "unassigned",
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  RoomCompanion
                </h1>
                <p className="text-sm text-slate-500">
                  Room Assignment Dashboard
                </p>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() - 1)),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="text-center min-w-[200px]">
                <div className="text-lg font-semibold text-slate-900">
                  {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
                </div>
                <div className="text-sm text-slate-500">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() + 1)),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Calendar Section - Left */}
        <div className="flex-1 overflow-hidden border-r border-slate-200 bg-white">
          <div className="h-full overflow-auto">
            <div className="min-w-[1800px]">
              {/* Room Headers */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex">
                  <div className="w-20 flex-shrink-0 border-r border-slate-200 bg-slate-50"></div>
                  {rooms.map((room) => (
                    <div
                      key={room}
                      className="w-[180px] flex-shrink-0 px-4 py-4 text-center border-r border-slate-200 last:border-r-0"
                    >
                      <div className="font-semibold text-slate-900">{room}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="relative">
                {timeSlots.map((time, timeIndex) => (
                  <div key={time} className="flex border-b border-slate-200">
                    {/* Time Label */}
                    <div className="w-20 flex-shrink-0 border-r border-slate-200 bg-slate-50 px-2 py-4 text-right">
                      <span className="text-sm font-medium text-slate-600">
                        {time}
                      </span>
                    </div>

                    {/* Room Slots */}
                    {rooms.map((room) => {
                      const assignment = getAssignmentForSlot(room, time);
                      const appointment = assignment
                        ? getAppointmentById(assignment.appointmentId)
                        : undefined;
                      const isBeingDraggedOver =
                        dragOverSlot?.room === room &&
                        dragOverSlot?.time === time;
                      const isOccupied = assignment !== undefined;

                      return (
                        <div
                          key={`${room}-${time}`}
                          className={`w-[180px] flex-shrink-0 border-r border-slate-200 last:border-r-0 relative transition-colors ${
                            isBeingDraggedOver && !isOccupied
                              ? "bg-blue-50"
                              : ""
                          }`}
                          style={{ minHeight: "60px" }}
                          onDragOver={(e) => handleDragOver(e, room, time)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(room, time)}
                        >
                          {assignment && appointment && (
                            <div
                              draggable
                              onDragStart={() =>
                                handleDragStartFromCalendar(
                                  appointment,
                                  assignment.id,
                                )
                              }
                              className={`absolute inset-x-1 top-1 rounded-lg shadow-sm border-l-4 cursor-move group hover:shadow-lg transition-all ${
                                draggedAppointment &&
                                (draggedAppointment as any).assignmentId ===
                                  assignment.id
                                  ? "opacity-40"
                                  : ""
                              }`}
                              style={{
                                height: `${
                                  calculateSlotHeight(assignment.duration) - 8
                                }px`,
                                backgroundColor: "#dbeafe",
                                borderLeftColor: "#3b82f6",
                              }}
                            >
                              <div className="p-2 h-full flex flex-col justify-between">
                                <div>
                                  <div className="font-semibold text-sm text-slate-900 truncate">
                                    {appointment.patientName}
                                  </div>
                                  <div className="text-xs text-slate-600 truncate">
                                    {appointment.doctorName}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {assignment.duration} min
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg pointer-events-none"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List - Right */}
        <div className="w-96 flex-shrink-0 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Unassigned Appointments
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Drag appointments to calendar to assign rooms
            </p>
          </div>

          <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
            {unassignedAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-slate-600 font-medium">
                  All appointments assigned!
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Great job organizing the schedule.
                </p>
              </div>
            ) : (
              unassignedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  draggable
                  onDragStart={() => handleDragStart(appointment)}
                  className="bg-white border-2 border-slate-200 rounded-xl p-4 cursor-move hover:border-blue-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <GripVertical className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 mb-2 truncate">
                        {appointment.patientName}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {appointment.doctorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {appointment.time} ({appointment.duration} min)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Appointments:</span>
              <span className="font-semibold text-slate-900">
                {appointments.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-600">Unassigned:</span>
              <span className="font-semibold text-blue-600">
                {unassignedAppointments.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
