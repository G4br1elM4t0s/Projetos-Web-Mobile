import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (email === "" || null) {
      alert("Email invalido");
    } else {
      const response = await api.post("/auth/authenticate", {
        email,
        password,
      });
      const { _id } = response.data;
      localStorage.setItem("user", _id);

      navigate("/dashboard");
    }
  }
  return (
    <div className="container">
      <div className="content">
        <p>
          <strong>Organize suas tarefas</strong>, com o intuito de ter mais{" "}
          <strong>produtividade</strong> em seu dia!
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-MAIL *</label>
          <input
            id="email"
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="email">PASSWORD *</label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          
          <a href="/"><p>Esqueceu sua senha?</p></a>

          <button className="btn" type="submit">
            Entrar
          </button>
          <button className="btn-cadastro" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
