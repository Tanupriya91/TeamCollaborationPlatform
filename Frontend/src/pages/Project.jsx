import { Link, useParams } from "react-router-dom";

function Project() {
    const { workspaceId, projectId } = useParams();

    return (
        <div>
            <h1>Project</h1>

            <p>
                Workspace ID: {workspaceId}
            </p>

            <p>
                Project ID: {projectId}
            </p>

            <Link to={`/workspace/${workspaceId}/projects`}>
                Back to Projects
            </Link>
        </div>
    );
}

export default Project;