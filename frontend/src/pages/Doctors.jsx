import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Filter, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SPECIALIZATION_LIST } from "@/lib/mockData";
import { doctorAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 6;

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [page, setPage] = useState(1);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data } = await doctorAPI.getDoctors();
      return data.map(d => ({
        id: d._id,
        name: d.name,
        specialization: d.doctorProfile?.specialization || "General Medicine",
        avatar: d.avatar || (d.name ? d.name[0] : "D"),
        rating: d.doctorProfile?.rating || 0,
        reviews: d.doctorProfile?.reviews || 0,
        experience: d.doctorProfile?.experience || 0,
        fee: d.doctorProfile?.fee || 0,
        location: d.doctorProfile?.location || "Unknown",
        available: d.doctorProfile?.available !== false,
      }));
    }
  });

  const filtered = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase());
      const matchSpec = specFilter === "All" || d.specialization === specFilter;
      return matchSearch && matchSpec;
    });
  }, [search, specFilter, doctors]);


  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1"></div>
            {userInfo?.role === 'admin' && (
              <Link to="/admin">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Go to Add Doctor
                </Button>
              </Link>
            )}
          </div>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Find Your Doctor
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our network of verified specialists and book your
              appointment
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors, specialization, location..."
                className="pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                className="h-10 pl-10 pr-4 rounded-md border border-input bg-background text-foreground text-sm appearance-none cursor-pointer min-w-[180px]"
                value={specFilter}
                onChange={(e) => {
                  setSpecFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Specializations</option>
                {SPECIALIZATION_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">
              Error loading doctors. Please try again later.
            </div>
          ) : paged.length === 0 ? (

            <div className="text-center py-20 text-muted-foreground">
              No doctors found matching your criteria.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="block bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                        {doc.avatar}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {doc.specialization}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span className="text-sm text-foreground font-medium">
                            {doc.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({doc.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {doc.location}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {doc.experience} yrs exp
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        ${doc.fee}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${doc.available ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {doc.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
