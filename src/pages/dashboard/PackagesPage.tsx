
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
import { getPackagesWithPagination, Package, addPackage, updatePackage, deletePackage, publishPackage, } from '@/services/Listings/Packages';
import { getDestinations } from '@/services/Listings/Destinations';
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

const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardView, setIsCardView] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchPackages(pagination.page, pagination.limit);
    fetchDestinations();
  }, []);

  const fetchPackages = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const data = await getPackagesWithPagination(page, limit);
      setPackages(data.packages);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        totalPages: data.pagination.totalPages,
        totalRecords: data.pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await getDestinations();
      setDestinations(response.data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentPackage(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      setCurrentPackage({
        ...pkg,
        destination_id: String(pkg.destination_id),
        featured: String(pkg.featured)
      });
      setFormOpen(true);
    }
  };
  
  const handlePublish = (id: number) => {
    const _package = packages.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (_package) { 
      setCurrentPackage(_package)
      values.published = _package.published === "1" ? "0" : "1";
      handlePublishedPackage(values);
    }
  };

  const handleDelete = (id: number) => {
    setPackageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (packageToDelete === null) return;
    
    try {
      await deletePackage(packageToDelete);
      fetchPackages();
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    } finally {
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const handleUpdate = async (values) => {
    try{
      const updatedPackage = await updatePackage(currentPackage.id,{
        ...values,
      })
      fetchPackages();
      toast.success("packages successfully updated");
    }catch(error){
      console.error('Error updating packages:', error);
      toast.error('Failed to update packages');
    }
  }
  const handleFormSubmit = async (values) => {
    try {
      
      // Add new package
      const newPackage = await addPackage(values);
      fetchPackages();
      toast.success("packages created successfully");
    } catch (error) {
      console.error('Error saving package:', error);
      throw error;
    }
  };

  const handlePublishedPackage = async(published: { published: string })=>{
    if(!currentPackage) return;
    try{
      const response = await publishPackage(currentPackage.id,{...published});
      if(!response){
          toast.error('Failed to publish Package');
      }else{
        toast.success('Package updated successfully');
      }
      fetchPackages(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update Package published');
    }finally{
      setCurrentPackage(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchPackages(newPage, pagination.limit);
  };

  const additionalFields = [
    { name: 'name', label: 'Travel Name', type: 'text', required: true },
    { 
      name: 'destination_id', 
      label: 'Destination', 
      type: 'option', 
      required: true,
      placeholder: 'Select Destination',
      options:[
        ...destinations.map(dest => (
          { 
            key: dest.id,
            value: dest.id, 
            label: dest.name 
          }
        )),
      ] 
    },
    { name: 'description', label: 'Travel Description', type: 'textarea', required: true },
    { name: 'price', label: 'Travel Price', type: 'number', required: true },
    { name: 'travel_type', label: 'Travel Type', type: 'text', required: false },
    { name: 'image', label: 'Image', type: 'file', required: false },
    { name: 'duration', label: 'Duration', type: 'text', required: true },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', required: false },
    { 
      name: 'featured', 
      label: 'Featured', 
      type: 'option', 
      placeholder: 'true or false', 
      required: false,
      options: [
        { value: '1', label: 'True' },
        { value: '0', label: 'False' }
      ]
    }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Packages</h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel package listings
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Package
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
      ) : packages.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No packages found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first package listing
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        </div>
      ) : isCardView ? (
        <div className="listing-grid">
          {packages.map((pkg) => (
            <ListingCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              image={typeof pkg.image_url === 'string' ? pkg.image_url : ''}
              description={pkg.description}
              price={pkg.price}
              priceLabel="total"
              badges={[
                pkg.travel_type || 'Package', 
                Number(pkg.featured) === 1 ? 'Featured' : ''
              ].filter(Boolean)}
              details={{
                'Duration': pkg.duration,
                'Rating': pkg.rating ? `${pkg.rating}/5` : 'N/A'
              }}
              published={pkg.published}
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
              <TableHead>Travel Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((_package) => (
              <TableRow key={_package.id}>
                <TableCell className="font-medium">{_package.name}</TableCell>
                <TableCell>{_package.description?`${_package.description.slice(0,20)}...` : "N/A"}</TableCell>
                <TableCell>${_package.price}</TableCell>
                <TableCell>{_package.travel_type || 'N/A'}</TableCell>
                <TableCell>{_package.rating || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,_package.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            _package.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              _package.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit.bind(null, _package.id)}
                      className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete.bind(null, _package.id)}
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


      {/* Add Form */}
      {
        !currentPackage && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          title={"Add New Package"}
          initialValues={(currentPackage as unknown as Record<string, unknown>) || {}}
          fields={additionalFields}
        />
      )}
      {/* Pagination */}
      <Pagination className="mt-6">
        {packages.length > 0 && (
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

      {/* update Form */}
      {
        currentPackage && (
        <ListingForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleUpdate}
          title={"Edit Package" }
          initialValues={(currentPackage as unknown as Record<string, unknown>) || {}}
          fields={additionalFields}
        />
      )}

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone."
      />
    </>
  );
};

export default PackagesPage;
