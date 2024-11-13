export interface School {
  IL_ADI: string;
  ILCE_ADI: string;
  OKUL_ADI: string;
  ADRES: string;
  TELEFON: string;
  WEB_ADRES: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
}

export interface Sale {
  id: string;
  schoolId: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paidAmount: number;
  date: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface Appointment {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ExcelFile {
  id: string;
  name: string;
  date: string;
}