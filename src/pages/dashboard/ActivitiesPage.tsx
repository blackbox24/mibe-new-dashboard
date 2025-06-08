
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  PlusCircle,
  Loader,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from '@/components/ui/sonner';
import { getActivitiesWithPagination, Activity, addActivity, updateActivity, deleteActivity, publishActivity } from '@/services/Listings/Activities';
import { getDestinations, Destination} from '@/services/Listings/Destinations';
import ListingCard from '@/components/ListingCard';
import { ListingForm } from '@/components/forms/ListingForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getStatusBadge from '@/components/ui/CustomBadges';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activitiesToDelete, setActivitiesToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  

  useEffect(() => {
    fetchActivities(pagination.page, pagination.limit);
    fetchDestinations();
  }, []);

  const fetchActivities = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const {activities, pagination: newPagination } = await getActivitiesWithPagination(page, limit);
      console.log(activities);
      setActivities(activities);
      setPagination({
        page: newPagination.page,
        limit: newPagination.limit,
        totalPages: newPagination.totalPages,
        totalRecords: newPagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async() => {
    setIsLoading(true);
    try{
      const response = await getDestinations();
      setDestinations(response.data);
      console.log('Fetched destinations:', response);
    }catch(error){
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination');
    }finally{
      setIsLoading(false);
    }
  }

  const handleAdd = () => {
    setCurrentActivity(null);
    setFormOpen(true);
  }

  const handleEdit = (id: number) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      setCurrentActivity({
        ...activity,
        destination_id:String(activity.destination_id)
      });
      setFormOpen(true);
    }
  };
  
  const handlePublish = (id: number) => {
    const activity = activities.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (activity) { 
      setCurrentActivity(activity)
      values.published = activity.published === "1" ? "0" : "1";
      handlePublishedActivity(values);
    }
  };

  const handleUpdate = async (values) => {
    if (!currentActivity) return;
    
    try {
      setIsProcessing(true);
      const updatedActivity = await updateActivity(currentActivity.id, {
        ...values,
      });
      fetchActivities(pagination.page, pagination.limit);; // Refresh activities list
      toast.success('Activity updated successfully');
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: number) => {
    setActivitiesToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (activitiesToDelete == null) return;
    
    try {
      setIsProcessing(true);
      await deleteActivity(activitiesToDelete);
      fetchActivities(pagination.page, pagination.limit);; // Refresh activities list
      toast.success('Activity deleted successfully');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setActivitiesToDelete(null);
    }
  };


  const handleFormSubmit = async (values) => {
    try {
      setIsProcessing(true);
      const newActivity = await addActivity(values);
      console.log('New Activity:', newActivity);
      fetchActivities(pagination.page, pagination.limit);; // Refresh activities list
      toast.success('Activity added successfully');

    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    } finally {
      setIsProcessing(false);
      setFormOpen(false);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchActivities(newPage, pagination.limit);
  };

  const handlePublishedActivity = async(published: { published: string })=>{
    if(!currentActivity) return;
    try{
      console.log(currentActivity.id)
      const response = await publishActivity(currentActivity.id,{...published});
      if(!response){
          toast.error('Failed to publish activity');
      }else{
        toast.success('activity updated successfully');
      }
      fetchActivities(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update activity published');
    }finally{
      setCurrentActivity(null)
    }
  }
  const additionalFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'file', required: false },
    // { name: 'image_file', label: 'Image File', type: 'file', required: false },
    {
      name: "destination_id",
      label: "Destination",
      type: "option",
      required: true,
      options: [
        ...destinations.map(destination => ({
          key: destination.id,
          label: destination.name,
          value: destination.id.toString()
        })),
      ]
    },
    { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 hours, Half day' }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Things to Do</h1>
          <p className="text-muted-foreground mt-1">
            Manage your activity listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Activity
        </Button>
        {/* Toggle between card and list view */}
        <div className="flex justify-end">
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
        {/* Toggle between card and list view */}
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No activities found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first activity listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ListingCard
              key={activity.id}
              id={activity.id}
              published={activity.published}
              title={activity.name}
              image={typeof activity.image_url === 'string' ? activity.image_url : ''}
              description={activity.description}
              price={activity.price}
              priceLabel="per person"
              badges={['Activity']}
              details={{
                'Duration': activity.duration || 'Flexible'
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPublish={handlePublish}
            />
          ))}
        </div>
      ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>{activity.description.slice(0,20)}...</TableCell>
                    <TableCell>${activity.price}</TableCell>
                    <TableCell>{activity.dest_name || 'N/A'}</TableCell>
                    <TableCell>{activity.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,activity.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            activity.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              activity.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit.bind(null, activity.id)}
                          className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete.bind(null, activity.id)}
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

      {/* Pagination */}
      <Pagination className="mt-6">
        {activities.length > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
        )}
        <PaginationContent>
          <PaginationPrevious
            onClick={pagination.page > 1 ? () => handlePageChange(pagination.page - 1) : undefined}
            className={pagination.page <= 1 ? "disabled-class" : ""}
          />
          {[...Array(pagination.totalPages)].map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={pagination.page === idx + 1}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
              className={pagination.page >= pagination.totalPages ? "disabled-class" : ""}
              onClick={pagination.page < pagination.totalPages ? () => handlePageChange(pagination.page + 1) : undefined}
          />
        </PaginationContent>
      </Pagination>
         
      {/* Add Form Dialog */}
      {!currentActivity &&(
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        title="Add New Activity"
        fields={additionalFields}
        initialValues={{ name: '', price: 0, description: '', image_url: '', duration: '', published: true } as Record<string, unknown>}
      />)}

      {/* Edit Form Dialog */}
      {currentActivity && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={`Edit Activity: ${currentActivity.name}`}
          initialValues={currentActivity as unknown as Record<string, unknown>}
          fields={additionalFields}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        description={`Are you sure you want to delete this activity ? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default ActivitiesPage;
