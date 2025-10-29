  import { useState } from 'react';
  import MovieForm from './components/MovieForm';
  import MovieTable from './components/MovieTable';
  import type { Movie } from './types';

  export default function App() {
    const [editing, setEditing] = useState<Movie | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function onEdit(movie: Movie) {
      setEditing(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function onSaved() {
      setEditing(null);
      setRefreshKey((k) => k + 1);
    }

    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">
          Movies / Shows Dashboard
        </h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <MovieForm editing={editing} onSaved={onSaved} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <MovieTable key={refreshKey} onEdit={onEdit} />
        </div>
      </div>
    );
  }
