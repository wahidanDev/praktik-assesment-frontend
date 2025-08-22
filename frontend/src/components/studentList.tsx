import React, { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: number;
  kode_siswa: string;
  nama_siswa: string;
  alamat_siswa?: string | null;
  tgl_siswa?: string | null;
  jurusan_siswa?: string | null;
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    setError(null);
    axios
      .get<Student[]>("http://localhost:3000/students")
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch students");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm("Yakin ingin menghapus siswa ini?")) return;

    setDeletingId(id);
    axios
      .delete(`http://localhost:3000/students/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch(() => {
        alert("Gagal menghapus siswa.");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-4xl mb-4">Daftar Siswa</h1>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Kode</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Alamat</th>
            <th className="border border-gray-300 px-4 py-2">Tanggal Lahir</th>
            <th className="border border-gray-300 px-4 py-2">Jurusan</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{student.kode_siswa}</td>
              <td className="border border-gray-300 px-4 py-2">{student.nama_siswa}</td>
              <td className="border border-gray-300 px-4 py-2">{student.alamat_siswa || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{student.tgl_siswa || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{student.jurusan_siswa || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  disabled={deletingId === student.id}
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === student.id ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;
