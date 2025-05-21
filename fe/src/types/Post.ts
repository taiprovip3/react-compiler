interface Owner {
    id: number;
    username: string;
    email: string;
}

interface PostImage {
    id: number;
    imageUrl: string;
    description: string;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    price: string;
    viewsCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    owner: Owner;
    postImages: PostImage[];
}