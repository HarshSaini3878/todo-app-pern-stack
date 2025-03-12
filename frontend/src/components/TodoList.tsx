import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api";
import { Todo } from "../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Trash } from "lucide-react";

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
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: number) => updateTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10 text-green-600" size={40} />;
  if (error) return <p className="text-red-500 text-center mt-4">Error fetching todos</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">✅ Todo List</h1>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addMutation.mutate();
        }}
        className="flex flex-col gap-4 mb-6"
      >
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" disabled={addMutation.isLoading}>
          {addMutation.isLoading ? <Loader2 className="animate-spin" size={18} /> : "Add Todo"}
        </Button>
      </form>

      <div className="space-y-4">
        {todos?.map((todo) => (
          <Card key={todo.id} className="border border-gray-200 p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{todo.description}</p>
              <p className="text-sm font-medium mb-3">
                Status: {todo.completed ? "✅ Completed" : "❌ Pending"}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => updateMutation.mutate(todo.id)} 
                  variant={todo.completed ? "outline" : "default"}
                >
                  <Check className="mr-2" size={16} /> Complete
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  <Trash className="mr-2" size={16} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
