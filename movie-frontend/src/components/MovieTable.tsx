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
  }, [loadMoreRef.current, hasMore, loading, page]);

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
        setMovies((m) => [...m, ...filteredData]);
      }
      setPage(res.page);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id?: string) {
    if (!id) return;
    const ok = confirm("Are you sure you want to delete this entry?");
    if (!ok) return;
    try {
      await deleteMovie(id);
      setMovies((m) => m.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  const uniqueTypes = Array.from(new Set(movies.map((m) => m.type))).filter(Boolean);
  const uniqueDirectors = Array.from(new Set(movies.map((m) => m.director))).filter(Boolean);

  return (
    <div className="w-full">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-48 focus:outline-none focus:ring focus:ring-blue-200"
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
          className="px-3 py-2 border rounded-md w-full sm:w-48 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">All Directors</option>
          {uniqueDirectors.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
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
                <tr
                  key={m._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2">
                    {m.image ? (
                      <img
                        src={`http://localhost:5000${m.image}`}
                        alt={m.title}
                        className="w-14 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 text-gray-500 flex items-center justify-center text-xs rounded-md border border-gray-300">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-800">{m.title}</td>
                  <td className="px-3 py-2">{m.type}</td>
                  <td className="px-3 py-2">{m.director}</td>
                  <td className="px-3 py-2">{m.budget ?? "-"}</td>
                  <td className="px-3 py-2">{m.location}</td>
                  <td className="px-3 py-2">{m.duration}</td>
                  <td className="px-3 py-2">{m.yearOrTime}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit?.(m)}
                        className="px-2 py-1 text-sm border rounded-md text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(m._id)}
                        className="px-2 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {movies.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No records found</div>
        ) : (
          movies.map((m) => (
            <div
              key={m._id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-shrink-0">
                {m.image ? (
                  <img
                    src={`http://localhost:5000${m.image}`}
                    alt={m.title}
                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 text-gray-500 flex items-center justify-center text-xs rounded-md border border-gray-300">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 text-sm">
                <h3 className="font-semibold text-gray-800">{m.title}</h3>
                <p>
                  <span className="font-medium">Type:</span> {m.type}
                </p>
                <p>
                  <span className="font-medium">Director:</span> {m.director}
                </p>
                <p>
                  <span className="font-medium">Year:</span> {m.yearOrTime}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onEdit?.(m)}
                    className="px-2 py-1 text-xs border rounded-md text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(m._id)}
                    className="px-2 py-1 text-xs border rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loadMoreRef} className="py-6 text-center text-gray-600">
        {loading ? (
          <div>Loading...</div>
        ) : hasMore ? (
          <div>Scroll to load more...</div>
        ) : (
          <div>No more records</div>
        )}
      </div>
    </div>
  );
}
