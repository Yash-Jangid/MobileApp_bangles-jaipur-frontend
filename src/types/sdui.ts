export interface ComponentSection {
    id: string;
    component: string;       // Registry key: "HeroBanner", "ProductGrid"
    variant?: string;        // Optional variant: "Style_10", "Minimal"
    props: Record<string, any>; // Component-specific props
}

export interface PageResponse {
    pageId: string;
    pageType: string;
    slug: string;
    seo: {
        title: string;
        description: string;
        keywords?: string;
    };
    layout: ComponentSection[];
}

export interface HeroBannerProps {
    slides: Array<{
        id: string;
        image: string;
        title: string;
        subtitle?: string;
        ctaText?: string;
        ctaLink?: string;
    }>;
    autoplay?: boolean;
    interval?: number;
    variant?: 'Slider' | 'Static';
}

export interface ProductGridProps {
    title?: string;
    products?: any[];
    categoryId?: string;
    limit?: number;
    variant?: 'Grid' | 'Carousel' | 'List';
}

export interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    slug: string;
}
