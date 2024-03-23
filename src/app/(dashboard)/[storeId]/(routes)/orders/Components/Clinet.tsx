"use client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-tabel";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClinet: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for you store"
        />
        <Button
          size="sm"
          className="mt-2"
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API calls for Billboards" />
      <Separator />
      <ApiList entitiyName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default BillboardClinet;
