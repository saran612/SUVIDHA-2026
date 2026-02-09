'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  IndianRupee, 
  Activity, 
  FileText, 
  ArrowLeft,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/apiService';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import Loading from '@/app/loading';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({
    revenue: 0,
    totalRequests: 0,
    activeUsers: 0
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqsRes] = await Promise.all([
          apiService.admin.getDashboardStats(),
          apiService.admin.getAllRequests()
        ]);
        if (statsRes) setStats(statsRes);
        if (reqsRes) setRequests(reqsRes);
        setLogs(logger.getDailyLogs());
      } catch (error) {
        console.error('Failed to load admin data', error);
      } finally {
        // Ensure loading state is cleared even on partial failure
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Mon', connections: 4, grievances: 2, payments: 12 },
    { name: 'Tue', connections: 3, grievances: 5, payments: 18 },
    { name: 'Wed', connections: 7, grievances: 3, payments: 15 },
    { name: 'Thu', connections: 5, grievances: 8, payments: 22 },
    { name: 'Fri', connections: 8, grievances: 4, payments: 25 },
    { name: 'Sat', connections: 12, grievances: 6, payments: 35 },
    { name: 'Sun', connections: 10, grievances: 2, payments: 40 },
  ];

  const distributionData = [
    { name: 'Electricity', value: 45, color: '#0E6170' },
    { name: 'Water', value: 30, color: '#0ea5e9' },
    { name: 'Gas', value: 15, color: '#f43f5e' },
    { name: 'Waste', value: 10, color: '#10b981' },
  ];

  const filteredRequests = requests.filter(req => 
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Admin Navbar */}
      <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} title="Back to Kiosk">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#0E6170]" />
            <h1 className="text-xl font-black text-gray-900 tracking-tight">SUVIDHA | Management Console</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
            <Activity className="w-3 h-3 text-emerald-500" />
            SYSTEM ONLINE
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-[#0E6170] flex items-center justify-center text-white font-bold">
            AD
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col p-8">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8 flex-1 overflow-hidden">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
                  <h3 className="text-3xl font-black mt-1">{formatINR(stats?.revenue || 0)}</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-2">↑ 12% vs last week</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <IndianRupee className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Requests</p>
                  <h3 className="text-3xl font-black mt-1">{stats?.totalRequests || 0}</h3>
                  <p className="text-xs text-blue-600 font-bold mt-2">Current System Total</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Citizen Engagement</p>
                  <h3 className="text-3xl font-black mt-1">{stats?.activeUsers || 0}</h3>
                  <p className="text-xs text-orange-600 font-bold mt-2">Active kiosk sessions</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">System Health</p>
                  <h3 className="text-3xl font-black mt-1">99.9%</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-2">All services operational</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <Activity className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-fit bg-white border p-1 rounded-xl mb-6 shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 font-bold px-6">Overview</TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-gray-100 font-bold px-6">Service Requests</TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-gray-100 font-bold px-6">System Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 flex flex-col gap-6 overflow-hidden mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Service Volume Trends</CardTitle>
                    <CardDescription>Daily breakdown of kiosk operations</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="payments" fill="#0E6170" radius={[4, 4, 0, 0]} name="Payments" />
                        <Bar dataKey="connections" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="New Con." />
                        <Bar dataKey="grievances" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Grievances" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Utility Distribution</CardTitle>
                    <CardDescription>By service category</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distributionData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="flex-1 flex flex-col gap-6 overflow-hidden mt-0">
              <Card className="flex-1 border-none shadow-md flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
                    <CardDescription>Manage citizen submissions from all kiosk modules</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Search Ref ID or Name..." 
                        className="pl-10 h-10 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="bg-[#0E6170] hover:bg-[#0E6170]/90">Export CSV</Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0">
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow>
                        <TableHead className="font-bold">Ref ID</TableHead>
                        <TableHead className="font-bold">Type</TableHead>
                        <TableHead className="font-bold">Applicant / Category</TableHead>
                        <TableHead className="font-bold">Date Submitted</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((req) => (
                        <TableRow key={req.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-mono font-bold text-[#0E6170]">{req.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full px-3">
                              {req.type === 'NEW_CONNECTION' ? 'New Connection' : 'Grievance'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">{req.name || req.category || 'N/A'}</span>
                              <span className="text-xs text-muted-foreground">{req.service || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {req.timestamp ? new Date(req.timestamp).toLocaleString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-xs font-bold text-amber-600">{req.status?.replace(/_/g, ' ') || 'Pending Review'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="font-bold text-[#0E6170]">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredRequests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-60 text-center opacity-50">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <FileText className="w-12 h-12" />
                              <p className="text-xl font-bold">No records found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 flex flex-col gap-6 overflow-hidden mt-0">
              <Card className="flex-1 border-none shadow-md flex flex-col overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">System Activity Logs</CardTitle>
                  <CardDescription>Live telemetry from kiosk hardware and software sessions</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-gray-900 text-emerald-400 font-mono text-sm p-6">
                  <div className="space-y-2">
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex gap-4">
                        <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={
                          log.level === 'ERROR' ? 'text-red-400' : 
                          log.level === 'WARN' ? 'text-amber-400' : 
                          'text-emerald-400'
                        }>
                          [{log.level}]
                        </span>
                        <span className="text-gray-300">{log.message}</span>
                        {log.data && <span className="text-blue-400 opacity-60 text-xs truncate">{JSON.stringify(log.data)}</span>}
                      </div>
                    ))}
                    <div className="flex gap-4 animate-pulse">
                      <span className="text-gray-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-emerald-400">[INFO]</span>
                      <span className="text-gray-300">Listening for kiosk events...</span>
                      <span className="w-2 h-4 bg-emerald-400 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
