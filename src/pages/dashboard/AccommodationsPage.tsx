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
import { getAccommodationsWithPagination, Accommodation, addAccommodation, updateAccommodation, deleteAccommodation, publishAccommodation } from '@/services/Listings/Accommodation';
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

const AccommodationsPage = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });


  useEffect(() => {
    fetchAccommodations(pagination.page, pagination.limit);
    fetchDestinations();
  }, []);

  const fetchAccommodations = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const {accommodations, pagination} = await getAccommodationsWithPagination(page, limit);
      console.log(accommodations)
      setAccommodations(accommodations || []);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });

    } catch (error) {
      console.error('Error fetching accommodations:', error);
      toast.error('Failed to load accommodations');
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
    setCurrentAccommodation(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const accommodation = accommodations.find(a => a.id === id);
    if (accommodation) {
      setCurrentAccommodation({
        ...accommodation,
        destination_id: String(accommodation.destination_id),
        availability: String(accommodation.availability),
      });
      setFormOpen(true);
    }
  };
  const handlePublish = (id: number) => {
    const acommodation = accommodations.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (acommodation) { 
      setCurrentAccommodation(acommodation)
      values.published = acommodation.published === "1" ? "0" : "1";
      handlePublishedAccommodation(values);
    }
  };

  const handleDelete = (id: number) => {
    setAccommodationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (accommodationToDelete === null) return;
    
    try {
      await deleteAccommodation(accommodationToDelete);
      setAccommodations(accommodations.filter(a => a.id !== accommodationToDelete));
      toast.success('Accommodation deleted successfully');
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      toast.error('Failed to delete accommodation');
    } finally {
      setIsDeleteDialogOpen(false);
      setAccommodationToDelete(null);
    }
  };

  const handleUpdate = async(values) => {
    if(!currentAccommodation) return;
    try{
      setIsProcessing(true)
      const response = await updateAccommodation(
        currentAccommodation.id,{
          ...values

        }
      );
      
      
      fetchAccommodations(pagination.page, pagination.limit); // Refresh the list after adding
      toast.success("Accommodations updated successfully");
    }catch(error){
      console.error('Error updating Accommodation:', error);
      toast.error('Failed to update Accommodation');
    }finally{
      setCurrentAccommodation(null)
      setIsProcessing(false)
    }
  }
  const handleFormSubmit = async (values) => {
    try {
      
      const newAccommodation = await addAccommodation(values);
      fetchAccommodations(pagination.page, pagination.limit); // Refresh the list after adding
      setFormOpen(false);
      toast.success('Accommodation saved successfully');
      
    } catch (error) {
      console.error('Error saving accommodation:', error);
      toast.error('Failed to save Accommodations');
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchAccommodations(newPage, pagination.limit);
  };

  const handlePublishedAccommodation = async(published: { published: string })=>{
    if(!currentAccommodation) return;
    try{
      const response = await publishAccommodation(currentAccommodation.id,{...published});
      if(!response){
          toast.error('Failed to publish accommodation');
      }else{
        toast.success('accommodation updated successfully');
      }
      fetchAccommodations(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update accommodation published');
    }finally{
      setCurrentAccommodation(null)
    }
  }
  const additionalFields = [
    { name: 'name', label: 'Accommodation Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'type', label: 'Accommodation Type', type: 'text', required: true },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', required: false },
    { name: 'price_per_night', label: 'Accommodation Price', type: 'number', required: true },
    { name: 'amenities', label: 'Amenities', type: 'text', required: false },
    { name: 'image', label: 'Image Url', type: 'file', required: false },
    {
      name: 'availability', 
      label: 'Availability', 
      type: 'option', 
      required: false,
      options: [
        { value: '1', label: 'Available' },
        { value: '0', label: 'Unavailable' },
      ]
    },
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
    }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div> 
          <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your accommodation listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Accommodation
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
      ) : accommodations.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No accommodations found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first accommodation listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Accommodation
          </Button>
        </div>
      ) : isCardView ? (
        <div className="listing-grid">
          {accommodations.map((accommodation,index) => (
            <ListingCard
              key={accommodation.id}
              id={accommodation.id}
              title={accommodation.name}
              image={typeof accommodation.image_url === "string" ? accommodation.image_url:""}
              description={accommodation.description}
              price={accommodation.price_per_night}
              priceLabel="per night"
              badges={[accommodation.type, Number(accommodation.availability) === 1 ? 'Available' : 'Unavailable']}
              details={{
                'Type': accommodation.type,
                'Rating': accommodation.rating ? `${accommodation.rating}/5` : 'N/A'
              }}
              published={accommodation.published}
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
                  <TableHead>Acc Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.map((accommodation) => (
                  <TableRow key={accommodation.id}>
                    <TableCell className="font-medium">{accommodation.name}</TableCell>
                    <TableCell>{accommodation.description.slice(0,20)}...</TableCell>
                    <TableCell>${accommodation.price_per_night}</TableCell>
                    <TableCell>{accommodation.amenities ? `${accommodation.amenities.slice(0, 20)}...` : 'N/A'}</TableCell>
                    <TableCell>{accommodation.rating || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,accommodation.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            accommodation.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              accommodation.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit.bind(null, accommodation.id)}
                          className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete.bind(null, accommodation.id)}
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
          {accommodations.length > 0 && (
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
      {!currentAccommodation && (
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        title="Add New Activity"
        fields={additionalFields}
        initialValues={(currentAccommodation as unknown as Record<string, unknown>) || {}}
      />)}

      {/* Edit Form Dialog */}
      {currentAccommodation && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={`Edit Accommodation: ${currentAccommodation.name}`}
          initialValues={currentAccommodation as unknown as Record<string, unknown>}
          fields={additionalFields}
        />
      )}

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Accommodation"
        description="Are you sure you want to delete this accommodation? This action cannot be undone."
      />
    </>
  );
};

export default AccommodationsPage;
