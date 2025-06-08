
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
import { 
  getFacilitationServices,
  Facilitation,
  getFacilitationServicesWithPagination, 
  addFacilitationService, 
  updateFacilitationService, 
  deleteFacilitationService,
  publishFacilitation
} from '@/services/Listings/facilitations';
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

const FacilitationsPage = () => {
  const [services, setServices] = useState<Facilitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentService, setCurrentService] = useState<Facilitation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchServices(pagination.page, pagination.limit);
  }, []);

  const fetchServices = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const {facilitations,pagination} = await getFacilitationServicesWithPagination(page, limit);
      setServices(facilitations);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching facilitation services:', error);
      toast.error('Failed to load facilitation services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentService(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setCurrentService(service);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const facilitation = services.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (facilitation) { 
      setCurrentService(facilitation)
      values.published = facilitation.published === "1" ? "0" : "1";
      handlePublishedService(values);
    }
  };

  const handleDelete = (id: number) => {
    setServiceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete === null) return;
    
    try {
      await deleteFacilitationService(serviceToDelete);
      fetchServices(pagination.page, pagination.limit);
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleUpdate = async (values) => {
    try{
      const updatedService = await updateFacilitationService(currentService.id,{
        ...values,
      })
      fetchServices(pagination.page, pagination.limit);
      toast.success("Service successfully updated");
    }catch(error){
      console.error('Error updating Service:', error);
      toast.error('Failed to update Service');
    }
  }

  const handleFormSubmit = async (values) => {
    try {
      const newService = await addFacilitationService(values);
      fetchServices(pagination.page, pagination.limit);
      toast.success("Service successfully updated");
    } catch (error) {
      console.error('Error saving Service:', error);
      toast.error("Service successfully failed");
      throw error;
    }
  };

  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchServices(newPage, pagination.limit);
  };
  
  const handlePublishedService = async(published: { published: string })=>{
    if(!currentService) return;
    try{
      const response = await publishFacilitation(currentService.id,{...published});
      if(!response){
          toast.error('Failed to publish facilitations');
      }else{
        toast.success('facilitations updated successfully');
      }
      fetchServices(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update facilitations published');
    }finally{
      setCurrentService(null)
    }
  }
  const additionalFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image Url', type: 'file', required: true },
  ];
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilitation Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel facilitation service listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Service
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
      ) : services.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No facilitation services found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first facilitation service listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      ) : isCardView ? (
        <div className="listing-grid">
          {services.map((service) => (
            <ListingCard
              key={service.id}
              id={service.id}
              title={service.name}
              image={typeof service.image_url === "string" ? service.image_url : ""}
              description={service.description}
              price={service.price}
              priceLabel="per service"
              badges={['Service']}
              details={{
                'Type': 'Facilitation Service'
              }}
              published={service.published}
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
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.description.slice(0,20)}...</TableCell>
                    <TableCell>${service.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,service.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            service.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              service.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit.bind(null, service.id)}
                          className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete.bind(null, service.id)}
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
          {services.length > 0 && (
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
              disabled={(pagination.page >= pagination.totalPages)}
            />
          </PaginationContent>
        </Pagination>

      {/* Add Form */}
      {
        !currentService && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          title={"Add New Package"}
          initialValues={(currentService as unknown as Record<string, unknown>) || {}}
          fields={additionalFields}
        />
      )}

      {/* update Form */}
      {
        currentService && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={"Edit Package" }
          initialValues={(currentService as unknown as Record<string, unknown>) || {}}
          fields={additionalFields}
        />
      )}
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Facilitation Service"
        description="Are you sure you want to delete this facilitation service? This action cannot be undone."
      />
    </>
  );
};

export default FacilitationsPage;
