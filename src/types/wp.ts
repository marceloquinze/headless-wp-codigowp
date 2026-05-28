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
      parentDatabaseId: number | null;
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
    parentDatabaseId: number | null;
    author: {
      node: {
        name: string;
        url: string | null;
      };
    };
  }[];
}

// Posts by slug
export interface RawGetPostBySlugResponse {
  post: RawPostNode | null;
}

// Paginated posts
export interface PaginatedPosts {
  posts: CleanPost[];
  total: number;
  hasMore: boolean;
}
