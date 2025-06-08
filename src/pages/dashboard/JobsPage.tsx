import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getAllJobs, Job, addJob, updateJob, deleteJob } from '@/services/dataService';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListingForm } from '@/components/forms/ListingForm';
import ListingCard from '@/components/ListingCard';
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import getStatusBadge from '@/components/ui/CustomBadges';

const JobsPage = () => {
  const [Jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentJobs, setCurrentJobs] = useState<Job | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [JobsToDelete, setJobsToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchJobs(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchJobs = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching Jobs:', error);
      toast.error('Failed to load Jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd =  () => {
    setCurrentJobs(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const Job = Jobs.find((g) => g.id === id);
    console.log('Editing Job:', Job);
    if (Job) {
      setCurrentJobs(() => Job);
      setFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setJobsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentJobs) return;
    
    try {
      setIsProcessing(true);
      const response = await updateJob(currentJobs.id, {
        ...values
      });

      setJobs(Jobs.map(r => r.id === currentJobs.id ? { ...r, ...response } : r));
      setFormOpen(false);
      toast.success('Jobs updated successfully');
    } catch (error) {
      console.error('Error updating Jobs:', error);
      toast.error('Failed to update Jobs');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!JobsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteJob(JobsToDelete);
      setJobs(Jobs.filter(r => r.id !== JobsToDelete));
      toast.success('Jobs deleted successfully');
    } catch (error) {
      console.error('Error deleting Jobs:', error);
      toast.error('Failed to delete Jobs');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setJobsToDelete(null);
    }
  };



const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchJobs(newPage, pagination.limit);
  };
  const additionalFields = [
    {name:"name", label:"Name", type:"text", placeholder:"Enter Jobs name", required:true},
    {
        name:"status", 
        label:"Status", 
        type:"option",
        placeholder:"Enter Jobs content",
        required:true, 
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Archived', label: 'Archived' }
        ]
    },
    {name:"description", label:"Description", type:"textarea", placeholder:"Enter Jobs description",required:true},
    {name:"published", label:"Published", type:"switch", placeholder:"Enter Jobs published",required:true}
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newJobs: Job = await addJob(values);
        setJobs([...Jobs, newJobs]);
        setFormOpen(false);
        toast.success('Jobs added successfully');
    } catch (error) {
        console.error('Error adding Jobs:', error);
        toast.error('Failed to add Jobs');
        throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage Jobs
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Jobs
        </Button>
        {/* Toggle between listings */}
        <div className='flex justify-end'>
            <button
            onClick={() => setIsCardView(!isCardView)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                isCardView ? "bg-blue-500" : "bg-gray-300"
            }`}
            >
            <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                isCardView ? "translate-x-6" : ""
                }`}
            ></div>
            </button>
        </div>
      
      {/* End of toggle  */}
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : Jobs.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No Jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Jobs
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Jobs
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Jobs.map((Job) => (
            <ListingCard
              key={Job.id}
              id={Job.id}
              title={Job.name}
              description={`${Job.description}`}
              badges={[ Job.status, Job.published === "1" ? "Published" : "Unpublished"]}
              price={null}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Jobs.map((Job) => (
                        <TableRow key={Job.id}>
                            <TableCell className="font-medium">{Job.name}</TableCell>
                            <TableCell>{Job.description.slice(0,20)}...</TableCell>
                            <TableCell>{getStatusBadge(Job.status)}</TableCell>
                            <TableCell className="text-right">{getStatusBadge(Job.published)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, Job.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, Job.id)}
                                        className="bg-red-100 text-red-800 border-travel-200 hover:bg-red-200"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )}

      {/* Add Jobs Dialog */}
      {!currentJobs && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New Jobs"
          fields={additionalFields}
          initialValues={{name: '', description: '', status: 'Active'}}
          onSubmit={handleFormSubmit}
        />
      )}
    
      {/* Edit Jobs Dialog */}
      {currentJobs && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update Jobs: ${currentJobs.name}`}
          fields={additionalFields}
          initialValues={currentJobs ? { ...currentJobs } : {}}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Jobs"
        description={`Are you sure you want to delete the Job? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default JobsPage;
