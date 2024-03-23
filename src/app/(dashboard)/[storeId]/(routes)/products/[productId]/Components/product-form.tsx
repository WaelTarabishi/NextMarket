"use client";
import React, { useState } from "react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character long"),
  images: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .refine((value) => value.length > 0, {
      message: "Please upload at least one image.",
    }),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1, "Category must be at least 1 character long"),
  colorId: z.string().min(1, "Color must be at least 1 character long"),
  sizeId: z.string().min(1, "Size must be at least 1 character long"),
  isArchived: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isArchived: false,
          isFeatured: false,
        },
  });
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const OnDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (err) {
      console.log(err);
      toast.error("Some thing went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={OnDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm">
            <div onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4" />
            </div>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product Name"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="9.99$"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem className="">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={form.formState.isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="sizeId"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem className="">
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={form.formState.isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes?.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="colorId"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem className="">
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={form.formState.isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors?.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="isFeatured"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-y-0 rounded-md border p-4 md:mt-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        //@ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none ml-2">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />
            <FormField
              name="isArchived"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-y-0 rounded-md border p-4 md:mt-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        //@ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none ml-2">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        This product will not appear anywhere in the store.
                      </FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            disabled={form.formState.isSubmitting}
            className="ml-auto"
            type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
