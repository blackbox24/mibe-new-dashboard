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
import { getShuttlesWithPagination, Shuttle, addShuttle, updateShuttle, deleteShuttle, publishShuttle } from '@/services/Listings/shuttles';
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

const ShuttlesPage = () => {
  const [shuttles, setShuttles] = useState<Shuttle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentShuttle, setCurrentShuttle] = useState<Shuttle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shuttleToDelete, setShuttleToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  // Fetch shuttles with pagination
  const fetchShuttles = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const { shuttles, pagination: newPagination } = await getShuttlesWithPagination(page, limit);
      setShuttles(shuttles || []);
      setPagination({
        page: newPagination.page,
        limit: newPagination.limit,
        totalPages: newPagination.totalPages,
        totalRecords: newPagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching shuttles:', error);
      toast.error('Failed to load shuttles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShuttles(pagination.page, pagination.limit);
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setCurrentShuttle(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const shuttle = shuttles.find(s => s.id === id);
    if (shuttle) {
      setCurrentShuttle(shuttle);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const shuttle = shuttles.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (shuttle) { 
      setCurrentShuttle(shuttle)
      values.published = shuttle.published === "1" ? "0" : "1";
      handlePublishedShuttle(values);
    }
  };

  const handleDelete = (id: number) => {
    setShuttleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (shuttleToDelete === null) return;
    try {
      await deleteShuttle(shuttleToDelete);
      fetchShuttles(pagination.page, pagination.limit);
      toast.success('Shuttle deleted successfully');
    } catch (error) {
      console.error('Error deleting shuttle:', error);
      toast.error('Failed to delete shuttle');
    } finally {
      setIsDeleteDialogOpen(false);
      setShuttleToDelete(null);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateShuttle(currentShuttle.id, { ...values });
      fetchShuttles(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success("Shuttle successfully updated");
    } catch (error) {
      console.error('Error updating Shuttle:', error);
      toast.error('Failed to update Shuttle');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await addShuttle(values);
      fetchShuttles(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success("Shuttle successfully added");
    } catch (error) {
      console.error('Error saving shuttle:', error);
      toast.error("Failed to add shuttle");
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchShuttles(newPage, pagination.limit);
  };

  const handlePublishedShuttle = async(published: { published: string })=>{
    if(!currentShuttle) return;
    try{
      const response = await publishShuttle(currentShuttle.id,{...published});
      if(!response){
          toast.error('Failed to publish shuttle');
      }else{
        toast.success('shuttle updated successfully');
      }
      fetchShuttles(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update shuttle published');
    }finally{
      setCurrentShuttle(null)
    }
  }

  const additionalFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'image', label: 'Image Url', type: 'file', required: true },
    { name: 'from_location', label: 'From', type: 'text', required: true },
    { name: 'to_location', label: 'To', type: 'text', required: true },
    { name: 'schedule', label: 'Schedule', type: 'text', required: false },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shuttles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your shuttle service listings
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Shuttle
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
      ) : shuttles.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No shuttles found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first shuttle listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Shuttle
          </Button>
        </div>
      ) : isCardView ?(
        <div className="listing-grid">
          {shuttles.map((shuttle) => (
            <ListingCard
              key={shuttle.id}
              id={shuttle.id}
              title={shuttle.name}
              image={typeof shuttle.image_url === "string"? shuttle.image_url : ""}
              description={`Shuttle service from ${shuttle.from_location} to ${shuttle.to_location}`}
              price={shuttle.price}
              priceLabel="per seat"
              badges={['Shuttle']}
              details={{
                From: shuttle.from_location,
                To: shuttle.to_location,
                Schedule: shuttle.schedule || 'Flexible',
              }}
              published={shuttle.published}
              onEdit={handleEdit}
              onPublish={handlePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
       ):(
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>From Location</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shuttles.map((shuttle) => (
                  <TableRow key={shuttle.id}>
                    <TableCell className="font-medium">{shuttle.name}</TableCell>
                    <TableCell>${shuttle.price}</TableCell>
                    <TableCell>{shuttle.from_location}</TableCell>
                    <TableCell>{shuttle.to_location}</TableCell>
                    <TableCell>{shuttle.schedule || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="flex justify-end">
                          <button
                            onClick={handlePublish.bind(null,shuttle.id)}
                            className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                              shuttle.published === "1" ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                                shuttle.published === "1" ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit.bind(null, shuttle.id)}
                          className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete.bind(null, shuttle.id)}
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
        {shuttles.length > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
        )}
        <PaginationContent>
          <PaginationPrevious
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
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
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          />
        </PaginationContent>
      </Pagination>

      {/* Add Form */}
      {!currentShuttle && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          title={"Add New Shuttle"}
          initialValues={{}}
          fields={additionalFields}
        />
      )}

      {/* Update Form */}
      {currentShuttle && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={"Edit Shuttle"}
          initialValues={currentShuttle as unknown as Record<string, unknown>}
          fields={additionalFields}
        />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Shuttle Service"
        description="Are you sure you want to delete this shuttle service? This action cannot be undone."
      />
    </>
  );
};

export default ShuttlesPage;
