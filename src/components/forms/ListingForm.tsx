import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Interface for field configuration
interface FieldConfig {
  name: string; // Field name
  label: string; // Field label
  type: string; // Field type (e.g., text, number, option, etc.)
  placeholder?: string; // Optional placeholder text
  required?: boolean; // Whether the field is required
  options?: { label: string; value: string }[]; // Options for select fields
  option2?: { label: string; value: number }[]; // Additional options for select fields
}

// Props for the ListingForm component
interface ListingFormProps {
  open: boolean; // Whether the dialog is open
  onOpenChange: (open: boolean) => void; // Callback to handle dialog open state
  onSubmit: (values: Record<string, unknown>) => Promise<void>; // Submit handler
  title: string; // Dialog title
  fields: FieldConfig[]; // Array of field configurations
  initialValues?: Record<string, unknown>; // Initial values for the form
}

export const ListingForm = ({
  open,
  onOpenChange,
  onSubmit,
  title,
  fields,
  initialValues = {},
}: ListingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  // Build Zod schema dynamically based on field configurations
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    if (field.type === "number") {
      schemaShape[field.name] = field.required
        ? z.coerce.number().min(0, `${field.label} is required`)
        : z.coerce.number().min(0).optional();
    } else if (field.type === "option") {
      schemaShape[field.name] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional();
    } else if (field.type === "file") {
      schemaShape[field.name] = field.required
        ? z.any().refine(
            (value) => value instanceof File,
            `${field.label} is required`
          )
        : z.any()
            .refine((value) => value instanceof File)
            .optional();
    } else {
      schemaShape[field.name] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional();
    }
  });
  const formSchema = z.object(schemaShape);

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...Object.fromEntries(
        fields.map((field) => [
          field.name,
          initialValues[field.name] !== undefined
            ? initialValues[field.name]
            : field.type === "number"
            ? 0
            : "",
        ])
      ),
    },
  });

  // Reset form values when dialog opens or initialValues/fields change
  useEffect(() => {
    if (open) {
      form.reset({
        ...Object.fromEntries(
          fields.map((field) => [
            field.name,
            initialValues[field.name] !== undefined
              ? initialValues[field.name]
              : field.type === "number"
              ? 0
              : "",
          ])
        ),
      });
    }
  }, [open, initialValues, fields, form]);

  // Handle form submission
  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            {fields.map((fieldConfig) =>
              fieldConfig.type === "option" ? (
                // Render select field for "option" type
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldConfig.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value)} 
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                fieldConfig.placeholder ||
                                `Select ${fieldConfig.label.toLowerCase()}`
                              }
                            >
                              {
                                fieldConfig.options?.find(
                                  (opt) =>
                                    String(opt.value) === String(field.value)
                                )?.label
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {fieldConfig.options.map((opt) => (
                              <SelectItem key={opt.value} value={String(opt.value)}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                // Render other field types
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldConfig.label}</FormLabel>
                      <FormControl>
                        {fieldConfig.type === "text" ? (
                          <Input
                            type="text"
                            placeholder={
                              fieldConfig.placeholder ||
                              `Enter ${fieldConfig.label.toLowerCase()}`
                            }
                            {...field}
                            value={
                              field.value as string | number | readonly string[]
                            }
                          />
                        ) : fieldConfig.type === "number" ? (
                          <Input
                            type="number"
                            placeholder={
                              fieldConfig.placeholder ||
                              `Enter ${fieldConfig.label.toLowerCase()}`
                            }
                            {...field}
                            value={
                              field.value as string | number | readonly string[]
                            }
                          />
                        ) : fieldConfig.type === "textarea" ? (
                          <Textarea
                            placeholder={
                              fieldConfig.placeholder ||
                              `Enter ${fieldConfig.label.toLowerCase()}`
                            }
                            {...field}
                            value={
                              field.value as string | number | readonly string[]
                            }
                          />
                        ) : fieldConfig.type === "switch" ? (
                          <>
                            <Switch
                              key={field.name}
                              checked={field.value === "1" ? true : false}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? "1" : "0");
                              }}
                              className="w-10 h-6 ml-2"
                              value={field.value === "1" ? "1" : "0"}
                            />
                            <input
                              type="hidden"
                              {...field}
                              value={field.value === "1" ? "1" : "0"}
                            />
                          </>
                        ) : fieldConfig.type === "file" ? (
                          <Input
                            type="file"
                            placeholder={
                              fieldConfig.placeholder ||
                              `Upload ${fieldConfig.label.toLowerCase()}`
                            }
                            onChange={(e) => {
                              const file = e.target.files?.[0] || "";
                              field.onChange(file);
                            }}
                          />
                        ) : (
                          <Input
                            type={fieldConfig.type}
                            placeholder={
                              fieldConfig.placeholder ||
                              `Enter ${fieldConfig.label.toLowerCase()}`
                            }
                            {...field}
                            value={
                              field.value as string | number | readonly string[]
                            }
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-travel-600 hover:bg-travel-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
