import { GraphQLClient, gql } from "graphql-request";
import {
  RawGetCursosResponse,
  GetMenuResponse,
  RawGetPostsResponse,
  CleanPost,
  RawGetPostBySlugResponse,
  PaginatedPosts,
  CreateCommentInput,
  GetCursosResponse,
  SiteSettings,
  RawSiteSettingsResponse,
  GetDepoimentosResponse,
  RawGetDepoimentosResponse,
} from "@/types/wp";

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

// the main site's engine
export const wpClient = new GraphQLClient(endpoint);

// Get one by one and give specific data only to the requesting component
// Helps handling cache

// Get Customizer data
export async function getSiteSettings(): Promise<SiteSettings> {
  const query = gql`
    query siteSettings {
      themeSettings {
        siteLogo {
          sourceUrl
          altText
          mediaDetails {
            height
            width
          }
        }
        numAlunos
        numPaises
        numAvaliacoes
        numDuvidas
        subtituloCursos
        tituloCursos
        textoSobreMim
        tituloBotaoSobreMim
        linkBotaoSobreMim
        imagemSobreMim
        tituloVantagens
        subtituloVantagens
        vantagensList
        tituloDepoimentos
        subtituloDepoimentos
        tituloBotaoDepoimentos
        linkBotaoDepoimentos
      }
    }
  `;

  const rawData = await wpClient.request<RawSiteSettingsResponse>(query);

  // centers the data treatment here so we don't need to do it in types file or components
  return {
    siteLogo: rawData.themeSettings.siteLogo || undefined,
    numAlunos: rawData.themeSettings.numAlunos ?? 0,
    numPaises: rawData.themeSettings.numPaises ?? 0,
    numAvaliacoes: rawData.themeSettings.numAvaliacoes ?? 0,
    numDuvidas: rawData.themeSettings.numDuvidas ?? 0,
    subtituloCursos: rawData.themeSettings.subtituloCursos || "",
    tituloCursos: rawData.themeSettings.tituloCursos || "",
    textoSobreMim: rawData.themeSettings.textoSobreMim || "",
    tituloBotaoSobreMim: rawData.themeSettings.tituloBotaoSobreMim || "",
    linkBotaoSobreMim: rawData.themeSettings.linkBotaoSobreMim || "",
    imagemSobreMim: rawData.themeSettings.imagemSobreMim || "",
    tituloVantagens: rawData.themeSettings.tituloVantagens || "",
    subtituloVantagens: rawData.themeSettings.subtituloVantagens || "",
    vantagensList: rawData.themeSettings.vantagensList || [],
    tituloDepoimentos: rawData.themeSettings.tituloDepoimentos || "",
    subtituloDepoimentos: rawData.themeSettings.subtituloDepoimentos || "",
    tituloBotaoDepoimentos: rawData.themeSettings.tituloBotaoDepoimentos || "",
    linkBotaoDepoimentos: rawData.themeSettings.linkBotaoDepoimentos || "",
  };
}

export async function getDepoimentos(): Promise<GetDepoimentosResponse> {
  const query = gql`
    query depoimentos {
      depoimentos(first: 100, where: { orderby: { field: DATE, order: ASC } }) {
        nodes {
          codigowpDestaque
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          slug
          title
        }
      }
    }
  `;

  const data = await wpClient.request<RawGetDepoimentosResponse>(query);
  const depoimentos = data.depoimentos.nodes.map((depoimento) => ({
    isFeatured: depoimento.codigowpDestaque,
    content: depoimento.content,
    featuredImage: depoimento.featuredImage?.node.sourceUrl || null,
    slug: depoimento.slug,
    title: depoimento.title,
  }));

  return {
    depoimentos,
  };
}

// Get only courses data
export async function getCursos(): Promise<GetCursosResponse> {
  // the promise above represents what the function really returns (a GetCursosResponse type format)
  const query = gql`
    query GetCursosComMeta {
      cursos {
        nodes {
          title
          slug
          status
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
          codigowpCourseDuration
          codigowpCourseId
          codigowpCourseLevel
          codigowpCourseLink
          codigowpIsUdemy
          codigowpNewCourse
          codigowpNumStudents
          codigowpRegularPrice
          codigowpSalePrice
        }
      }
    }
  `;

  // real WordPress API response (using RawGetCursosResponse as reference)
  const data = await wpClient.request<RawGetCursosResponse>(query);
  const cursos = data.cursos.nodes.map((curso) => ({
    title: curso.title,
    slug: curso.slug,
    status: curso.status,
    categories: curso.categories?.nodes || [],
    featuredImage: curso.featuredImage?.node.sourceUrl || null,
    duration: curso.codigowpCourseDuration,
    id: curso.codigowpCourseId,
    level: curso.codigowpCourseLevel,
    link: curso.codigowpCourseLink,
    isUdemy: curso.codigowpIsUdemy,
    isNew: curso.codigowpNewCourse,
    numStudents: curso.codigowpNumStudents,
    regularPrice: curso.codigowpRegularPrice,
    salesPrice: curso.codigowpSalePrice,
  }));

  return {
    cursos,
  };
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
            databaseId
            parentDatabaseId
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
// Translates the data from the RawPostNode type to the CleanPost type
export async function getPostBySlug(slug: string): Promise<CleanPost | null> {
  // slug comes from the folder name and, consequently, from the URL parameters
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
        comments(
          where: { orderby: COMMENT_DATE_GMT, order: DESC }
          first: 100
        ) {
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

  // Just fetches data from the API
  // the request if of type RawGetPostBySlugResponse (RawPostNode)
  // used as reference, not to lie to typescript
  const data = await wpClient.request<RawGetPostBySlugResponse>(query, {
    id: slug,
    // just like we do in the GraphiQL interface
  });

  if (!data.post) return null;

  // Mapping from RawPostNode to CleanPost
  const cleanPost: CleanPost = {
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

  return cleanPost;
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
          status
        }
      }
    }
  `;

  const graphQLInput = {
    commentOn: input.commentOn,
    parent: input.parent,
    content: input.content,
    author: input.authorName,
    authorEmail: input.authorEmail,
  };

  try {
    const data = await wpClient.request<CreateCommentInput>(mutation, {
      input: graphQLInput,
    });

    if (data?.createComment?.success) {
      const isApproved = data.createComment.comment?.status === "approved";
      return {
        success: true,
        message:
          isApproved === true
            ? "Comentário publicado com sucesso!"
            : "Comentário enviado com sucesso! Ele aparecerá aqui assim que for aprovado pelo moderador.",
      };
    }

    return {
      success: false,
      message: "Não foi possível processar o comentário.",
    };
  } catch (error) {
    console.error("Erro na Mutation de Comentário:", error);
    return {
      success: false,
      message: "Erro de conexão com o servidor de comentários.",
    };
  }
}
