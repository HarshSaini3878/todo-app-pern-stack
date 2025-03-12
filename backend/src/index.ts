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
app.get("/todos", async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post(
  "/registerUser",
  async (req: Request, res: Response): Promise<void> => {
    interface UserInput {
      name: string;
      email: string;
      password: string;
    }
    const { name, email, password }: UserInput = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Credentials  required" });
      return;
    }
    try {
      const newUser = await prisma.user.create({
        data: { name, email, password },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
);
app.post("/todos", async (req: Request, res: Response): Promise<void> => {
  interface TodoInput {
    title: string;
    description?: string;
    userId: string; // Ensure userId is included
  }

  const { title, description, userId="3813b455-9078-4e21-abba-628c2f47f55e" }: TodoInput = req.body;

  if (!title ||!userId ) {
    res.status(400).json({ error: "Title and userId are required" });
    return;
  }

  try {
    const newTodo = await prisma.todo.create({
      data: { title, description, userId },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// ✅ Update a Todo (Mark as Completed)
app.put("/todos/:id", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id }, // ✅ Correct field
      data: { completed: true },
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ❌ Delete a Todo
app.delete("/todos/:id", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
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
