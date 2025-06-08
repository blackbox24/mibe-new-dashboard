import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  getTravelResourceWithPagination,
  TravelResource,
  addResource,
  updateResource,
  deleteResource,
  publishTravelResources,
} from "@/services/Listings/TravelResources";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListingForm } from '@/components/forms/ListingForm';
import ListingCard from '@/components/ListingCard';
import { Badge } from "@/components/ui/badge";

const ToolkitsPage = () => {
  const [toolkits, setToolkits] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentToolkits, setCurrentToolkits] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toolkitsToDelete, setToolkitsToDelete] = useState<number | null>(null);
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
    fetchToolkits(pagination.page, pagination.limit);
  }, []);


  const fetchToolkits = async (    
    page: number,
    limit: number,
    resource: string = "toolkit"
  ) => {
    try {
      setIsLoading(true);
      const {travel_resource, pagination} = await getTravelResourceWithPagination(resource,page,limit);
      setToolkits(travel_resource);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching toolkits:', error);
      toast.error('Failed to load toolkits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setCurrentToolkits(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const toolkit = toolkits.find((g) => g.id === id);
    if (toolkit) {
      setCurrentToolkits(toolkit);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const toolkit = toolkits.find((f) => f.id === id);
    const values: { published: string } = { published: "" };

    if (toolkit) {
      setCurrentToolkits(toolkit);
      values.published = toolkit.published === "1" ? "0" : "1";
      handlePublishedToolkit(values);
    }
  };

  const handleDelete = (id: number) => {
    setToolkitsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentToolkits) return;
    
    try {
      setIsProcessing(true);
      const response = await updateResource(currentToolkits.id, {
        ...values
      });

      setToolkits(toolkits.map(r => r.id === currentToolkits.id ? response : r));
      setFormOpen(false);
      toast.success('toolkits updated successfully');
    } catch (error) {
      console.error('Error updating toolkits:', error);
      toast.error('Failed to update toolkits');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toolkitsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteResource(toolkitsToDelete);
      setToolkits(toolkits.filter(r => r.id !== toolkitsToDelete));
      toast.success('toolkits deleted successfully');
    } catch (error) {
      console.error('Error deleting toolkits:', error);
      toast.error('Failed to delete toolkits');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setToolkitsToDelete(null);
    }
  };

    const handlePublishedToolkit = async (published: { published: string }) => {
      if (!currentToolkits) return;
      try {
        const response = await publishTravelResources(currentToolkits.id, {
          ...published,
        });
        if (!response) {
          toast.error("Failed to publish map");
        } else {
          toast.success("toolkit updated successfully");
        }
        fetchToolkits(pagination.page, pagination.limit);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update toolkit published");
      } finally {
        setCurrentToolkits(null);
      }
    };

  const additionalFields = [
    {name:"title", label:"Title", type:"text", placeholder:"Enter toolkits title", required:true},
    {name:"short_description", label:"Description", type:"textarea", placeholder:"Enter toolkits description",required:true},
    {name:"content", label:"Content", type:"textarea", placeholder:"Enter toolkits content",required:true},
    {name:"image", label:"Image URL", type:"file", placeholder:"https://example.com/image.jpg",required:false},
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newToolkits = await addResource({...values,type:"toolkit"});
        fetchToolkits(pagination.page,pagination.limit)
        setFormOpen(false);
        toast.success('toolkits added successfully');
    } catch (error) {
        console.error('Error adding toolkits:', error);
        toast.error('Failed to add toolkits');
        throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel toolkits</h1>
          <p className="text-muted-foreground mt-1">
            Manage toolkits for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New toolkits
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
      ) : toolkits.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No toolkits found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel toolkits
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add toolkits
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolkits.map((toolkit) => (
            <ListingCard
              key={toolkit.id}
              id={toolkit.id}
              title={toolkit.title}
              description={toolkit.short_description || ""}
              image={typeof toolkit.image_url === "string" ? toolkit.image_url :  ""}
              badges={[ Number(toolkit.published) === 1 ? 'Published' : 'Unpublished' ]}
              price={null}
              published={toolkit.published}
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
                    {toolkits.map((toolkit) => (
                        <TableRow key={toolkit.id}>
                            <TableCell className="font-medium">{toolkit.title}</TableCell>
                            <TableCell>{toolkit.content.slice(0, 30)}...</TableCell>
                            <TableCell>{formatDate(toolkit.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <div className="flex justify-end">
                                      <button
                                        onClick={handlePublish.bind(null, map.id)}
                                        className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                                          map.published === "1"
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                        }`}
                                      >
                                        <div
                                          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                                            map.published === "1" ? "translate-x-6" : ""
                                          }`}
                                        ></div>
                                      </button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, toolkit.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, toolkit.id)}
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
        {toolkits.length > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
        )}
        <PaginationContent>
          <PaginationPrevious
            onClick={
              pagination.page > 1
                ? () => handlePageChange(pagination.page - 1)
                : undefined
            }
            className={
              pagination.page <= 1 ? "opacity-50 pointer-events-none" : ""
            }
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
            className={
              pagination.page >= pagination.totalPages
                ? "opacity-50 pointer-events-none"
                : ""
            }
          />
        </PaginationContent>
      </Pagination>

      {/* Add toolkits Dialog */}
      {!currentToolkits && (
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Add New toolkits"
        fields={additionalFields}
        initialValues={{title:"",description:"",content:"",image_url:"",type:"toolkit"}}
        onSubmit={handleFormSubmit}
      />
      )}

      {/* Edit toolkits Dialog */}
      {currentToolkits && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update toolkits: ${currentToolkits.title}`}
          fields={additionalFields}
          initialValues={currentToolkits}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete toolkits"
        description={`Are you sure you want to delete the Toolkit? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default ToolkitsPage;
