import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function AdminAddPhoto() {
  const navigate = useNavigate();
  const { id } = useParams(); // Se existir id, estamos em modo edição
  const isEditMode = Boolean(id);

  const [adminUser, setAdminUser] = useState(null);
  const [title, setTitle] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [year, setYear] = useState('');
  const [medium, setMedium] = useState('');
  const [era, setEra] = useState('seculo-19');
  const [historicalContext, setHistoricalContext] = useState('');
  const [photographerBio, setPhotographerBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user || !user.token) {
      navigate('/login');
    } else {
      setAdminUser(user);
    }
  }, [navigate]);

  // Carrega os dados da foto existente se estiver no modo de edição
  useEffect(() => {
    if (isEditMode) {
      async function fetchPhotoForEdit() {
        try {
        const API_URL = 'https://camara-escura-backend.onrender.com/api';
const eraParam = era ? era : 'todas';
// Exemplo no fetch:
const response = await fetch(`${API_URL}/photos/era/${eraParam}`);
          if (!res.ok) throw new Error('Erro ao carregar dados da fotografia.');
          const data = await res.json();

          setTitle(data.title || '');
          setPhotographer(data.photographer || '');
          setYear(data.year || '');
          setMedium(data.medium || '');
          setEra(data.era || 'seculo-19');
          setHistoricalContext(data.historicalContext || '');
          setPhotographerBio(data.photographerBio || '');
          setImageUrl(data.imageUrl || '');
        } catch (err) {
          setError(err.message);
        }
      }
      fetchPhotoForEdit();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  setError('');

  try {
    // 1. Recupera o token diretamente do localStorage para garantir que ele exista no momento do envio
    const storedUser = JSON.parse(localStorage.getItem('adminUser'));
    const token = storedUser?.token || adminUser?.token;

    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('photographer', photographer);
    formData.append('year', year);
    formData.append('medium', medium);
    formData.append('era', era);
    formData.append('historicalContext', historicalContext);
    formData.append('photographerBio', photographerBio);

    if (imageFile) {
      formData.append('imageFile', imageFile);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    } else if (!isEditMode) {
      throw new Error('Informe uma URL de imagem ou selecione um arquivo.');
    }

    const url = isEditMode
      ? `http://localhost:5000/api/photos/${id}`
      : 'http://localhost:5000/api/photos';

    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Se o token tiver expirado ou retornado 401, aí sim redireciona pro login
      if (response.status === 401) {
        localStorage.removeItem('adminUser');
        navigate('/login');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(data.error || 'Erro ao processar requisição');
    }

    setMessage(isEditMode ? 'Fotografia atualizada com sucesso!' : 'Fotografia cadastrada com sucesso!');

    // 2. Limpa APENAS os campos do formulário e NUNCA o localStorage/sessão
    if (!isEditMode) {
      setTitle('');
      setPhotographer('');
      setYear('');
      setMedium('');
      setHistoricalContext('');
      setPhotographerBio('');
      setImageUrl('');
      setImageFile(null);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <h2>{isEditMode ? 'Editar Fotografia do Acervo' : 'Painel de Cadastramento'}</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>

      {message && <div style={styles.successMessage}>{message}</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Título da Obra*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Fotógrafo/Autor*</label>
            <input
              type="text"
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ano*</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Técnica / Processo*</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Época do Acervo*</label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              style={styles.input}
            >
              <option value="seculo-19">Século XIX</option>
              <option value="anos-1900-1920">Anos 1900–1920</option>
              <option value="anos-1930-1950">Anos 1930–1950</option>
              <option value="anos-1960-1980">Anos 1960–1980</option>
              <option value="contemporanea">Contemporânea</option>
            </select>
          </div>
        </div>

        <hr style={styles.divider} />

        <h3>Imagem da Fotografia</h3>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Substituir por arquivo local</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>OU URL Direta da Imagem</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={!!imageFile}
              style={styles.input}
            />
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.field}>
          <label style={styles.label}>Contexto Histórico</label>
          <textarea
            value={historicalContext}
            onChange={(e) => setHistoricalContext(e.target.value)}
            rows={3}
            style={styles.textarea}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Biografia do Fotógrafo</label>
          <textarea
            value={photographerBio}
            onChange={(e) => setPhotographerBio(e.target.value)}
            rows={3}
            style={styles.textarea}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Salvando...' : isEditMode ? 'Atualizar Fotografia' : 'Cadastrar Foto no Acervo'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '24px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '1px solid #333',
    color: '#fff',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  successMessage: {
    backgroundColor: '#1b3d1b',
    color: '#2ecc71',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  errorMessage: {
    backgroundColor: '#3d1212',
    color: '#e74c3c',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#aaa',
    fontSize: '0.9rem',
  },
  input: {
    padding: '10px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
  },
  textarea: {
    padding: '10px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
    resize: 'vertical',
  },
  divider: {
    borderColor: '#333',
    margin: '10px 0',
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#e5ba43',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
  },
};