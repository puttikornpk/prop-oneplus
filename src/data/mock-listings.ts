export interface Property {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    location: string;
    size: {
        rai?: number;
        ngan?: number;
        sqwah: number;
    };
    image: string;
    isHot?: boolean;
    tags: string[];
    updatedAt: string;
    views: number;
}

export const MOCK_LISTINGS: Property[] = [
    {
        id: "1",
        title: "Land for Sale, Sukhumvit 39, Prime Location",
        price: 350000000,
        location: "Khlong Tan Nuea, Watthana, Bangkok",
        size: {
            rai: 1,
            ngan: 0,
            sqwah: 50,
        },
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        isHot: true,
        tags: ["Land", "Sale"],
        updatedAt: "2 hours ago",
        views: 1250,
    },
    {
        id: "2",
        title: "Beautiful Plot in Chiang Mai, Mountain View",
        price: 4500000,
        originalPrice: 5000000,
        location: "Hang Dong, Chiang Mai",
        size: {
            rai: 2,
            ngan: 0,
            sqwah: 0,
        },
        image: "https://images.unsplash.com/photo-1516156008625-3a9d60daae7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["Land", "Sale", "Mountain View"],
        updatedAt: "1 day ago",
        views: 850,
    },
    {
        id: "3",
        title: "Commercial Land near Future Park Rangsit",
        price: 85000000,
        location: "Thanyaburi, Pathum Thani",
        size: {
            rai: 5,
            ngan: 2,
            sqwah: 0,
        },
        image: "https://images.unsplash.com/photo-1599809275311-2cd0a3073711?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["Commercial", "Sale"],
        updatedAt: "3 days ago",
        views: 430,
    },
    {
        id: "4",
        title: "Cheap Land in Nakhon Nayok, Fruit Orchard",
        price: 1200000,
        location: "Mueang, Nakhon Nayok",
        size: {
            rai: 3,
            ngan: 1,
            sqwah: 20,
        },
        image: "https://images.unsplash.com/photo-1628192342028-2d93e187515b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["Orchard", "Sale"],
        updatedAt: "5 hours ago",
        views: 2100,
    },
    {
        id: "5",
        title: "Beachfront Land land for sale in Phuket",
        price: 150000000,
        location: "Thalang, Phuket",
        size: {
            rai: 4,
            ngan: 0,
            sqwah: 0,
        },
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["Beachfront", "Premium"],
        updatedAt: "1 week ago",
        views: 5600,
    },
    {
        id: "6",
        title: "Industrial Land, Purple Zone, Bang Na - Trad",
        price: 220000000,
        location: "Bang Phli, Samut Prakan",
        size: {
            rai: 10,
            ngan: 0,
            sqwah: 0,
        },
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["Industrial", "Sale"],
        updatedAt: "2 days ago",
        views: 320,
    },
];
