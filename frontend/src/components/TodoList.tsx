import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api";
import { Todo } from "../types";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const TodoList = () => {
  const queryClient = useQueryClient();
  const { data: todos, isLoading, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addMutation = useMutation({
    mutationFn: () => addTodo(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setDescription("");
      toast.success("Todo added successfully!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: number) => updateTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.info("Todo status updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.error("Todo deleted!");
    },
  });

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching todos</p>;

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
      
      {/* Add Todo Form */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          addMutation.mutate();
        }}
        className="flex space-x-4 bg-white p-4 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-48"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-64"
          required
        />
        <motion.button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
          whileHover={{ scale: 1.1 }}
        >
          Add Todo
        </motion.button>
      </motion.form>

      {/* Todo List */}
      <ul className="w-full max-w-md space-y-4">
        {todos?.map((todo) => (
          <motion.li
            key={todo.id}
            className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div>
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <p className="text-gray-600">{todo.description}</p>
              <p className="text-sm mt-1 flex items-center">
                Status: {todo.completed ? "✅ Completed" : "⏳ Pending"}
              </p>
            </div>
            <div className="flex space-x-2">
              <motion.button
                onClick={() => updateMutation.mutate(todo.id)}
                className={`p-2 rounded-full shadow-md ${todo.completed ? "bg-gray-500" : "bg-blue-500"}`}
                whileHover={{ scale: 1.2 }}
              >
                <Check size={18} />
              </motion.button>
              <motion.button
                onClick={() => deleteMutation.mutate(todo.id)}
                className="bg-red-500 text-white p-2 rounded-full shadow-md"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
