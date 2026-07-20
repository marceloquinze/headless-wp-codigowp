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
  RawGetVideosResponse,
  PaginatedVideos,
  // Pages
  RawPage,
  RawGetPageBySlugResponse,
  RawGetPagesResponse,
  RawPageSlugsResponse,
  CleanPage,
  GetPageBySlugParams,
  GetPagesParams,
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
        textoDestaque
        tituloBotaoDestaque
        linkBotaoDestaque
        imagemDestaque {
          alt
          height
          url
          width
        }
        imagemDestaqueFundo
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
    textoDestaque: rawData.themeSettings.textoDestaque || "",
    tituloBotaoDestaque: rawData.themeSettings.tituloBotaoDestaque || "",
    linkBotaoDestaque: rawData.themeSettings.linkBotaoDestaque || "",
    imagemDestaque: rawData.themeSettings.imagemDestaque || "",
    imagemDestaqueFundo: rawData.themeSettings.imagemDestaqueFundo || "",
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

// Get Videos
export async function getVideos(
  page: number = 1,
  size: number = 6,
): Promise<PaginatedVideos> {
  const offset = (page - 1) * size;

  const query = gql`
    query videos($offset: Int!, $size: Int!) {
      videos(where: { offsetPagination: { offset: $offset, size: $size } }) {
        nodes {
          title
          slug
          content
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;

  const data = await wpClient.request<RawGetVideosResponse>(query, {
    offset,
    size,
  });

  const videos = data.videos.nodes.map((video) => ({
    title: video.title,
    slug: video.slug,
    content: video.content,
  }));

  return {
    videos,
    total: data.videos.pageInfo.offsetPagination.total,
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

// Pages

const GET_PAGE_BY_SLUG_QUERY = gql`
  query GetPageBySlug($id: ID!, $idType: PageIdType = URI) {
    page(id: $id, idType: $idType) {
      databaseId
      title
      slug
      content
      date
      modified
      status
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            height
            width
          }
        }
      }
      parent {
        node {
          databaseId
          slug
        }
      }
      children {
        nodes {
          databaseId
          slug
        }
      }
      template {
        templateName
      }
    }
  }
`;

const GET_PAGES_QUERY = gql`
  query GetPages(
    $first: Int = 100
    $after: String = ""
    $orderBy: PagesOrderByEnum = DATE
    $order: OrderEnum = DESC
  ) {
    pages(
      first: $first
      after: $after
      where: { orderby: $orderBy, order: $order }
    ) {
      nodes {
        databaseId
        title
        slug
        content
        excerpt
        date
        modified
        status
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
        }
        seo {
          title
          description
          canonical
          openGraph {
            title
            description
            image {
              sourceUrl
            }
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

const GET_PAGE_SLUGS_QUERY = gql`
  query GetPageSlugs($first: Int = 1000) {
    pages(first: $first) {
      nodes {
        slug
      }
    }
  }
`;

export async function getPageBySlug(slug: string): Promise<CleanPage | null> {
  try {
    const data = await wpClient.request<RawGetPageBySlugResponse>(
      GET_PAGE_BY_SLUG_QUERY,
      { id: slug, idType: "URI" },
    );

    if (!data.page) {
      return null;
    }

    return transformRawPageToClean(data.page);
  } catch (error) {
    console.error(`Erro ao buscar página com slug "${slug}":`, error);
    return null;
  }
}

export async function getPages({
  first = 100,
  after = "",
  orderBy = "DATE",
  order = "DESC",
}: GetPagesParams = {}): Promise<{
  pages: CleanPage[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const data = await wpClient.request<RawGetPagesResponse>(GET_PAGES_QUERY, {
      first,
      after,
      orderBy,
      order,
    });

    const cleanPages = data.pages.nodes.map(transformRawPageToClean);

    return {
      pages: cleanPages,
      total: data.pages.pageInfo.offsetPagination.total,
      hasMore: data.pages.pageInfo.offsetPagination.hasMore,
    };
  } catch (error) {
    console.error("Erro ao buscar páginas:", error);
    return {
      pages: [],
      total: 0,
      hasMore: false,
    };
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const data = await wpClient.request<RawPageSlugsResponse>(
      GET_PAGE_SLUGS_QUERY,
      { first: 1000 },
    );

    return data.pages.nodes
      .map((node) => node.slug)
      .filter((slug) => slug !== ""); // Remove slugs vazios
  } catch (error) {
    console.error("Erro ao buscar slugs de páginas:", error);
    return [];
  }
}

export function transformRawPageToClean(rawPage: RawPage): CleanPage {
  return {
    id: rawPage.databaseId,
    title: rawPage.title || "",
    slug: rawPage.slug || "",
    content: rawPage.content || "",
    excerpt: rawPage.excerpt || "",
    date: rawPage.date || "",
    modified: rawPage.modified || "",
    status: rawPage.status || "draft",
    featuredImage: rawPage.featuredImage?.node?.sourceUrl || null,
    featuredImageAlt: rawPage.featuredImage?.node?.altText || null,
    featuredImageDimensions: rawPage.featuredImage?.node?.mediaDetails
      ? {
          width: rawPage.featuredImage.node.mediaDetails.width,
          height: rawPage.featuredImage.node.mediaDetails.height,
        }
      : null,
    seo: rawPage.seo
      ? {
          title: rawPage.seo.title || rawPage.title || "",
          description: rawPage.seo.description || "",
          canonical: rawPage.seo.canonical || "",
          ogTitle: rawPage.seo.openGraph?.title || rawPage.title || "",
          ogDescription: rawPage.seo.openGraph?.description || "",
          ogImage: rawPage.seo.openGraph?.image?.sourceUrl || null,
        }
      : null,
    parentId: rawPage.parent?.node?.databaseId || null,
    parentSlug: rawPage.parent?.node?.slug || null,
    template: rawPage.template?.templateName || null,
    children: rawPage.children?.nodes?.map(transformRawPageToClean) || [],
  };
}
