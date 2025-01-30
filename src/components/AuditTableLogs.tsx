import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface AuditLogEntry {
    id: string;
    user_id: string;
    action_type: string;
    changed_data: Record<string, any>;
    timestamp: string;
}

const AuditLogTable: React.FC = () => {
    const [rowData, setRowData] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        // Fetch audit log data from your data service
        const fetchAuditLogs = async () => {
            const data = await DataService.getAuditLogs();
            setRowData(data);
        };

        fetchAuditLogs();
    }, []);

    const columns = [
        { headerName: 'User ID', field: 'user_id' },
        { headerName: 'Action Type', field: 'action_type' },
        { headerName: 'Changed Data', field: 'changed_data', cellRenderer: 'jsonRenderer' },
        { headerName: 'Timestamp', field: 'timestamp' },
    ];

    const frameworkComponents = {
        jsonRenderer: (params: any) => <pre>{JSON.stringify(params.value, null, 2)}</pre>,
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columns}
                frameworkComponents={frameworkComponents}
                pagination={true}
                paginationPageSize={10}
            />
        </div>
    );
};

export default AuditLogTable;
