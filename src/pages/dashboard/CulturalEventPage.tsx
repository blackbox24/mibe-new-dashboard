import { useState,useEffect } from "react";
import { Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import { Separator } from "@/components/ui/separator";
import getStatusBadge from "@/components/ui/CustomBadges";
import { ListingForm } from "@/components/forms/ListingForm";
import { useCulturalEvents } from "@/hooks/use-cultural-event";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  CulturalEvent,
  getCulturalEventWithPagination,
  addCulturalEvent,
  updateCulturalEvent,
  publishCulturalEvent,
  deleteCulturalEvent,
} from "@/services/Listings/CulturalEvent";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";


const CulturalEventPage = () => {
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<CulturalEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  

  useEffect(()=>{
    fetchEvents(pagination.page,pagination.limit);
  },[]);

  const fetchEvents = async(page:number,limit:number) => {
    setIsLoading(true);
    try{
      const {culturalEvent, pagination} = await getCulturalEventWithPagination(page,limit);
      setEvents(culturalEvent);
      setPagination({
        page:pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords
      })
    }catch(err){
      console.error(err);
      toast.error(err)
    }finally {
      setIsLoading(false);
    }
  }

  const handleAdd = () => {
      setCurrentEvent(null);
      setFormOpen(true);
    };
  
    const handleEdit = (id: number) => {
      const event = events.find(a => a.id === id);
      if (event) {
        setCurrentEvent({
          ...event
        });
        setFormOpen(true);
      }
    };
    const handlePublish = (id: number) => {
      const event = events.find(f => f.id === id);
      const values: { published: string } = { published: "" };
      
      if (event) { 
        setCurrentEvent(event)
        console.log(event.published)
        values.published = String(event.published) === "1" ? "0" : "1";
        handlePublishedCulturalEvent(values);
      }
    };
  
    const handleDelete = (id: number) => {
      setEventToDelete(id);
      setIsDeleteDialogOpen(true);
    };
  
    const confirmDelete = async () => {
      if (eventToDelete === null) return;
      
      try {
        await deleteCulturalEvent(eventToDelete);
        setEvents(events.filter(a => a.id !== eventToDelete));
        toast.success('event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      } finally {
        setIsDeleteDialogOpen(false);
        setEventToDelete(null);
      }
    };
  
    const handleUpdate = async(values) => {
      if(!currentEvent) return;
      try{
        setIsProcessing(true)
        const response = await updateCulturalEvent(
          currentEvent.id,{
            ...values
  
          }
        );
        fetchEvents(pagination.page, pagination.limit); // Refresh the list after adding
      }catch(error){
        console.error('Error updating event:', error);
        toast.error('Failed to update event');
      }finally{
        setCurrentEvent(null)
        setIsProcessing(false)
      }
    }
    const handleFormSubmit = async (values) => {
      try {
        
        const newAccommodation = await addCulturalEvent(values);
        fetchEvents(pagination.page, pagination.limit); // Refresh the list after adding
        setFormOpen(false);
        
      } catch (error) {
        console.error('Error saving event:', error);
        toast.error('Failed to save events');
        throw error;
      }
    };
  
    const handlePageChange = (newPage: number) => {
      if (newPage < 1 || newPage > pagination.totalPages) return;
      fetchEvents(newPage, pagination.limit);
    };
  
    const handlePublishedCulturalEvent = async(published: { published: string })=>{
      if(!currentEvent) return;
      try{
        const response = await publishCulturalEvent(currentEvent.id,{...published});
        console.log(published)
        if(!response){
            toast.error('Failed to publish event');
        }else{
          toast.success('event updated successfully');
        }
        fetchEvents(pagination.page, pagination.limit);
        
      }catch(error){
        console.error(error);
        toast.error('Failed to update event published');
      }finally{
        setCurrentEvent(null)
      }
    }
  const additionalFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
    },
    // {
    //   name: "destination",
    //   label: "Destination",
    //   type: "text",
    //   placeholder: "Enter Cultural Events status",
    //   required: true,
    // },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      required: true,
    },
    {
      name: "type",
      label: "Event Type",
      type: "option",
      options: [
        { value: "paid", label: "Paid" },
        { value: "free", label: "Free" },
      ],
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter price",
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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Travel Cultural Events
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage Cultural Events for travelers
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={() => setFormOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Cultural Event
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
      ) : events.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">
            No Cultural Events found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Cultural Event
          </p>
          <Button onClick={() => setFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cultural Event
          </Button>
          
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: CulturalEvent) => (
            <ListingCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              price={event.price}
              badges={[event.type,String(event.published) === "1" ? "Published" : "Unpublished"]}
              image={
                typeof event.image_url === "string"
                  ? event.image_url
                  : "https://via.placeholder.com/150"
              }
              published={event.published}
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: CulturalEvent) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.description.slice(0, 20)}...</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,event.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            String(event.published) === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              event.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={handleEdit.bind(null, event.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(Number(event.id))}
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
          {events.length > 0 && (
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

      {/* Add Cultural Events Dialog */}
      {!currentEvent && (
        <ListingForm
          title="Add New Cultural Event"
          open={formOpen}
          onOpenChange={setFormOpen}
          fields={additionalFields}
          initialValues={(currentEvent as unknown as Record<string, unknown>) || {}}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Edit Cultural Events Dialog */}
      {currentEvent && (
        <ListingForm
          title={`Edit Cultural Event: ${currentEvent.title}`}
          open={formOpen}
          onOpenChange={setFormOpen}
          fields={additionalFields}
          initialValues={currentEvent as unknown as Record<string, unknown>}
          onSubmit={handleUpdate}
        />
      )}

       <DeleteConfirmationDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete event"
          description="Are you sure you want to delete this event? This action cannot be undone."
        />
    </>
  );
};

export default CulturalEventPage;
