export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  encrypted_name: string;
  encrypted_phone?: string;
  encrypted_address?: string;
  gdpr_consent: boolean;
  gdpr_consent_date?: string;
  marketing_consent: boolean;
  data_retention_period: string;
  preferred_language: string;
  notes?: string;
  deleted_at?: string;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  estimated_completion?: string;
  repair_details: string;
  technician_id?: string;
  total_amount?: number;
  currency: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  created_at: string;
  updated_at: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  reorder_point: number;
  unit_price: number;
  supplier_info?: Record<string, any>;
  category?: string;
  location?: string;
}

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  payment_terms?: string;
  notes?: string;
}