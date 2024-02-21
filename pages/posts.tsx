import { useEffect } from "react";

const PostsPage: React.FC = () => {
  useEffect(() => {
    // Perform the redirect when the component mounts
    window.location.href = "/#posts";
  }, []);

  return null; // This component does not render anything
};

export default PostsPage;
