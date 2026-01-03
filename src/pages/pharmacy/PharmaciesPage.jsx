/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaClock, FaPills, FaSearch, FaStar } from "react-icons/fa";

// PharmaLink API Base URL - Update this to your deployed API
const PHARMALINK_API_URL = "https://pharmalink-api.azurewebsites.net/api";

// Sample pharmacies data (fallback when API is unavailable)
const SAMPLE_PHARMACIES = [
  {
    pharmacyID: 1,
    name: "صيدلية كيور - Cure Pharmacy",
    ownerName: "Dr. Ahmed El-Sayed",
    address: "بعد متجر رنين، بعد فيلا المحافظ، طريق، منشأة عبد الله، محافظة الفيوم",
    phoneNumber: "01096906912",
    rate: 4.5,
    startHour: "09:00",
    endHour: "21:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 2,
    name: "صيدلية الدكتوره رشا",
    ownerName: "Dr. Fatma Nour",
    address: "أمام فيلا المحافظ بجوار محطة البنزين، أحمد شوقي، أول الفيوم، محافظة الفيوم",
    phoneNumber: "0842112689",
    rate: 4.2,
    startHour: "08:00",
    endHour: "20:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 3,
    name: "صيدليات عناية",
    ownerName: "Dr. Mohamed Ali",
    address: "أمام فيلا المحافظ بجوار مطعم كوك دور، أحمد شوقي، قسم الفيوم، أول الفيوم، محافظة الفيوم",
    phoneNumber: "01200169999",
    rate: 4.7,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 4,
    name: "صيدليه الجبيلي",
    ownerName: "Dr. Ahmed Ali",
    address: "منشاة عبد الله، قبل معهد الصفوه الازهري، أول الفيوم، محافظة الفيوم",
    phoneNumber: "01068309213",
    rate: 4.7,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 5,
    name: "صيدلية المتحدة",
    ownerName: "Dr. Sara Hassan",
    address: "شارع الجمهورية، الفيوم",
    phoneNumber: "0846343938",
    rate: 4.3,
    startHour: "09:00",
    endHour: "23:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 6,
    name: "صيدلية الجهاد",
    ownerName: "Dr. Mohamed Wali",
    address: "مركز, الجامعة، قسم الفيوم، أول الفيوم، محافظة الفيوم",
    phoneNumber: "01064206162",
    rate: 4.6,
    startHour: "08:00",
    endHour: "24:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 7,
    name: "صيدليات سامح عطا",
    ownerName: "Dr. Sameh Atta",
    address: "Sameh Atta Pharmacy، alsayfiat aljadidat in front of Al-Shorouk Private School، محافظة الفيوم",
    phoneNumber: "0842030536",
    rate: 4.8,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
    imgUrl: null
  },
  {
    pharmacyID: 8,
    name: "صيدلية النيل",
    ownerName: "Dr. Khaled Ibrahim",
    address: "شارع النيل، الفيوم الجديدة",
    phoneNumber: "01012345678",
    rate: 4.4,
    startHour: "08:00",
    endHour: "22:00",
    status: "Active",
    imgUrl: null
  }
];

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(1);

  const isFirstRunFilters = useRef(true);
  const isFirstRunPage = useRef(true);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${PHARMALINK_API_URL}/Pharmacy`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pharmacies");
      }
      const data = await response.json();
      setAllPharmacies(data || []);
      setIsUsingMockData(false);
      applyFiltersAndPagination(data || []);
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
      // Use sample data as fallback
      console.log("Using sample pharmacy data as fallback");
      setAllPharmacies(SAMPLE_PHARMACIES);
      setIsUsingMockData(true);
      applyFiltersAndPagination(SAMPLE_PHARMACIES);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = (data) => {
    // Filter by search if provided
    let filtered = data || [];
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.address?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);
    
    setPharmacies(paginated);
    setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  useEffect(() => {
    if (isFirstRunFilters.current) {
      isFirstRunFilters.current = false;
      return;
    }
    setPage(1);
    applyFiltersAndPagination(allPharmacies);
  }, [search]);

  useEffect(() => {
    if (isFirstRunPage.current) {
      isFirstRunPage.current = false;
      return;
    }
    applyFiltersAndPagination(allPharmacies);
  }, [page]);

  // Format working hours
  const formatHours = (startHour, endHour) => {
    if (!startHour && !endHour) return null;
    const start = startHour || "N/A";
    const end = endHour || "N/A";
    return `${start} - ${end}`;
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full mb-4">
          <FaPills className="text-lg" />
          <span className="font-medium">Find Your Medicine</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Nearby Pharmacies
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse pharmacies near you, check medicine availability, and get your
          medications delivered or ready for pickup.
        </p>
        {isUsingMockData && (
          <p className="text-amber-600 text-sm mt-2 bg-amber-50 inline-block px-4 py-2 rounded-full">
            📍 Showing sample data - API connection unavailable
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pharmacies by name or location..."
            className="border rounded-xl pl-12 pr-4 py-3 w-full shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPharmacies}
            className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-600 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Pharmacies Grid */}
      {!loading && !error && (
        <>
          {pharmacies.length === 0 ? (
            <div className="text-center py-20">
              <FaPills className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No pharmacies found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.pharmacyID}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
                  style={{ overflowWrap: "anywhere" }}
                >
                  <div className="w-full h-32 flex items-center justify-center mb-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                    {pharmacy.imgUrl ? (
                      <img
                        src={pharmacy.imgUrl}
                        alt={pharmacy.name}
                        className="h-full object-contain p-4"
                      />
                    ) : (
                      <FaPills className="text-5xl text-teal-400" />
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {pharmacy.name}
                  </h2>

                  <div className="space-y-2 mb-4">
                    {pharmacy.address && (
                      <p className="text-gray-600 text-sm flex items-start gap-2">
                        <FaMapMarkerAlt className="text-teal-500 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2">{pharmacy.address}</span>
                      </p>
                    )}

                    {pharmacy.phoneNumber && (
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <FaPhone className="text-teal-500" />
                        <span dir="ltr">{pharmacy.phoneNumber}</span>
                      </p>
                    )}

                    {formatHours(pharmacy.startHour, pharmacy.endHour) && (
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <FaClock className="text-teal-500" />
                        <span>{formatHours(pharmacy.startHour, pharmacy.endHour)}</span>
                      </p>
                    )}

                    {pharmacy.rate && (
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span>{pharmacy.rate.toFixed(1)}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pharmacy.status === "Active" || pharmacy.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pharmacy.status === "Active" || pharmacy.status === 1 ? "Open" : "Closed"}
                    </span>

                    <Link
                      to={`/pharmacy/${pharmacy.pharmacyID}`}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-xl transition text-sm"
                    >
                      View Medicines
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pharmacies.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                className="px-4 py-2 border rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 transition"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span className="font-semibold text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                className="px-4 py-2 border rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 transition"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
