import { GraphQLClient, gql } from "graphql-request";
import {
  GetCursosResponse,
  GetMenuResponse,
  RawGetPostsResponse,
  CleanPost,
  RawGetPostBySlugResponse,
  PaginatedPosts,
} from "@/types/wp";
import { isBefore } from "date-fns";

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

// the main site's engine
export const wpClient = new GraphQLClient(endpoint);

// Get one by one and give specific data only to the requesting component
// Helps handling cache

// Get only courses data
export async function getCursos(): Promise<GetCursosResponse> {
  const query = gql`
    query GetCursosComMeta {
      cursos {
        nodes {
          title
          slug
          codigowpCourseDuration
          codigowpCourseLink
          codigowpCourseId
          codigowpCourseLevel
          codigowpIsUdemy
          codigowpNewCourse
          codigowpNumStudents
          codigowpRegularPrice
          codigowpSalePrice
        }
      }
    }
  `;

  return await wpClient.request<GetCursosResponse>(query);
}

// Get only menu data
export async function getMenu(slug: string): Promise<GetMenuResponse> {
  const query = gql`
    query GetMenuBySlug($id: ID!) {
      menu(id: $id, idType: SLUG) {
        menuItems {
          nodes {
            label
            uri
          }
        }
      }
    }
  `;

  return await wpClient.request<GetMenuResponse>(query, { id: slug });
}

// Get all posts (for Blog page)
// All data already formatted to pass on to views
export async function getPosts(
  page: number = 1,
  size: number = 6,
): Promise<PaginatedPosts> {
  const offset = (page - 1) * size;

  const query = gql`
    query GetPosts($offset: Int!, $size: Int!) {
      posts(where: { offsetPagination: { offset: $offset, size: $size } }) {
        nodes {
          title
          slug
          excerpt
          date
          commentCount
          categories {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
        pageInfo {
          offsetPagination {
            total
            hasMore
          }
        }
      }
    }
  `;

  const data = await wpClient.request<RawGetPostsResponse>(query, {
    offset,
    size,
  });

  const posts = data.posts.nodes.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content || "",
    date: post.date,
    commentCount: post.commentCount ?? 0,
    authorName: post.author?.node?.name || "Autor Desconhecido",
    categories: post.categories?.nodes || [],
    featuredImage: post.featuredImage?.node?.sourceUrl || null,
  }));

  return {
    posts,
    total: data.posts.pageInfo.offsetPagination.total,
    hasMore: data.posts.pageInfo.offsetPagination.hasMore,
  };
}

// Get posts by slug
export async function getPostBySlug(slug: string): Promise<CleanPost | null> {
  const query = gql`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        slug
        content
        date
        commentCount
        author {
          node {
            name
            description
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;

  const data = await wpClient.request<RawGetPostBySlugResponse>(query, {
    id: slug,
  });

  if (!data.post) return null;

  return {
    title: data.post.title,
    slug: data.post.slug,
    excerpt: data.post.excerpt,
    content: data.post.content,
    date: data.post.date,
    commentCount: data.post.commentCount ?? 0,
    authorName: data.post.author?.node?.name || "Sem Autor",
    categories: data.post.categories?.nodes || [],
    featuredImage: data.post.featuredImage?.node?.sourceUrl || null,
  };
}
