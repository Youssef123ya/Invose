/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaPills,
  FaSearch,
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

// PharmaLink API Base URL
const PHARMALINK_API_URL = "https://pharmalink-api.azurewebsites.net/api";

// Sample pharmacies data (matching PharmaciesPage)
const SAMPLE_PHARMACIES = {
  1: {
    pharmacyID: 1,
    name: "صيدلية كيور - Cure Pharmacy",
    ownerName: "Dr. Ahmed El-Sayed",
    address: "بعد متجر رنين، بعد فيلا المحافظ، طريق، منشأة عبد الله، محافظة الفيوم",
    phoneNumber: "01096906912",
    rate: 4.5,
    startHour: "09:00",
    endHour: "21:00",
    status: "Active",
  },
  2: {
    pharmacyID: 2,
    name: "صيدلية الدكتوره رشا",
    ownerName: "Dr. Fatma Nour",
    address: "أمام فيلا المحافظ بجوار محطة البنزين، أحمد شوقي، أول الفيوم",
    phoneNumber: "0842112689",
    rate: 4.2,
    startHour: "08:00",
    endHour: "20:00",
    status: "Active",
  },
  3: {
    pharmacyID: 3,
    name: "صيدليات عناية",
    ownerName: "Dr. Mohamed Ali",
    address: "أمام فيلا المحافظ بجوار مطعم كوك دور، أحمد شوقي، قسم الفيوم",
    phoneNumber: "01200169999",
    rate: 4.7,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
  },
  4: {
    pharmacyID: 4,
    name: "صيدليه الجبيلي",
    address: "منشاة عبد الله، قبل معهد الصفوه الازهري، أول الفيوم",
    phoneNumber: "01068309213",
    rate: 4.7,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
  },
  5: {
    pharmacyID: 5,
    name: "صيدلية المتحدة",
    address: "شارع الجمهورية، الفيوم",
    phoneNumber: "0846343938",
    rate: 4.3,
    startHour: "09:00",
    endHour: "23:00",
    status: "Active",
  },
  6: {
    pharmacyID: 6,
    name: "صيدلية الجهاد",
    address: "مركز, الجامعة، قسم الفيوم",
    phoneNumber: "01064206162",
    rate: 4.6,
    startHour: "08:00",
    endHour: "24:00",
    status: "Active",
  },
  7: {
    pharmacyID: 7,
    name: "صيدليات سامح عطا",
    address: "alsayfiat aljadidat in front of Al-Shorouk Private School",
    phoneNumber: "0842030536",
    rate: 4.8,
    startHour: "10:00",
    endHour: "22:00",
    status: "Active",
  },
  8: {
    pharmacyID: 8,
    name: "صيدلية النيل",
    address: "شارع النيل، الفيوم الجديدة",
    phoneNumber: "01012345678",
    rate: 4.4,
    startHour: "08:00",
    endHour: "22:00",
    status: "Active",
  },
};

// Sample medicines data
const SAMPLE_MEDICINES = [
  { drugId: 1, drugName: "Panadol Extra", drugCategory: "Pain Relief", price: 45.00, quantityAvailable: 150, drugImageUrl: null },
  { drugId: 2, drugName: "Augmentin 1g", drugCategory: "Antibiotics", price: 180.00, quantityAvailable: 80, drugImageUrl: null },
  { drugId: 3, drugName: "Nexium 40mg", drugCategory: "Digestive", price: 220.00, quantityAvailable: 45, drugImageUrl: null },
  { drugId: 4, drugName: "Lipitor 20mg", drugCategory: "Cardiovascular", price: 350.00, quantityAvailable: 30, drugImageUrl: null },
  { drugId: 5, drugName: "Ventolin Inhaler", drugCategory: "Respiratory", price: 95.00, quantityAvailable: 60, drugImageUrl: null },
  { drugId: 6, drugName: "Glucophage 850mg", drugCategory: "Diabetes", price: 85.00, quantityAvailable: 100, drugImageUrl: null },
  { drugId: 7, drugName: "Cataflam 50mg", drugCategory: "Pain Relief", price: 65.00, quantityAvailable: 200, drugImageUrl: null },
  { drugId: 8, drugName: "Concor 5mg", drugCategory: "Cardiovascular", price: 120.00, quantityAvailable: 55, drugImageUrl: null },
  { drugId: 9, drugName: "Xanax 0.5mg", drugCategory: "Nervous System", price: 75.00, quantityAvailable: 25, drugImageUrl: null },
  { drugId: 10, drugName: "Aspirin 100mg", drugCategory: "Pain Relief", price: 25.00, quantityAvailable: 300, drugImageUrl: null },
  { drugId: 11, drugName: "Omeprazole 20mg", drugCategory: "Digestive", price: 55.00, quantityAvailable: 120, drugImageUrl: null },
  { drugId: 12, drugName: "Amoxicillin 500mg", drugCategory: "Antibiotics", price: 65.00, quantityAvailable: 90, drugImageUrl: null },
];

const SAMPLE_CATEGORIES = ["Pain Relief", "Antibiotics", "Digestive", "Cardiovascular", "Respiratory", "Diabetes", "Nervous System"];

export default function PharmacyDetailsPage() {
  const { id: pharmacyId } = useParams();

  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch pharmacy details
  const fetchPharmacy = async () => {
    try {
      const response = await fetch(`${PHARMALINK_API_URL}/Pharmacy/${pharmacyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pharmacy details");
      }
      const data = await response.json();
      setPharmacy(data);
      setIsUsingMockData(false);
    } catch (err) {
      console.error("Error fetching pharmacy:", err);
      // Use mock data as fallback
      const mockPharmacy = SAMPLE_PHARMACIES[pharmacyId];
      if (mockPharmacy) {
        setPharmacy(mockPharmacy);
        setIsUsingMockData(true);
      } else {
        setError("Pharmacy not found.");
      }
    }
  };

  // Fetch pharmacy stock/medicines
  const fetchMedicines = async () => {
    setLoadingMedicines(true);
    try {
      let url = `${PHARMALINK_API_URL}/PharmacyStock/GetBatchOfPharmacyStock?pharmacyId=${pharmacyId}&pageNumber=${page}&pageSize=${pageSize}`;
      
      if (selectedCategory) {
        url = `${PHARMALINK_API_URL}/PharmacyStock/${selectedCategory}?pharmacyId=${pharmacyId}&pageNumber=${page}&pageSize=${pageSize}`;
      }

      if (search) {
        url = `${PHARMALINK_API_URL}/PharmacyStock/DrugName/?pharmacyId=${pharmacyId}&drugName=${search}&pageNumber=${page}&pageSize=${pageSize}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data) {
        const items = data.data.items || data.data || [];
        setMedicines(items);
        setTotalPages(Math.ceil((data.data.totalItems || items.length || 1) / pageSize));
        setIsUsingMockData(false);
      } else {
        throw new Error("No data");
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      // Use mock data as fallback
      let filtered = [...SAMPLE_MEDICINES];
      
      if (search) {
        filtered = filtered.filter(m => 
          m.drugName.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(m => m.drugCategory === selectedCategory);
      }

      const startIdx = (page - 1) * pageSize;
      const paginated = filtered.slice(startIdx, startIdx + pageSize);
      
      setMedicines(paginated);
      setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
      setIsUsingMockData(true);
    } finally {
      setLoadingMedicines(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${PHARMALINK_API_URL}/Drug/GetAdminData`);
      const data = await response.json();
      if (data.Categories) {
        setCategories([...new Set(data.Categories)]);
      } else {
        throw new Error("No categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories(SAMPLE_CATEGORIES);
    }
  };

  // Format working hours
  const formatHours = (startHour, endHour) => {
    if (!startHour && !endHour) return null;
    return `${startHour || "N/A"} - ${endHour || "N/A"}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPharmacy(), fetchCategories()]);
      await fetchMedicines();
      setLoading(false);
    };
    loadData();
  }, [pharmacyId]);

  useEffect(() => {
    setPage(1);
    fetchMedicines();
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchMedicines();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          to="/pharmacy"
          className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-600 transition"
        >
          Back to Pharmacies
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        to="/pharmacy"
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back to Pharmacies</span>
      </Link>

      {/* Pharmacy Info Card */}
      {pharmacy && (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 md:p-8 mb-8 text-white">
          {isUsingMockData && (
            <p className="text-teal-100 text-sm mb-4 bg-teal-600/30 inline-block px-3 py-1 rounded-full">
              📍 Sample data - API unavailable
            </p>
          )}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              {pharmacy.imgUrl ? (
                <img
                  src={pharmacy.imgUrl}
                  alt={pharmacy.name}
                  className="w-full h-full object-contain p-2 rounded-xl"
                />
              ) : (
                <FaPills className="text-4xl text-teal-500" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {pharmacy.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-teal-100">
                {pharmacy.address && (
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span className="text-sm line-clamp-1">{pharmacy.address}</span>
                  </p>
                )}
                {pharmacy.phoneNumber && (
                  <p className="flex items-center gap-2">
                    <FaPhone />
                    <span className="text-sm" dir="ltr">{pharmacy.phoneNumber}</span>
                  </p>
                )}
                {formatHours(pharmacy.startHour, pharmacy.endHour) && (
                  <p className="flex items-center gap-2">
                    <FaClock />
                    <span className="text-sm">{formatHours(pharmacy.startHour, pharmacy.endHour)}</span>
                  </p>
                )}
                {pharmacy.rate && (
                  <p className="flex items-center gap-2">
                    <FaStar className="text-yellow-300" />
                    <span className="text-sm">{pharmacy.rate.toFixed(1)} rating</span>
                  </p>
                )}
              </div>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                pharmacy.status === "Active" || pharmacy.status === 1
                  ? "bg-green-400 text-green-900"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {pharmacy.status === "Active" || pharmacy.status === 1 ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="border rounded-xl pl-12 pr-4 py-3 w-full focus:ring-2 focus:ring-teal-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none min-w-[200px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicines Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Available Medicines
      </h2>

      {loadingMedicines ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <FaPills className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No medicines found.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <div
                key={medicine.drugId}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 border border-gray-100"
              >
                <div className="w-full h-32 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
                  {medicine.drugImageUrl ? (
                    <img
                      src={medicine.drugImageUrl}
                      alt={medicine.drugName}
                      className="h-full object-contain p-2"
                    />
                  ) : (
                    <FaPills className="text-4xl text-teal-300" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {medicine.drugName}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {medicine.drugCategory || "General"}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-teal-600">
                      {medicine.price?.toFixed(2) || "N/A"} EGP
                    </span>
                    {medicine.quantityAvailable !== undefined && (
                      <p className="text-xs text-gray-400">
                        {medicine.quantityAvailable > 0
                          ? `${medicine.quantityAvailable} in stock`
                          : "Out of stock"}
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/pharmacy/${pharmacyId}/medicine/${medicine.drugId}`}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition"
                  >
                    <FaShoppingCart />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              className="px-4 py-2 border rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              className="px-4 py-2 border rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
