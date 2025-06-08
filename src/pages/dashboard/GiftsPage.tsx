import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Loader, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import {getGiftCardWithPagination,addGiftCard,updateGiftCard,deleteGiftcard,publishGiftCard} from "@/services/Listings/giftCard";
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

const GiftsPage = () => {
  const [Gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentGifts, setCurrentGifts] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [GiftsToDelete, setGiftsToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchGifts(pagination.page,pagination.limit);
  }, []);

  const fetchGifts = async (page:number,limit:number) => {
    setIsLoading(true);
    try {
      const {records,pagination} = await getGiftCardWithPagination(page,limit);

      setGifts(records);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error("Error fetching Gifts:", error);
      toast.error("Failed to load Gifts");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (id:number) => {
    const gift = Gifts.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (gift) { 
      setCurrentGifts(gift)
      values.published = gift.published === "1" ? "0" : "1";
      handlePublishedGift(values);
    }
  };

  const handleAdd = () => {
    setCurrentGifts(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const gift = Gifts.find((g) => g.id === id);
    console.log("Editing gift:", gift);
    if (gift) {
      setCurrentGifts(() => gift);
      setFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setGiftsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentGifts) return;

    try {
      setIsProcessing(true);
      const response = await updateGiftCard(currentGifts.id,{
        ...values
      })
      fetchGifts(pagination.page,pagination.limit);
      setFormOpen(false);
      toast.success("Gifts updated successfully");
    } catch (error) {
      console.error("Error updating Gifts:", error);
      toast.error("Failed to update Gifts");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!GiftsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteGiftcard(GiftsToDelete)
      fetchGifts(pagination.page,pagination.limit);
      toast.success("Gift deleted successfully");
    } catch (error) {
      console.error("Error deleting Gift:", error);
      toast.error("Failed to delete Gift");
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setGiftsToDelete(null);
    }
  };

  const getStatusBadge = (reason) => {
    return <Badge className="bg-blue-500">{reason}</Badge>;
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePublishedGift = async(published: { published: string })=>{
    if(!currentGifts) return;
    try{
      const response = await publishGiftCard(currentGifts.id,{...published});
      if(!response){
          toast.error('Failed to publish gift');
      }else{
        toast.success('gift updated successfully');
      }
      fetchGifts(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update gift published');
    }finally{
      setCurrentGifts(null)
    }
  }

  const additionalFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter Gifts title",
      required: true,
    },
    {
      name: "gifttypes",
      label: "Gift Reason",
      type: "option",
      placeholder: "Select gift reason",
      required: true,
      options: [
        { value: "Birthday", label: "Birthday" },
        { value: "Fathers Day", label: "Fathers Day" },
        { value: "Mothers Day", label: "Mothers Day" },
        { value: "Anniversary", label: "Anniversary" },
        { value: "Wedding Day", label: "Wedding Day" },
        { value: "HoneyMoon", label: "HoneyMoon" },
        { value: "Employee of the Month", label: "Employee of the Month" },
        { value: "Employee Reward", label: "Employee Reward" },
        { value: "Christmas", label: "Christmas" },
        { value: "Graduation", label: "Graduation" },
        { value: "Valentine", label: "Valentine" },
      ],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Gifts description",
      required: true,
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "text",
      placeholder: "Enter Gifts occassion",
      required: true,
    },
    {
      name: "amount",
      label: "Price",
      type: "number",
      placeholder: "Enter Gifts price",
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
      const data  = await addGiftCard(values);
      fetchGifts(pagination.page,pagination.limit);
      setFormOpen(false);
      toast.success("Gift added successfully");
    } catch (error) {
      console.error("Error adding Gift:", error);
      toast.error("Failed to add Gift");
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Gifts</h1>
          <p className="text-muted-foreground mt-1">
            Manage Gifts for travelers
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Gifts
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
      ) : Gifts.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No Gifts found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Gifts
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Gifts
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Gifts.map((gift) => (
            <ListingCard
              key={gift.id}
              id={gift.id}
              title={gift.title}
              description={`${gift.description}`}
              badges={[
                gift.status,
                gift.published === "1" ? "Published" : "Unpublished",
              ]}
              image={
                typeof gift.image_url === "string"
                  ? gift.image_url
                  : "https://via.placeholder.com/150"
              }
              price={gift.amount} // Provide a default price if not available
              published={gift.published}
              onPublish={handlePublish}
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Gifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell className="font-medium">{gift.title}</TableCell>
                  <TableCell>{gift.description.slice(0, 20)}...</TableCell>
                  <TableCell>{getStatusBadge(gift.status)}</TableCell>
                  <TableCell className="text-right">{gift.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="flex justify-end">
                        <button
                          onClick={handlePublish.bind(null,gift.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                            gift.published === "1" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                              gift.published === "1" ? "translate-x-6" : ""
                            }`}
                          ></div>
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit.bind(null, gift.id)}
                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete.bind(null, gift.id)}
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
        {Gifts.length > 0 && (
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
            className={pagination.page <= 1 ? "disabled-class" : ""}
          />
          {[...Array(pagination.totalPages)].map((_, idx) => (
            <PaginationItem key={`page-${idx}`}>
              <PaginationLink
                isActive={pagination.page === idx + 1}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            className={
              pagination.page >= pagination.totalPages ? "disabled-class" : ""
            }
            onClick={
              pagination.page < pagination.totalPages
                ? () => handlePageChange(pagination.page + 1)
                : undefined
            }
          />
        </PaginationContent>
      </Pagination>

      {/* Add Gifts Dialog */}
      {!currentGifts && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New Gifts"
          fields={additionalFields}
          initialValues={{
            title: "",
            description: "",
            content: "",
            image_url: "",
            price: 0,
            status: "Active",
            published: "1",
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Edit Gifts Dialog */}
      {currentGifts && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update Gifts: ${currentGifts.title}`}
          fields={additionalFields}
          initialValues={currentGifts ? { ...currentGifts } : {}}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Gifts"
        description={`Are you sure you want to delete the gift? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default GiftsPage;
