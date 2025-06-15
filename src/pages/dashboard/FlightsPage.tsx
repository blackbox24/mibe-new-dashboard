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
import { getFlightsWithPagination, Flight, addFlight, updateFlight, deleteFlight, publishFlights } from '@/services/Listings/flights';
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

const FlightsPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchFlights(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const fetchFlights = async (page: number, limit: number) => {
      setIsLoading(true);
      try {
        const {flights, pagination: newPagination } = await getFlightsWithPagination(page, limit);
        setFlights(flights || []);
        setPagination({  
          page: newPagination.page,
          limit: newPagination.limit,
          totalPages: newPagination.totalPages,
          totalRecords: newPagination.totalRecords,
        });
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast.error('Failed to load flights');
      } finally {
        setIsLoading(false);
      }
    };

  const handleAdd = () => {
    setCurrentFlight(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const flight = flights.find(f => f.id === id);
    if (flight) {
      setCurrentFlight(flight);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const flight = flights.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (flight) { 
      setCurrentFlight(flight)
      values.published = flight.published === "1" ? "0" : "1";
      handlePublishedFlight(values);
    }
  };

  const handleDelete = (id: number) => {
    setFlightToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (flightToDelete === null) return;
    
    try {
      await deleteFlight(flightToDelete);
      fetchFlights(pagination.page, pagination.limit);
      toast.success('Flight deleted successfully');
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast.error('Failed to delete flight');
    } finally {
      setIsDeleteDialogOpen(false);
      setFlightToDelete(null);
    }
  };

    const handleUpdate = async (values) => {
      if (!currentFlight) return;
      
      try {
        setIsProcessing(true);
        const updatedFlight = await updateFlight(currentFlight.id, {
          ...values,
          departure_time: new Date(values.departure_time).toISOString(),
          arrival_time: new Date(values.arrival_time).toISOString(),
        });

        if(!updatedFlight){
          toast.error('Failed to update flight');
        }else{
          toast.success('Flight updated successfully');
        }
        fetchFlights(pagination.page, pagination.limit);
      } catch (error) {
        console.error('Error updating flight:', error);
        toast.error('Failed to update flight');
      } finally {
        setCurrentFlight(null)
        setIsProcessing(false);
      }
    };

  const handleFormSubmit = async (values) => {
    try {
      // Add new flight
      const newFlight = await addFlight(values);
      if(!newFlight){
        toast.error('Failed to save flight');
      }

      fetchFlights(pagination.page, pagination.limit);
      toast.success('Flight saved successfully');
      
    } catch (error) {
      console.error('Error saving flight:', error);
      toast.error('Failed to save flight');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchFlights(newPage, pagination.limit);
  };

  const handlePublishedFlight = async(published: { published: string })=>{
    if(!currentFlight) return;
    try{
      console.log(currentFlight.id)
      const response = await publishFlights(currentFlight.id,{...published});
      if(!response){
          toast.error('Failed to publish flight');
      }else{
        toast.success('Flight updated successfully');
      }
      fetchFlights(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update flight published');
    }finally{
      setCurrentFlight(null)
    }
  }

  const additionalFields = [
    { name: 'airline', label: 'Airline', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    // { name: 'image_url', label: 'Image URL', type: 'text', required: false },
    // { name: 'image_file', label: 'Image File', type: 'file', required: false },
    { name: 'flight_number', label: 'Flight Number', type: 'text', required: true },
    { name: 'departure_city', label: 'Departure City', type: 'text', required: true },
    { name: 'arrival_city', label: 'Arrival City', type: 'text', required: true },
    { name: 'departure_time', label: 'Departure Time (YYYY-MM-DD HH:MM)', type: 'datetime-local', required: true },
    { name: 'arrival_time', label: 'Arrival Time (YYYY-MM-DD HH:MM)', type: 'datetime-local', required: true },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flights</h1>
          <p className="text-muted-foreground mt-1">
            Manage your flight listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Flight
        </Button>
        {/* Toggle between listings */}
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
      ) : flights.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No flights found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first flight listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
        </div>
      ) : isCardView ? (
        <div className="listing-grid">
          {flights.map((flight) => (
            <ListingCard
              key={flight.id}
              id={flight.id}
              title={`${flight.airline} ${flight.flight_number}`}
              image={flight.image_url}
              description={`Flight from ${flight.departure_city} to ${flight.arrival_city}`}
              price={flight.price}
              priceLabel="per seat"
              badges={[flight.airline]}
              details={{
                'Departure': new Date(flight.departure_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }),
                'Arrival': new Date(flight.arrival_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }),
                'Date': new Date(flight.departure_time).toLocaleDateString()
              }}
              published={flight.published}
              onEdit={handleEdit}
              onPublish={handlePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight #</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>Depart City</TableHead>
                <TableHead>Arrival City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell className="font-medium">{flight.flight_number}</TableCell>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>{flight.departure_city}</TableCell>
                  <TableCell>{flight.arrival_city}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,flight.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            flight.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              flight.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit.bind(null, flight.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete.bind(null, flight.id)}
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
          {flights.length > 0 && (
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
              <PaginationItem key={`page-${idx}`}>
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
      {
        !currentFlight &&(
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          title="Add Listing"
          fields={additionalFields}
          initialValues={(currentFlight as unknown as Record<string, unknown>) || {}}
        />
      )}

      {/* Edit Form Dialog */}
      {
        currentFlight &&(
          <ListingForm
            open={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleUpdate}
            title={`Edit Flight: ${currentFlight.airline} ${currentFlight.flight_number}`}
            initialValues={currentFlight as unknown as Record<string, unknown>}
            fields={additionalFields}
          />
        )
      }
      

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Flight"
        description="Are you sure you want to delete this flight? This action cannot be undone."
        isDeleting={isProcessing}
      />
    </>
  );
};

export default FlightsPage;
