/**
 * Centralized API service for SUVIDHA Kiosk.
 * Optimized for future backend microservices integration (OAuth2 + JWT).
 * Token management is strictly session-based.
 */

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

// Simulated JWT Token helper (Future: Replace with real Auth logic)
const getAuthToken = () => sessionStorage.getItem('suvidha_token');

/**
 * Mock persistence for prototype session.
 * In a real app, this would be a database call.
 */
const getStoredRequests = () => {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('suvidha_mock_requests') || '{}');
};

const saveRequest = (id: string, data: any) => {
  const requests = getStoredRequests();
  requests[id] = {
    ...data,
    timestamp: new Date().toISOString(),
    status: 'PENDING_VERIFICATION',
    updates: [
      { date: new Date().toLocaleDateString(), message: 'Application submitted successfully' },
      { date: new Date().toLocaleDateString(), message: 'Sent for field officer assignment' }
    ]
  };
  localStorage.setItem('suvidha_mock_requests', JSON.stringify(requests));
};

export const apiService = {
  // Authentication (/api/auth/login)
  requestOtp: async (identifier: string): Promise<{ success: boolean }> => {
    console.log(`[API] POST /api/auth/request-otp : ${identifier}`);
    await new Promise((r) => setTimeout(r, 150));
    return { success: true };
  },

  verifyOtp: async (identifier: string, otp: string): Promise<{ token: string; user: any }> => {
    console.log(`[API] POST /api/auth/verify-otp : ${identifier}`);
    await new Promise((r) => setTimeout(r, 200));
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: identifier }))}.mock`;
    return {
      token: mockToken,
      user: { id: 'USR-' + identifier, name: 'Citizen User' }
    };
  },

  // Billing (/api/billing/fetch)
  fetchBill: async (consumerNo: string): Promise<BillData> => {
    console.log(`[API] GET /api/billing/fetch?consumerId=${consumerNo}`);
    await new Promise((r) => setTimeout(r, 150));
    return {
      id: 'BILL' + Math.floor(Math.random() * 10000),
      consumerNo,
      name: 'Rajesh Kumar',
      amount: 1450.00,
      dueDate: '2024-05-20',
      cycle: 'April 2024',
      status: 'UNPAID'
    };
  },

  fetchUserBills: async (identifier: string): Promise<BillData[]> => {
    console.log(`[API] GET /api/billing/user-bills?id=${identifier}`);
    await new Promise((r) => setTimeout(r, 300));
    return [
      {
        id: 'B-8821',
        consumerNo: identifier,
        name: 'Rajesh Kumar',
        amount: 850.50,
        dueDate: '2024-05-15',
        cycle: 'Electricity - April',
        status: 'UNPAID'
      },
      {
        id: 'B-9912',
        consumerNo: identifier,
        name: 'Rajesh Kumar',
        amount: 420.00,
        dueDate: '2024-05-10',
        cycle: 'Water - April',
        status: 'UNPAID'
      }
    ];
  },

  // Payment (/api/payment/initiate)
  initiatePayment: async (billId: string, method: string): Promise<{ success: boolean; transactionId: string }> => {
    console.log(`[API] POST /api/payment/initiate (Method: ${method})`);
    await new Promise((r) => setTimeout(r, 200));
    return {
      success: true,
      transactionId: (method === 'CASH' ? 'TOKEN-' : 'TXN-') + Date.now(),
    };
  },

  // New Connection (/api/services/new-connection)
  submitNewConnection: async (data: ConnectionRequest): Promise<{ referenceId: string }> => {
    console.log(`[API] POST /api/services/new-connection (Admin Log: Future Sync Active)`);
    await new Promise((r) => setTimeout(r, 400));
    const referenceId = 'NC-' + Math.floor(Math.random() * 1000000);
    saveRequest(referenceId, { ...data, type: 'NEW_CONNECTION' });
    return { referenceId };
  },

  // Grievances (/api/grievance/submit)
  submitGrievance: async (type: string, description: string): Promise<GrievanceResponse> => {
    console.log(`[API] POST /api/grievance/submit`);
    await new Promise((r) => setTimeout(r, 200));
    const referenceId = 'GRV-' + Math.floor(Math.random() * 1000000);
    saveRequest(referenceId, { type: 'GRIEVANCE', category: type, description });
    return {
      referenceId,
      status: 'SUBMITTED',
      timestamp: new Date().toISOString(),
    };
  },

  // Status Tracking (/api/status/track)
  trackStatus: async (referenceId: string): Promise<{ status: string; updates: any[] } | null> => {
    console.log(`[API] GET /api/status/track?ref=${referenceId}`);
    await new Promise((r) => setTimeout(r, 250));
    
    // Check mock persistence
    const requests = getStoredRequests();
    if (requests[referenceId]) {
      return {
        status: requests[referenceId].status,
        updates: requests[referenceId].updates,
      };
    }

    // Default mock for demo purposes if ID doesn't exist
    if (referenceId.startsWith('GRV-') || referenceId.startsWith('NC-')) {
        return {
          status: 'IN_PROGRESS',
          updates: [
            { date: '2024-05-01', message: 'Request registered successfully' },
            { date: '2024-05-02', message: 'Assigned to Ward Officer for verification' },
          ],
        };
    }

    return null;
  },

  // Admin Dashboard Services
  admin: {
    getDashboardStats: async () => {
      console.log(`[API] GET /api/admin/stats`);
      await new Promise((r) => setTimeout(r, 300));
      const requests = getStoredRequests();
      const allReqs = Object.values(requests) as any[];
      
      return {
        totalRequests: allReqs.length,
        newConnections: allReqs.filter(r => r.type === 'NEW_CONNECTION').length,
        grievances: allReqs.filter(r => r.type === 'GRIEVANCE').length,
        revenue: allReqs.length * 1450.50, // Mock revenue calculation
        activeUsers: Math.floor(Math.random() * 50) + 10,
      };
    },
    
    getAllRequests: async () => {
      console.log(`[API] GET /api/admin/requests`);
      await new Promise((r) => setTimeout(r, 300));
      const requests = getStoredRequests();
      return Object.entries(requests).map(([id, data]) => ({
        id,
        ...(data as any)
      })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }
};
