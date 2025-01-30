// src/core/FluentData.tsx
import { useEffect } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase, type Database } from '../lib/supabase';
import type { UseQueryResult } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface FluentDataConfig<T extends TableName> {
  table: T;
  select?: string;
  filters?: Record<string, unknown>;
  realtime?: boolean;
}

export function useFluentData<T extends TableName>({
  table,
  select = '*',
  filters = {},
  realtime = true,
}: FluentDataConfig<T>): UseQueryResult<TableRow<T>[], Error> {
  const queryKey = [table, JSON.stringify(filters)];
  const queryClient = useQueryClient();

  const fetchData = async () => {
    let query = supabase.from(table).select(select);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as TableRow<T>[];
  };

  const query = useQuery<TableRow<T>[], Error>({
    queryKey,
    queryFn: fetchData,
  });

  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table.toString(),
      }, () => {
        queryClient.invalidateQueries(queryKey);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, realtime, queryClient, queryKey]);

  return query;
}

// GDPR-specific operations
export const useGDPROperations = () => {
  const handleConsent = async (userId: string) => {
    const { error } = await supabase
      .from('customers')
      .update({
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw new Error('Consent update failed');
    return true;
  };

  const handleDataDeletion = async (userId: string) => {
    const { error } = await supabase.rpc('delete_customer_data', {
      customer_id: userId,
    });

    if (error) throw new Error('Data deletion failed');
    return true;
  };

  return { handleConsent, handleDataDeletion };
};

// Inventory-specific hooks
export const useInventory = () => {
  return useFluentData({
    table: 'inventory_items',
    select: '*,supplier_info',
    realtime: true,
  });
};

export const useLowStockItems = () => {
  const query = useInventory();
  return {
    ...query,
    data: query.data?.filter(item => item.quantity < item.reorder_point) || [],
  };
};

// Customer-specific hooks
export const useCustomers = (filters?: { status?: string }) => {
  return useFluentData({
    table: 'customers',
    select: 'id,created_at,encrypted_name,email,status,gdpr_consent,marketing_consent',
    filters,
  });
};

// Data Provider component
export function FluentDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Helper functions
export const decryptField = (encrypted: string) => {
  try {
    return supabase
      .rpc('decrypt_field', { encrypted_value: encrypted })
      .then(({ data }) => data);
  } catch (error) {
    console.error('Decryption error:', error);
    return '********';
  }
};

// Usage example in components:
/*
import { useInventory, useLowStockItems } from '../core/FluentData';

function InventoryTable() {
  const { data: inventory, isLoading } = useInventory();
  const { data: lowStock } = useLowStockItems();

  if (isLoading) return <Loader />;
  
  return (
    <>
      <LowStockAlert count={lowStock.length} />
      <Table data={inventory} />
    </>
  );
}
*/