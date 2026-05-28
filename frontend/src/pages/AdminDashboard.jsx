import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  BarChart3,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Activity,
  Shield,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  mockUsers,
  mockDoctors,
  mockAppointments,
  mockActivityLogs,
  SPECIALIZATION_LIST,
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

const logTypeColors = {
  user: "bg-blue-100 text-blue-700",
  doctor: "bg-accent text-accent-foreground",
  appointment: "bg-yellow-100 text-yellow-700",
  system: "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [aptSearch, setAptSearch] = useState("");
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const { toast } = useToast();

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: SPECIALIZATION_LIST[0],
    fee: "",
    experience: "",
    location: "",
    education: "",
    bio: "",
  });

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );
  const filteredDocs = mockDoctors.filter(
    (d) =>
      d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.specialization.toLowerCase().includes(docSearch.toLowerCase()),
  );
  const filteredApts = mockAppointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(aptSearch.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Users",
      value: mockUsers.length,
      icon: Users,
      delta: "+12%",
    },
    {
      label: "Doctors",
      value: mockDoctors.length,
      icon: Stethoscope,
      delta: "+3",
    },
    {
      label: "Appointments",
      value: mockAppointments.length,
      icon: CalendarCheck,
      delta: "+8%",
    },
    { label: "Revenue", value: "$12,450", icon: TrendingUp, delta: "+15%" },
  ];

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "users", label: "Users", icon: Users },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "appointments", label: "Appointments", icon: CalendarCheck },
    { key: "logs", label: "Activity Logs", icon: Activity },
  ];

  const handleAddDoctor = () => {
    toast({
      title: "Doctor added!",
      description: `${newDoctor.name} has been added to the platform.`,
    });
    setShowAddDoctor(false);
    setNewDoctor({
      name: "",
      specialization: SPECIALIZATION_LIST[0],
      fee: "",
      experience: "",
      location: "",
      education: "",
      bio: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MediBook Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
              AU
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage the entire MediBook platform
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

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-card rounded-xl p-5 card-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg hero-gradient flex items-center justify-center">
                        <s.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium text-primary bg-accent px-2 py-0.5 rounded-full">
                        {s.delta}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-xl p-6 card-shadow">
                  <h3 className="font-semibold text-foreground mb-4">
                    Appointments by Status
                  </h3>
                  <div className="space-y-3">
                    {["pending", "accepted", "completed", "rejected"].map(
                      (s) => {
                        const count = mockAppointments.filter(
                          (a) => a.status === s,
                        ).length;
                        const pct = Math.round(
                          (count / mockAppointments.length) * 100,
                        );
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
                                className="h-full hero-gradient rounded-full transition-all"
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
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {mockActivityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${log.type === "appointment" ? "bg-yellow-500" : log.type === "doctor" ? "bg-primary" : "bg-muted-foreground"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {log.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.user} · {log.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor availability overview */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="font-semibold text-foreground mb-4">
                  Doctor Availability Overview
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {mockDoctors.slice(0, 8).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-accent/30"
                    >
                      <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {doc.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.specialization}
                        </p>
                      </div>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${doc.available ? "bg-green-500" : "bg-red-400"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {tab === "users" && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span className="bg-card px-3 py-2 rounded-lg card-shadow">
                    {mockUsers.filter((u) => u.role === "patient").length}{" "}
                    Patients
                  </span>
                  <span className="bg-card px-3 py-2 rounded-lg card-shadow">
                    {mockUsers.filter((u) => u.role === "doctor").length}{" "}
                    Doctors
                  </span>
                  <span className="bg-card px-3 py-2 rounded-lg card-shadow">
                    {mockUsers.filter((u) => u.role === "admin").length} Admins
                  </span>
                </div>
              </div>
              <div className="bg-card rounded-xl card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          User
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Role
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Joined
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Status
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                                {u.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {u.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-primary/10 text-primary" : u.role === "doctor" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(u.joined).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.status === "active" ? "bg-accent text-accent-foreground" : "bg-red-100 text-red-700"}`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toast({ title: `Viewing ${u.name}` })
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toast({
                                    title: `Deleted ${u.name}`,
                                    description: "User removed from platform",
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DOCTORS */}
          {tab === "doctors" && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors..."
                    className="pl-10"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setShowAddDoctor(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Doctor
                </Button>
              </div>

              {/* Add Doctor Modal */}
              {showAddDoctor && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 card-shadow mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      Add New Doctor
                    </h3>
                    <button onClick={() => setShowAddDoctor(false)}>
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Full Name
                      </label>
                      <Input
                        placeholder="Dr. ..."
                        value={newDoctor.name}
                        onChange={(e) =>
                          setNewDoctor({ ...newDoctor, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Specialization
                      </label>
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        value={newDoctor.specialization}
                        onChange={(e) =>
                          setNewDoctor({
                            ...newDoctor,
                            specialization: e.target.value,
                          })
                        }
                      >
                        {SPECIALIZATION_LIST.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Fee ($)
                      </label>
                      <Input
                        placeholder="150"
                        value={newDoctor.fee}
                        onChange={(e) =>
                          setNewDoctor({ ...newDoctor, fee: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Experience (years)
                      </label>
                      <Input
                        placeholder="10"
                        value={newDoctor.experience}
                        onChange={(e) =>
                          setNewDoctor({
                            ...newDoctor,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Location
                      </label>
                      <Input
                        placeholder="New York, NY"
                        value={newDoctor.location}
                        onChange={(e) =>
                          setNewDoctor({
                            ...newDoctor,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Education
                      </label>
                      <Input
                        placeholder="MD — ..."
                        value={newDoctor.education}
                        onChange={(e) =>
                          setNewDoctor({
                            ...newDoctor,
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
                        placeholder="Brief bio..."
                        value={newDoctor.bio}
                        onChange={(e) =>
                          setNewDoctor({ ...newDoctor, bio: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddDoctor} className="gap-2">
                    <Save className="h-4 w-4" /> Add Doctor
                  </Button>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
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
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${doc.available ? "bg-green-500" : "bg-red-400"}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                      <span>⭐ {doc.rating}</span>
                      <span>{doc.experience} yrs</span>
                      <span>${doc.fee}/visit</span>
                      <span>{doc.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => toast({ title: `Editing ${doc.name}` })}
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        onClick={() => toast({ title: `Removed ${doc.name}` })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            <>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10"
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                />
              </div>
              <div className="bg-card rounded-xl card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Patient
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Doctor
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Date/Time
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Status
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApts.map((apt) => {
                        const sc = statusConfig[apt.status];
                        const Icon = sc.icon;
                        return (
                          <tr
                            key={apt.id}
                            className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                          >
                            <td className="p-4">
                              <p className="text-sm font-medium text-foreground">
                                {apt.patientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {apt.patientEmail}
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-foreground">
                                {apt.doctorName}
                              </p>
                              <p className="text-xs text-primary">
                                {apt.specialization}
                              </p>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(apt.date).toLocaleDateString()} ·{" "}
                              {apt.time}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}
                              >
                                <Icon className="h-3 w-3" /> {sc.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toast({
                                    title: `Managing appointment ${apt.id}`,
                                  })
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ACTIVITY LOGS */}
          {tab === "logs" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Activity Logs
              </h2>
              <div className="bg-card rounded-xl card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Action
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          User
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Type
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockActivityLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                        >
                          <td className="p-4 text-sm text-foreground">
                            {log.action}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {log.user}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${logTypeColors[log.type]}`}
                            >
                              {log.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
