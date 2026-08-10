import { auth } from "../firebase/config";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("User is not authenticated");
    }

    const token = await currentUser.getIdToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "API request failed");
    }

    return data;
}


export async function getProjects(workspaceId, token) {
    const response = await fetch(
        `http://localhost:3000/workspaces/${workspaceId}/projects`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    return response.json();
}

export async function createProject(workspaceId, data, token) {
    const response = await fetch(
        `http://localhost:3000/workspaces/${workspaceId}/projects`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    return response.json();
}
