"use client";
import { useParams, useRouter } from 'next/navigation';
import ApiAlert from './Api-alert';
import { useOrigin } from '@/hooks/custom/use-origin';


interface ApiListProps {
    entityName: string;
    entityIdName: string;
}
const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin() //custom

    const baseUrl = `${origin}/api/${params.storeId}`;

    return (
        <>
            <ApiAlert
                title="GET"
                variant='public'
                description={`${baseUrl}/${entityName}`}
            />

            <ApiAlert
                title="GET"
                variant='public'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />

            <ApiAlert
                title="POST"
                variant='admin'
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title="PATCH"
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}

            />
            <ApiAlert
                title="DELETE"
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}

            />
        </>
    )

}

export default ApiList