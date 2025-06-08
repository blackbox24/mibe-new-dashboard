import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Loader, Pencil, Trash2, FileText, BookOpen, Wrench } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getTravelResources, TravelResource, addResource, updateResource, deleteResource } from '@/services/dataService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  type: z.enum(["guide", "story", "toolkit"]),
  image_url: z.string().url("Must be a valid URL").or(z.string().length(0).optional()),
});

type FormValues = z.infer<typeof formSchema>;

const ResourcesPage = () => {
  const [resources, setResources] = useState<TravelResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentResource, setCurrentResource] = useState<TravelResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      type: "guide",
      image_url: "",
    }
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      type: "guide",
      image_url: "",
    }
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (currentResource && openEditDialog) {
      editForm.reset({
        title: currentResource.title,
        description: currentResource.description || "",
        content: currentResource.content || "",
        type: currentResource.type,
        image_url: currentResource.image_url || "",
      });
    }
  }, [currentResource, openEditDialog, editForm]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const data = await getTravelResources();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (values: FormValues) => {
    try {
      setIsProcessing(true);
      const newResource = await addResource({
        title: values.title,
        description: values.description,
        content: values.content,
        type: values.type,
        image_url: values.image_url || null,
      });
      
      setResources([...resources, newResource]);
      setOpenAddDialog(false);
      form.reset();
      toast.success('Resource added successfully');
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Failed to add resource');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditClick = (resource: TravelResource) => {
    setCurrentResource(resource);
    setOpenEditDialog(true);
  };

  const handleUpdate = async (values: FormValues) => {
    if (!currentResource) return;
    
    try {
      setIsProcessing(true);
      const updatedResource = await updateResource(currentResource.id, {
        title: values.title,
        description: values.description,
        content: values.content,
        type: values.type,
        image_url: values.image_url || null,
      });
      
      setResources(resources.map(r => r.id === currentResource.id ? updatedResource : r));
      setOpenEditDialog(false);
      toast.success('Resource updated successfully');
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (resource: TravelResource) => {
    setCurrentResource(resource);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentResource) return;
    
    try {
      setIsProcessing(true);
      await deleteResource(currentResource.id);
      setResources(resources.filter(r => r.id !== currentResource.id));
      setOpenDeleteDialog(false);
      toast.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4 mr-2" />;
      case 'story':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'toolkit':
        return <Wrench className="h-4 w-4 mr-2" />; // Changed from Tool to Wrench
      default:
        return null;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-800';
      case 'story':
        return 'bg-green-100 text-green-800';
      case 'toolkit':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage guides, stories, and toolkits for travelers
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-travel-600 hover:bg-travel-700"
          onClick={() => setOpenAddDialog(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Resource
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-travel-600" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first travel resource
          </p>
          <Button onClick={() => setOpenAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden flex flex-col">
              {resource.image_url && (
                <div 
                  className="aspect-video w-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${resource.image_url})` }}
                />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getTypeBadgeClass(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                    <span className="capitalize">{resource.type}</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {resource.description && (
                  <p className="text-muted-foreground mb-3">{resource.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Last updated: {format(new Date(resource.updated_at), 'PPP')}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditClick(resource)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(resource)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Resource Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter resource title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="toolkit">Toolkit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter resource description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter resource content" className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setOpenAddDialog(false)}
                  className="mt-2 sm:mt-0"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-travel-600 hover:bg-travel-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Saving..." : "Save Resource"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      {currentResource && (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Resource: {currentResource.title}</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter resource title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resource type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="toolkit">Toolkit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter resource description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter resource content" className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setOpenEditDialog(false)}
                    className="mt-2 sm:mt-0"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-travel-600 hover:bg-travel-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Saving..." : "Update Resource"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        description={`Are you sure you want to delete the resource "${currentResource?.title}"? This action cannot be undone.`}
        isDeleting={isProcessing}
      />
    </>
  );
};

export default ResourcesPage;
