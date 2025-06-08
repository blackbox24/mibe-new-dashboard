
import { useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  MapPin, 
  TrendingUp,
  Calendar,
  Bell,
  CircleX,
  Settings,
  FileText,
  ReceiptCent,
  Users,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getFlights, getAccommodations, getPackages } from '@/services/dataService';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [packagesData, setPackagesData] = useState<any[]>([]);
  const [accommodationsData, setAccommodationsData] = useState<any[]>([]);
  // const [stats, setStats] = useState({
  //   flights: 0,
  //   accommodations: 0,
  //   packages: 0,
  //   vehicles: 5,
  //   shuttles: 3,
  //   facilitations: 3,
  //   activities: 4,
  // });
  const stats = [
    {
      title: 'Total Bookings',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Revenue',
      value: 'GH₵45,678',
      change: '+8%',
      changeType: 'positive' as const,
      icon: ReceiptCent
    },
    {
      title: 'Active Listings',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
      icon: MapPin
    },
    {
      title: 'Net Prompter Rate',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative' as const,
      icon: TrendingUp
    },
    {
      title: 'Star Rate',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative' as const,
      icon: Star
    },
    {
      title: 'Cancellations',
      value: '23',
      change: '3',
      changeType: 'negative' as const,
      icon: CircleX
    },
    {
      title: 'Pending leads',
      value: '23',
      type: "leads",
      change: '3',
      changeType: 'positive' as const,
      icon: Star
    },
    {
      title: 'Total Clients',
      value: '45,678',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 }
  ];

  const bookingData = [
    { month: 'Jan', bookings: 65 },
    { month: 'Feb', bookings: 59 },
    { month: 'Mar', bookings: 80 },
    { month: 'Apr', bookings: 81 },
    { month: 'May', bookings: 95 },
    { month: 'Jun', bookings: 89 }
  ];

  const travelTypeData = [
    { name: 'To Ghana', value: 45, color: '#0D47A1' },
    { name: 'Within Ghana', value: 35, color: '#1E88E5' },
    { name: 'From Ghana', value: 20, color: '#BBDEFB' }
  ];

  const recentBookings = [
    { id: 1, customer: 'Sarah Johnson', destination: 'Accra', amount: '$1,200', date: '2024-01-15' },
    { id: 2, customer: 'Kwame Asante', destination: 'Cape Coast', amount: '$800', date: '2024-01-14' },
    { id: 3, customer: 'Maria Silva', destination: 'Kumasi', amount: '$950', date: '2024-01-13' },
    { id: 4, customer: 'John Doe', destination: 'Tamale', amount: '$600', date: '2024-01-12' }
  ];

  const feedback = [
    { id: 1, user: "Sarah Wilson", rating: 5, comment: "Amazing service! Highly recommend.", service: "Flight Booking", date: "2024-01-15" },
    { id: 2, user: "David Brown", rating: 4, comment: "Good experience overall.", service: "Hotel Booking", date: "2024-01-14" },
    { id: 3, user: "Lisa Davis", rating: 5, comment: "Excellent customer support.", service: "Tour Package", date: "2024-01-13" }
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flights, accommodations, packages] = await Promise.all([
          getFlights(),
          getAccommodations(),
          getPackages(),
        ]);
        
        // setStats(prev => ({
        //   ...prev,
        //   flights: flights.length,
        //   accommodations: accommodations.length,
        //   packages: packages.length,
        // }));

        setPackagesData(packages);
        setAccommodationsData(accommodations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
              <p className="text-gray-600">Welcome back! {user.firstName} Here's what's happening with your travel platform.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                  Generate Report
                </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {
                          stat.title === "Cancellations" ? 
                          (`${stat.change} pending review`
                          ) : stat.type === "leads" ? (
                            stat.changeType === 'positive' ? (
                              `${stat.change} new leads`
                            ) : (
                              `${stat.change} from last month`
                            )
                          ) : (`${stat.change} from last month`)
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#1E88E5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bookings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#1E88E5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Travel Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={travelTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {travelTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {travelTypeData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Link to="/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-gray-600">{booking.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{booking.amount}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recently Added Packages</CardTitle>
              <CardDescription>New travel packages added to your listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 rounded bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {packagesData.length > 0 && (
                    <>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${packagesData[0]?.image_url || ''})` }} />
                        <div>
                          <h4 className="font-semibold">Zanzibar Beach Getaway</h4>
                          <p className="text-sm text-muted-foreground">7 days | $1,200</p>
                        </div>
                      </div>
                      {packagesData.length > 1 && (
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${packagesData[1]?.image_url || ''})` }} />
                          <div>
                            <h4 className="font-semibold">Serengeti Safari Adventure</h4>
                            <p className="text-sm text-muted-foreground">5 days | $1,800</p>
                          </div>
                        </div>
                      )}
                      {packagesData.length > 2 && (
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${packagesData[2]?.image_url || ''})` }} />
                          <div>
                            <h4 className="font-semibold">Kilimanjaro Climbing Expedition</h4>
                            <p className="text-sm text-muted-foreground">8 days | $2,500</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          <Card >
            <CardHeader>
              <CardTitle>Popular Accommodations</CardTitle>
              <CardDescription>Top rated places to stay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 rounded bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {accommodationsData.length > 0 && (
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${accommodationsData[0]?.image_url || ''})` }} />
                      <div>
                        <h4 className="font-semibold">Zanzibar Beach Resort</h4>
                        <div className="flex items-center text-sm">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(accommodationsData[0]?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-500">{accommodationsData[0]?.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {accommodationsData.length > 1 && (
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${accommodationsData[1]?.image_url || ''})` }} />
                      <div>
                        <h4 className="font-semibold">Serengeti Safari Lodge</h4>
                        <div className="flex items-center text-sm">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(accommodationsData[1]?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-500">{accommodationsData[1]?.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {accommodationsData.length > 4 && (
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${accommodationsData[4]?.image_url || ''})` }} />
                      <div>
                        <h4 className="font-semibold">Victoria Falls Resort</h4>
                        <div className="flex items-center text-sm">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(accommodationsData[4]?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-500">{accommodationsData[4]?.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.slice(0, 3).map(item => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{item.user}</p>
                      <div className="flex">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/activities">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Manage Listings
                  </Button>
                </Link>
                <Link to="/finance">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <DollarSign className="w-6 h-6 mb-2" />
                    View Finances
                  </Button>
                </Link>
                <Link to="/feedback">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Users className="w-6 h-6 mb-2" />
                    Feedback
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Settings className="w-6 h-6 mb-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;