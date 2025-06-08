
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportReportModal = ({ isOpen, onClose }: ExportReportModalProps) => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [format, setFormat] = useState('');
  const [includeSections, setIncludeSections] = useState({
    transactions: true,
    bookings: true,
    cancellations: true,
    revenue: true,
    customers: false,
    tax: true
  });

  const handleExport = () => {
    console.log('Exporting report:', {
      reportType,
      dateRange,
      format,
      includeSections
    });
    
    // Mock export functionality
    const reportData = generateMockReportData();
    downloadReport(reportData, format);
    onClose();
  };

  const generateMockReportData = () => {
    return {
      reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: 125000,
        totalBookings: 1250,
        totalCancellations: 23,
        totalCustomers: 890
      },
      transactions: [
        { id: 'TXN001', customer: 'John Doe', amount: 5200, date: '2024-01-15', status: 'completed' },
        { id: 'TXN002', customer: 'Jane Smith', amount: 3400, date: '2024-01-14', status: 'pending' }
      ]
    };
  };

  const downloadReport = (data: any, format: string) => {
    let content = '';
    let mimeType = '';
    let fileName = `report_${Date.now()}`;

    if (format === 'csv') {
      content = convertToCSV(data);
      mimeType = 'text/csv';
      fileName += '.csv';
    } else if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else {
      content = convertToText(data);
      mimeType = 'text/plain';
      fileName += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any) => {
    let csv = 'Report Type,Date Range,Generated At\n';
    csv += `${data.reportType},${data.dateRange},${data.generatedAt}\n\n`;
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,${data.summary.totalRevenue}\n`;
    csv += `Total Bookings,${data.summary.totalBookings}\n`;
    csv += `Total Cancellations,${data.summary.totalCancellations}\n`;
    csv += `Total Customers,${data.summary.totalCustomers}\n\n`;
    csv += 'Transactions\n';
    csv += 'ID,Customer,Amount,Date,Status\n';
    data.transactions.forEach((txn: any) => {
      csv += `${txn.id},${txn.customer},${txn.amount},${txn.date},${txn.status}\n`;
    });
    return csv;
  };

  const convertToText = (data: any) => {
    let text = `Financial Report\n`;
    text += `Report Type: ${data.reportType}\n`;
    text += `Date Range: ${data.dateRange}\n`;
    text += `Generated At: ${data.generatedAt}\n\n`;
    text += `Summary:\n`;
    text += `- Total Revenue: ₵${data.summary.totalRevenue.toLocaleString()}\n`;
    text += `- Total Bookings: ${data.summary.totalBookings}\n`;
    text += `- Total Cancellations: ${data.summary.totalCancellations}\n`;
    text += `- Total Customers: ${data.summary.totalCustomers}\n\n`;
    text += `Recent Transactions:\n`;
    data.transactions.forEach((txn: any) => {
      text += `- ${txn.id}: ${txn.customer} - ₵${txn.amount} (${txn.status})\n`;
    });
    return text;
  };

  const toggleSection = (section: keyof typeof includeSections) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Financial Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="transactions">Transaction Report</SelectItem>
                  <SelectItem value="revenue">Revenue Analysis</SelectItem>
                  <SelectItem value="tax">Tax Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Data Format)
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text File
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-semibold mb-4 block">Include Sections</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(includeSections).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={() => toggleSection(key as keyof typeof includeSections)}
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Report Preview</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Report Type: {reportType || 'Not selected'}</p>
                <p>Date Range: {dateRange || 'Not selected'}</p>
                <p>Format: {format?.toUpperCase() || 'Not selected'}</p>
                <p>Sections: {Object.entries(includeSections).filter(([_, value]) => value).length} selected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!reportType || !dateRange || !format}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportModal;