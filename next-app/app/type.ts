
type user = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}

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

type order = {
    id: string;
    created_at: Date;
    store_id: string;
    quantity: number;
    item_id: string;
    price_per_unit: number;
    cost_per_unit: number;
    method: OrderMethod;
}

type OrderMethod = "manual" | "api";

interface YearlyReportData {
  storeOverview: {
    revenue: number;
    cost: number;
    profit: number;
    totalOrders: number;
  };
  byMethod: {
    manual: {
      revenue: number;
      cost: number;
      profit: number;
      orderCount: number;
    };
    api: {
      revenue: number;
      cost: number;
      profit: number;
      orderCount: number;
    };
  };
  topItems: Array<{
    itemId: string;
    itemName: string;
    itemPicture: string;
    revenue: number;
    cost: number;
    profit: number;
    quantitySold: number;
  }>;
  storeName: string;
  year: number;
}

export type { store , item  , OrderMethod , order , YearlyReportData , user };