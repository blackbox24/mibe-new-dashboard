import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getPartnerWithPagination, Partner, addPartner, updatePartner, deletePartner, publishPartner } from '@/services/Listings/Partners';
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

const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [PartnersToDelete, setPartnersToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchPartners(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchPartners = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const {partners,pagination} = await getPartnerWithPagination(page,limit);
      setPartners(partners);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd =  () => {
    setCurrentPartner(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const Partner = partners.find((g) => g.id === id);
    console.log('Editing Partner:', Partner);
    if (Partner) {
      setCurrentPartner(() => Partner);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const trustpartner = partners.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (trustpartner) { 
      setCurrentPartner(trustpartner)
      values.published = trustpartner.published === "1" ? "0" : "1";
      handlePublishedPartner(values);
    }
  };

  const handleDelete = (id: number) => {
    setPartnersToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentPartner) return;
    
    try {
      setIsProcessing(true);
      const response = await updatePartner(currentPartner.id, {
        ...values
      });

      setPartners(partners.map(r => r.id === currentPartner.id ? { ...r, ...response } : r));
      setFormOpen(false);
      toast.success('partners updated successfully');
    } catch (error) {
      console.error('Error updating partners:', error);
      toast.error('Failed to update partners');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!PartnersToDelete) return;

    try {
      setIsProcessing(true);
      await deletePartner(PartnersToDelete);
      setPartners(partners.filter(r => r.id !== PartnersToDelete));
      toast.success('partners deleted successfully');
    } catch (error) {
      console.error('Error deleting partners:', error);
      toast.error('Failed to delete partners');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setPartnersToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchPartners(newPage, pagination.limit);
  };

  const handleFormSubmit = async (values) => {
    try{
        const newPartners: Partner = await addPartner(values);
        setPartners([...partners, newPartners]);
        setFormOpen(false);
        toast.success('partners added successfully');
    } catch (error) {
        console.error('Error adding partners:', error);
        toast.error('Failed to add partners');
        throw error;
    }
  };
  
    const handlePublishedPartner = async(published: { published: string })=>{
      if(!currentPartner) return;
      try{
        const response = await publishPartner(currentPartner.id,{...published});
        if(!response){
            toast.error('Failed to publish partner');
        }else{
          toast.success('partner updated successfully');
        }
        fetchPartners(pagination.page, pagination.limit);
        
      }catch(error){
        console.error(error);
        toast.error('Failed to update partner published');
      }finally{
        setCurrentPartner(null)
      }
    }
  const additionalFields = [
    {name:"name", label:"Name", type:"text", placeholder:"Enter Partner name"},
    {name:"website", label:"Website URL", type:"text", placeholder:"https://example.com"},
    {name:"logo_url", label:"Logo URL", type:"file", placeholder:"https://example.com/logo.png"},
    // {name:"partnership_type", label:"Partnership Type", type:"text", placeholder:"E.g., Hotel Chain, Airline, Tourism Board"},
  ]
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trusted partners</h1>
          <p className="text-muted-foreground mt-1">
            Manage your trusted business partners
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Partner
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
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No partners found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first business partner
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <ListingCard
              key={partner.id}
              id={partner.id}
              title={partner.name}
              description={`Visit our partners at ${partner.website}`}
              image={partner.logo_url || ""}
              badges={[ partner.published === "1"? 'Published' : 'Unpublished']}
              published={partner.published}
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
                        <TableHead className="text-right">Website</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {partners.map((partner) => (
                        <TableRow key={partner.id}>
                            <TableCell className="font-medium">{partner.name}</TableCell>
                            <TableCell className="text-right">{partner.website}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <div className="flex justify-end">
                                    <button
                                      onClick={handlePublish.bind(null,partner.id)}
                                      className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                                        partner.published === "1" ? "bg-blue-500" : "bg-gray-300"
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                                          partner.published === "1" ? "translate-x-6" : ""
                                        }`}
                                      ></div>
                                    </button>
                                  </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, partner.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, partner.id)}
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
              {partners.length > 0 && (
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
    

      {/* Add Partner Dialog */}
      {!currentPartner && (
        <ListingForm
          open={formOpen}
          title="Add New Partner"
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          initialValues={currentPartner || {}}
          fields={additionalFields}
        />
      )}

      {/* Edit Partner Dialog */}
      {currentPartner && (
        <ListingForm
          open={formOpen}
          title={`Edit Partner: ${currentPartner.name}`}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          initialValues={currentPartner}
          fields={additionalFields}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Partner"
        description={`Are you sure you want to delete the partner? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default PartnersPage;
