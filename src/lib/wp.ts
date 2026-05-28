import { GraphQLClient, gql } from "graphql-request";
import {
  GetCursosResponse,
  GetMenuResponse,
  RawGetPostsResponse,
  CleanPost,
  RawGetPostBySlugResponse,
  PaginatedPosts,
} from "@/types/wp";

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
    // check this
    commentStatus: post.commentStatus || "closed",
    databaseId: post.databaseId || 0,
    comments: post.comments?.nodes || [],
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
        databaseId
        title
        slug
        content
        excerpt
        date
        commentCount
        commentStatus
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
        # Comments
        comments(where: { orderby: COMMENT_DATE_GMT, order: ASC }, first: 100) {
          nodes {
            databaseId
            content
            date
            parentDatabaseId
            author {
              node {
                name
                url
              }
            }
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
    // Comments
    databaseId: data.post.databaseId || 0,
    commentStatus: data.post.commentStatus || "closed",
    comments: data.post.comments?.nodes || [],
  };
}

// Mutations

export async function createComment(input: {
  commentOn: number; // ID do Post
  parent?: number; // ID do Comentário Pai (opcional)
  content: string; // Texto do comentário
  authorName: string; // Nome do Autor
  authorEmail: string; // E-mail do Autor
}): Promise<{ success: boolean; message: string }> {
  const mutation = gql`
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        success
        comment {
          databaseId
          approved
        }
      }
    }
  `;

  try {
    const data = await wpClient.request<any>(mutation, { input });

    if (data?.createComment?.success) {
      const isApproved = data.createComment.comment.approved;
      return {
        success: true,
        message: isApproved
          ? "Comentário publicado com sucesso!"
          : "Comentário enviado com sucesso! Ele aparecerá aqui assim que for aprovado pelo moderador.",
      };
    }

    return {
      success: false,
      message: "Não foi possível processar o comentário.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro de conexão com o servidor de comentários.",
    };
  }
}
