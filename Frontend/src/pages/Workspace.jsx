import { Link, useParams } from "react-router-dom";

function Workspace() {
    const { workspaceId } = useParams();

    return (
        <div>
            <h1>Workspace</h1>

            <p>Workspace ID: {workspaceId}</p>

            <Link to={`/workspace/${workspaceId}/projects`}>
                Projects
            </Link>
        </div>
    );
}

export default Workspace;