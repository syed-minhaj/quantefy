
type store = {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
}

type item = {
    id: string;
    name: string;
    picture: string;
    store_id: string;
    quantity: number;
    sale_price: number;
    cost_price: number;
    created_at: Date;
    updated_at: Date;
}

export type { store , item };