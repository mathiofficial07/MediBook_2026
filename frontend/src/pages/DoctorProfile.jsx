import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDoctors } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

import { doctorAPI, appointmentAPI } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data } = await doctorAPI.getDoctorById(id);
      return {
        id: data._id,
        name: data.name,
        specialization: data.doctorProfile.specialization,
        avatar: data.avatar,
        rating: data.doctorProfile.rating,
        reviews: data.doctorProfile.reviews,
        location: data.doctorProfile.location,
        fee: data.doctorProfile.fee,
        experience: data.doctorProfile.experience,
        education: data.doctorProfile.education,
        bio: data.doctorProfile.bio,
        available: data.doctorProfile.available,
        slots: data.doctorProfile.slots,
      };
    },
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: (data) => appointmentAPI.book(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} has been confirmed.`,
      });
      navigate("/patient-dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Doctor not found
          </h2>
          <Link to="/doctors" className="text-primary hover:underline">
            Browse doctors
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    if (!userInfo._id) {
      toast({ title: "Please login to book", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Please select date and time slot",
        variant: "destructive",
      });
      return;
    }
    
    bookingMutation.mutate({
      doctorId: doctor.id,
      date: selectedDate,
      time: selectedSlot,
    });
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Profile card */}
            <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow mb-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-24 w-24 rounded-2xl hero-gradient flex items-center justify-center text-primary-foreground font-bold text-3xl shrink-0">
                  {doctor.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        {doctor.name}
                      </h1>
                      <p className="text-primary font-medium">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />{" "}
                          {doctor.rating} ({doctor.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {doctor.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ₹{doctor.fee}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per consultation
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />{" "}
                      {doctor.experience} yrs experience
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />{" "}
                      {doctor.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />{" "}
                      {doctor.available ? "Available" : "Unavailable"}
                    </div>
                  </div>

                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking section */}
            <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Appointment
              </h2>

              {/* Date picker */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Select Date
                </p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((d) => {
                    const dayName = new Date(d).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const dayNum = new Date(d).getDate();
                    return (
                      <button
                        key={d}
                        onClick={() => {
                          setSelectedDate(d);
                          setSelectedSlot("");
                        }}
                        className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all ${
                          selectedDate === d
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="text-xs text-muted-foreground">
                          {dayName}
                        </span>
                        <span className="text-lg font-bold text-foreground">
                          {dayNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Available Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.slots.length > 0 ? (
                      doctor.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                            selectedSlot === slot
                              ? "border-primary bg-accent text-accent-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {slot}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No slots available for this date.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!userInfo._id ? (
                <Link to="/login" className="w-full sm:w-auto block sm:inline-block">
                  <Button size="lg" className="w-full sm:w-auto">
                    Log in to Book
                  </Button>
                </Link>
              ) : userInfo.role !== 'patient' ? (
                <Button size="lg" className="w-full sm:w-auto" disabled>
                  Booking Restricted (Patients Only)
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleBook}
                  disabled={!doctor.available}
                >
                  {doctor.available ? "Confirm Booking" : "Doctor Unavailable"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
