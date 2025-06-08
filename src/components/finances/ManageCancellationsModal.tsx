
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XCircle, Check, X, Search, Filter, Eye, MessageSquare } from 'lucide-react';

interface ManageCancellationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Cancellation {
  id: string;
  customerName: string;
  email: string;
  bookingId: string;
  service: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  notes?: string;
}

const ManageCancellationsModal = ({ isOpen, onClose }: ManageCancellationsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCancellation, setSelectedCancellation] = useState<Cancellation | null>(null);
  const [responseMessage, setResponseMessage] = useState('');

  // Mock cancellation data
  const [cancellations, setCancellations] = useState<Cancellation[]>([
    {
      id: '1',
      customerName: 'Sarah Wilson',
      email: 'sarah@example.com',
      bookingId: 'BK001',
      service: 'Flight to Dubai',
      amount: 4800,
      reason: 'Family emergency',
      date: '2024-01-15',
      status: 'pending',
      requestDate: '2024-01-14'
    },
    {
      id: '2',
      customerName: 'David Brown',
      email: 'david@example.com',
      bookingId: 'BK002',
      service: 'Hotel Package',
      amount: 1200,
      reason: 'Change of travel dates',
      date: '2024-01-14',
      status: 'approved',
      requestDate: '2024-01-13',
      notes: 'Approved due to flexible booking policy'
    },
    {
      id: '3',
      customerName: 'Lisa Davis',
      email: 'lisa@example.com',
      bookingId: 'BK003',
      service: 'Tour Package',
      amount: 2500,
      reason: 'Medical reasons',
      date: '2024-01-13',
      status: 'rejected',
      requestDate: '2024-01-12',
      notes: 'Outside of cancellation window'
    },
    {
      id: '4',
      customerName: 'Mike Johnson',
      email: 'mike@example.com',
      bookingId: 'BK004',
      service: 'Flight to London',
      amount: 5200,
      reason: 'Visa denied',
      date: '2024-01-12',
      status: 'pending',
      requestDate: '2024-01-11'
    }
  ]);

  const filteredCancellations = cancellations.filter(cancellation => {
    const matchesSearch = cancellation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cancellation.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cancellation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cancellation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
    setCancellations(prev => prev.map(cancellation => 
      cancellation.id === id 
        ? { ...cancellation, status: newStatus, notes: responseMessage }
        : cancellation
    ));
    setSelectedCancellation(null);
    setResponseMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const pendingCount = cancellations.filter(c => c.status === 'pending').length;
  const approvedCount = cancellations.filter(c => c.status === 'approved').length;
  const rejectedCount = cancellations.filter(c => c.status === 'rejected').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Manage Cancellations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">{approvedCount}</p>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold">{rejectedCount}</p>
                  </div>
                  <X className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer name, booking ID, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cancellations Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCancellations.map((cancellation) => (
                  <TableRow key={cancellation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cancellation.customerName}</p>
                        <p className="text-sm text-muted-foreground">{cancellation.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{cancellation.bookingId}</TableCell>
                    <TableCell>{cancellation.service}</TableCell>
                    <TableCell>₵{cancellation.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-40 truncate">{cancellation.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(cancellation.status) as any}>
                        {cancellation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{cancellation.requestDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCancellation(cancellation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        {cancellation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(cancellation.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(cancellation.id, 'rejected')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Review Modal */}
        {selectedCancellation && (
          <Dialog open={!!selectedCancellation} onOpenChange={() => setSelectedCancellation(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Review Cancellation Request</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Name</Label>
                    <p className="font-medium">{selectedCancellation.customerName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedCancellation.email}</p>
                  </div>
                  <div>
                    <Label>Booking ID</Label>
                    <p className="font-medium">{selectedCancellation.bookingId}</p>
                  </div>
                  <div>
                    <Label>Service</Label>
                    <p className="font-medium">{selectedCancellation.service}</p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">₵{selectedCancellation.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Request Date</Label>
                    <p className="font-medium">{selectedCancellation.requestDate}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Cancellation Reason</Label>
                  <p className="p-3 bg-muted rounded-md">{selectedCancellation.reason}</p>
                </div>

                {selectedCancellation.notes && (
                  <div>
                    <Label>Admin Notes</Label>
                    <p className="p-3 bg-muted rounded-md">{selectedCancellation.notes}</p>
                  </div>
                )}

                {selectedCancellation.status === 'pending' && (
                  <div>
                    <Label htmlFor="response">Response Message</Label>
                    <Textarea
                      id="response"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Add a note about your decision..."
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setSelectedCancellation(null)}>
                    Close
                  </Button>
                  {selectedCancellation.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(selectedCancellation.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate(selectedCancellation.id, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCancellationsModal;