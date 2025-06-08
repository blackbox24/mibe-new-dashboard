import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getTravelResourceWithPagination, TravelResource, addResource, updateResource, deleteResource,publishTravelResources } from '@/services/Listings/TravelResources';
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

const ChecklistsPage = () => {
  const [checklists, setChecklists] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentChecklists, setCurrentChecklists] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [checklistsToDelete, setToolkitsToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const formatDate = (date: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
    };

  useEffect(() => {
    fetchChecklists(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchChecklists = async (page: number, limit: number,resource:string = "checklist") => {
    try {
      setIsLoading(true);
      const {travel_resource,pagination} = await getTravelResourceWithPagination(resource,page,limit);
      setChecklists(travel_resource);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast.error('Failed to load checklists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentChecklists(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const checklist = checklists.find((g) => g.id === id);
    if (checklist) {
      setCurrentChecklists(() => checklist);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const checklist = checklists.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (checklist) { 
      setCurrentChecklists(checklist)
      values.published = checklist.published === "1" ? "0" : "1";
      handlePublishedChecklist(values);
    }
  };
  const handleDelete = (id: number) => {
    setToolkitsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentChecklists) return;
    
    try {
      setIsProcessing(true);
      const response = await updateResource(currentChecklists.id, {
        ...values
      });

      setChecklists(checklists.map(r => r.id === currentChecklists.id ? response : r));
      setFormOpen(false);
      toast.success('checklists updated successfully');
    } catch (error) {
      console.error('Error updating checklists:', error);
      toast.error('Failed to update checklists');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!checklistsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteResource(checklistsToDelete);
      setChecklists(checklists.filter(r => r.id !== checklistsToDelete));
      toast.success('checklists deleted successfully');
    } catch (error) {
      console.error('Error deleting checklists:', error);
      toast.error('Failed to delete checklists');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setToolkitsToDelete(null);
    }
  };

const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchChecklists(newPage, pagination.limit);
  };
  const additionalFields = [
    {name:"title", label:"Title", type:"text", placeholder:"Enter checklists title", required:true},
    {name:"short_description", label:"Description", type:"textarea", placeholder:"Enter checklists description",required:true},
    {name:"content", label:"Content", type:"textarea", placeholder:"Enter checklists content",required:true},
    {name:"image", label:"Image URL", type:"file", placeholder:"https://example.com/image.jpg",required:false},
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newToolkits = await addResource({...values,type:"checklist"});
        fetchChecklists(pagination.page,pagination.limit)
        setFormOpen(false);
        toast.success('checklists added successfully');
    } catch (error) {
        console.error('Error adding checklists:', error);
        toast.error('Failed to add checklists');
        throw error;
    }
  };

  const handlePublishedChecklist = async(published: { published: string })=>{
    if(!currentChecklists) return;
    try{
      const response = await publishTravelResources(currentChecklists.id,{...published});
      if(!response){
          toast.error('Failed to publish checklist');
      }else{
        toast.success('checklist updated successfully');
      }
      fetchChecklists(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update checklist published');
    }finally{
      setCurrentChecklists(null)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel checklists</h1>
          <p className="text-muted-foreground mt-1">
            Manage checklists for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New checklists
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
      ) : checklists.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No checklists found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel checklists
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add checklists
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {checklists.map((checklist) => (
            <ListingCard
              key={checklist.id}
              id={checklist.id}
              title={checklist.title}
              description={checklist.short_description || ""}
              image={typeof checklist.image_url === "string" ? checklist.image_url :  ""}
              badges={[ Number(checklist.published) === 1 ? 'Published' : 'Unpublished' ]}
              price={ null} // Provide a default price if not available
              published={checklist.published}
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
                        <TableHead>Title</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {checklists.map((checklist) => (
                        <TableRow key={checklist.id}>
                            <TableCell className="font-medium">{checklist.title}</TableCell>
                            <TableCell>{checklist.content.slice(0, 30)}...</TableCell>
                            <TableCell>{formatDate(checklist.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, checklist.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, checklist.id)}
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
          {checklists.length > 0 && (
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

      {/* Add checklists Dialog */}
      {!currentChecklists && (
      <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New checklists"
          fields={additionalFields}
          initialValues={{title:"",description:"",content:"",image_url:"",type:"checklist"}}
          onSubmit={handleFormSubmit}
        />
      )}
      {/* Edit checklists Dialog */}
      {currentChecklists && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update checklists: ${currentChecklists.title}`}
          fields={additionalFields}
          initialValues={currentChecklists}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete checklists"
        description={`Are you sure you want to delete the checklist? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default ChecklistsPage;
