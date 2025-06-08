import { useState } from "react";
import { Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import { Separator } from "@/components/ui/separator";
import getStatusBadge from "@/components/ui/CustomBadges";
import { ListingForm } from "@/components/forms/ListingForm";
import { useCulturalEvents } from "@/hooks/use-cultural-event";
import {
  CulturalEvent,
  CulturalEventProp,
  addCulturalEvent,
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

const additionalFields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter title",
    required: true,
  },
  {
    name: "published",
    label: "Published",
    type: "switch",
    required: false,
  },
  {
    name: "destination",
    label: "Destination",
    type: "text",
    placeholder: "Enter Cultural Events status",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter description",
    required: true,
  },
  {
    name: "event_type",
    label: "Event Type",
    type: "option",
    options: [
      { value: "paid", label: "Paid" },
      { value: "free", label: "Free" },
    ],
  },
  // {
  //   name: "price",
  //   label: "Price",
  //   type: "number",
  //   placeholder: "Enter price",
  //   required: true,
  // },
  {
    name: "image",
    label: "Image URL",
    type: "file",
    placeholder: "https://example.com/image.jpg",
    required: false,
  },
];

const CulturalEventPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [isCardView, setIsCardView] = useState(true);

  const [formValues, setFormValues] = useState<CulturalEvent>({
    title: "",
    description: "",
    destination: "",
    event_type: "free",
    price: 0,
    published: "0",
    image: null as File | null,
  });

  if (formValues.event_type === "paid") {
    additionalFields.push({
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter price",
      required: true,
    });
  }

  /**data fetching */
  const { data, isLoading, isError, mutate } = useCulturalEvents();

  /** submit form*/
  const handleFormSubmit = async (values: Record<string, unknown>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      let finalValue = value;

      // Cast "published" to boolean
      if (key === "published") {
        finalValue = value === "true" || value === true;
      }

      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, String(finalValue));
      }
    });

    try {
      const newEvent = await addCulturalEvent(formData);
      const eventData = newEvent.data ? newEvent.data : newEvent;
      setFormValues(eventData);
      toast.success("Event created successfully");
      mutate();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "Error" in err) {
        console.log(err.Error, "err");
        // @ts-expect-error: Error property might exist
        toast.error(err.Error || "Failed to create event");
      } else {
        toast.error("Failed to create event");
      }
    }
  };

  /**handle delete */
  const handleDelete = async (id: string | number) => {
    try {
      const res = await deleteCulturalEvent(id);
      if (res) toast.success("Event deleted successfully");
      mutate(); // revalidate data
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

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
          onClick={() => setOpenForm(true)}
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
      ) : data.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">
            No Cultural Events found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Cultural Event
          </p>
          <Button onClick={() => setOpenForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cultural Event
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((event: CulturalEventProp) => (
            <ListingCard
              key={event.id}
              id={Number(event.id)}
              title={event.title}
              description={event.description}
              price={event.price}
              badges={[event.published ? "Published" : "Unpublished"]}
              image={
                typeof event.image_url === "string"
                  ? event.image_url
                  : "https://via.placeholder.com/150"
              }
              onEdit={() => "handleEdit"}
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
              {data.map((event: CulturalEventProp) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.description.slice(0, 20)}...</TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(event.published)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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

      {/* Add Cultural Events Dialog */}
      {/* {!currentCulturalEvent && ( */}
      <ListingForm
        title="Add New Cultural Event"
        open={openForm}
        onOpenChange={setOpenForm}
        fields={additionalFields}
        initialValues={formValues as unknown as Record<string, unknown>}
        onSubmit={handleFormSubmit}
      />
      {/* )} */}
    </>
  );
};

export default CulturalEventPage;
