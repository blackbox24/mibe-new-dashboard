import { Badge } from './badge';

const getStatusBadge = (status: string) => {
    switch (status) {
    case 'Active':
        return <Badge className="bg-blue-500">Active</Badge>;
      case 'Draft':
        return <Badge className="bg-gray-300">Draft</Badge>;
    case 'Archived':
        return <Badge className="bg-gray-500">Archived</Badge>;
    case '1':
        return <Badge className="bg-green-500">Published</Badge>;
    case '0':
      return <Badge className="bg-red-500">Unpublished</Badge>;
    default:
        return <Badge>{status}</Badge>;
    }
  };

export default getStatusBadge;