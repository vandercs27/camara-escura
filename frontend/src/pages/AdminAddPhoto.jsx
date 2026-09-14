import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, resolveImageUrl } from '../services/api';

export function AdminAddPhoto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [adminUser, setAdminUser] = useState(null);
  const [form, setForm] = useState({
    title: '', photographer: '', year: '', medium: '', era: 'seculo-19',
    historicalContext: '', photographerBio: '', imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user?.token) navigate('/login');
    else setAdminUser(user);
  }, [navigate]);

  useEffect(() => {
    if (!isEditMode) return;
    fetch(`${API_URL}/photos/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Erro ao carregar dados da fotografia.');
        return response.json();
      })
      .then((data) => setForm({
        title: data.title || '',
        photographer: data.photographer || '',
        year: data.year || '',
        medium: data.medium || '',
        era: data.era || 'seculo-19',
        historicalContext: data.historicalContext || '',
        photographerBio: data.photographerBio || '',
        imageUrl: resolveImageUrl(data.imageUrl),
      }))
      .catch((requestError) => setError(requestError.message));
  }, [id, isEditMode]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const storedUser = JSON.parse(localStorage.getItem('adminUser'));
      const token = storedUser?.token || adminUser?.token;
      if (!token) throw new Error('Sessão expirada. Faça login novamente.');

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'imageUrl') formData.append(key, value);
      });
      if (imageFile) formData.append('imageFile', imageFile);
      else if (form.imageUrl) formData.append('imageUrl', form.imageUrl);
      else if (!isEditMode) throw new Error('Informe uma URL de imagem ou selecione um arquivo.');

      const response = await fetch(`${API_URL}/photos${isEditMode ? `/${id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminUser');
          navigate('/login');
        }
        throw new Error(data.error || 'Erro ao processar requisição.');
      }

      setMessage(isEditMode ? 'Fotografia atualizada com sucesso!' : 'Fotografia cadastrada com sucesso!');
      if (!isEditMode) {
        setForm((current) => ({ ...current, title: '', photographer: '', year: '', medium: '',
          historicalContext: '', photographerBio: '', imageUrl: '' }));
        setImageFile(null);
      }
    } catch (requestError) {
      setError(requestError.message);
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
      <div style={styles.header}>
        <h2>{isEditMode ? 'Editar Fotografia do Acervo' : 'Painel de Cadastramento'}</h2>
        <button onClick={handleLogout} style={styles.button}>Sair</button>
      </div>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          ['title', 'Título da Obra'], ['photographer', 'Fotógrafo/Autor'],
          ['year', 'Ano'], ['medium', 'Técnica / Processo'],
        ].map(([name, label]) => (
          <label key={name} style={styles.field}>{label}
            <input name={name} value={form[name]} onChange={updateField} required style={styles.input} />
          </label>
        ))}
        <label style={styles.field}>Época
          <select name="era" value={form.era} onChange={updateField} style={styles.input}>
            <option value="seculo-19">Século XIX</option>
            <option value="1900-1920">Anos 1900-1920</option>
            <option value="1930-1950">Anos 1930-1950</option>
            <option value="1960-1980">Anos 1960-1980</option>
            <option value="contemporanea">Contemporânea</option>
          </select>
        </label>
        <label style={styles.field}>Arquivo de imagem
          <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} style={styles.input} />
        </label>
        <label style={styles.field}>Ou URL da imagem
          <input name="imageUrl" value={form.imageUrl} onChange={updateField} disabled={Boolean(imageFile)} style={styles.input} />
        </label>
        <label style={styles.field}>Contexto histórico
          <textarea name="historicalContext" value={form.historicalContext} onChange={updateField} style={styles.input} />
        </label>
        <label style={styles.field}>Biografia do fotógrafo
          <textarea name="photographerBio" value={form.photographerBio} onChange={updateField} style={styles.input} />
        </label>
        <button type="submit" disabled={loading} style={styles.submit}>
          {loading ? 'Salvando...' : 'Salvar fotografia'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 5%', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  form: { display: 'grid', gap: '16px' },
  field: { display: 'grid', gap: '6px', color: '#aaa' },
  input: { padding: '10px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px', color: '#fff' },
  button: { padding: '8px 14px', backgroundColor: '#333', border: 0, color: '#fff', borderRadius: '6px' },
  submit: { padding: '12px', backgroundColor: '#e5ba43', border: 0, borderRadius: '6px', fontWeight: 'bold' },
  success: { color: '#58d68d' },
  error: { color: '#e74c3c' },
};
