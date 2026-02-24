/**
 * Centralized API service for SUVIDHA Kiosk.
 * Now connected to real Django Backend API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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
      // Mocking for now since admin endpoint for all requests might not exist in same format
      return [];
    }
  }
};
