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

// Menus

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

// Posts

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
}

export interface PaginatedPosts {
  posts: CleanPost[];
  total: number;
  hasMore: boolean;
}

// Posts by slug
export interface RawGetPostBySlugResponse {
  post: RawPostNode | null;
}
