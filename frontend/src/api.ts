import axios from "axios";

const API_URL = "http://localhost:5000/todos"; // Adjust according to your backend

export const getTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addTodo = async (title: string, description: string) => {
  const response = await axios.post(API_URL, { title, description });
  return response.data;
};

export const updateTodo = async (id: number) => {
  const response = await axios.put(`${API_URL}/${id}`);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
