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

  const handleNameChange = (index, value) => {
    const newContacts = [...contacts];
    newContacts[index].name = value;
    setContacts(newContacts);
  };

  const formatPhoneNumber = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 11) {
      cleaned = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (cleaned.length === 10) {
      cleaned = cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (index, value) => {
    const newContacts = [...contacts];
    newContacts[index].phoneNumber = formatPhoneNumber(value);
    setContacts(newContacts);
  };

  const handleSubmit = async (e) => {
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

  const handleDeleteContact = (index) => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Adicionar Contatos
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={contact.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={contact.phoneNumber}
                  onChange={(e) =>
                    handlePhoneNumberChange(index, e.target.value)
                  }
                  maxLength={15}
                  minLength={14}
                  required
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteContact(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddContact}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar Contato
            </button>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
            {successMessage && <p className="text-center">{successMessage}</p>}
          </form>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Logout
      </button>
    </div>
  );
};

export default AddContacts;
