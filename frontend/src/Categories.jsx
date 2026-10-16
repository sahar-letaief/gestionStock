import { useEffect, useState } from 'react';
import { api } from './api.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/categories').then(setCategories);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editId) await api.put(`/categories/${editId}`, { name });
    else await api.post('/categories', { name });
    reset();
    load();
  };

  const edit = (c) => { setEditId(c.id); setName(c.name); };
  const reset = () => { setEditId(null); setName(''); };

  const remove = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await api.del(`/categories/${id}`);
    load();
  };

  return (
    <section>
      <form onSubmit={submit}>
        <input placeholder="Nom de la catégorie" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="primary">{editId ? 'Modifier' : 'Ajouter'}</button>
        {editId && <button type="button" onClick={reset}>Annuler</button>}
      </form>

      <table>
        <thead>
          <tr><th>#</th><th>Nom</th><th></th></tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td className="actions">
                <button onClick={() => edit(c)}>Éditer</button>
                <button className="danger" onClick={() => remove(c.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && <tr><td colSpan="3" className="empty">Aucune catégorie</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
