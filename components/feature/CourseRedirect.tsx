import { useParams, Navigate } from "react-router-dom";

function CourseRedirect() {
  const { moduleId } = useParams();
  return <Navigate to={`/module/${moduleId}`} replace />;
}

export default CourseRedirect;