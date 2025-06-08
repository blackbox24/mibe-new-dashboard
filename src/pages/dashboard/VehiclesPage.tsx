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
// import { getVehicles, Vehicle, addVehicle, updateVehicle, deleteVehicle } from '@/services/dataService';
import { getVehicles, getVehiclesWithPagination,Vehicle, addVehicle, updateVehicle, deleteVehicle,publishVehicle } from '@/services/Listings/Vehicles';
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

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchVehicles(pagination.page, pagination.limit);
  }, []);

  const fetchVehicles = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const { vehicles, pagination: newPagination } = await getVehiclesWithPagination(page, limit);
      setVehicles(vehicles);
      setPagination({
        page: newPagination.page,
        limit: newPagination.limit,
        totalPages: newPagination.totalPages,
        totalRecords: newPagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentVehicle(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      setCurrentVehicle({
        ...vehicle,
        status: String(vehicle.status)
      });
      setFormOpen(true);
    }
  };
  const handlePublish = (id: number) => {
    const vehicle = vehicles.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (vehicle) { 
      setCurrentVehicle(vehicle)
      values.published = vehicle.published === "1" ? "0" : "1";
      handlePublishedVehicle(values);
    }
  };
  const handleDelete = (id: number) => {
    setVehicleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vehicleToDelete === null) return;
    
    try {
      await deleteVehicle(vehicleToDelete);
      fetchVehicles(pagination.page, pagination.limit); // Refresh the vehicle list
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleUpdate = async (values)=> {
    if(!currentVehicle) return;
    try{
      const updatedVehicle = await updateVehicle(
        currentVehicle.id,{
          ...values
        }
      )

      fetchVehicles(pagination.page, pagination.limit); // Refresh the list after updating
      setCurrentVehicle(null); // Clear current vehicle after update
      toast.success("Vehicle updated successfully");
    }catch(error){
      console.error('Error updating Vehicle:', error);
      toast.error('Failed to update Vehicle');
    } 
  }
  const handleFormSubmit = async (values ) => {
    try{
    // Add new vehicle
      const newVehicle = await addVehicle(values);
      fetchVehicles(pagination.page, pagination.limit); // Refresh the vehicle list
      toast.success('Vehicle saved successfully');
      
    }catch(error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchVehicles(newPage, pagination.limit);
  };

  const handlePublishedVehicle = async(published: { published: string })=>{
    if(!currentVehicle) return;
    try{
      console.log(currentVehicle.id)
      const response = await publishVehicle(currentVehicle.id,{...published});
      if(!response){
          toast.error('Failed to publish flight');
      }else{
        toast.success('Flight updated successfully');
      }
      fetchVehicles(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update flight published');
    }finally{
      setCurrentVehicle(null)
    }
  }
  

  const additionalFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'capacity', label: 'Capacity', type: 'number', required: true },
    { 
      name: 'type', 
      label: 'Type',
      type: 'option',
      required: true,
      options:[
        { value:"SUV" , label:"SUV" },
        { value:"Sedan" , label:"Sedan" },
        { value:"Hatchback" , label:"Hatchback" },
        { value:"Truck" , label:"Truck" },
        { value:"Van" , label:"Van" },
        { value:"Motorcycle" , label:"Motorcycle" },
        { value:"Bicycle" , label:"Bicycle" },
        { value:"Other" , label:"Other" }
      ]
    },
    { name: 'price_per_day', label: 'Price /Day', type: 'number', required: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'option',
      placeholder:"Select availability or unavailability", 
      required: false,
      options:[
        {value:"1", label:"Available"},
        {value:"0", label:"Unavailable"},
      ]
    },
    { 
      name: 'transmission', 
      label: 'Transmission', 
      type: 'option', 
      required: false,
      options:[
        {value: 'Automatic', label: 'Automatic'},
        {value: 'Manual', label: 'Manual'},
        {value: 'Semi-Automatic', label: 'Semi-Automatic'},
      ]
    },
    { 
      name: 'fuel_type', 
      label: 'Fuel Type', 
      type: 'option', 
      required: false, 
      options: [
        { value: 'Petrol', label: 'Petrol' },
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Electric', label: 'Electric' },
        { value: 'Hybrid', label: 'Hybrid' },
      ] 
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image', type: 'file', required: true },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vehicle rental listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Vehicle
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
      ) : vehicles.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first vehicle listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      ) : isCardView ? (
        <div className="listing-grid">
          {vehicles.map((vehicle) => (
            <ListingCard
              key={vehicle.id}
              id={vehicle.id}
              title={vehicle.name}
              image={vehicle.image_url || ""}
              description={vehicle.type}
              price={vehicle.price_per_day}
              priceLabel="per day"
              badges={[vehicle.type, Number(vehicle.status) === 1 ? 'Available' : 'Unavailable']}
              details={{
                // 'Seats': vehicle.seats,
                'Transmission': vehicle.transmission || 'N/A',
                'Fuel': vehicle.fuel_type || 'N/A'
              }}
              published={vehicle.published}
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.name}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>${vehicle.price_per_day}</TableCell>
                <TableCell>{vehicle.transmission || 'N/A'}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                     <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,vehicle.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            vehicle.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              vehicle.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit.bind(null, vehicle.id)}
                      className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete.bind(null, vehicle.id)}
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
          {vehicles.length > 0 && (
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
      {
        !currentVehicle && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          title={"Add New Vehicle"}
          initialValues={(currentVehicle as unknown as Record <string, unknown>) || {}}
          fields={additionalFields}
        />
      )}

      {/* Update Form */}
      {
        currentVehicle && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={`Update Vehicle: ${currentVehicle.name}`}
          initialValues={(currentVehicle as unknown as Record <string, unknown>) || {}}
          fields={additionalFields}
        />
      )}

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
      />
    </>
  );
};

export default VehiclesPage;
