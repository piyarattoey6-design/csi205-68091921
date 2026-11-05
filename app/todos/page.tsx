'use client'
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { Button } from "@/components/tailgrids/core/button";
import { useState, useEffect } from "react";
import { Clock, Check, Trash2, Plus, Loader2, X } from "lucide-react";

type Todo = { id: number; title: string; completed: boolean };

// จำนวนรายการสูงสุดที่ดึงมาแสดง (20 รายการ / 5 ต่อหน้า = 4 หน้า)
const MAX_ITEMS = 20;

// ดึงข้อมูลจาก JSON (API)
const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [todosRaw, setTodosRaw] = useState<Todo[]>([]); // ข้อมูลดิบ
  const [todos, setTodos] = useState<Todo[]>([]); // ข้อมูลหลังกรอง
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(0);

  // State สำหรับควบคุม Modal และฟอร์มเพิ่ม Todo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // 1) load: fetch => todosRaw
  useEffect(() => {
    fetchTodos()
      .then((data) => {
        const limited = data.slice(0, MAX_ITEMS);
        console.log("todosRaw loaded:", limited);
        setTodosRaw(limited);
        setIsError(false);
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // 2) todosRaw, onlyWaiting => todos
  useEffect(() => {
    const selectedItems = todosRaw.filter(
      (todo) => !onlyWaiting || !todo.completed
    );
    console.log("todos (filtered):", selectedItems.length, "onlyWaiting:", onlyWaiting);
    setTodos(selectedItems);
  }, [todosRaw, onlyWaiting]);

  // 3) todos => numPages
  useEffect(() => {
    const n = Math.ceil(todos.length / itemsPerPage);
    console.log("numPages:", n);
    setNumPages(n);
  }, [todos, itemsPerPage]);

  // 4) numPages => curPage
  useEffect(() => {
    if (numPages === 0) setCurPage(0);
    else if (curPage === 0) setCurPage(1);
    else if (curPage > numPages) setCurPage(numPages);
    console.log("curPage check:", { numPages, curPage });
  }, [numPages]);

  // รายการที่แสดงในหน้าปัจจุบัน
  const start = Math.max(0, (curPage - 1) * itemsPerPage);
  const pageItems = todos.slice(start, start + itemsPerPage);

  // ตอนโหลดหรือ error ให้ pagination แสดงแบบปิดการใช้งาน
  const pagerDisabled = isLoading || isError;

  const deleteClick = (id: number) => {
    console.log("delete id:", id);
    setTodosRaw(todosRaw.filter((todo) => todo.id !== id));
  };

  // กด Waiting => เปลี่ยนเป็น Done
  const waitingClick = (id: number) => {
    console.log("waiting -> done, id:", id);
    setTodosRaw(
      todosRaw.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  // เปิด Modal พร้อมกำหนดค่าเริ่มต้น ID อัตโนมัติ (เช่น ใช้ค่าปัจจุบัน + 1 หรือ Date.now())
  const openAddModal = () => {
    setNewId(String(Date.now()));
    setNewTitle("");
    setIsModalOpen(true);
  };

  // ยืนยันการเพิ่ม Todo จาก Modal
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = Number(newId) || Date.now();
    const parsedTitle = newTitle.trim() !== "" ? newTitle : "New todo";

    const newTodo: Todo = { id: parsedId, title: parsedTitle, completed: false };
    console.log("add:", newTodo);
    setTodosRaw([newTodo, ...todosRaw]);
    setIsModalOpen(false);
  };

  return (
    // todos container
    <div className="mt-4 w-[600px] mx-auto relative">
      {/* controller */}
      <div className="flex items-center justify-between mb-3">
        {/* toggle + badge */}
        <div className="flex items-center gap-2">
          <Toggle
            label="Show only"
            checked={onlyWaiting}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOnlyWaiting(e.target.checked)
            }
          />
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-2.5 py-1 text-sm font-medium text-white">
            Waiting <Clock size={14} />
          </span>
        </div>

        {/* dropdown */}
        <div className="w-48">
          <NativeSelect
            value={itemsPerPage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              console.log("items per page:", e.target.value);
              setItemsPerPage(Number(e.target.value));
            }}
          >
            <NativeSelectOption value="5">5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">10 items per page</NativeSelectOption>
            <NativeSelectOption value="50">50 items per page</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <TableRoot>
          <TableHeader>
            <TableRow className="bg-black hover:bg-black">
              <TableHead className="w-24 text-center text-white font-bold">
                ID
              </TableHead>
              <TableHead className="text-center text-white font-bold">
                Title
              </TableHead>
              <TableHead className="text-white font-bold">
                <div className="flex items-center justify-end gap-3">
                  Completed
                  <button
                    onClick={openAddModal}
                    className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && isError && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-600 py-10">
                  No data, may be connection refused (reload again)
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-10">
                  No data
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              pageItems.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="text-center">
                    <span className="inline-block rounded-md bg-slate-600 px-3 py-1 text-sm font-semibold text-white">
                      {todo.id}
                    </span>
                  </TableCell>

                  <TableCell>{todo.title}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {todo.completed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-green-700 px-3 py-1.5 text-sm font-medium text-white">
                          Done <Check size={16} />
                        </span>
                      ) : (
                        <button
                          onClick={() => waitingClick(todo.id)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
                        >
                          Waiting <Clock size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteClick(todo.id)}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableRoot>
      </div>

      {/* pagination */}
      <div className="mt-2 mx-auto flex justify-center items-center gap-1">
        <Button
          size="sm"
          appearance="outline"
          disabled={pagerDisabled || curPage <= 1}
          onClick={() => setCurPage(1)}
        >
          First
        </Button>
        <div>
          <Pagination
            currentPage={pagerDisabled ? 1 : curPage}
            totalPages={pagerDisabled ? 3 : numPages}
            onPageChange={(p: number) => {
              if (pagerDisabled) return;
              console.log("change page ->", p);
              setCurPage(p);
            }}
            sideLayout="icon"
          />
        </div>
        <Button
          size="sm"
          appearance="outline"
          disabled={pagerDisabled || curPage >= numPages}
          onClick={() => setCurPage(numPages)}
        >
          Last
        </Button>
      </div>

      {/* Modal Popup สำหรับเพิ่ม Todo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl relative">
            {/* ปุ่มปิด (X) มุมขวาบน */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* หัวข้อ Modal */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 text-blue-600">
                <Plus size={20} />
              </span>
              <h2 className="text-xl font-bold text-gray-900">New todo</h2>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* ช่องกรอก ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* ช่องกรอก Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* ปุ่ม Cancel และ Add todo */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}