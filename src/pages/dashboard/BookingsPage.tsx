
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Booking, BookingReply, getBookings, addBookingReply } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader, Search, MessageSquare, Receipt, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ message: string }>();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBookings(
        bookings.filter(
          (booking) =>
            booking.user_name?.toLowerCase().includes(query) ||
            booking.item_name?.toLowerCase().includes(query) ||
            booking.booking_type.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, bookings]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDetailsDialog(true);
  };

  const openReceipt = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenReceiptDialog(true);
  };

  const openInvoice = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenInvoiceDialog(true);
  };

  const onMessageSubmit = async (data: { message: string }) => {
    if (!selectedBooking) return;
    
    try {
      setIsSubmitting(true);
      const reply = await addBookingReply(selectedBooking.id, data.message);
      
      // Update bookings state
      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          const updatedReplies = [...(booking.replies || []), reply];
          return { ...booking, replies: updatedReplies };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
      
      // Update the selected booking
      if (selectedBooking) {
        const updatedReplies = [...(selectedBooking.replies || []), reply];
        setSelectedBooking({ ...selectedBooking, replies: updatedReplies });
      }
      
      reset();
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer bookings and inquiries
          </p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search query.' : 'There are no bookings in the system yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Booking Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.user_name}</TableCell>
                  <TableCell className="capitalize">{booking.booking_type}</TableCell>
                  <TableCell>{booking.item_name}</TableCell>
                  <TableCell>{formatDate(booking.start_date)}</TableCell>
                  <TableCell>${booking.total_price}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetails(booking)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReceipt(booking)}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInvoice(booking)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Booking Details and Messages Dialog */}
      {selectedBooking && (
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Customer</h4>
                <p className="font-medium">{selectedBooking.user_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Booking ID</h4>
                <p className="font-medium">#{selectedBooking.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                <p className="font-medium capitalize">{selectedBooking.booking_type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Item</h4>
                <p className="font-medium">{selectedBooking.item_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h4>
                <p className="font-medium">{formatDate(selectedBooking.start_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">End Date</h4>
                <p className="font-medium">{formatDate(selectedBooking.end_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Price</h4>
                <p className="font-medium">${selectedBooking.total_price}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Communication</h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {selectedBooking.replies && selectedBooking.replies.length > 0 ? (
                  selectedBooking.replies.map((reply) => (
                    <div 
                      key={reply.id}
                      className={`p-3 rounded-lg ${
                        reply.is_admin 
                          ? "bg-blue-50 ml-8 border border-blue-100" 
                          : "bg-gray-50 mr-8 border border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {reply.is_admin ? "You" : "Customer"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(reply.created_at), 'PPp')}
                        </span>
                      </div>
                      <p className="text-sm">{reply.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground p-4">No messages yet</p>
                )}
              </div>
              
              <form onSubmit={handleSubmit(onMessageSubmit)} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Type your response here..."
                    className="min-h-[100px]"
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-travel-600 hover:bg-travel-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Receipt Dialog */}
      {selectedBooking && (
        <Dialog open={openReceiptDialog} onOpenChange={setOpenReceiptDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-travel-600">African Safari Tours</h2>
                  <p className="text-gray-500">123 Adventure Road</p>
                  <p className="text-gray-500">Nairobi, Kenya</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">Receipt</h3>
                  <p className="text-gray-500">#{selectedBooking.id}</p>
                  <p className="text-gray-500">{format(new Date(selectedBooking.created_at), 'PPP')}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold mb-2">Customer Details</h4>
                <p>{selectedBooking.user_name}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Item</td>
                      <td className="py-2 text-right">{selectedBooking.item_name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Type</td>
                      <td className="py-2 text-right capitalize">{selectedBooking.booking_type}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Date</td>
                      <td className="py-2 text-right">{formatDate(selectedBooking.start_date)}</td>
                    </tr>
                    <tr className="border-b font-bold">
                      <td className="py-2">Total Amount</td>
                      <td className="py-2 text-right">${selectedBooking.total_price}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Status</td>
                      <td className="py-2 text-right capitalize">{selectedBooking.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="text-center mt-8 pt-8 border-t">
                <p className="text-gray-500 mb-2">Thank you for your booking!</p>
                <p className="text-gray-500 text-sm">This is a computer-generated receipt and does not require a signature.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                className="bg-travel-600 hover:bg-travel-700"
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Invoice Dialog */}
      {selectedBooking && (
        <Dialog open={openInvoiceDialog} onOpenChange={setOpenInvoiceDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Invoice</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-travel-600">African Safari Tours</h2>
                  <p className="text-gray-500">123 Adventure Road</p>
                  <p className="text-gray-500">Nairobi, Kenya</p>
                  <p className="text-gray-500">info@africansafari.tours</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">Invoice</h3>
                  <p className="text-gray-500">INV-{selectedBooking.id}</p>
                  <p className="text-gray-500">Date: {format(new Date(selectedBooking.created_at), 'PPP')}</p>
                  <p className="text-gray-500">Due Date: {format(new Date(), 'PPP')}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold mb-2">Billed To:</h4>
                <p>{selectedBooking.user_name}</p>
              </div>
              
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4">
                        <p className="font-medium">{selectedBooking.item_name}</p>
                        <p className="text-sm text-gray-500 capitalize">{selectedBooking.booking_type}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(selectedBooking.start_date)} 
                          {selectedBooking.end_date ? ` to ${formatDate(selectedBooking.end_date)}` : ''}
                        </p>
                      </td>
                      <td className="py-4 text-right">${selectedBooking.total_price}</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-right font-semibold">Total</td>
                      <td className="py-4 text-right font-bold">${selectedBooking.total_price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Instructions:</h4>
                <p className="text-sm">
                  Please make payment via bank transfer to the following account:
                </p>
                <p className="text-sm mt-2">
                  Bank: Safari Bank<br />
                  Account Name: African Safari Tours<br />
                  Account Number: 12345678<br />
                  SWIFT/BIC: SAFBKKEA
                </p>
              </div>
              
              <div className="text-center mt-8 pt-8 border-t">
                <p className="text-gray-500 text-sm">
                  If you have any questions about this invoice, please contact us at billing@africansafari.tours
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                className="bg-travel-600 hover:bg-travel-700"
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BookingsPage;
