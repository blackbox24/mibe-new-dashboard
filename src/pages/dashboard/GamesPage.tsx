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

const GamesPage = () => {
  const [games, setToolkits] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentGames, setCurrentGames] = useState<TravelResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gamesToDelete, setGamesToDelete] = useState<number | null>(null);
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
    fetchGames(pagination.page, pagination.limit);
  }, []);


  const fetchGames = async (page:number, limit:number,resource:string = "game") => {
    try {
      setIsLoading(true);
      const {travel_resource,pagination} = await getTravelResourceWithPagination(resource,page,limit);
      setToolkits(travel_resource);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentGames(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const games = games.find((g) => g.id === id);
    if (games) {
      setCurrentGames(games);
      setFormOpen(true);
    }
  };

  const handlePublish = (id: number) => {
    const game = games.find((f) => f.id === id);
    const values: { published: string } = { published: "" };

    if (game) {
      setCurrentGames(game);
      values.published = game.published === "1" ? "0" : "1";
      handlePublishedGame(values);
    }
  };
  const handleDelete = (id: number) => {
    setGamesToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentGames) return;
    
    try {
      setIsProcessing(true);
      const response = await updateResource(currentGames.id, {
        ...values
      });

      setToolkits(games.map(r => r.id === currentGames.id ? response : r));
      setFormOpen(false);
      toast.success('games updated successfully');
    } catch (error) {
      console.error('Error updating games:', error);
      toast.error('Failed to update games');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!gamesToDelete) return;

    try {
      setIsProcessing(true);
      await deleteResource(gamesToDelete);
      setToolkits(games.filter(r => r.id !== gamesToDelete));
      toast.success('games deleted successfully');
    } catch (error) {
      console.error('Error deleting games:', error);
      toast.error('Failed to delete games');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setGamesToDelete(null);
    }
  };

  const handlePublishedGame = async (published: { published: string }) => {
    if (!currentGames) return;
    try {
      const response = await publishTravelResources(currentGames.id, {
        ...published,
      });
      if (!response) {
        toast.error("Failed to publish game");
      } else {
        toast.success("game updated successfully");
      }
      fetchGames(pagination.page, pagination.limit);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update game published");
    } finally {
      setCurrentGames(null);
    }
  };
  const additionalFields = [
    {name:"title", label:"Title", type:"text", placeholder:"Enter games title", required:true},
    {name:"short_description", label:"Description", type:"textarea", placeholder:"Enter games description",required:true},
    {name:"content", label:"Content", type:"textarea", placeholder:"Enter games content",required:true},
    {name:"image", label:"Image URL", type:"file", placeholder:"https://example.com/image.jpg",required:false},
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newToolkits: TravelResource = await addResource({...values,type:"game"});
        setToolkits([...games, newToolkits]);
        setFormOpen(false);
        toast.success('games added successfully');
    } catch (error) {
        console.error('Error adding games:', error);
        toast.error('Failed to add games');
        throw error;
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchGames(newPage, pagination.limit);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel games</h1>
          <p className="text-muted-foreground mt-1">
            Manage games for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New games
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
      ) : games.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel games
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add games
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <ListingCard
              key={game.id}
              id={game.id}
              title={game.title}
              description={game.short_description ||  ""}
              image={typeof game.image_url === "string" ? game.image_url : ""}
              badges={[ Number(game.published) === 1 ? 'Published' : 'Unpublished' ]}
              price={null} // Provide a default price if not available
              published={game.published}
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
                    {games.map((game) => (
                        <TableRow key={game.id}>
                            <TableCell className="font-medium">{game.title}</TableCell>
                            <TableCell>{game.content.slice(0, 30)}...</TableCell>
                            <TableCell>{formatDate(game.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <div className="flex justify-end">
                                    <button
                                      onClick={handlePublish.bind(null, game.id)}
                                      className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                                        game.published === "1"
                                          ? "bg-blue-500"
                                          : "bg-gray-300"
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                                          game.published === "1" ? "translate-x-6" : ""
                                        }`}
                                      ></div>
                                    </button>
                                  </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, game.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, game.id)}
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

      {/* Add games Dialog */}

      {!currentGames && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New games"
          fields={additionalFields}
          initialValues={{title:"",description:"",content:"",image_url:"",type:"games"}}
          onSubmit={handleFormSubmit}
        />
      )}
        {/* Pagination */}
        <Pagination className="mt-6">
            {games.length > 0 && (
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
        
      {/* Edit games Dialog */}
      {currentGames && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update games: ${currentGames.title}`}
          fields={additionalFields}
          initialValues={currentGames}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete games"
        description={`Are you sure you want to delete the games? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default GamesPage;
