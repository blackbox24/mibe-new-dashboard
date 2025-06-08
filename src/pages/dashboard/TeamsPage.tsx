import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getOtherListingWithPagination, OtherListing, addOtherListing, updateOtherListing, deleteOtherListing,publishOtherListing } from '@/services/Listings/otherListings';
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

const TeamsPage = () => {
  const [teams, setTeams] = useState<OtherListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentTeams, setCurrentTeams] = useState<OtherListing | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [TeamsToDelete, setTeamsToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchTeams(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchTeams = async (page: number, limit: number,resources:string = "team") => {
    try {
      setIsLoading(true);
      const {other_listings,pagination} = await getOtherListingWithPagination(resources,page,limit);
      setTeams(other_listings);
      setPagination({
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalRecords: pagination.totalRecords,
      });
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd =  () => {
    setCurrentTeams(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const team = teams.find((g) => g.id === id);
    console.log('Editing team:', team);
    if (team) {
      setCurrentTeams(() => team);
      setFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setTeamsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePublish = (id: number) => {
    const team = teams.find(f => f.id === id);
    const values: { published: string } = { published: "" };
    
    if (team) { 
      setCurrentTeams(team)
      values.published = team.published === "1" ? "0" : "1";
      handlePublishedTeam(values);
    }
  };


  const handleUpdate = async (values) => {
    if (!currentTeams) return;
    
    try {
      setIsProcessing(true);
      const response = await updateOtherListing(currentTeams.id, {
        ...values
      });

      fetchTeams(pagination.page, pagination.limit);
      setFormOpen(false);
      toast.success('teams updated successfully');
    } catch (error) {
      console.error('Error updating teams:', error);
      toast.error('Failed to update teams');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!TeamsToDelete) return;

    try {
      setIsProcessing(true);
      await deleteOtherListing(TeamsToDelete);
      setTeams(teams.filter(r => r.id !== TeamsToDelete));
      toast.success('teams deleted successfully');
    } catch (error) {
      console.error('Error deleting teams:', error);
      toast.error('Failed to delete teams');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setTeamsToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchTeams(newPage, pagination.limit);
  };

  
  const handlePublishedTeam = async(published: { published: string })=>{
    if(!currentTeams) return;
    try{
      const response = await publishOtherListing(currentTeams.id,{...published});
      if(!response){
          toast.error('Failed to publish team');
      }else{
        toast.success('team updated successfully');
      }
      fetchTeams(pagination.page, pagination.limit);
      
    }catch(error){
      console.error(error);
      toast.error('Failed to update team published');
    }finally{
      setCurrentTeams(null)
    }
  }
  const additionalFields = [
    {name:"name", label:"Name", type:"text", placeholder:"Enter team name", required:true},
    {name:"status", label:"Status", type:"option", placeholder:"Enter team status",required:true, options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Archived', label: 'Archived' },
      { value: 'Draft', label: 'Draft' },
    ]},
    {name:"description", label:"Description", type:"textarea", placeholder:"Enter team description",required:true},
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newTeams = await addOtherListing({...values,category:"team"});
        fetchTeams(pagination.page, pagination.limit);
        setFormOpen(false);
        toast.success('teams added successfully');
    } catch (error) {
        console.error('Error adding teams:', error);
        toast.error('Failed to add teams');
        throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel teams</h1>
          <p className="text-muted-foreground mt-1">
            Manage teams
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New teams
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
      ) : teams.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No teams found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel teams
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add teams
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <ListingCard
              key={team.id}
              id={team.id}
              title={team.name}
              description={`${team.description}`}
              badges={[ team.status, team.published === "1" ? "Published" : "Unpublished"]}
              price={null}
              published={team.published}
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
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((team) => (
                        <TableRow key={team.id}>
                            <TableCell className="font-medium">{team.name}</TableCell>
                            <TableCell>{team.description.slice(0,20)}...</TableCell>
                            <TableCell>{getStatusBadge(team.status)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <div className="flex justify-end">
                                    <button
                                      onClick={handlePublish.bind(null,team.id)}
                                      className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                                        team.published === "1" ? "bg-blue-500" : "bg-gray-300"
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                                          team.published === "1" ? "translate-x-6" : ""
                                        }`}
                                      ></div>
                                    </button>
                                  </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, team.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, team.id)}
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
        {teams.length > 0 && (
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
    
      {/* Add teams Dialog */}
      {!currentTeams && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New teams"
          fields={additionalFields}
          initialValues={{name: '', description: '', status: 'Active'}}
          onSubmit={handleFormSubmit}
        />
      )}
    
      {/* Edit teams Dialog */}
      {currentTeams && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update teams: ${currentTeams.name}`}
          fields={additionalFields}
          initialValues={currentTeams ? { ...currentTeams } : {}}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete teams"
        description={`Are you sure you want to delete the team? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default TeamsPage;
