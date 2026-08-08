import { useParams } from "react-router-dom";

function Workspace() {
    const { workspaceId } = useParams();

    return (
        <div>
            <h1>Workspace</h1>
            <p>Workspace ID: {workspaceId}</p>
        </div>
    );
}
export default Workspace;