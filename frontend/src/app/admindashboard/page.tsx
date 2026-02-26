'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const KioskMap = dynamic(() => import('@/components/admin/KioskMap'), { ssr: false });

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
  AreaChart,
  Area,
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
  MapPin,
  Server,
  AlertTriangle,
  MonitorSmartphone,
  CheckCircle2,
  Activity,
  FileText,
  ArrowLeft,
  Bell,
  Search,
  Calendar,
  Clock,
  BarChart3,
  Lock,
  User,
  LogOut
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
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId && password) {
      const mockJwt = btoa(JSON.stringify({ userid: loginId, role: 'admin' })) + '.mock.signature';
      localStorage.setItem('adminToken', mockJwt);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setLoginId('');
    setPassword('');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
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
  }, [isAuthenticated]);

  const trendDataMaps = {
    day: [
      { name: '12 AM', connections: 0, grievances: 0, payments: 1 },
      { name: '4 AM', connections: 0, grievances: 0, payments: 0 },
      { name: '8 AM', connections: 2, grievances: 1, payments: 8 },
      { name: '12 PM', connections: 5, grievances: 3, payments: 15 },
      { name: '4 PM', connections: 4, grievances: 2, payments: 12 },
      { name: '8 PM', connections: 1, grievances: 0, payments: 4 },
    ],
    week: [
      { name: 'Mon', connections: 4, grievances: 2, payments: 12 },
      { name: 'Tue', connections: 3, grievances: 5, payments: 18 },
      { name: 'Wed', connections: 7, grievances: 3, payments: 15 },
      { name: 'Thu', connections: 5, grievances: 8, payments: 22 },
      { name: 'Fri', connections: 8, grievances: 4, payments: 25 },
      { name: 'Sat', connections: 12, grievances: 6, payments: 35 },
      { name: 'Sun', connections: 10, grievances: 2, payments: 40 },
    ],
    month: [
      { name: 'Week 1', connections: 25, grievances: 10, payments: 100 },
      { name: 'Week 2', connections: 30, grievances: 15, payments: 120 },
      { name: 'Week 3', connections: 35, grievances: 12, payments: 140 },
      { name: 'Week 4', connections: 45, grievances: 18, payments: 180 },
    ],
    year: [
      { name: 'Q1', connections: 120, grievances: 45, payments: 400 },
      { name: 'Q2', connections: 150, grievances: 50, payments: 500 },
      { name: 'Q3', connections: 200, grievances: 60, payments: 700 },
      { name: 'Q4', connections: 230, grievances: 80, payments: 850 },
    ]
  };

  const currentTrendData = trendDataMaps[timeFilter];

  const peakUsageData = [
    { hour: '6 AM', users: 10 },
    { hour: '8 AM', users: 45 },
    { hour: '10 AM', users: 85 },
    { hour: '12 PM', users: 120 },
    { hour: '2 PM', users: 95 },
    { hour: '4 PM', users: 110 },
    { hour: '6 PM', users: 70 },
    { hour: '8 PM', users: 30 },
    { hour: '10 PM', users: 15 },
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0E6170]/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-3xl"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full px-4 sm:px-0">
          <div className="flex justify-center flex-col items-center">
            <div className="w-16 h-16 bg-[#0E6170] rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
            <p className="mt-2 text-center text-sm font-bold text-gray-500">
              use test login id = admin and password = admin
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full px-4 sm:px-0">
          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl border border-gray-100 sm:rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold text-gray-700">User ID</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0E6170] focus:ring-2 focus:ring-[#0E6170]/20 transition-all font-medium"
                    placeholder="Enter admin ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0E6170] focus:ring-2 focus:ring-[#0E6170]/20 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-6 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#0E6170] hover:bg-[#0E6170]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E6170] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Authenticate System
                </Button>
              </div>
            </form>
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-500 font-bold hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Kiosk
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden w-full relative">
      {/* Admin Navbar */}
      <header className="h-[108px] px-3 sm:px-6 bg-white/70 backdrop-blur-md border-b flex items-center justify-between shadow-sm sticky top-0 z-50 shrink-0">
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
          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#0E6170] flex items-center justify-center text-white font-bold shadow-sm">
              AD
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Sign Out">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-8 overflow-hidden min-h-0">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8 flex-1 overflow-hidden min-h-0">

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Kiosks</p>
                  <h3 className="text-3xl font-black mt-1">42</h3>
                  <p className="text-xs text-blue-600 font-bold mt-2">Registered on network</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <MonitorSmartphone className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Kiosks</p>
                  <h3 className="text-3xl font-black mt-1">38</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-2">Currently online</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <Activity className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">In Maintenance</p>
                  <h3 className="text-3xl font-black mt-1">4</h3>
                  <p className="text-xs text-rose-600 font-bold mt-2">Offline or servicing</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Avg System Health</p>
                  <h3 className="text-3xl font-black mt-1">96.5%</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-2">Network wide average</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <Server className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden min-h-0">
            <TabsList className="w-fit bg-white border p-1 rounded-xl mb-6 shadow-sm shrink-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 font-bold px-6">Overview</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-gray-100 font-bold px-6">Usage</TabsTrigger>
              <TabsTrigger value="new_services" className="data-[state=active]:bg-gray-100 font-bold px-6">New Services</TabsTrigger>
              <TabsTrigger value="complaints" className="data-[state=active]:bg-gray-100 font-bold px-6">Complaints</TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-gray-100 font-bold px-6">System Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 mt-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col gap-6 min-h-0">
              {/* Map and Devices Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Map View */}
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden flex flex-col relative bg-gray-100">
                  <CardHeader className="bg-white z-10">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0E6170]" />
                      Live Network Map
                    </CardTitle>
                    <CardDescription>Real-time location and status of all Kiosks</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 relative min-h-[400px]">
                    <KioskMap />
                  </CardContent>
                </Card>

                {/* Device List */}
                <Card className="border-none shadow-md overflow-hidden flex flex-col">
                  <CardHeader className="bg-white border-b sticky top-0 z-10 pb-4">
                    <CardTitle className="text-lg font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="w-5 h-5 text-gray-600" />
                        Device Status
                      </div>
                      <Badge variant="outline" className="bg-gray-100">{stats?.activeUsers || 0} Online</Badge>
                    </CardTitle>
                    <div className="mt-4 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search device ID or location..." className="pl-10 h-9 text-sm rounded-lg" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-0 pb-4">
                    <div className="divide-y divide-gray-100">
                      {Array.from({ length: 42 }).map((_, i) => {
                        const isOffline = i === 3 || i === 12 || i === 27 || i === 35;
                        const isWarning = i % 9 === 0 && !isOffline;
                        const status = isOffline ? 'offline' : (isWarning ? 'warning' : 'online');
                        const healthNum = isOffline ? 0 : (isWarning ? 70 + (i % 15) : 95 + (i % 5));
                        const locs = ['Municipal Office', 'Railway Station', 'District Hospital', 'Commercial Hub', 'Bus Terminal', 'City Mall', 'Market Zone', 'Public Library', 'Civil Court'];
                        return {
                          id: `K-${(i + 1).toString().padStart(3, '0')}`,
                          loc: `${locs[i % locs.length]} - Zone ${Math.floor(i / locs.length) + 1}`,
                          status,
                          health: `${healthNum}%`
                        };
                      }).map((device, i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors group">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 flex items-center gap-2">
                              {device.id}
                              {device.status === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                              {device.status === 'offline' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                              {device.status === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                            </span>
                            <span className="text-xs text-gray-500 truncate max-w-[180px]" title={device.loc}>{device.loc}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-400 uppercase">Health</span>
                            <span className={`text-sm font-black ${device.health === '0%' ? 'text-rose-500' : 'text-emerald-600'}`}>
                              {device.health}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="flex-1 mt-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col gap-6 min-h-0">
              {/* Usage Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <Card className="border-none shadow-md overflow-hidden flex flex-col flex-1">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        Platform Usage Trends
                      </CardTitle>
                      <CardDescription>Service usage breakdown</CardDescription>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                      {['day', 'week', 'month', 'year'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setTimeFilter(filter as any)}
                          className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition-colors ${timeFilter === filter ? 'bg-white shadow text-[#0E6170]' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

                <Card className="border-none shadow-md overflow-hidden flex flex-col flex-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      Peak Usage Hours
                    </CardTitle>
                    <CardDescription>Network-wide average active sessions by hour</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={peakUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0E6170" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0E6170" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#0E6170" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {[
              { id: 'new_services', title: 'New Service Applications', desc: 'Manage citizen submissions for new connections', filterFn: (r: any) => r.type === 'NEW_CONNECTION' },
              { id: 'complaints', title: 'Citizen Complaints', desc: 'Manage citizen grievances and complaints', filterFn: (r: any) => r.type !== 'NEW_CONNECTION' }
            ].map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="flex-1 mt-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col gap-6 min-h-0">
                <Card className="flex-1 border-none shadow-md flex flex-col overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-xl font-bold">{tab.title}</CardTitle>
                      <CardDescription>{tab.desc}</CardDescription>
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
                        {filteredRequests.filter(tab.filterFn).map((req) => (
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
                        {filteredRequests.filter(tab.filterFn).length === 0 && (
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
            ))}

            <TabsContent value="logs" className="flex-1 mt-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col gap-6 min-h-0">
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
    </div >
  );
}
