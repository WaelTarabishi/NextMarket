"use client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-tabel";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoriesColumn, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface CategoiresClinetProps {
  data: CategoriesColumn[];
}

const CategoryClient: React.FC<CategoiresClinetProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for you store"
        />
        <Button
          size="sm"
          className="mt-2"
          onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entitiyName="Categories" entityIdName="CategoriesId" />
    </>
  );
};

export default CategoryClient;
