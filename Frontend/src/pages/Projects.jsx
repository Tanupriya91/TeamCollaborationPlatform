import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjects, createProject } from "../api/client";

function Projects() {
  const { workspaceId } = useParams();
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const token = await user.getIdToken();

        const data = await getProjects(workspaceId, token);

        setProjects(data.projects);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user && workspaceId) {
      loadProjects();
    }
  }, [user, workspaceId]);

  async function handleCreateProject(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = await user.getIdToken();

      const data = await createProject(
        workspaceId,
        {
          name,
          description,
        },
        token,
      );

      setProjects((currentProjects) => [...currentProjects, data.project]);

      setName("");
      setDescription("");
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <button onClick={logout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong>

              {project.description && <p>{project.description}</p>}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Create Project</h2>

      <form onSubmit={handleCreateProject}>
        <div>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <textarea
            placeholder="Project description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default Projects;
