import { useState } from 'react';
import Products from './Products.jsx';
import Categories from './Categories.jsx';

export default function App() {
  const [tab, setTab] = useState('products');

  return (
    <div className="container">
      <header>
        <h1>Gestion de Stock</h1>
        <nav>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
            Produits
          </button>
          <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>
            Catégories
          </button>
        </nav>
      </header>
      {tab === 'products' ? <Products /> : <Categories />}
    </div>
  );
}
