import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createMovie, updateMovie } from "../api";
import type { Movie } from "../types";

export default function MovieForm({
  editing,
  onSaved,
  onClearEditing,
}: {
  editing?: Movie | null;
  onSaved?: () => void;
  onClearEditing?: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<Movie>({
    defaultValues: {
      title: "",
      type: "Movie",
      director: "",
      budget: undefined,
      location: "",
      duration: "",
      yearOrTime: "",
      details: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      reset(editing);
      setPreview(
        editing.image ? `https://movies-app-ten-flame.vercel.app${editing.image}` : null
      );
      if (fileRef.current) fileRef.current.value = "";
    } else {
      handleReset();
    }
  }, [editing]);

  const handleReset = () => {
    reset({
      title: "",
      type: "Movie",
      director: "",
      budget: undefined,
      location: "",
      duration: "",
      yearOrTime: "",
      details: "",
    });
    setPreview(null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: Movie) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v.toString());
    });
    if (file) fd.append("image", file);

    if (editing?._id) {
      await updateMovie(editing._id, fd);
      alert("Movie updated successfully!");
    } else {
      await createMovie(fd);
      alert("Movie added successfully!");
    }

    handleReset();
    onSaved?.();
    onClearEditing?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm">Title *</label>
        <input {...register("title", { required: true })} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Type *</label>
        <select {...register("type", { required: true })} className="w-full border rounded px-2 py-1">
          <option>Movie</option>
          <option>TV Show</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Director</label>
        <input {...register("director")} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Budget</label>
        <input type="number" {...register("budget")} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Location</label>
        <input {...register("location")} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Duration</label>
        <input {...register("duration")} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Year / Time</label>
        <input {...register("yearOrTime")} className="w-full border rounded px-2 py-1" />
      </div>

      <div>
        <label className="block text-sm">Image</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
          className="w-full border rounded px-2 py-1"
        />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm">Details</label>
        <textarea {...register("details")} rows={3} className="w-full border rounded px-2 py-1" />
      </div>

      <div className="md:col-span-2 flex justify-end gap-2 mt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editing ? "Update" : "Add"}
        </button>
        <button type="button" onClick={handleReset} className="px-4 py-2 border rounded">
          Reset
        </button>
      </div>
    </form>
  );
}
