export interface categories {
  id: number;
  cname: string;
}

export interface products {
  id: string;
  created_at: string;
  pname: string;
  categories: string[];
  description: string;
  detail: string;
  price: number;
  status: string;
  brand: string;
  updated_at: string;
  images: string[];
}
