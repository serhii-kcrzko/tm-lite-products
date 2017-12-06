
export interface Customer {
  article: string;
  name: string;
  lift: number;
  addresses: Raw[];
}

export interface Raw {
  raw: string;
  quantity: string;
}
