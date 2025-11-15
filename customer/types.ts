export interface Link {
  uniqueId: string;
  productName: string;
  amount: number;
  status: 'Pending' | 'PAID';
  imageUrl?: string;
  sellerEmail: string;
  buyerEmail?: string;
  createdAt: string;
}
