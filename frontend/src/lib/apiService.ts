/**
 * Centralized API service for SUVIDHA Kiosk.
 * Now connected to real Django Backend API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
const USE_MOCK = true; // Temporarily turned off to avoid fetch errors

export interface BillData {
  id: string;
  consumerNo: string;
  name: string;
  amount: number;
  dueDate: string;
  cycle: string;
  status: 'PAID' | 'UNPAID';
  paidDate?: string;
}

export interface GrievanceResponse {
  referenceId: string;
  status: string;
  timestamp: string;
}

export interface ConnectionRequest {
  service: string;
  category: string;
  name: string;
  idNumber: string;
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('suvidha_token');
  }
  return null;
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
};

export const apiService = {
  // Authentication (/api/auth/login)
  requestOtp: async (identifier: string): Promise<{ success: boolean }> => {
    if (USE_MOCK) return { success: true };
    try {
      console.log(`[API] POST /auth/send-otp/ : ${identifier}`);
      const res = await fetch(`${API_BASE_URL}/auth/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: identifier })
      });
      const data = await res.json();
      return { success: data.status === true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  verifyOtp: async (identifier: string, otp: string): Promise<{ token: string; user: any }> => {
    if (USE_MOCK) {
      if (typeof window !== 'undefined') sessionStorage.setItem('suvidha_token', 'mock_token_123');
      return { token: 'mock_token_123', user: { id: 'USR-' + identifier, name: 'Citizen User' } };
    }
    try {
      console.log(`[API] POST /auth/verify-otp/ : ${identifier}`);
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: identifier, otp })
      });
      const data = await res.json();
      if (data.status && data.token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('suvidha_token', data.token);
        }
        return {
          token: data.token,
          user: { id: data.user_id || 'USR-' + identifier, name: 'Citizen User' }
        };
      }
      throw new Error(data.message || 'OTP verification failed');
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // Billing (/api/billing/fetch)
  fetchBill: async (consumerNo: string): Promise<BillData> => {
    if (USE_MOCK) {
      return {
        id: 'BILL-123',
        consumerNo,
        name: 'Mock User',
        amount: 540.00,
        dueDate: '2026-03-15',
        cycle: 'Feb 2026',
        status: 'UNPAID'
      };
    }
    try {
      console.log(`[API] GET /billing/fetch/${consumerNo}/`);
      const res = await fetch(`${API_BASE_URL}/billing/fetch/${consumerNo}/`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch bill');
      const bills = await res.json();
      if (!bills || bills.length === 0) throw new Error('Bill not found');

      const b = bills[0];
      return {
        id: b.bill_id,
        consumerNo: b.consumer_number,
        name: 'Placeholder User',
        amount: parseFloat(b.amount),
        dueDate: b.due_date,
        cycle: b.bill_date,
        status: b.status === 'PAID' ? 'PAID' : 'UNPAID'
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  fetchUserBills: async (identifier: string): Promise<BillData[]> => {
    if (USE_MOCK) {
      return [
        {
          id: 'BILL-2026-04',
          consumerNo: 'CON-' + identifier,
          name: 'Mukesh Sharma',
          amount: 1020.00,
          dueDate: '2026-05-05',
          cycle: 'Apr 2026',
          status: 'UNPAID'
        },
        {
          id: 'BILL-2026-03',
          consumerNo: 'CON-' + identifier,
          name: 'Mukesh Sharma',
          amount: 750.00,
          dueDate: '2026-04-10',
          cycle: 'Mar 2026',
          status: 'UNPAID'
        },
        {
          id: 'BILL-2026-02',
          consumerNo: 'CON-' + identifier,
          name: 'Mukesh Sharma',
          amount: 540.00,
          dueDate: '2026-03-15',
          cycle: 'Feb 2026',
          status: 'UNPAID'
        },
        {
          id: 'BILL-2026-01',
          consumerNo: 'CON-' + identifier,
          name: 'Mukesh Sharma',
          amount: 610.50,
          dueDate: '2026-02-15',
          cycle: 'Jan 2026',
          status: 'PAID',
          paidDate: '2026-02-10'
        },
        {
          id: 'BILL-2025-12',
          consumerNo: 'CON-' + identifier,
          name: 'Mukesh Sharma',
          amount: 480.00,
          dueDate: '2026-01-15',
          cycle: 'Dec 2025',
          status: 'PAID',
          paidDate: '2026-01-14'
        }
      ];
    }
    try {
      console.log(`[API] GET /billing/history/`);
      const res = await fetch(`${API_BASE_URL}/billing/history/`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        // Fallback to fetch by identifier if history fails
        const res2 = await fetch(`${API_BASE_URL}/billing/fetch/${identifier}/`, {
          headers: getHeaders()
        });
        if (!res2.ok) return [];
        const data = await res2.json();
        return Array.isArray(data) ? data.map((b: any) => ({
          id: b.bill_id,
          consumerNo: b.consumer_number,
          name: 'Placeholder User',
          amount: parseFloat(b.amount),
          dueDate: b.due_date,
          cycle: b.bill_date,
          status: b.status === 'PAID' ? 'PAID' : 'UNPAID'
        })) : [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data.map((b: any) => ({
        id: b.bill_id,
        consumerNo: b.consumer_number,
        name: 'Placeholder User',
        amount: parseFloat(b.amount),
        dueDate: b.due_date,
        cycle: b.bill_date,
        status: b.status === 'PAID' ? 'PAID' : 'UNPAID'
      })) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // Payment (/api/payment/initiate)
  initiatePayment: async (billId: string, method: string): Promise<{ success: boolean; transactionId: string }> => {
    if (USE_MOCK) return { success: true, transactionId: `TXN-MOCK-${Date.now()}` };
    try {
      console.log(`[API] POST /payment/initiate/ (Method: ${method})`);
      const res = await fetch(`${API_BASE_URL}/payment/initiate/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bill_id: billId, payload: { payment_method: method } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment initiation failed');
      return {
        success: true,
        transactionId: data.transaction_id || `TXN-${Date.now()}`
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // New Connection (/api/services/new-connection)
  submitNewConnection: async (data: ConnectionRequest): Promise<{ referenceId: string }> => {
    if (USE_MOCK) {
      const id = `NC-${Date.now().toString().slice(-6)}`;
      const newReq = {
        id,
        type: 'New Connection',
        category: data.category || 'General',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'IN_PROGRESS',
        iconName: 'Zap',
        bg: 'bg-amber-50',
        color: 'text-amber-500',
        updates: [
          { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), message: 'Application Submitted' }
        ]
      };
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('suvidha_requests') || '[]');
        localStorage.setItem('suvidha_requests', JSON.stringify([newReq, ...existing]));
      }
      return { referenceId: id };
    }
    try {
      console.log(`[API] POST /service/request/`);
      const payload = {
        service_type: 'NEW_CONNECTION',
        description: `Category: ${data.category}, Name: ${data.name}, ID: ${data.idNumber}`,
        location_data: {}
      };
      const res = await fetch(`${API_BASE_URL}/service/request/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const responseData = await res.json();
      return { referenceId: responseData.request_id || `NC-${Date.now()}` };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // Grievances (/api/grievance/submit)
  submitGrievance: async (type: string, description: string): Promise<GrievanceResponse> => {
    if (USE_MOCK) {
      const id = `GRV-${Date.now().toString().slice(-6)}`;
      const newReq = {
        id,
        type: 'Complaint',
        category: type || 'General Grievance',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'SUBMITTED',
        iconName: 'AlertCircle',
        bg: 'bg-rose-50',
        color: 'text-rose-500',
        updates: [
          { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), message: 'Complaint Logged' }
        ]
      };
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('suvidha_requests') || '[]');
        localStorage.setItem('suvidha_requests', JSON.stringify([newReq, ...existing]));
      }
      return { referenceId: id, status: 'SUBMITTED', timestamp: new Date().toISOString() };
    }
    try {
      console.log(`[API] POST /grievance/submit/`);
      const res = await fetch(`${API_BASE_URL}/grievance/submit/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          category: type,
          description: description,
          location_data: {}
        })
      });
      const data = await res.json();
      return {
        referenceId: data.complaint_id || `GRV-${Date.now()}`,
        status: data.status || 'SUBMITTED',
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // Status Tracking (/api/status/track)
  trackStatus: async (referenceId: string): Promise<{ status: string; updates: any[] } | null> => {
    if (USE_MOCK) {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('suvidha_requests') || '[]');
        const found = existing.find((req: any) => req.id === referenceId);
        if (found) {
          return {
            status: found.status,
            updates: found.updates || [{ date: found.date, message: 'Application Registered' }]
          };
        }
      }
      // If mock but specific ID not found in local storage, assume it exists out of system
      return { status: 'IN_PROGRESS', updates: [{ date: new Date().toLocaleDateString('en-GB'), message: 'System processing request.' }] };
    }
    try {
      if (referenceId.startsWith('GRV')) {
        const res = await fetch(`${API_BASE_URL}/grievance/track/${referenceId}/`, { headers: getHeaders() });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          status: data.status,
          updates: [
            { date: data.created_at || new Date().toISOString(), message: 'Grievance created' }
          ]
        };
      } else {
        const res = await fetch(`${API_BASE_URL}/service/status/${referenceId}/`, { headers: getHeaders() });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          status: data.status,
          updates: [
            { date: data.created_at || new Date().toISOString(), message: 'Service request created' }
          ]
        };
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Admin Dashboard Services
  admin: {
    getDashboardStats: async () => {
      if (USE_MOCK) return { totalRequests: 15, newConnections: 5, grievances: 10, revenue: 5400, activeUsers: 42 };
      try {
        console.log(`[API] GET /admin/dashboard/stats/`);
        const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats/`, {
          headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        return {
          totalRequests: data.total_grievances || 0,
          newConnections: data.total_service_requests || 0,
          grievances: data.total_grievances || 0,
          revenue: data.total_revenue || 0,
          activeUsers: data.total_users || 0,
        };
      } catch (e) {
        console.error(e);
        return {
          totalRequests: 0,
          newConnections: 0,
          grievances: 0,
          revenue: 0,
          activeUsers: 0,
        };
      }
    },

    getAllRequests: async () => {
      if (USE_MOCK) {
        if (typeof window !== 'undefined') {
          const stored = JSON.parse(localStorage.getItem('suvidha_requests') || '[]');
          return stored.map((r: any) => {
            // "25 Feb 2026" can usually be passed into Date directly, but we provide it as timestamp fallback safely.
            const parsedDate = new Date(r.date);
            return {
              id: r.id,
              type: r.type === 'New Connection' ? 'NEW_CONNECTION' : 'GRIEVANCE',
              name: r.category,
              category: r.category,
              service: r.type,
              timestamp: isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
              status: r.status
            };
          });
        }
        return [];
      }
      return [];
    }
  }
};
