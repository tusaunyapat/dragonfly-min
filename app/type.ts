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

export interface contacts {
  id: string;
  name: string;
  phone: string;
  other: string;
  created_at: string;
}

export interface social_medias {
  id: string;
  platform: string;
  url: string;
  created_at: string;
}
