import { db } from "../config/firebase.js";
export async function createProject(req, res) {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }
    const projectRef = db
      .collection("workspaces")
      .doc(workspaceId)
      .collection("projects")
      .doc();
    const project = {
      name: name.trim(),
      description: description?.trim() || "",
      createdBy: req.user.uid,
      createdAt: new Date(),
    };
    await projectRef.set(project);
    return res.status(201).json({
      message: "Project created successfully",
      project: {
        id: projectRef.id,
        ...project,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
}

export async function getProjects(req, res) {
  try {
    const { workspaceId } = req.params;

    const snapshot = await db
      .collection("workspaces")
      .doc(workspaceId)
      .collection("projects")
      .orderBy("createdAt", "asc")
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
}
