import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [estAuBureau, setEstAuBureau] = useState(null);

  const verifierMotDePasse = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { password });
      if (response.data.authentifie) {
        setModalIsOpen(false);
        alert("Mot de passe correct. Vous pouvez maintenant indiquer votre présence.");
      } else {
        alert("Mot de passe incorrect.");
      }
    } catch (error) {
      alert("Erreur lors de la vérification du mot de passe.");
      console.error("Erreur d'authentification:", error);
    }
  };

  const changerPresence = async (presence) => {
    try {
      const response = await axios.post('http://localhost:5000/etat-presence', { password, presence });
      if (response.status === 200) {
        setEstAuBureau(presence);
        alert(response.data.message);
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour de l'état de présence.");
      console.error("Erreur de mise à jour de présence:", error);
    }
  };

  return (
    <div>
      <h1>Jérôme est-il au bureau ?</h1>
      <img src={estAuBureau === null ? "image_par_defaut.jpg" : estAuBureau ? "jerome_au_bureau.jpg" : "jerome_pas_au_bureau.jpg"} alt="Etat de présence de Jérôme" />
      <button onClick={() => setModalIsOpen(true)}>Je suis Jérôme</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Authentification de Jérôme"
      >
        <h2>Entrez votre mot de passe</h2>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={verifierMotDePasse}>Valider</button>
      </Modal>
      {estAuBureau !== null && (
        <div>
          <button onClick={() => changerPresence(true)}>Je suis au bureau</button>
          <button onClick={() => changerPresence(false)}>Je ne suis pas au bureau</button>
        </div>
      )}
    </div>
  );
}

export default App;
