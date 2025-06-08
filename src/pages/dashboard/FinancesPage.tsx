import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CancellationModal from "@/components/CancellationModal";
import CreateInvoiceModal from "@/components/finances/CreateInvoiceModal";
import ExportReportModal from "@/components/finances/ExportReportModal";
import ManageCancellationsModal from "@/components/finances/ManageCancellationsModal";
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
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Users,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  email: string;
  service: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

const FinancesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCancellation, setSelectedCancellation] = useState<any>(null);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
    useState(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
  const [isManageCancellationsModalOpen, setIsManageCancellationsModalOpen] =
    useState(false);

  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customer: "Sarah Johnson",
      email: "sarah@email.com",
      service: "Accra City Tour Package",
      amount: 1200,
      status: "paid",
      dueDate: "2024-01-15",
      paidDate: "2024-01-12",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customer: "Kwame Asante",
      email: "kwame@email.com",
      service: "Cape Coast Historical Tour",
      amount: 800,
      status: "pending",
      dueDate: "2024-02-01",
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customer: "Maria Silva",
      email: "maria@email.com",
      service: "Kumasi Cultural Experience",
      amount: 950,
      status: "paid",
      dueDate: "2024-01-20",
      paidDate: "2024-01-18",
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      customer: "John Doe",
      email: "john@email.com",
      service: "Northern Ghana Adventure",
      amount: 1500,
      status: "overdue",
      dueDate: "2024-01-10",
      createdAt: "2023-12-28",
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-005",
      customer: "Emma Brown",
      email: "emma@email.com",
      service: "Travel Guide Package",
      amount: 299,
      status: "paid",
      dueDate: "2024-01-25",
      paidDate: "2024-01-23",
      createdAt: "2024-01-10",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 15420, expenses: 8950 },
    { month: "Feb", revenue: 18230, expenses: 9200 },
    { month: "Mar", revenue: 22100, expenses: 10500 },
    { month: "Apr", revenue: 19800, expenses: 9800 },
    { month: "May", revenue: 25600, expenses: 11200 },
    { month: "Jun", revenue: 28900, expenses: 12100 },
  ];

  const paymentMethodData = [
    { name: "Credit Card", value: 45, color: "#DC8A3B" },
    { name: "Bank Transfer", value: 30, color: "#2D5930" },
    { name: "Mobile Money", value: 20, color: "#FFD700" },
    { name: "Cash", value: 5, color: "#CE1126" },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Mock data
  const overviewStats = {
    totalBookings: 1250,
    totalRevenue: 125000,
    activeUsers: 8900,
    pendingLeads: 45,
    totalCancellations: 23,
  };
  const handleViewCancellation = (cancellation: any) => {
    setSelectedCancellation(cancellation);
    setIsCancellationModalOpen(true);
  };

  const cancellations = [
    {
      id: 1,
      customerName: "Sarah Wilson",
      email: "sarah@example.com",
      bookingId: "BK001",
      service: "Flight to Dubai",
      amount: 4800,
      reason: "Family emergency",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      customerName: "David Brown",
      email: "david@example.com",
      bookingId: "BK002",
      service: "Hotel Package",
      amount: 1200,
      reason: "Change of travel dates",
      date: "2024-01-14",
      status: "approved",
    },
    {
      id: 3,
      customerName: "Lisa Davis",
      email: "lisa@example.com",
      bookingId: "BK003",
      service: "Tour Package",
      amount: 2500,
      reason: "Medical reasons",
      date: "2024-01-13",
      status: "rejected",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateMetrics = () => {
    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + (inv.status === "paid" ? inv.amount : 0),
      0
    );
    const pendingAmount = invoices.reduce(
      (sum, inv) => sum + (inv.status === "pending" ? inv.amount : 0),
      0
    );
    const overdueAmount = invoices.reduce(
      (sum, inv) => sum + (inv.status === "overdue" ? inv.amount : 0),
      0
    );
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
    const conversionRate =
      totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      conversionRate,
      totalInvoices,
      paidInvoices,
    };
  };

  const metrics = calculateMetrics();
  const FinanceTab = () => (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button onClick={() => setIsCreateInvoiceModalOpen(true)}>
          Create Invoice
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsExportReportModalOpen(true)}
        >
          Export Report
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsManageCancellationsModalOpen(true)}
        >
          Manage Cancellations
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#TXN001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>₵5,200</TableCell>
                  <TableCell>
                    <Badge>Completed</Badge>
                  </TableCell>
                  <TableCell>2024-01-15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#TXN002</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>₵3,400</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pending</Badge>
                  </TableCell>
                  <TableCell>2024-01-15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cancellations.map((cancellation) => (
                <div
                  key={cancellation.id}
                  className="flex justify-between items-center p-4 border rounded"
                >
                  <div>
                    <p className="font-medium">{cancellation.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {cancellation.service} - ₵
                      {cancellation.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        cancellation.status === "pending"
                          ? "default"
                          : cancellation.status === "approved"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {cancellation.status}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleViewCancellation(cancellation)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Manage your invoices and payments
              </CardDescription>
            </div>
            <Button>Create Invoice</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.service}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ghana-green">
                Financial Dashboard
              </h1>
              <p className="text-gray-600">
                Track your revenue, invoices, and financial performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Payments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.pendingAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {invoices.filter((inv) => inv.status === "pending").length}{" "}
                    invoices
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Overdue Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.overdueAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Needs attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Payment Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {metrics.paidInvoices}/{metrics.totalInvoices} invoices paid
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Cancellations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {metrics.paidInvoices} cancelled
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.paidInvoices}
                  </p>
                  <p className="text-sm text-gray-500">
                    {metrics.paidInvoices} invoices
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Financial Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoice Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinanceTab />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#2D5930" name="Revenue" />
                      <Bar dataKey="expenses" fill="#DC8A3B" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {paymentMethodData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-sm">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices
                    .filter((inv) => inv.status === "paid")
                    .slice(0, 5)
                    .map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-gray-600">
                              {invoice.service}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {invoice.paidDate}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "paid", "pending", "overdue"].map((status) => (
                      <Button
                        key={status}
                        variant={
                          statusFilter === status ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Invoice #</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Service</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Due Date</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{invoice.customer}</p>
                              <p className="text-sm text-gray-600">
                                {invoice.email}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">{invoice.service}</td>
                          <td className="p-4 font-medium">
                            ${invoice.amount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="p-4">{invoice.dueDate}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredInvoices.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No invoices found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Revenue Trend */}
            <div className="flex gap-4 mb-6">
              <Button onClick={() => setIsCreateInvoiceModalOpen(true)}>
                Create Invoice
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsExportReportModalOpen(true)}
              >
                Export Report
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsManageCancellationsModalOpen(true)}
              >
                Manage Cancellations
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2D5930"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Services by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        service: "Accra City Tours",
                        revenue: 15600,
                        percentage: 35,
                      },
                      {
                        service: "Cape Coast Packages",
                        revenue: 12400,
                        percentage: 28,
                      },
                      {
                        service: "Cultural Experiences",
                        revenue: 8900,
                        percentage: 20,
                      },
                      {
                        service: "Adventure Tours",
                        revenue: 7500,
                        percentage: 17,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.service}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-medium">
                            ${item.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Average Order Value
                        </span>
                        <span className="text-lg font-bold">$1,089</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Customer Retention
                        </span>
                        <span className="text-lg font-bold">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Payment Success Rate
                        </span>
                        <span className="text-lg font-bold">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {selectedCancellation && (
        <CancellationModal
          cancellation={selectedCancellation}
          isOpen={isCancellationModalOpen}
          onClose={() => {
            setIsCancellationModalOpen(false);
            setSelectedCancellation(null);
          }}
        />
      )}

      <CreateInvoiceModal
        isOpen={isCreateInvoiceModalOpen}
        onClose={() => setIsCreateInvoiceModalOpen(false)}
      />

      <ExportReportModal
        isOpen={isExportReportModalOpen}
        onClose={() => setIsExportReportModalOpen(false)}
      />

      <ManageCancellationsModal
        isOpen={isManageCancellationsModalOpen}
        onClose={() => setIsManageCancellationsModalOpen(false)}
      />
    </div>
  );
};

export default FinancesPage;
