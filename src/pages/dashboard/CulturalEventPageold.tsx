import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Loader,
  Pencil,
  Trash2,
  FileText,
  BookOpen,
  Wrench,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getAllCulturalEvents,
  CulturalEvent,
  addCulturalEvent,
  updateCulturalEvent,
  deleteCulturalEvent,
} from "@/services/dataService";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListingForm } from "@/components/forms/ListingForm";
import ListingCard from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import getStatusBadge from "@/components/ui/CustomBadges";

const CulturalEventPage = () => {
  const [CulturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentCulturalEvent, setCurrentCulturalEvent] =
    useState<CulturalEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [CulturalEventsToDelete, setCulturalEventsToDelete] = useState<
    number | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const [form, setForm] = useState<CulturalEvent>({
    title: "",
    description: "",
    status: "draft",
    image: null as File | null,
    price: 0,
    published: "",
  });

  useEffect(() => {
    fetchCulturalEvents(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const fetchCulturalEvents = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const data = await getAllCulturalEvents();
      setCulturalEvents(data);
    } catch (error) {
      console.error('Error fetching Cultural Events:', error);
      toast.error('Failed to load Cultural Events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentCulturalEvent(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const CulturalEvent = CulturalEvents.find((g) => g.id === id);
    console.log('Editing Cultural Event:', CulturalEvent);
    if (CulturalEvent) {
      setCurrentCulturalEvent(() => CulturalEvent);
      setFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setCulturalEventsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentCulturalEvent) return;

    try {
      setIsProcessing(true);
      const response = await updateCulturalEvent(currentCulturalEvent.id, {
        ...values
      });

      setCulturalEvents(CulturalEvents.map(r => r.id === currentCulturalEvent.id ? { ...r, ...response } : r));
      setFormOpen(false);
      toast.success('Cultural Event updated successfully');
    } catch (error) {
      console.error('Error updating Cultural Events:', error);
      toast.error('Failed to update Cultural Events');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!CulturalEventsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteCulturalEvent(CulturalEventsToDelete);
      setCulturalEvents(CulturalEvents.filter(r => r.id !== CulturalEventsToDelete));
      toast.success('Cultural Events deleted successfully');
    } catch (error) {
      console.error('Error deleting Cultural Events:', error);
      toast.error('Failed to delete Cultural Events');
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setCulturalEventsToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchCulturalEvents(newPage, pagination.limit);
  };

  const additionalFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter Cultural Events title",
      required: true,
    },
    {
      name: "published",
      label: "Published",
      type: "switch",
      placeholder: "Select Cultural Events published status",
      required: false,
    },
    {
      name: "status",
      label: "Status",
      type: "option",
      placeholder: "Enter Cultural Events status",
      required: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Archived", label: "Archived" },
        { value: "Draft", label: "Draft" },
      ],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Cultural Events description",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter Cultural Events price",
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
    try{
        const newCulturalEvent: CulturalEvent = await addCulturalEvent(values);
        setCulturalEvents([...CulturalEvents, newCulturalEvent]);
        setFormOpen(false);
        toast.success('Cultural Event added successfully');
    } catch (error) {
        console.error('Error adding Cultural Event:', error);
        toast.error('Failed to add Cultural Event');
        throw error;
    }
  };

//  const handleFormSubmit = async (values: Record<string, unknown>) => {
//   const formData = new FormData();

//   Object.entries(values).forEach(([key, value]) => {
//     if (key === "image" && value instanceof File) {
//       formData.append("image", value);
//     } else {
//       formData.append(key, String(value));
//     }
//   });

//   try {
//     const newEvent = await addCulturalEvent(formData);
//       const eventData = newEvent.data ? newEvent.data : newEvent;
//     setCulturalEvents((prev) => [...prev, eventData]);
//     toast.success("Event created successfully");
//   } catch (err:any) {
//     console.log(err,'err');
    
//     toast.error(err.response?.message || "Failed to create event");
//   }
// };

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
          onClick={handleAdd}
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
      ) : CulturalEvents.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">
            No Cultural Events found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Cultural Event
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cultural Event
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CulturalEvents.map((Culture) => (
            <ListingCard
              key={Culture.id}
              id={Culture.id}
              title={Culture.title}
              description={`${Culture.description}`}
              price={0}
              badges={[Culture.published === "1" ? "Published" : "Unpublished"]}
              image={
                typeof Culture.image_url === "string"
                  ? Culture.image_url
                  : "https://via.placeholder.com/150"
              }
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CulturalEvents.map((Culture) => (
                <TableRow key={Culture.id}>
                  <TableCell className="font-medium">{Culture.title}</TableCell>
                  <TableCell>{Culture.description.slice(0, 20)}...</TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(Culture.published)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit.bind(null, Culture.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete.bind(null, Culture.id)}
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

      {/* Add Cultural Events Dialog */}
      {!currentCulturalEvent && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New Cultural Event yas"
          fields={additionalFields}
          initialValues={{
            title: "",
            description: "",
            content: "",
            image_url: "",
            price: 0,
            published: false,
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Edit Cultural Events Dialog */}
      {currentCulturalEvent && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update Cultural Event: ${currentCulturalEvent.title}`}
          fields={additionalFields}
          initialValues={currentCulturalEvent ? { ...currentCulturalEvent } : {}}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Cultures"
        description={`Are you sure you want to delete the Culture? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default CulturalEventPage;
