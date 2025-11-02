
type store = {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
}

export type { store };