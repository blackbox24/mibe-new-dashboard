import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getAllCaseStudies, CaseStudy, addCaseStudy, updateCaseStudy, deleteCaseStudy } from '@/services/dataService';
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

const CaseStudyPage = () => {
  const [CaseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  // State to toggle between card and list view
  const [isCardView, setIsCardView] = useState(true);
  const [currentCaseStudies, setCurrentCaseStudies] = useState<CaseStudy | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [CaseStudiesToDelete, setCaseStudiesToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchCaseStudies(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);


  const fetchCaseStudies = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const data = await getAllCaseStudies();
      setCaseStudies(data);
    } catch (error) {
      console.error('Error fetching CaseStudies:', error);
      toast.error('Failed to load CaseStudies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd =  () => {
    setCurrentCaseStudies(null);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const CaseStudy = CaseStudies.find((g) => g.id === id);
    console.log('Editing CaseStudy:', CaseStudy);
    if (CaseStudy) {
      setCurrentCaseStudies(() => CaseStudy);
      setFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setCaseStudiesToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (values) => {
    if (!currentCaseStudies) return;
    
    try {
      setIsProcessing(true);
      const response = await updateCaseStudy(currentCaseStudies.id, {
        ...values
      });

      setCaseStudies(CaseStudies.map(r => r.id === currentCaseStudies.id ? { ...r, ...response } : r));
      setFormOpen(false);
      toast.success('Case Studies updated successfully');
    } catch (error) {
      console.error('Error updating Case Studies:', error);
      toast.error('Failed to update Case Studies');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!CaseStudiesToDelete) return;

    try {
      setIsProcessing(true);
      await deleteCaseStudy(CaseStudiesToDelete);
      setCaseStudies(CaseStudies.filter(r => r.id !== CaseStudiesToDelete));
      toast.success('CaseStudies deleted successfully');
    } catch (error) {
      console.error('Error deleting CaseStudies:', error);
      toast.error('Failed to delete CaseStudies');
    } finally {
      setIsProcessing(false);
        setIsDeleteDialogOpen(false);
        setCaseStudiesToDelete(null);
    }
  };

const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchCaseStudies(newPage, pagination.limit);
  };
  const additionalFields = [
    {name:"name", label:"Name", type:"text", placeholder:"Enter Case Studies name", required:true},
    {name:"status", label:"Status", type:"option", placeholder:"Enter Case Studies content",required:true, options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Archived', label: 'Archived' },
      { value: 'Draft', label: 'Draft' }
    ]},
    {name:"description", label:"Description", type:"textarea", placeholder:"Enter Case Studies description",required:true},
    {name:"published", label:"Published", type:"switch", placeholder:"Enter Case Studies published",required:false}
  ]

  const handleFormSubmit = async (values) => {
    try{
        const newCaseStudies: CaseStudy = await addCaseStudy(values);
        setCaseStudies([...CaseStudies, newCaseStudies]);
        setFormOpen(false);
        toast.success('CaseStudies added successfully');
    } catch (error) {
        console.error('Error adding CaseStudies:', error);
        toast.error('Failed to add CaseStudies');
        throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Case Studies</h1>
          <p className="text-muted-foreground mt-1">
            Manage Case Studies for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={handleAdd}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New CaseStudies
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
      ) : CaseStudies.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No Case Studies found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel Case Studies
          </p>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Case Studies
          </Button>
        </div>
      ) : isCardView ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CaseStudies.map((CaseStudy) => (
            <ListingCard
              key={CaseStudy.id}
              id={CaseStudy.id}
              title={CaseStudy.name}
              description={`${CaseStudy.description}`}
              badges={[ CaseStudy.status, CaseStudy.published === "1" ? "Published" : "Unpublished"]}
              price={null}
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
                        <TableHead className="text-right">Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {CaseStudies.map((CaseStudy) => (
                        <TableRow key={CaseStudy.id}>
                            <TableCell className="font-medium">{CaseStudy.name}</TableCell>
                            <TableCell>{CaseStudy.description.slice(0,20)}...</TableCell>
                            <TableCell>{getStatusBadge(CaseStudy.status)}</TableCell>
                            <TableCell className="text-right">{getStatusBadge(CaseStudy.published)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit.bind(null, CaseStudy.id)}
                                        className="bg-travel-100 text-travel-800 border-travel-200 hover:bg-travel-200"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete.bind(null, CaseStudy.id)}
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

      {/* Add CaseStudies Dialog */}
      {!currentCaseStudies && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add New CaseStudies"
          fields={additionalFields}
          initialValues={{name: '', description: '', status: 'Active'}}
          onSubmit={handleFormSubmit}
        />
      )}
    
      {/* Edit CaseStudies Dialog */}
      {currentCaseStudies && (
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={`Update Case Studies: ${currentCaseStudies.name}`}
          fields={additionalFields}
          initialValues={currentCaseStudies ? { ...currentCaseStudies } : {}}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete CaseStudies"
        description={`Are you sure you want to delete the Case Study? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default CaseStudyPage;
