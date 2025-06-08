import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MessageSquare, Reply, Search, Filter, TrendingUp, TrendingDown, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  listingId: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  responseDate?: string;
}

interface NPSFeedback {
  id: string;
  customerName: string;
  customerEmail: string;
  score: number;
  category: 'promoter' | 'passive' | 'detractor';
  comment: string;
  date: string;
  adminResponse?: string;
  responseDate?: string;
}

interface FeatureRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'bug';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewing' | 'planned' | 'completed' | 'rejected';
  votes: number;
  date: string;
  adminResponse?: string;
  responseDate?: string;
}

const FeedbackPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedNPSFeedback, setSelectedNPSFeedback] = useState<NPSFeedback | null>(null);
  const [selectedFeatureRequest, setSelectedFeatureRequest] = useState<FeatureRequest | null>(null);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');

  // Mock review data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@example.com',
      service: 'Flight to Dubai',
      listingId: 'FL001',
      rating: 5,
      comment: 'Amazing service! The booking process was smooth and the flight was exactly as described. Highly recommend!',
      date: '2024-01-15',
      status: 'approved',
      adminResponse: 'Thank you for your wonderful feedback! We appreciate your business.',
      responseDate: '2024-01-16'
    },
    {
      id: '2',
      customerName: 'David Brown',
      customerEmail: 'david@example.com',
      service: 'Hotel Package',
      listingId: 'HT002',
      rating: 4,
      comment: 'Good experience overall. The hotel was nice but check-in took longer than expected.',
      date: '2024-01-14',
      status: 'approved'
    },
    {
      id: '3',
      customerName: 'Lisa Davis',
      customerEmail: 'lisa@example.com',
      service: 'Tour Package',
      listingId: 'TR003',
      rating: 2,
      comment: 'Disappointed with the tour guide. Not very knowledgeable and the itinerary was rushed.',
      date: '2024-01-13',
      status: 'pending'
    },
    {
      id: '4',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      service: 'Flight to London',
      listingId: 'FL004',
      rating: 5,
      comment: 'Excellent customer support throughout the booking process. Will definitely use again!',
      date: '2024-01-12',
      status: 'approved'
    },
    {
      id: '5',
      customerName: 'Emma Thompson',
      customerEmail: 'emma@example.com',
      service: 'Cultural Tour',
      listingId: 'TR005',
      rating: 1,
      comment: 'Terrible experience. The tour was cancelled last minute with no proper explanation.',
      date: '2024-01-11',
      status: 'pending'
    }
  ]);

  // Mock NPS feedback data
  const [npsFeedback, setNpsFeedback] = useState<NPSFeedback[]>([
    {
      id: '1',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      score: 9,
      category: 'promoter',
      comment: 'Love the platform! Easy to use and great customer service.',
      date: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Alice Johnson',
      customerEmail: 'alice@example.com',
      score: 7,
      category: 'passive',
      comment: 'Good service but could improve the mobile app experience.',
      date: '2024-01-14'
    },
    {
      id: '3',
      customerName: 'Bob Williams',
      customerEmail: 'bob@example.com',
      score: 4,
      category: 'detractor',
      comment: 'Website is slow and booking process is confusing.',
      date: '2024-01-13'
    }
  ]);

  // Mock feature requests data
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([
    {
      id: '1',
      customerName: 'Sarah Chen',
      customerEmail: 'sarah.chen@example.com',
      title: 'Mobile App for iOS',
      description: 'Would love to have a dedicated mobile app for easier booking on the go.',
      category: 'feature',
      priority: 'high',
      status: 'planned',
      votes: 25,
      date: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Mark Davis',
      customerEmail: 'mark@example.com',
      title: 'Real-time Flight Updates',
      description: 'Get notifications about flight delays and gate changes.',
      category: 'feature',
      priority: 'medium',
      status: 'reviewing',
      votes: 18,
      date: '2024-01-14'
    },
    {
      id: '3',
      customerName: 'Lisa Park',
      customerEmail: 'lisa.park@example.com',
      title: 'Improve Search Filters',
      description: 'Add more filtering options like price range and amenities.',
      category: 'improvement',
      priority: 'medium',
      status: 'new',
      votes: 12,
      date: '2024-01-13'
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(review => 
      review.id === id 
        ? { ...review, status: newStatus }
        : review
    ));
  };

  const handleResponse = (id: string, type: 'review' | 'nps' | 'feature') => {
    if (type === 'review') {
      setReviews(prev => prev.map(review => 
        review.id === id 
          ? { 
              ...review, 
              adminResponse: responseText,
              responseDate: new Date().toISOString().split('T')[0]
            }
          : review
      ));
    } else if (type === 'nps') {
      setNpsFeedback(prev => prev.map(feedback => 
        feedback.id === id 
          ? { 
              ...feedback, 
              adminResponse: responseText,
              responseDate: new Date().toISOString().split('T')[0]
            }
          : feedback
      ));
    } else if (type === 'feature') {
      setFeatureRequests(prev => prev.map(request => 
        request.id === id 
          ? { 
              ...request, 
              adminResponse: responseText,
              responseDate: new Date().toISOString().split('T')[0]
            }
          : request
      ));
    }
    
    setSelectedReview(null);
    setSelectedNPSFeedback(null);
    setSelectedFeatureRequest(null);
    setResponseText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': case 'new': return 'default';
      case 'approved': case 'completed': return 'secondary';
      case 'rejected': return 'destructive';
      case 'planned': return 'outline';
      case 'reviewing': return 'default';
      default: return 'outline';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getNPSCategoryColor = (category: string) => {
    switch (category) {
      case 'promoter': return 'secondary';
      case 'passive': return 'outline';
      case 'detractor': return 'destructive';
      default: return 'outline';
    }
  };

  // Calculate NPS Score
  const promoters = npsFeedback.filter(f => f.category === 'promoter').length;
  const detractors = npsFeedback.filter(f => f.category === 'detractor').length;
  const totalResponses = npsFeedback.length;
  const npsScore = totalResponses > 0 ? Math.round(((promoters - detractors) / totalResponses) * 100) : 0;

  // Statistics
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const highRatedReviews = reviews.filter(r => r.rating >= 4).length;
  const lowRatedReviews = reviews.filter(r => r.rating <= 2).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Feedback</h1>
              <p className="text-gray-600">Feedbacks from travels</p>
            </div>
            
          </div>
        </div>
      </header>
      
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="nps">NPS Feedback</TabsTrigger>
          <TabsTrigger value="features">Feature Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  </div>
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{totalReviews}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">{pendingReviews}</p>
                  </div>
                  <Filter className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Rated (4-5★)</p>
                    <p className="text-2xl font-bold">{highRatedReviews}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Rated (1-2★)</p>
                    <p className="text-2xl font-bold">{lowRatedReviews}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Reviews</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by customer, service, or comment"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rating">Filter by Rating</Label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
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

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setRatingFilter('all');
                      setStatusFilter('all');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-muted-foreground">{review.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{review.service}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm">{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-80">
                        <p className="truncate">{review.comment}</p>
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(review.status) as any}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReview(review)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {review.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nps" className="mt-6 space-y-6">
          {/* NPS Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">NPS Score</p>
                    <p className="text-2xl font-bold">{npsScore}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    npsScore >= 50 ? 'bg-green-100 text-green-600' :
                    npsScore >= 0 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {npsScore >= 0 ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Promoters</p>
                    <p className="text-2xl font-bold">{promoters}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Passives</p>
                    <p className="text-2xl font-bold">{npsFeedback.filter(f => f.category === 'passive').length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Detractors</p>
                    <p className="text-2xl font-bold">{detractors}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NPS Feedback Table */}
          <Card>
            <CardHeader>
              <CardTitle>NPS Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {npsFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feedback.customerName}</p>
                          <p className="text-sm text-muted-foreground">{feedback.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{feedback.score}</span>
                          <span className="text-sm text-muted-foreground">/10</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getNPSCategoryColor(feedback.category) as any}>
                          {feedback.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-80">
                        <p className="truncate">{feedback.comment}</p>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedNPSFeedback(feedback)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6 space-y-6">
          {/* Feature Request Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{featureRequests.length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Requests</p>
                    <p className="text-2xl font-bold">{featureRequests.filter(r => r.status === 'new').length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{featureRequests.filter(r => r.status === 'planned' || r.status === 'reviewing').length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{featureRequests.filter(r => r.status === 'completed').length}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Requests & Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.customerName}</p>
                          <p className="text-sm text-muted-foreground">{request.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-60">
                        <p className="truncate font-medium">{request.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.priority === 'high' ? 'destructive' : request.priority === 'medium' ? 'default' : 'outline'}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status) as any}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.votes}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFeatureRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Detail Modal */}
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedReview.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedReview.customerEmail}</p>
                </div>
                <div>
                  <Label>Service</Label>
                  <p className="font-medium">{selectedReview.service}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="font-medium">{selectedReview.date}</p>
                </div>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <span className="text-lg font-medium">{selectedReview.rating}/5</span>
                </div>
              </div>
              
              <div>
                <Label>Customer Comment</Label>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.adminResponse && (
                <div>
                  <Label>Admin Response</Label>
                  <p className="p-3 bg-blue-50 rounded-md mt-1">{selectedReview.adminResponse}</p>
                  {selectedReview.responseDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Responded on: {selectedReview.responseDate}
                    </p>
                  )}
                </div>
              )}

              {!selectedReview.adminResponse && (
                <div>
                  <Label htmlFor="response">Add Response</Label>
                  <Textarea
                    id="response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response to the customer..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
                  Close
                </Button>
                {!selectedReview.adminResponse && responseText && (
                  <Button onClick={() => handleResponse(selectedReview.id, 'review')}>
                    <Reply className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* NPS Feedback Detail Modal */}
      {selectedNPSFeedback && (
        <Dialog open={!!selectedNPSFeedback} onOpenChange={() => setSelectedNPSFeedback(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>NPS Feedback Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedNPSFeedback.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedNPSFeedback.customerEmail}</p>
                </div>
                <div>
                  <Label>Score</Label>
                  <p className="font-medium">{selectedNPSFeedback.score}/10</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge variant={getNPSCategoryColor(selectedNPSFeedback.category) as any}>
                    {selectedNPSFeedback.category}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Customer Comment</Label>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedNPSFeedback.comment}</p>
              </div>

              {selectedNPSFeedback.adminResponse && (
                <div>
                  <Label>Admin Response</Label>
                  <p className="p-3 bg-blue-50 rounded-md mt-1">{selectedNPSFeedback.adminResponse}</p>
                  {selectedNPSFeedback.responseDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Responded on: {selectedNPSFeedback.responseDate}
                    </p>
                  )}
                </div>
              )}

              {!selectedNPSFeedback.adminResponse && (
                <div>
                  <Label htmlFor="nps-response">Add Response</Label>
                  <Textarea
                    id="nps-response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response to the customer..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedNPSFeedback(null)}>
                  Close
                </Button>
                {!selectedNPSFeedback.adminResponse && responseText && (
                  <Button onClick={() => handleResponse(selectedNPSFeedback.id, 'nps')}>
                    <Reply className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Feature Request Detail Modal */}
      {selectedFeatureRequest && (
        <Dialog open={!!selectedFeatureRequest} onOpenChange={() => setSelectedFeatureRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Feature Request Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedFeatureRequest.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedFeatureRequest.customerEmail}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge variant="outline">{selectedFeatureRequest.category}</Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant={selectedFeatureRequest.priority === 'high' ? 'destructive' : selectedFeatureRequest.priority === 'medium' ? 'default' : 'outline'}>
                    {selectedFeatureRequest.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <p className="font-medium">{selectedFeatureRequest.title}</p>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedFeatureRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Votes</Label>
                  <p className="font-medium">{selectedFeatureRequest.votes}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={getStatusColor(selectedFeatureRequest.status) as any}>
                    {selectedFeatureRequest.status}
                  </Badge>
                </div>
              </div>

              {selectedFeatureRequest.adminResponse && (
                <div>
                  <Label>Admin Response</Label>
                  <p className="p-3 bg-blue-50 rounded-md mt-1">{selectedFeatureRequest.adminResponse}</p>
                  {selectedFeatureRequest.responseDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Responded on: {selectedFeatureRequest.responseDate}
                    </p>
                  )}
                </div>
              )}

              {!selectedFeatureRequest.adminResponse && (
                <div>
                  <Label htmlFor="feature-response">Add Response</Label>
                  <Textarea
                    id="feature-response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response to the customer..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedFeatureRequest(null)}>
                  Close
                </Button>
                {!selectedFeatureRequest.adminResponse && responseText && (
                  <Button onClick={() => handleResponse(selectedFeatureRequest.id, 'feature')}>
                    <Reply className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </div>
  );
};

export default FeedbackPage;