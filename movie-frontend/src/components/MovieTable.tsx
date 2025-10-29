import { useEffect, useRef, useState } from "react";
import type { Movie } from "../types";
import { fetchMovies, deleteMovie } from "../api";

type Props = {
  onEdit?: (movie: Movie) => void;
};

export default function MovieTable({ onEdit }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDirector, setFilterDirector] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadPage(1, true);
  }, [search, filterType, filterDirector]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page]);

  async function loadPage(nextPage: number, replace = false) {
    try {
      setLoading(true);
      const res = await fetchMovies(nextPage, 10);
      let filteredData = res.data;

      // Apply search and filters
      if (search.trim()) {
        filteredData = filteredData.filter((m) =>
          m.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterType) {
        filteredData = filteredData.filter(
          (m) => m.type.toLowerCase() === filterType.toLowerCase()
        );
      }
      if (filterDirector) {
        filteredData = filteredData.filter(
          (m) => m.director.toLowerCase() === filterDirector.toLowerCase()
        );
      }

      if (replace) {
        setMovies(filteredData);
      } else {
        setMovies((prev) => [...prev, ...filteredData]);
      }

      setPage(res.page);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id?: string) {
    if (!id) return;
    const ok = confirm("Are you sure you want to delete this movie?");
    if (!ok) return;
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie.");
    }
  }

  const uniqueTypes = Array.from(new Set(movies.map((m) => m.type))).filter(Boolean);
  const uniqueDirectors = Array.from(new Set(movies.map((m) => m.director))).filter(Boolean);

  return (
    <div className="w-full">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-64"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-48"
        >
          <option value="">All Types</option>
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={filterDirector}
          onChange={(e) => setFilterDirector(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-48"
        >
          <option value="">All Directors</option>
          {uniqueDirectors.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Thumbnail</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Director</th>
              <th className="px-3 py-2 text-left">Budget</th>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Duration</th>
              <th className="px-3 py-2 text-left">Year / Time</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              movies.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    {m.image ? (
                      <img
                        src={`https://movies-app-ten-flame.vercel.app${m.image}`}
                        alt={m.title}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium">{m.title}</td>
                  <td className="px-3 py-2">{m.type}</td>
                  <td className="px-3 py-2">{m.director}</td>
                  <td className="px-3 py-2">{m.budget ?? "-"}</td>
                  <td className="px-3 py-2">{m.location}</td>
                  <td className="px-3 py-2">{m.duration}</td>
                  <td className="px-3 py-2">{m.yearOrTime}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => onEdit?.(m)}
                      className="px-2 py-1 text-sm border rounded text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(m._id)}
                      className="px-2 py-1 text-sm border rounded text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loadMoreRef} className="py-6 text-center text-gray-600">
        {loading ? "Loading..." : hasMore ? "Scroll to load more..." : "No more records"}
      </div>
    </div>
  );
}
