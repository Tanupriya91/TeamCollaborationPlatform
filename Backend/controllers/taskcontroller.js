import { db } from "../config/firebase.js";

export async function createTask(req, res) {
  try {
    const { workspaceId, projectId } = req.params;
    const { title, description, priority, assigneeId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const taskRef = db
      .collection("workspaces")
      .doc(workspaceId)
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc();

    const tasksSnapshot = await db
      .collection("workspaces")
      .doc(workspaceId)
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .where("status", "==", "todo")
      .orderBy("order", "desc")
      .limit(1)
      .get();

    let nextOrder = 1000;

    if (!tasksSnapshot.empty) {
      const highestOrder = tasksSnapshot.docs[0].data().order || 0;
      nextOrder = highestOrder + 1000;
    }
    const task = {
      title: title.trim(),
      description: description?.trim() || "",
      status: "todo",
      priority: priority || "medium",
      assigneeId: assigneeId || null,
      createdBy: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: nextOrder,
    };

    await taskRef.set(task);

    return res.status(201).json({
      message: "Task created successfully",
      task: {
        id: taskRef.id,
        ...task,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
}

export async function getTasks(req, res) {
  try {
    const { workspaceId, projectId } = req.params;

    const snapshot = await db
      .collection("workspaces")
      .doc(workspaceId)
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .orderBy("order", "asc")
      .get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
}
