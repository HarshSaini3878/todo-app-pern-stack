import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🚀 Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Todo App API is running! 🚀");
});

// 📌 Get all Todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✨ Create a Todo
app.post("/todos", async (req: Request, res: Response) => {
  // Define type for the request body
  interface TodoInput {
    title: string;
    description: string;
  }

  const { title, description }: TodoInput = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    const newTodo = await prisma.todo.create({
      data: { title, description },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// ✅ Update a Todo (Mark as Completed)
app.put("/todos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id); // Convert ID to a number

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: true }, // Update completed status
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ❌ Delete a Todo
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id); // Convert ID to a number

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    await prisma.todo.delete({ where: { id } });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// 🛠 Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
