import { useEffect, useState } from 'react';
import { api } from './api.js';

const empty = { name: '', price: '', category_id: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/products').then(setProducts);
  useEffect(() => {
    load();
    api.get('/categories').then(setCategories);
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) await api.put(`/products/${editId}`, form);
    else await api.post('/products', form);
    reset();
    load();
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, category_id: p.category_id ?? '' });
  };
  const reset = () => { setEditId(null); setForm(empty); };

  const remove = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.del(`/products/${id}`);
    load();
  };

  return (
    <section>
      <form onSubmit={submit}>
        <input name="name" placeholder="Nom du produit" value={form.name} onChange={change} />
        <input name="price" type="number" step="0.01" placeholder="Prix" value={form.price} onChange={change} />
        <select name="category_id" value={form.category_id} onChange={change}>
          <option value="">— Catégorie —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" className="primary">{editId ? 'Modifier' : 'Ajouter'}</button>
        {editId && <button type="button" onClick={reset}>Annuler</button>}
      </form>

      <table>
        <thead>
          <tr><th>#</th><th>Nom</th><th>Prix</th><th>Catégorie</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{Number(p.price).toFixed(2)} dt</td>
              <td>{p.category_name || <span className="muted">—</span>}</td>
              <td className="actions">
                <button onClick={() => edit(p)}>Éditer</button>
                <button className="danger" onClick={() => remove(p.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan="5" className="empty">Aucun produit</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
