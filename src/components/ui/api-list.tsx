"use client";

import { useOrigin } from "@/Hooks/use-origin";
import { useParams } from "next/navigation";
import ApiAlert from "./api-alert";

interface ApiListProps {
  entitiyName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entitiyName, entityIdName }) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entitiyName}`}
        variant="public"
      />

      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entitiyName}/{${entityIdName}}`}
        variant="public"
      />

      <ApiAlert
        title="POST"
        description={`${baseUrl}/${entitiyName}`}
        variant="admin"
      />

      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/${entitiyName}/{${entityIdName}}`}
        variant="admin"
      />
      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/${entitiyName}/{${entityIdName}}`}
        variant="admin"
      />
    </>
  );
};

export default ApiList;
