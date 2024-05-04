import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const AddContacts = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState([{ name: "", phoneNumber: "" }]);
  const [successMessage, setSuccessMessage] = useState("");
  const maxContacts = 5;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      }
    });

    return unsubscribe;
  }, []);

  const handleAddContact = () => {
    if (contacts.length < maxContacts) {
      setContacts([...contacts, { name: "", phoneNumber: "" }]);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index].name = value;
    setContacts(newContacts);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 11) {
      cleaned = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (cleaned.length === 10) {
      cleaned = cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index].phoneNumber = formatPhoneNumber(value);
    setContacts(newContacts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAnyEmpty = contacts.some(
      (contact) => contact.name === "" || contact.phoneNumber === ""
    );

    if (isAnyEmpty) {
      console.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const contactsRef = collection(db, "contacts");

      await Promise.all(
        contacts.map(async (contact) => {
          await addDoc(contactsRef, contact);
        })
      );

      setSuccessMessage(`${contacts.length} contatos foram adicionados.`);
      setContacts([{ name: "", phoneNumber: "" }]);
    } catch (error) {
      console.error("Erro ao enviar contatos:", error);
    }
  };

  const handleDeleteContact = async (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div>
      <h1>Adicionar Contatos</h1>
      <form onSubmit={handleSubmit}>
        {contacts.map((contact, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nome"
              value={contact.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={contact.phoneNumber}
              onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              maxLength={15}
              minLength={14}
              required
            />
            <button type="button" onClick={() => handleDeleteContact(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddContact}>
          Adicionar Contato
        </button>
        <button type="submit">Enviar</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default AddContacts;
