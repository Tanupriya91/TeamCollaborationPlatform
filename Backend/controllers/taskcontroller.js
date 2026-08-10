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



export async function updateTaskStatus(req, res) {
    try {
        const { workspaceId, projectId, taskId } = req.params;
        const { status } = req.body;

        const validStatuses = ["todo", "doing", "done"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Use todo, doing, or done"
            });
        }

        const taskRef = db
            .collection("workspaces")
            .doc(workspaceId)
            .collection("projects")
            .doc(projectId)
            .collection("tasks")
            .doc(taskId);

        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const task = taskSnapshot.data();

        let nextOrder = task.order || 1000;

        // If moving to a different status column,
        // put the task at the end of that column.
        if (task.status !== status) {
            const tasksSnapshot = await db
                .collection("workspaces")
                .doc(workspaceId)
                .collection("projects")
                .doc(projectId)
                .collection("tasks")
                .where("status", "==", status)
                .orderBy("order", "desc")
                .limit(1)
                .get();

            if (!tasksSnapshot.empty) {
                const highestOrder =
                    tasksSnapshot.docs[0].data().order || 0;

                nextOrder = highestOrder + 1000;
            } else {
                nextOrder = 1000;
            }
        }

        await taskRef.update({
            status,
            order: nextOrder,
            updatedAt: new Date()
        });

        return res.status(200).json({
            message: "Task status updated successfully",
            task: {
                id: taskId,
                ...task,
                status,
                order: nextOrder
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update task status",
            error: error.message
        });
    }
}