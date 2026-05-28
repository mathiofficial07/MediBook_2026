import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Stethoscope,
  Edit,
  Users,
  BarChart3,
  FileText,
  Plus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockAppointments, mockDoctors } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  accepted: {
    icon: CalendarCheck,
    label: "Accepted",
    className: "bg-accent text-accent-foreground",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "bg-muted text-muted-foreground",
  },
};

const DoctorDashboard = () => {
  const { toast } = useToast();
  const doctor = mockDoctors[0];
  const [appointments, setAppointments] = useState(
    mockAppointments.filter((a) => a.doctorId === doctor.id),
  );
  const [tab, setTab] = useState("appointments");
  const [prescriptionFor, setPrescriptionFor] = useState(null);
  const [rxForm, setRxForm] = useState({
    diagnosis: "",
    medications: "",
    notes: "",
  });
  const [slots, setSlots] = useState(doctor.slots);
  const [newSlot, setNewSlot] = useState("");
  const [profileForm, setProfileForm] = useState({
    fee: String(doctor.fee),
    experience: String(doctor.experience),
    bio: doctor.bio,
    education: doctor.education,
  });

  const updateStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    toast({ title: `Appointment ${status}` });
  };

  const addPrescription = (aptId) => {
    toast({
      title: "Prescription added",
      description: `Prescription saved for appointment ${aptId}`,
    });
    setPrescriptionFor(null);
    setRxForm({ diagnosis: "", medications: "", notes: "" });
  };

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots([...slots, newSlot].sort());
      setNewSlot("");
      toast({ title: "Slot added" });
    }
  };

  const removeSlot = (slot) => {
    setSlots(slots.filter((s) => s !== slot));
    toast({ title: "Slot removed" });
  };

  const todayAppointments = appointments.filter(
    (a) => a.status === "accepted" || a.status === "pending",
  );
  const uniquePatients = [...new Set(appointments.map((a) => a.patientName))];

  const tabs = [
    { key: "appointments", label: "Appointments", icon: CalendarCheck },
    { key: "schedule", label: "Schedule", icon: Clock },
    { key: "patients", label: "Patients", icon: Users },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "profile", label: "Profile", icon: Edit },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MediBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                {doctor.avatar}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {doctor.name}
              </span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {doctor.name}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <Button
                key={t.key}
                variant={tab === t.key ? "default" : "outline"}
                onClick={() => setTab(t.key)}
                className="gap-2"
                size="sm"
              >
                <t.icon className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">{t.label}</span>
              </Button>
            ))}
          </div>

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total", count: appointments.length },
                  {
                    label: "Pending",
                    count: appointments.filter((a) => a.status === "pending")
                      .length,
                  },
                  {
                    label: "Accepted",
                    count: appointments.filter((a) => a.status === "accepted")
                      .length,
                  },
                  {
                    label: "Completed",
                    count: appointments.filter((a) => a.status === "completed")
                      .length,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-card rounded-xl p-4 card-shadow"
                  >
                    <p className="text-2xl font-bold text-foreground">
                      {s.count}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {appointments.map((apt) => {
                  const sc = statusConfig[apt.status];
                  const Icon = sc.icon;
                  return (
                    <div
                      key={apt.id}
                      className="bg-card rounded-xl p-5 card-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shrink-0">
                          {apt.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {apt.patientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {apt.patientEmail}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(apt.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            · {apt.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${sc.className}`}
                          >
                            <Icon className="h-3.5 w-3.5" /> {sc.label}
                          </span>
                          {apt.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateStatus(apt.id, "accepted")}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(apt.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {apt.status === "accepted" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatus(apt.id, "completed")
                                }
                              >
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPrescriptionFor(apt.id)}
                                className="gap-1"
                              >
                                <FileText className="h-3.5 w-3.5" /> Add Rx
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline prescription form */}
                      {prescriptionFor === apt.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 border-t border-border pt-4 space-y-3"
                        >
                          <h4 className="font-semibold text-foreground text-sm">
                            Add Prescription
                          </h4>
                          <Input
                            placeholder="Diagnosis"
                            value={rxForm.diagnosis}
                            onChange={(e) =>
                              setRxForm({
                                ...rxForm,
                                diagnosis: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Medications (comma separated)"
                            value={rxForm.medications}
                            onChange={(e) =>
                              setRxForm({
                                ...rxForm,
                                medications: e.target.value,
                              })
                            }
                          />
                          <Textarea
                            placeholder="Notes / Instructions"
                            value={rxForm.notes}
                            onChange={(e) =>
                              setRxForm({ ...rxForm, notes: e.target.value })
                            }
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addPrescription(apt.id)}
                              className="gap-1"
                            >
                              <Save className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPrescriptionFor(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* SCHEDULE */}
          {tab === "schedule" && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Manage Time Slots
              </h2>
              <div className="bg-card rounded-2xl p-6 card-shadow mb-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Today's Schedule
                </h3>
                <div className="space-y-2">
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No appointments today.
                    </p>
                  ) : (
                    todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg"
                      >
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground text-sm">
                          {apt.time}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          — {apt.patientName}
                        </span>
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${statusConfig[apt.status].className}`}
                        >
                          {statusConfig[apt.status].label}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold text-foreground mb-3">
                  Available Slots
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {slots.map((slot) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm"
                    >
                      {slot}
                      <button
                        onClick={() => removeSlot(slot)}
                        className="ml-1 hover:text-destructive"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 05:00 PM"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button size="sm" onClick={addSlot} className="gap-1">
                    <Plus className="h-4 w-4" /> Add Slot
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PATIENTS */}
          {tab === "patients" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Patient History
              </h2>
              <div className="space-y-4">
                {uniquePatients.map((name) => {
                  const patientApts = appointments.filter(
                    (a) => a.patientName === name,
                  );
                  return (
                    <div
                      key={name}
                      className="bg-card rounded-xl p-5 card-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                          {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {patientApts.length} appointment(s)
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {patientApts.map((apt) => (
                          <div
                            key={apt.id}
                            className="flex items-center gap-3 text-sm p-2 rounded-lg bg-accent/30"
                          >
                            <span className="text-muted-foreground">
                              {new Date(apt.date).toLocaleDateString()}
                            </span>
                            <span className="text-foreground">{apt.time}</span>
                            <span
                              className={`ml-auto text-xs px-2 py-0.5 rounded-full ${statusConfig[apt.status].className}`}
                            >
                              {statusConfig[apt.status].label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Analytics Overview
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Patients",
                    value: uniquePatients.length,
                    icon: Users,
                  },
                  {
                    label: "Completed",
                    value: appointments.filter((a) => a.status === "completed")
                      .length,
                    icon: CheckCircle,
                  },
                  {
                    label: "Pending",
                    value: appointments.filter((a) => a.status === "pending")
                      .length,
                    icon: Clock,
                  },
                  {
                    label: "Revenue",
                    value: `$${appointments.filter((a) => a.status === "completed").length * doctor.fee}`,
                    icon: BarChart3,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-card rounded-xl p-5 card-shadow"
                  >
                    <div className="h-10 w-10 rounded-lg hero-gradient flex items-center justify-center mb-3">
                      <s.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 card-shadow">
                  <h3 className="font-semibold text-foreground mb-4">
                    Appointments by Status
                  </h3>
                  <div className="space-y-3">
                    {["pending", "accepted", "completed", "rejected"].map(
                      (s) => {
                        const count = appointments.filter(
                          (a) => a.status === s,
                        ).length;
                        const pct = appointments.length
                          ? Math.round((count / appointments.length) * 100)
                          : 0;
                        return (
                          <div key={s}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-foreground capitalize">
                                {s}
                              </span>
                              <span className="text-muted-foreground">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full hero-gradient rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 card-shadow">
                  <h3 className="font-semibold text-foreground mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Rating</span>
                      <span className="font-bold text-foreground">
                        {doctor.rating} ⭐
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Reviews
                      </span>
                      <span className="font-bold text-foreground">
                        {doctor.reviews}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-bold text-foreground">
                        {doctor.experience} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fee per Visit
                      </span>
                      <span className="font-bold text-foreground">
                        ${doctor.fee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Available Slots
                      </span>
                      <span className="font-bold text-foreground">
                        {slots.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Edit Profile
              </h2>
              <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-20 w-20 rounded-2xl hero-gradient flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    {doctor.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {doctor.name}
                    </h2>
                    <p className="text-primary font-medium">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Consultation Fee ($)
                    </label>
                    <Input
                      value={profileForm.fee}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, fee: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Experience (years)
                    </label>
                    <Input
                      value={profileForm.experience}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Education
                    </label>
                    <Input
                      value={profileForm.education}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Bio
                    </label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => toast({ title: "Profile updated!" })}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
