// Customizer
// What I want...
export interface SiteSettings {
  siteLogo?: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      height: number;
      width: number;
    };
  };
  // Course data
  numAlunos: number;
  numPaises: number;
  numAvaliacoes: number;
  numDuvidas: number;
  subtituloCursos: string;
  tituloCursos: string;
  // About Me
  textoSobreMim: string;
  tituloBotaoSobreMim: string;
  linkBotaoSobreMim: string;
  imagemSobreMim: string;
  // Vantagens
  tituloVantagens: string;
  subtituloVantagens: string;
  vantagensList: string[];
  // Depoimentos
  tituloDepoimentos: string;
  subtituloDepoimentos: string;
  tituloBotaoDepoimentos: string;
  linkBotaoDepoimentos: string;
  // Destaque
  textoDestaque: string;
  tituloBotaoDestaque: string;
  linkBotaoDestaque: string;
  imagemDestaque: {
    alt: string;
    height: number;
    width: number;
    url: string;
  };
  imagemDestaqueFundo: string;
}

// How the API responds...
export interface RawSiteSettingsResponse {
  themeSettings: SiteSettings;
}

// 1 Cursos
export interface RawCurso {
  title: string;
  slug: string;
  status: string;
  categories?: {
    nodes: { name: string; slug: string }[];
  };
  featuredImage?: {
    node: { sourceUrl: string };
  };
  codigowpCourseDuration: string;
  codigowpCourseId: string;
  codigowpCourseLevel: string;
  codigowpCourseLink: string;
  codigowpIsUdemy: boolean;
  codigowpNewCourse: boolean;
  codigowpNumStudents: number;
  codigowpRegularPrice: string;
  codigowpSalePrice: string;
}

export interface RawGetCursosResponse {
  cursos: {
    nodes: RawCurso[];
  };
}

export interface CleanCurso {
  title: string;
  slug: string;
  status: string;
  categories: { name: string; slug: string }[];
  featuredImage: string | null;
  duration: string;
  id: string;
  level: string;
  link: string;
  isUdemy: boolean;
  isNew: boolean;
  numStudents: number;
  regularPrice: string;
  salesPrice: string;
}

export interface GetCursosResponse {
  cursos: CleanCurso[];
}

// Depoimemtos

export interface RawDepoimento {
  title: string;
  slug: string;
  content: string;
  featuredImage?: {
    node: { sourceUrl: string };
  };
  codigowpDestaque: string;
}

export interface RawGetDepoimentosResponse {
  depoimentos: {
    nodes: RawDepoimento[];
  };
}

export interface CleanDepoimento {
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  isFeatured: string;
}

export interface GetDepoimentosResponse {
  depoimentos: CleanDepoimento[];
}

// Videos
export interface RawVideo {
  title: string;
  slug: string;
  content: string;
}

export interface RawGetVideosResponse {
  videos: {
    nodes: RawVideo[];
  };
}

export interface CleanVideo {
  title: string;
  slug: string;
  content: string;
}

export interface GetVideosResponse {
  videos: CleanVideo[];
}

// 2 Menus
export interface MenuItem {
  label: string;
  uri: string;
  databaseId: number;
  parentDatabaseId: number;
  childItems?: {
    nodes: MenuItem[];
  };
}

export interface GetMenuResponse {
  menu: {
    menuItems: {
      nodes: MenuItem[];
    };
  };
}

// 3 Posts
// Flattens post data - according to the GraphQL query
// helps getting the data from GraphQL in the getPostBySlug function
export interface RawPostNode {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  commentCount: number | null;
  author?: {
    node: { name: string };
  };
  categories?: {
    nodes: { name: string; slug: string }[];
  };
  featuredImage?: {
    node: { sourceUrl: string };
  };
  // Comments
  databaseId?: number;
  commentStatus?: "open" | "closed";
  comments?: {
    nodes: {
      databaseId: number;
      content: string;
      date: string;
      parentDatabaseId: number | 0;
      author: {
        node: {
          name: string;
          url: string | null;
        };
      };
    }[];
  };
}

export interface RawGetPostsResponse {
  posts: {
    nodes: RawPostNode[];
    pageInfo: {
      offsetPagination: {
        total: number;
        hasMore: boolean;
      };
    };
  };
}

// removes nodes, but not a singular 'node'
// helps translating the data from the RawPostNode type to the CleanPost type
// see the getPostBySlug function
export interface CleanPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  commentCount: number;
  authorName: string;
  categories: { name: string; slug: string }[];
  featuredImage: string | null;
  // Comments
  commentStatus: "open" | "closed";
  databaseId: number;
  comments: {
    databaseId: number;
    content: string;
    date: string;
    parentDatabaseId: number | 0;
    author: {
      node: {
        name: string;
        url: string | null;
      };
    };
  }[];
}

// Posts by slug
// helps getting the data from GraphQL in the getPostBySlug function
// since it is a wrapper of RawPostNode
export interface RawGetPostBySlugResponse {
  // each post is of type RawPostNode
  post: RawPostNode | null;
}

// Paginated posts
export interface PaginatedPosts {
  posts: CleanPost[];
  total: number;
  hasMore: boolean;
}

// Comments Mutation
export interface CreateCommentInput {
  createComment: {
    success: boolean;
    comment: {
      databaseId: number;
      status: "approved" | "hold" | "spam" | "trash";
    };
  };
  commentOn: number; // ID do Post
  parent?: number; // ID do Comentário Pai (opcional)
  content: string; // Texto do comentário
  author: string; // Nome do Autor
  authorEmail: string; // E-mail do Autor
}
