import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

function Workspaces() {
    const [workspaces, setWorkspaces] = useState([]);
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [createError, setCreateError] = useState("");

    async function loadWorkspaces() {
        try {
            setError("");

            const data = await apiFetch("/workspaces");

            setWorkspaces(data.workspaces);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWorkspaces();
    }, []);

    async function handleCreateWorkspace(event) {
        event.preventDefault();

        if (!name.trim()) {
            setCreateError("Workspace name is required");
            return;
        }

        try {
            setCreateError("");
            setCreating(true);

            await apiFetch("/workspaces", {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                }),
            });

            setName("");

            await loadWorkspaces();
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setCreating(false);
        }
    }

    if (loading) {
        return <p>Loading workspaces...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>My Workspaces</h1>

            {workspaces.length === 0 ? (
                <p>You don't have any workspaces yet.</p>
            ) : (
                <ul>
                    {workspaces.map((workspace) => (
                        <li key={workspace.id}>
                            <Link to={`/workspace/${workspace.id}`}>
                                {workspace.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Create Workspace</h2>

            <form onSubmit={handleCreateWorkspace}>
                <input
                    type="text"
                    placeholder="Workspace name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Workspace"}
                </button>
            </form>

            {createError && (
                <p>{createError}</p>
            )}
        </div>
    );
}

export default Workspaces;