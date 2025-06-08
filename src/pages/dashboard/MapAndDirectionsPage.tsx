import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Loader,
  Pencil,
  Trash2
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getTravelResourceWithPagination,
  TravelResource,
  addResource,
  updateResource,
  deleteResource,
  publishTravelResources,
} from "@/services/Listings/TravelResources";
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

const MapAndDirectionsPage = () => {
  const [maps, setMaps] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentMaps, setCurrentMaps] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [MapsToDelete, setMapsToDelete] = useState<number | null>(null);
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
    fetchMaps(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const fetchMaps = async (
    page: number,
    limit: number,
    resource: string = "map"
  ) => {
    try {
      setIsLoading(true);
      const { travel_resource, pagination } =
      await getTravelResourceWithPagination(resource, page, limit);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
      setMaps(travel_resource);
    } catch (error) {
      console.error("Error fetching maps:", error);
      toast.error("Failed to load maps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setCurrentMaps(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const map = maps.find((g) => g.id === id);
    if (map) {
      setCurrentMaps(map);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const map = maps.find((f) => f.id === id);
    const values: { published: string } = { published: "" };

    if (map) {
      setCurrentMaps(map);
      values.published = map.published === "1" ? "0" : "1";
      handlePublishedMap(values);
    }
  };
  const handleDelete = (id: number) => {
    setMapsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentMaps) return;

    try {
      setIsProcessing(true);
      const response = await updateResource(currentMaps.id, {
        ...values,
      });

      setMaps(maps.map((r) => (r.id === currentMaps.id ? response : r)));
      setFormOpen(false);
      toast.success("maps updated successfully");
    } catch (error) {
      console.error("Error updating maps:", error);
      toast.error("Failed to update maps");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!MapsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteResource(MapsToDelete);
      setMaps(maps.filter((r) => r.id !== MapsToDelete));
      toast.success("maps deleted successfully");
    } catch (error) {
      console.error("Error deleting maps:", error);
      toast.error("Failed to delete maps");
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setMapsToDelete(null);
    }
  };

  const handlePublishedMap = async (published: { published: string }) => {
    if (!currentMaps) return;
    try {
      const response = await publishTravelResources(currentMaps.id, {
        ...published,
      });
      if (!response) {
        toast.error("Failed to publish map");
      } else {
        toast.success("map updated successfully");
      }
      fetchMaps(pagination.page, pagination.limit);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update map published");
    } finally {
      setCurrentMaps(null);
    }
  };
  const additionalFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter maps title",
      required: true,
    },
    {
      name: "short_description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter maps description",
      required: true,
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      placeholder: "Enter maps content",
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
      const newMaps: TravelResource = await addResource({
        ...values,
        type: "map",
      });
      fetchMaps(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success("maps added successfully");
    } catch (error) {
      console.error("Error adding maps:", error);
      toast.error("Failed to add maps");
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchMaps(newPage, pagination.limit);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Travel maps and Directions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage maps and directions for travelers
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New maps
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
      ) : maps.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No maps found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel maps
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add maps
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <ListingCard
              key={map.id}
              id={map.id}
              title={map.title}
              description={map.short_description || ""}
              image={
                typeof map.image_url === "string"
                  ? map.image_url
                  : map.image_url
                  ? URL.createObjectURL(map.image_url)
                  : ""
              }
              badges={[
                Number(map.published) === 1 ? "Published" : "Unpublished",
              ]}
              price={null}
              published={map.published}
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
              {maps.map((map) => (
                <TableRow key={map.id}>
                  <TableCell className="font-medium">{map.title}</TableCell>
                  <TableCell>{map.content.slice(0, 30)}...</TableCell>
                  <TableCell>{formatDate(map.created_at)}</TableCell>
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
                        onClick={handleEdit.bind(null, map.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete.bind(null, map.id)}
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

      {/* Add maps Dialog */}
      {!currentMaps && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New maps"
          fields={additionalFields}
          initialValues={{
            title: "",
            description: "",
            content: "",
            image_url: "",
            type: "map",
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Pagination */}
      <Pagination className="mt-6">
        {maps.length > 0 && (
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

      {/* Edit maps Dialog */}
      {currentMaps && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update maps: ${currentMaps.title}`}
          fields={additionalFields}
          initialValues={currentMaps}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete maps"
        description={`Are you sure you want to delete the map? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default MapAndDirectionsPage;
