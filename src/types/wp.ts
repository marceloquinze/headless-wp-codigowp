// 1 Cursos
export interface Curso {
  title: string;
  slug: string;
  codigowpCourseDuration: string;
  codigowpCourseLink: string;
  codigowpIsUdemy: boolean;
  codigowpNumStudents: number;
  codigowpSalePrice: string;
  codigowpRegularPrice: string;
}

export interface GetCursosResponse {
  cursos: {
    nodes: Curso[];
  };
}

// 2 Menus
export interface MenuItem {
  label: string;
  uri: string;
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
