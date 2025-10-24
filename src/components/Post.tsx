"use client";
import React from "react";
import { Link, Button } from "@heroui/react";
import { displayDate } from "@/app/utilities/dateDisplay";
import { PostProps, PublicPost } from "@/app/utilities/getPublicPosts";
import { Subheading } from "./SiteFormat";
import { DownloadButton } from "./Downloads";

export interface PublicPostsProps {
  posts: PublicPost[];
}

interface PostHeaderProps {
  post: PostProps;
  downloadButtonVisible?: boolean;
}

export function PublicPosts({ posts }: PublicPostsProps) {
  const displayedPosts = posts.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  const [postsToShow, setPostsToShow] = React.useState(3);
  const handleLoadMore = () => {
    setPostsToShow(postsToShow + 3);
  };
  return (
    <div>
      <Subheading id="posts" title="Posts" />
      {displayedPosts.slice(0, postsToShow).map((post) => (
        <div key={post.slug} className="post-content m-8">
          <Link href={`/posts/${post.slug}/`} className="hyperlink text-2xl font-bold mb-2 block">
            {post.title}
          </Link>
          <p>{post.description}</p>
          <span className="text-gray-500">{`By ${post.author} · Posted: ${displayDate(post.lastModified)}`}</span>
        </div>
      ))}
      {posts.length > postsToShow && ( // Check if there are more posts to load
        <center>
          <Button color="primary" onClick={handleLoadMore}>
            Load More Posts
          </Button>
        </center>
      )}
    </div>
  );
}

export function PostHeader({ post, downloadButtonVisible = true }: PostHeaderProps) {
  return (
    <div className="markdown-header">
      <span>
        <Link href="/#posts">Posts</Link>
        {` > ${post.title}`}
      </span>
      <br />
      <span className="text-gray-500">
        By {post.author} &middot; Posted: {displayDate(post.lastModified)}
      </span>

      {downloadButtonVisible && post.download && <DownloadButton />}
    </div>
  );
}

interface PageHeadElementProps {
  post: PostProps;
  isDownloadPage?: boolean;
}

// Head component for SEO and redirection
export function PostPageHeadElement({ post, isDownloadPage = false }: PageHeadElementProps) {
  const pageTitle = isDownloadPage ? `${post.title} - Downloads | JaylyMC` : `${post.title} | JaylyMC`;
  const pageDescription = isDownloadPage ? `Downloads for ${post.title}. ` + post.description : post.description;
  return (
    <head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={post.author} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={post.image} />
      <meta property="twitter:card" content={post.card} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={post.image} />
      {post.redirect && <meta httpEquiv="refresh" content={`0; url=${post.redirect}`} />}
    </head>
  );
}
