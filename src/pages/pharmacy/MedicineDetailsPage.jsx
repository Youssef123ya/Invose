/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaPills,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaPhone,
  FaMinus,
  FaPlus,
  FaCheck,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";

// PharmaLink API Base URL
const PHARMALINK_API_URL = "https://pharmalink-api.azurewebsites.net/api";

// Sample medicines data (fallback)
const SAMPLE_MEDICINES = {
  1: { drugId: 1, drugName: "Panadol Extra", drugCategory: "Pain Relief", drugActiveIngredient: "Paracetamol + Caffeine", price: 45.00, quantityAvailable: 150, drugDescription: "Panadol Extra provides fast and effective relief from headaches, migraines, toothaches, and muscle pain. The combination of paracetamol and caffeine works together to enhance pain relief.", drugImageUrl: null, indications: "Headaches, migraines, toothaches, muscle pain, cold and flu symptoms", dosage: "Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.", warnings: "Do not exceed recommended dose. Consult doctor if symptoms persist." },
  2: { drugId: 2, drugName: "Augmentin 1g", drugCategory: "Antibiotics", drugActiveIngredient: "Amoxicillin + Clavulanic Acid", price: 180.00, quantityAvailable: 80, drugDescription: "Augmentin is a broad-spectrum antibiotic used to treat various bacterial infections including respiratory, urinary tract, and skin infections.", drugImageUrl: null, indications: "Bacterial infections of respiratory tract, urinary tract, skin and soft tissue", dosage: "As prescribed by physician. Complete the full course of treatment.", warnings: "May cause allergic reactions. Inform doctor of any penicillin allergies." },
  3: { drugId: 3, drugName: "Nexium 40mg", drugCategory: "Digestive", drugActiveIngredient: "Esomeprazole", price: 220.00, quantityAvailable: 45, drugDescription: "Nexium reduces stomach acid production and is used to treat gastroesophageal reflux disease (GERD) and peptic ulcers.", drugImageUrl: null, indications: "GERD, peptic ulcers, Zollinger-Ellison syndrome", dosage: "One tablet daily, preferably in the morning before breakfast.", warnings: "Long-term use may affect bone density. Consult doctor for extended use." },
  4: { drugId: 4, drugName: "Lipitor 20mg", drugCategory: "Cardiovascular", drugActiveIngredient: "Atorvastatin", price: 350.00, quantityAvailable: 30, drugDescription: "Lipitor helps lower cholesterol and reduce the risk of heart disease when diet and exercise alone are not enough.", drugImageUrl: null, indications: "High cholesterol, prevention of cardiovascular disease", dosage: "One tablet daily, with or without food.", warnings: "Report any unexplained muscle pain to your doctor immediately." },
  5: { drugId: 5, drugName: "Ventolin Inhaler", drugCategory: "Respiratory", drugActiveIngredient: "Salbutamol", price: 95.00, quantityAvailable: 60, drugDescription: "Ventolin provides quick relief from asthma symptoms and bronchospasm by relaxing airway muscles.", drugImageUrl: null, indications: "Asthma, bronchospasm, COPD", dosage: "1-2 puffs as needed. Do not exceed 8 puffs in 24 hours.", warnings: "Shake well before use. Seek emergency care if symptoms worsen." },
  6: { drugId: 6, drugName: "Glucophage 850mg", drugCategory: "Diabetes", drugActiveIngredient: "Metformin", price: 85.00, quantityAvailable: 100, drugDescription: "Glucophage helps control blood sugar levels in type 2 diabetes by improving insulin sensitivity.", drugImageUrl: null, indications: "Type 2 diabetes mellitus", dosage: "As prescribed. Usually taken with meals to reduce stomach upset.", warnings: "Monitor blood sugar regularly. Avoid excessive alcohol consumption." },
  7: { drugId: 7, drugName: "Cataflam 50mg", drugCategory: "Pain Relief", drugActiveIngredient: "Diclofenac Potassium", price: 65.00, quantityAvailable: 200, drugDescription: "Cataflam is a fast-acting anti-inflammatory medication for pain relief and reduction of inflammation.", drugImageUrl: null, indications: "Acute pain, inflammation, arthritis, dental pain", dosage: "1 tablet 2-3 times daily with food.", warnings: "Take with food to reduce stomach irritation. Avoid if allergic to NSAIDs." },
  8: { drugId: 8, drugName: "Concor 5mg", drugCategory: "Cardiovascular", drugActiveIngredient: "Bisoprolol", price: 120.00, quantityAvailable: 55, drugDescription: "Concor is a beta-blocker used to treat high blood pressure and heart failure.", drugImageUrl: null, indications: "Hypertension, heart failure, angina", dosage: "One tablet daily in the morning.", warnings: "Do not stop suddenly. Gradual dose reduction required under medical supervision." },
  9: { drugId: 9, drugName: "Xanax 0.5mg", drugCategory: "Nervous System", drugActiveIngredient: "Alprazolam", price: 75.00, quantityAvailable: 25, drugDescription: "Xanax is used for short-term relief of anxiety disorders and panic attacks.", drugImageUrl: null, indications: "Anxiety disorders, panic attacks", dosage: "As prescribed by physician. Start with lowest effective dose.", warnings: "May cause dependence. Do not stop abruptly. Avoid alcohol." },
  10: { drugId: 10, drugName: "Aspirin 100mg", drugCategory: "Pain Relief", drugActiveIngredient: "Acetylsalicylic Acid", price: 25.00, quantityAvailable: 300, drugDescription: "Low-dose aspirin is used for pain relief and cardiovascular protection.", drugImageUrl: null, indications: "Pain relief, fever reduction, cardiovascular protection", dosage: "1 tablet daily for cardiovascular protection, or as directed.", warnings: "May cause stomach bleeding. Not recommended for children under 12." },
  11: { drugId: 11, drugName: "Omeprazole 20mg", drugCategory: "Digestive", drugActiveIngredient: "Omeprazole", price: 55.00, quantityAvailable: 120, drugDescription: "Omeprazole reduces stomach acid and treats acid reflux and ulcers.", drugImageUrl: null, indications: "GERD, peptic ulcers, H. pylori infection", dosage: "One capsule daily before breakfast.", warnings: "Consult doctor for use beyond 14 days without medical advice." },
  12: { drugId: 12, drugName: "Amoxicillin 500mg", drugCategory: "Antibiotics", drugActiveIngredient: "Amoxicillin", price: 65.00, quantityAvailable: 90, drugDescription: "Amoxicillin is a penicillin-type antibiotic used to treat bacterial infections.", drugImageUrl: null, indications: "Bacterial infections of ear, nose, throat, respiratory and urinary tract", dosage: "One capsule 3 times daily for 7-10 days or as prescribed.", warnings: "Complete the full course. Report any allergic reactions immediately." },
};

// Sample pharmacies for "other pharmacies" section
const SAMPLE_NEARBY_PHARMACIES = [
  { pharmacyId: 2, pharmacyName: "صيدلية الدكتوره رشا", price: 47.00, address: "أحمد شوقي، الفيوم" },
  { pharmacyId: 3, pharmacyName: "صيدليات عناية", price: 44.00, address: "قسم الفيوم" },
  { pharmacyId: 4, pharmacyName: "صيدليه الجبيلي", price: 46.50, address: "منشاة عبد الله" },
];

export default function MedicineDetailsPage() {
  const { id: pharmacyId, medicineId } = useParams();
  const { user } = useContext(UserContext);

  const [medicine, setMedicine] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Fetch medicine details
  const fetchMedicineDetails = async () => {
    try {
      const response = await fetch(
        `${PHARMALINK_API_URL}/PharmacyStock/${pharmacyId}/${medicineId}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setMedicine(data.data);
        setIsUsingMockData(false);
      } else {
        throw new Error("No data");
      }
    } catch (err) {
      console.error("Error fetching medicine details:", err);
      // Use mock data as fallback
      const mockMedicine = SAMPLE_MEDICINES[medicineId];
      if (mockMedicine) {
        setMedicine(mockMedicine);
        setIsUsingMockData(true);
      } else {
        // Create a generic medicine if ID not found
        setMedicine(SAMPLE_MEDICINES[1]); // Default to first medicine
        setIsUsingMockData(true);
      }
    }
  };

  // Fetch pharmacy details
  const fetchPharmacy = async () => {
    try {
      const response = await fetch(`${PHARMALINK_API_URL}/Pharmacy/${pharmacyId}`);
      if (response.ok) {
        const data = await response.json();
        setPharmacy(data);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error("Error fetching pharmacy:", err);
      // Use simple mock pharmacy name
      setPharmacy({ name: "Pharmacy", pharmacyID: pharmacyId });
    }
  };

  // Fetch nearby pharmacies that have this medicine
  const fetchNearbyPharmacies = async () => {
    try {
      const response = await fetch(
        `${PHARMALINK_API_URL}/PharmacyStock/${medicineId}/pharmacies`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setNearbyPharmacies(data.data.slice(0, 5));
      } else {
        throw new Error("No data");
      }
    } catch (err) {
      console.error("Error fetching nearby pharmacies:", err);
      // Filter out current pharmacy from nearby list
      setNearbyPharmacies(
        SAMPLE_NEARBY_PHARMACIES.filter(p => p.pharmacyId !== parseInt(pharmacyId))
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMedicineDetails(),
        fetchPharmacy(),
        fetchNearbyPharmacies(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [pharmacyId, medicineId]);

  const handleAddToCart = () => {
    // In a real app, this would add to cart state/context
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || "Medicine not found"}</p>
        <Link
          to={`/pharmacy/${pharmacyId}`}
          className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-600 transition"
        >
          Back to Pharmacy
        </Link>
      </div>
    );
  }

  const totalPrice = (medicine.price || 0) * quantity;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        to={`/pharmacy/${pharmacyId}`}
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back to {pharmacy?.name || "Pharmacy"}</span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Medicine Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {isUsingMockData && (
            <p className="text-amber-600 text-sm mb-4 bg-amber-50 inline-block px-3 py-1 rounded-full">
              📍 Sample data - API unavailable
            </p>
          )}
          <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            {medicine.drugImageUrl ? (
              <img
                src={medicine.drugImageUrl}
                alt={medicine.drugName}
                className="max-h-full max-w-full object-contain p-4"
              />
            ) : (
              <FaPills className="text-8xl text-teal-300" />
            )}
          </div>
        </div>

        {/* Medicine Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <span className="text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1 rounded-full">
              {medicine.drugCategory || "Medicine"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {medicine.drugName}
          </h1>

          {medicine.drugActiveIngredient && (
            <p className="text-gray-500 mb-4">
              Active Ingredient: {medicine.drugActiveIngredient}
            </p>
          )}

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-teal-600">
              {medicine.price?.toFixed(2) || "N/A"}
            </span>
            <span className="text-xl text-gray-500">EGP</span>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {medicine.quantityAvailable !== undefined && medicine.quantityAvailable > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <FaCheck />
                <span className="font-medium">
                  In Stock ({medicine.quantityAvailable} available)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <FaExclamationTriangle />
                <span className="font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-600 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                <FaMinus className="text-gray-600" />
              </button>
              <span className="px-6 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                <FaPlus className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-teal-600">
                {totalPrice.toFixed(2)} EGP
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!medicine.quantityAvailable || medicine.quantityAvailable <= 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition ${
              addedToCart
                ? "bg-green-500 text-white"
                : medicine.quantityAvailable > 0
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {addedToCart ? (
              <>
                <FaCheck />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <FaShoppingCart />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {!user && (
            <p className="text-center text-gray-500 text-sm mt-3">
              <Link to="/login" className="text-teal-600 hover:underline">
                Login
              </Link>{" "}
              to complete your purchase
            </p>
          )}
        </div>
      </div>

      {/* Medicine Details Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex border-b mb-6">
          {["description", "usage", "warnings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition ${
                activeTab === tab
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="prose max-w-none">
          {activeTab === "description" && (
            <div>
              <p className="text-gray-600">
                {medicine.drugDescription ||
                  medicine.description ||
                  "No description available for this medicine."}
              </p>
              {medicine.indications && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Indications:</h4>
                  <p className="text-gray-600">{medicine.indications}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "usage" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-teal-500" />
                Dosage & Administration
              </h3>
              <p className="text-gray-600">
                {medicine.dosage ||
                  medicine.dosage_and_administration ||
                  "Please consult with a healthcare professional for proper dosage."}
              </p>
            </div>
          )}

          {activeTab === "warnings" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" />
                Warnings & Precautions
              </h3>
              <p className="text-gray-600">
                {medicine.warnings ||
                  medicine.warnings_and_cautions ||
                  "Always read the label. Follow the dosage instructions. Consult a doctor if symptoms persist."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Other Pharmacies with this Medicine */}
      {nearbyPharmacies.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Also Available At
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyPharmacies.map((pharm) => (
              <div
                key={pharm.pharmacyId || pharm.pharmacyID}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {pharm.pharmacyName || pharm.name}
                </h3>

                {pharm.address && (
                  <p className="text-sm text-gray-500 flex items-start gap-2 mb-2">
                    <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                    <span>{pharm.address}</span>
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-teal-600">
                    {pharm.price?.toFixed(2) || medicine.price?.toFixed(2)} EGP
                  </span>
                  <Link
                    to={`/pharmacy/${pharm.pharmacyId || pharm.pharmacyID}/medicine/${medicineId}`}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
