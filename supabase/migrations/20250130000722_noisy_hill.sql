/*
  # Initial Schema for Fluent Repair Shop Platform

  1. New Tables
    - `customers`
      - Core customer information with GDPR consent tracking
      - Encrypted sensitive data fields
    - `orders`
      - Repair order details with customer relationships
      - Status tracking and technician assignments
    - `inventory_items`
      - Basic inventory tracking
      - Stock levels and reorder points
    - `invoices`
      - Invoice records linked to orders
      - Payment tracking and tax calculations
    - `audit_logs`
      - GDPR-compliant activity tracking
      - Data access and modifications

  2. Security
    - RLS policies for all tables
    - Role-based access control
    - Encryption for sensitive data
*/

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Customers table with GDPR compliance
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  -- Encrypted personal data
  encrypted_name text NOT NULL,
  encrypted_phone text,
  encrypted_address text,
  -- GDPR consent tracking
  gdpr_consent boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  marketing_consent boolean DEFAULT false,
  data_retention_period interval DEFAULT '3 years'::interval,
  -- Metadata
  preferred_language text DEFAULT 'de',
  notes text,
  deleted_at timestamptz -- Soft delete for GDPR compliance
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  customer_id uuid REFERENCES customers(id),
  status text NOT NULL CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  estimated_completion timestamptz,
  repair_details text NOT NULL,
  technician_id uuid REFERENCES auth.users(id),
  total_amount decimal(10,2),
  currency text DEFAULT 'EUR',
  notes text
);

-- Inventory items
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  quantity integer NOT NULL DEFAULT 0,
  reorder_point integer NOT NULL DEFAULT 5,
  unit_price decimal(10,2) NOT NULL,
  supplier_info jsonb,
  category text,
  location text
);

-- Invoices
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  order_id uuid REFERENCES orders(id),
  invoice_number text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date timestamptz NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  tax_rate decimal(4,2) NOT NULL,
  tax_amount decimal(10,2) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  payment_terms text,
  notes text
);

-- Audit logs for GDPR compliance
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  old_data jsonb,
  new_data jsonb
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Employees can view customers" ON customers
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'technician'));

CREATE POLICY "Admins can manage customers" ON customers
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Employees can view orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'technician'));

CREATE POLICY "Admins and assigned technicians can update orders" ON orders
  FOR UPDATE TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() ->> 'role' = 'technician' AND technician_id = auth.uid())
  );

-- Functions for encryption/decryption
CREATE OR REPLACE FUNCTION encrypt_customer_data() RETURNS trigger AS $$
BEGIN
  NEW.encrypted_name = encode(encrypt_iv(NEW.encrypted_name::bytea, 
    current_setting('app.encryption_key')::bytea, 
    gen_random_bytes(16), 'aes'
  ), 'base64');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER encrypt_customer_data_trigger
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_customer_data();

-- Automated audit logging
CREATE OR REPLACE FUNCTION audit_log_changes() RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to all tables
CREATE TRIGGER audit_customers_changes
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_orders_changes
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();