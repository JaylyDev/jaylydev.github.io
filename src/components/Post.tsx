"use client";
import React from "react";
import Head from "next/head";
import { Link, Button } from "@heroui/react";
import { displayDate } from "@/utilities/dateDisplay";
import { PostProps, PublicPost } from "@/utilities/getPublicPosts";
import { Subheading } from "./SiteFormat";
import { DownloadButton } from "./Downloads";
import { TranslateProps } from "@/locale/i18n";

export interface PublicPostsProps extends TranslateProps {
  posts: PublicPost[];
}

interface PostHeaderProps extends TranslateProps {
  post: PostProps;
  downloadButtonVisible?: boolean;
  lang?: string;
}

export function PublicPosts({ posts, t }: PublicPostsProps) {
  const displayedPosts = posts.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  const [postsToShow, setPostsToShow] = React.useState(3);
  const handleLoadMore = () => {
    setPostsToShow(postsToShow + 3);
  };
  return (
    <div>
      <Subheading id="posts" title={t("postsHeading")} />
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
          <Button color="primary" onPress={handleLoadMore}>
            Load More Posts
          </Button>
        </center>
      )}
    </div>
  );
}

export function PostHeader({ post, downloadButtonVisible = true, t, lang = "en" }: PostHeaderProps) {
  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";

  return (
    <div className="markdown-header">
      <span>
        <Link href={`${localePrefix}/#posts`}>{t("header.posts")}</Link>
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
export function PostHeadMetadata({ post, isDownloadPage = false }: PageHeadElementProps) {
  const pageTitle = isDownloadPage ? `${post.title} - Downloads | JaylyMC` : `${post.title} | JaylyMC`;
  const pageDescription = isDownloadPage ? `Downloads for ${post.title}. ` + post.description : post.description;
  let postImage = "";
  if (post.image && post.image.startsWith("/")) {
    postImage = "https://jaylydev.github.io" + post.image;
  } else if (post.image) {
    postImage = post.image;
  }
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {post.author && <meta name="author" content={post.author} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {postImage && <meta property="og:image" content={postImage} />}
      <meta property="twitter:card" content={post.card} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      {postImage && <meta property="twitter:image" content={postImage} />}
      {post.redirect && <meta httpEquiv="refresh" content={`0; url=${post.redirect}`} />}
    </Head>
  );
}
