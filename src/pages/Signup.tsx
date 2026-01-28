import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    imageUrl: "",
    firmType: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", {
        ...formData,
        age: Number(formData.age),
      });

      console.log("Signup Success:", response.data);

      // Optional: auto-login token
      // localStorage.setItem("token", response.data.token);

      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0,0); }
            50% { transform: translate(30px,-10px); }
            100% { transform: translate(0,0); }
          }
          .cloud-float {
            animation: float 8s ease-in-out infinite;
          }
        `}
      </style>

      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white overflow-hidden">
        {/* Clouds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="cloud-float absolute left-[-100px] top-[35%] w-[300px] h-[100px] bg-white/70 rounded-full blur-xl"></div>
          <div className="cloud-float absolute right-[-120px] top-[40%] w-[320px] h-[110px] bg-white/70 rounded-full blur-xl"></div>
          <div className="cloud-float absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-white/60 rounded-full blur-2xl"></div>
        </div>

        {/* Glow rings */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-white/40 opacity-40 -top-96"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-white/40 opacity-30 -top-72"></div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl px-8 py-10">
          <h2 className="text-xl font-semibold text-center mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Start managing candidates effortlessly
          </p>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <input
              name="firstName"
              placeholder="First Name"
              className="input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <select
              name="gender"
              className="input"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input"
              value={formData.age}
              onChange={handleChange}
              required
              min={0}
            />

            <input
              name="email"
              placeholder="Email"
              className="input col-span-2"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="input col-span-2"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input col-span-2"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="firmType"
              className="input col-span-2"
              value={formData.firmType}
              onChange={handleChange}
              required
            >
              <option value="">Type of Firm</option>
              <option>Individual</option>
              <option>HR Firm</option>
              <option>Recruitment Head</option>
              <option>HR Head</option>
              <option>Consultancy</option>
              <option>Staffing Agency</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-black text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <span
              className="font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
