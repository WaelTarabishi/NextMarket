"use client";

import React, { useState } from "react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
import {
  Form,
  FormControl,
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
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/Hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  label: z.string().min(1, "Label must be at least 1 character long"),
  imageUrl: z.string().min(1, "You should provide an image"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const OnDelete = async () => {
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted.");
    } catch (err) {
      console.log(err);
      toast.error(
        "Please ensure that all categories associated with this billboard are removed before proceeding."
      );
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => OnDelete()}
        loading={form.formState.isSubmitting}
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
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={form.formState.isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="label"
              control={form.control}
              render={({ field }) => {
                // console.log(field.value); // Log the value of the field
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Billboard label"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
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
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
