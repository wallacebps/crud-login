import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("Este e-mail não está cadastrado.");
      } else {
        setMessage("Ocorreu um erro ao enviar o e-mail de redefinição de senha. Por favor, tente novamente mais tarde.");
      }
    }
  };

  return (
    <div>
      <h1>Esqueceu a senha</h1>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetPassword}>Redefinir Senha</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
