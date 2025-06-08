import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getTravelResources, TravelResource, addResource, updateResource, deleteResource } from '@/services/dataService';
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
import { publishAccommodation } from '@/services/Listings/Accommodation';

const StoriesPage = () => {
  const [stories, setStories] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentStories, setCurrentStories] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [StoriesToDelete, setStoriesToDelete] = useState<number | null>(null);
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
    fetchStories(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchStories = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const data = await getTravelResources();
      const stories = data.filter((resource) => resource.type === "story");
      setStories(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setCurrentStories(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const story = stories.find((g) => g.id === id);
    if (story) {
      setCurrentStories(story);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const story = stories.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (story) { 
      setCurrentStories(story)
      values.published = story.published === "1" ? "0" : "1";
      handlePublishedStory(values);
    }
  };
  const handleDelete = (id: number) => {
    setStoriesToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentStories) return;
    
    try {
      setIsProcessing(true);
      const response = await updateResource(currentStories.id, {
        ...values
      });

      fetchStories(pagination.page,pagination.limit);
      setFormOpen(false);
      toast.success('stories updated successfully');
    } catch (error) {
      console.error('Error updating stories:', error);
      toast.error('Failed to update stories');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!StoriesToDelete) return;

    try {
      setIsProcessing(true);
      await deleteResource(StoriesToDelete);
      fetchStories(pagination.page,pagination.limit);
      toast.success('stories deleted successfully');
    } catch (error) {
      console.error('Error deleting stories:', error);
      toast.error('Failed to delete stories');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setStoriesToDelete(null);
    }
  };


const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchStories(newPage, pagination.limit);
  };
  const additionalFields = [
    {name:"title", label:"Title", type:"text", placeholder:"Enter stories title", required:true},
    {name:"description", label:"Description", type:"textarea", placeholder:"Enter stories description",required:true},
    {name:"content", label:"Content", type:"textarea", placeholder:"Enter stories content",required:true},
    {name:"image", label:"Image URL", type:"file", placeholder:"https://example.com/image.jpg",required:false},
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newStories = await addResource(values);
        fetchStories(pagination.page,pagination.limit);
        setFormOpen(false);
        toast.success('stories added successfully');
    } catch (error) {
        console.error('Error adding stories:', error);
        toast.error('Failed to add stories');
        throw error;
    }
  };

  const handlePublishedStory = async(published: { published: string })=>{
    if(!currentStories) return;
    try{
      const response = await publishAccommodation(currentStories.id,{...published});
      if(!response){
          toast.error('Failed to publish accommodation');
      }else{
        toast.success('accommodation updated successfully');
      }
      fetchStories(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update accommodation published');
    }finally{
      setCurrentStories(null)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel stories</h1>
          <p className="text-muted-foreground mt-1">
            Manage User stories for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New stories
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
      ) : stories.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel stories
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add stories
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <ListingCard
              key={story.id}
              id={story.id}
              title={story.title}
              description={story.description || story.content || ""}
              image={typeof story.image_url === "string" ? story.image_url : story.image_url ? URL.createObjectURL(story.image_url) : ""}
              badges={[ Number(story.published) === 1 ? 'Published' : 'Unpublished' ]}
              price={ 0} // Provide a default price if not available
              onEdit={handleEdit}
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
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stories.map((story) => (
                        <TableRow key={story.id}>
                            <TableCell className="font-medium">{story.title}</TableCell>
                            <TableCell>{story.content.slice(0, 30)}...</TableCell>
                            <TableCell>{formatDate(story.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(story.published)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, story.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, story.id)}
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

      {/* Add stories Dialog */}
      {!currentStories && (
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Add New stories"
        fields={additionalFields}
        initialValues={{title:"",description:"",content:"",image_url:"",type:"story"}}
        onSubmit={handleFormSubmit}
      />
      )}

      {/* Edit stories Dialog */}
      {currentStories && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update stories: ${currentStories.title}`}
          fields={additionalFields}
          initialValues={currentStories}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete stories"
        description={`Are you sure you want to delete the story? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default StoriesPage;
