import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Loader,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getTravelResourceWithPagination,
  TravelResource,
  addResource,
  updateResource,
  deleteResource,
  publishTravelResources
} from "@/services/Listings/TravelResources";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { ListingForm } from "@/components/forms/ListingForm";
import ListingCard from "@/components/ListingCard";

const GuidesPage = () => {
  const [guides, setGuides] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentGuide, setCurrentGuide] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [guideToDelete, setGuideToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const formatDate = (date: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchGuides(pagination.page, pagination.limit);
  }, []);

  const fetchGuides = async (page: number, limit: number,resource: string = "guide") => {
    try {
      setIsLoading(true);
      const {travel_resource, pagination} = await getTravelResourceWithPagination(resource,page, limit);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      })
      setGuides(travel_resource);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Failed to load guides");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setCurrentGuide(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const guide = guides.find((g) => g.id === id);
    if (guide) {
      setCurrentGuide(guide);
      setFormOpen(true);
    }
  };
  const handlePublish = (id: number) => {
    const guide = guides.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (guide) { 
      setCurrentGuide(guide)
      values.published = guide.published === "1" ? "0" : "1";
      handlePublishedGuide(values);
    }
  };

  const handleDelete = (id: number) => {
    setGuideToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentGuide) return;

    try {
      setIsProcessing(true);
      const response = await updateResource(currentGuide.id, {
        ...values,
      });

      
      fetchGuides(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success("Guide updated successfully");
    } catch (error) {
      console.error("Error updating Guide:", error);
      toast.error("Failed to update Guide");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!guideToDelete) return;
    try {
      setIsProcessing(true);
      await deleteResource(guideToDelete);
      fetchGuides(pagination.page, pagination.limit);
      toast.success("Guide deleted successfully");
    } catch (error) {
      console.error("Error deleting Guide:", error);
      toast.error("Failed to delete Guide");
    } finally {
      setIsDeleteDialogOpen(false);
      setGuideToDelete(null);
      setIsProcessing(false);
    }
  };


  const handlePublishedGuide = async(published: { published: string })=>{
    if(!currentGuide) return;
    try{
      const response = await publishTravelResources(currentGuide.id,{...published});
      if(!response){
          toast.error('Failed to publish guide');
      }else{
        toast.success('guide updated successfully');
      }
      fetchGuides(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update guide published');
    }finally{
      setCurrentGuide(null)
    }
  }
const additionalFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter Guide title",
      required: true,
    },
    {
      name: "short_description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Guide description",
      required: true,
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      placeholder: "Enter Guide content",
      required: true,
    },
    {
      name: "image",
      label: "Image URL",
      type: "file",
      placeholder: "https://example.com/image.jpg",
      required: false,
    },
  ];

  const handleFormSubmit = async (values) => {
    try {
      const newGuide = await addResource({...values,type:"guide"});
      fetchGuides(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success("Guide added successfully");
    } catch (error) {
      console.error("Error adding Guide:", error);
      toast.error("Failed to add Guide");
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchAccommodations(newPage, pagination.limit);
  };


  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel guides</h1>
          <p className="text-muted-foreground mt-1">
            Manage guides for travelers
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Guide
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

        {/* End of toggle  */}
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No guides found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Guide
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Guide
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <ListingCard
              key={guide.id}
              id={guide.id}
              title={guide.title}
              description={guide.short_description || guide.content || ""}
              image={
                typeof guide.image_url === "string"
                  ? guide.image_url
                  : guide.image_url
                  ? URL.createObjectURL(guide.image_url)
                  : ""
              }
              badges={[
                Number(guide.published) === 1 ? "Published" : "Unpublished",
              ]}
              price={null} // Provide a default price if not available
              published={guide.published}
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.title}</TableCell>
                  <TableCell>{guide.content.slice(0, 30)}...</TableCell>
                  <TableCell>{guide.short_description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,guide.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            guide.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              guide.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit.bind(null, guide.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete.bind(null, guide.id)}
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
                {guides.length > 0 && (
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
      

      {/* Add Guide Dialog */}
      {!currentGuide && (
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Add New Guide"
        fields={additionalFields}
        initialValues={{
          title: "",
          description: "",
          content: "",
          image_url: "",
          type: "guide",
        }}
        onSubmit={handleFormSubmit}
      />
      )}

      {/* Edit Guide Dialog */}
      {currentGuide && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update Guide: ${currentGuide.title}`}
          fields={additionalFields}
          initialValues={currentGuide}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Guide"
        description={`Are you sure you want to delete the guide? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default GuidesPage;
