export interface ProductImage {
    id: string;
    imageUrl: string;
    thumbnailUrl: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    productId?: string;
}

export interface Product {
    id: string;
    name: string; // Replaces title
    slug: string;
    description: string;
    categoryId: string;
    category?: any; // Define properly if needed later

    // Pricing
    mrp: string; // "399.00" - Was originalPrice
    sellingPrice: string; // "299.00" - Was price
    discountPercentage: string;

    // Inventory
    stockQuantity: number;
    lowStockThreshold: number;
    sku: string;
    isOutofStock?: boolean; // Computable from stockQuantity <= 0

    // Metadata
    specifications?: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;

    // Status
    isFeatured: boolean;
    isActive: boolean;

    // Dates
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    deletedAt?: string | null;

    // Media
    images: ProductImage[];

    // Flexible for future DB fields
    [key: string]: any;
}
