import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  LogOut,
  Stethoscope,
  Heart,
  FileText,
  Download,
  Bell,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  mockAppointments,
  mockDoctors,
  mockPrescriptions,
} from "@/lib/mockData";
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

import { appointmentAPI, prescriptionAPI } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PatientDashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  if (!userInfo || !userInfo._id || userInfo.role !== 'patient') {
    return <Navigate to="/login" replace />;
  }

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("appointments");
  const [filter, setFilter] = useState("all");
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [favorites, setFavorites] = useState(userInfo.favorites || []);


  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', userInfo._id],
    queryFn: async () => {
      const { data } = await appointmentAPI.getMyAppointments();
      return data.map(a => ({
        id: a._id,
        doctorId: a.doctor?._id,
        doctorName: a.doctor?.name || "Unknown Doctor",
        specialization: a.doctor?.doctorProfile?.specialization || "General Medicine",
        date: a.date,
        time: a.time,
        status: a.status,
        patientName: a.patient?.name || userInfo.name || 'Patient',
      }));
    },
    enabled: !!userInfo._id,
  });

  const { data: patientPrescriptions = [] } = useQuery({
    queryKey: ['prescriptions', userInfo._id],
    queryFn: async () => {
      const { data } = await prescriptionAPI.getMyPrescriptions();
      return data.map(p => ({
        id: p._id,
        doctorName: p.doctor?.name || 'Unknown Doctor',
        date: p.createdAt,
        diagnosis: p.diagnosis || '',
        medications: p.medications || [],
        notes: p.notes || '',
      }));
    },
    enabled: !!userInfo._id,
  });


  const cancelMutation = useMutation({
    mutationFn: (id) => appointmentAPI.updateStatus(id, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast({ title: "Appointment cancelled" });
    }
  });

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const cancelAppointment = (id) => {
    cancelMutation.mutate(id);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
    onSuccess: (data) => {
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
      toast({ title: "Profile updated!" });
    }
  });

  const [profile, setProfile] = useState({
    name: userInfo.name || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
    address: userInfo.address || "",
  });


  const favoriteMutation = useMutation({
    mutationFn: (id) => authAPI.toggleFavorite(id),
    onSuccess: (newFavorites) => {
      setFavorites(newFavorites);
      const isFav = newFavorites.includes(docIdContext.current);
      toast({ title: isFav ? "Added to favorites" : "Removed from favorites" });
      
      const updatedUser = { ...userInfo, favorites: newFavorites };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    }
  });

  const docIdContext = { current: null };

  const toggleFavorite = (docId) => {
    docIdContext.current = docId;
    favoriteMutation.mutate(docId);
  };

  const downloadPrescription = (rx) => {
    const text = `
PRESCRIPTION
============
Doctor: ${rx.doctorName}
Patient: ${rx.patientName}
Date: ${rx.date}
Diagnosis: ${rx.diagnosis}

Medications:
${rx.medications.map((m, i) => `${i + 1}. ${m.name} — ${m.dosage} — ${m.duration}`).join("\n")}

Notes: ${rx.notes}
    `.trim();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription-${rx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Prescription downloaded" });
  };

  const notifications = [
    {
      id: "n1",
      text: "Your appointment with Dr. Sarah Mitchell is tomorrow at 10:00 AM",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "n2",
      text: "Dr. Priya Sharma accepted your appointment",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "n3",
      text: "Prescription available from Dr. Emily Watson",
      time: "1 day ago",
      read: true,
    },
    {
      id: "n4",
      text: "Reminder: Follow-up with Dr. David Kim on March 28",
      time: "2 days ago",
      read: true,
    },
  ];

  const tabs = [
    { key: "appointments", label: "Appointments", icon: CalendarCheck },
    { key: "prescriptions", label: "Prescriptions", icon: FileText },
    { key: "favorites", label: "Favorites", icon: Heart },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "profile", label: "Profile", icon: Settings },
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
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {userInfo.name}
              </span>
            </div>
            <Link to="/login" onClick={() => localStorage.removeItem('userInfo')}>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Patient Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {userInfo.name}!</p>
            </div>

            <Link to="/doctors">
              <Button className="gap-2">
                <Calendar className="h-4 w-4" /> Book New
              </Button>
            </Link>
          </div>

          {/* Tabs */}
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

          {/* APPOINTMENTS TAB */}
          {tab === "appointments" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["all", "pending", "accepted", "completed"].map((s) => {
                  const count =
                    s === "all"
                      ? appointments.length
                      : appointments.filter((a) => a.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${filter === s ? "border-primary bg-accent" : "border-border hover:border-primary/40"}`}
                    >
                      <p className="text-2xl font-bold text-foreground">
                        {count}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {s === "all" ? "Total" : s}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    No appointments found.
                  </div>
                ) : (
                  filtered.map((apt) => {
                    const sc = statusConfig[apt.status];
                    const Icon = sc.icon;
                    return (
                      <div
                        key={apt.id}
                        className="bg-card rounded-xl p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground font-bold shrink-0">
                          {apt.doctorName 
                            ? (apt.doctorName.split(" ").slice(1).map((n) => n ? n[0] : "").join("") || apt.doctorName[0] || "DR")
                            : "DR"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {apt.doctorName}
                          </p>
                          <p className="text-sm text-primary">
                            {apt.specialization}
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelAppointment(apt.id)}
                              className="text-destructive"
                            >
                              Cancel
                            </Button>
                          )}
                          {apt.status === "accepted" && (
                            <Link to="/doctors">
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                            </Link>
                          )}
                          {apt.prescription && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setPrescriptionModal(apt.prescription)
                              }
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" /> Rx
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* PRESCRIPTIONS TAB */}
          {tab === "prescriptions" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Prescription History
              </h2>
              {patientPrescriptions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  No prescriptions yet.
                </div>
              ) : (
                patientPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-card rounded-xl p-6 card-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {rx.doctorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rx.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Diagnosis: {rx.diagnosis}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPrescription(rx)}
                        className="gap-2 shrink-0"
                      >
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Medications:
                      </p>
                      {rx.medications.map((m, i) => (
                        <div
                          key={i}
                          className="flex gap-4 text-sm text-muted-foreground py-1"
                        >
                          <span className="font-medium text-foreground">
                            {m.name}
                          </span>
                          <span>{m.dosage}</span>
                          <span>{m.duration}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Notes:
                      </span>{" "}
                      {rx.notes}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* FAVORITES TAB */}
          {tab === "favorites" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Favorite Doctors
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDoctors
                  .filter((d) => favorites.includes(d.id))
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-card rounded-xl p-5 card-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground font-bold">
                            {doc.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {doc.name}
                            </p>
                            <p className="text-xs text-primary">
                              {doc.specialization}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => toggleFavorite(doc.id)}>
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                        <span>⭐ {doc.rating}</span>
                        <span>{doc.experience} yrs exp</span>
                        <span>${doc.fee}/visit</span>
                        <span>{doc.location}</span>
                      </div>
                      <Link to={`/doctors/${doc.id}`}>
                        <Button size="sm" className="w-full">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  ))}
                {favorites.length === 0 && (
                  <div className="col-span-full text-center py-16 text-muted-foreground">
                    No favorite doctors yet. Browse doctors and add them to your
                    favorites!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {tab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`bg-card rounded-xl p-4 card-shadow flex items-start gap-3 ${!n.read ? "border-l-4 border-primary" : ""}`}
                  >
                    <Bell
                      className={`h-5 w-5 shrink-0 mt-0.5 ${!n.read ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm ${!n.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {n.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                My Profile
              </h2>
              <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {profile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">Patient</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Full Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Email
                    </label>
                    <Input
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Phone
                    </label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Address
                    </label>
                    <Input
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={() => updateProfileMutation.mutate(profile)}
                  className="gap-2"
                  disabled={updateProfileMutation.isPending}
                >
                  <Settings className="h-4 w-4" /> 
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setPrescriptionModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                Prescription
              </h3>
              <button onClick={() => setPrescriptionModal(null)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-medium text-foreground">Doctor:</span>{" "}
                <span className="text-muted-foreground">
                  {prescriptionModal.doctorName}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-foreground">Date:</span>{" "}
                <span className="text-muted-foreground">
                  {prescriptionModal.date}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-foreground">Diagnosis:</span>{" "}
                <span className="text-primary">
                  {prescriptionModal.diagnosis}
                </span>
              </p>
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Medications:
                </p>
                {prescriptionModal.medications.map((m, i) => (
                  <div
                    key={i}
                    className="text-sm text-muted-foreground py-1 flex gap-3"
                  >
                    <span className="font-medium text-foreground">
                      {m.name}
                    </span>{" "}
                    — {m.dosage} — {m.duration}
                  </div>
                ))}
              </div>
              <p className="text-sm">
                <span className="font-medium text-foreground">Notes:</span>{" "}
                <span className="text-muted-foreground">
                  {prescriptionModal.notes}
                </span>
              </p>
            </div>
            <Button
              onClick={() => {
                downloadPrescription(prescriptionModal);
                setPrescriptionModal(null);
              }}
              className="mt-4 gap-2 w-full"
            >
              <Download className="h-4 w-4" /> Download Prescription
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
