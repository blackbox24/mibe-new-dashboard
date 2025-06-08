
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Send } from 'lucide-react';

interface Cancellation {
  id: number;
  customerName: string;
  email: string;
  bookingId: string;
  service: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface CancellationModalProps {
  cancellation: Cancellation;
  isOpen: boolean;
  onClose: () => void;
}

const CancellationModal = ({ cancellation, isOpen, onClose }: CancellationModalProps) => {
  const [responseMessage, setResponseMessage] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = () => {
    setAction('approve');
    setResponseMessage('Your cancellation request has been approved. The refund will be processed within 3-5 business days.');
  };

  const handleReject = () => {
    setAction('reject');
    setResponseMessage('We are unable to process your cancellation request at this time. Please contact our support team for more information.');
  };

  const handleSendResponse = () => {
    console.log(`${action}ing cancellation:`, cancellation.id);
    console.log('Response message:', responseMessage);
    
    // Reset form
    setResponseMessage('');
    setAction(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cancellation Request Details</DialogTitle>
          <DialogDescription>
            Review and respond to this cancellation request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Customer:</span> {cancellation.customerName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {cancellation.email}
                </div>
                <div>
                  <span className="font-medium">Booking ID:</span> {cancellation.bookingId}
                </div>
                <div>
                  <span className="font-medium">Service:</span> {cancellation.service}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> ₵{cancellation.amount.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Request Date:</span> {cancellation.date}
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Cancellation Reason:</span>
                <p className="text-muted-foreground mt-1">{cancellation.reason}</p>
              </div>
              <div className="mt-4">
                <span className="font-medium">Status:</span>
                <Badge variant="outline" className="ml-2">{cancellation.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {!action && (
            <div className="flex gap-4">
              <Button 
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Cancellation
              </Button>
              <Button 
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Cancellation
              </Button>
            </div>
          )}

          {action && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">
                  {action === 'approve' ? 'Approving' : 'Rejecting'} Cancellation
                </h4>
                <p className="text-sm text-muted-foreground">
                  {action === 'approve' 
                    ? 'This will process the refund and notify the customer.'
                    : 'This will deny the cancellation request and notify the customer.'
                  }
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Response Message</label>
                <Textarea
                  placeholder="Enter your response message to the customer"
                  rows={4}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAction(null)}>
                  Back
                </Button>
                <Button onClick={handleSendResponse}>
                  <Send className="h-4 w-4 mr-2" />
                  Send {action === 'approve' ? 'Approval' : 'Rejection'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;