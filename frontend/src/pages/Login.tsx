import { useState } from "react";
import { useLoginMutation } from "../services/endpoints/authApi.endpoints";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      setError("Something wrong!");
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="text-red-400 font-bold">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
