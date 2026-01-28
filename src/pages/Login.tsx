import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("https://n8n.srv982383.hstgr.cloud/webhook/7630ecaf-d839-4b98-ba96-a5774a85d224", {
        email_id:email,
        password,
      });

      // console.log("Login Success:", response.data);

      localStorage.setItem("token", uuidv4());
    

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
  0% { transform: translate(0, 0); }
  50% { transform: translate(30px, -10px); }
  100% { transform: translate(0, 0); }
}

          .cloud-float {
            animation:  float 6s ease-in-out infinite;
          }
        `}
      </style>
      <div
        className="min-h-screen relative flex items-center justify-center 
  bg-gradient-to-b from-sky-200 via-sky-100 to-white overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          {/* Left cloud */}
          <div className="cloud-float absolute left-[-100px] top-[40%] w-[300px] h-[100px] bg-white/70 rounded-full blur-xl"></div>
          <div className="cloud-float absolute left-[-40px] top-[38%] w-[180px] h-[80px] bg-white/70 rounded-full blur-xl"></div>

          {/* Right cloud */}
          <div className="cloud-float absolute right-[-120px] top-[45%] w-[320px] h-[110px] bg-white/70 rounded-full blur-xl"></div>
          <div className="cloud-float absolute right-[-40px] top-[43%] w-[200px] h-[90px] bg-white/70 rounded-full blur-xl"></div>

          {/* Bottom soft cloud */}
          <div className="cloud-float absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-white/60 rounded-full blur-2xl"></div>
        </div>
        {/* Glow arcs */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-white/40 opacity-40 -top-96"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-white/40 opacity-30 -top-72"></div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl px-8 py-10">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-xl shadow p-3">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center">
            Sign in with email
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Please log in to proceed.

            
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-black/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-black/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" /> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Get Started"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <span
              className="text-black font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
