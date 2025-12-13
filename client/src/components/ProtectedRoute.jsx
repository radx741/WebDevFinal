import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.user);

    // Check if user is authenticated (user object is not empty)
    const isAuthenticated = user && Object.keys(user).length > 0;

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the protected content
    return children;
};

export default ProtectedRoute;
