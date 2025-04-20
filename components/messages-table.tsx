import { getMessages } from "@/lib/appwrite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteMessageButton } from "@/components/delete-message-button";
import { ViewMessageButton } from "@/components/view-message-button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export async function MessagesTable() {
  const messages = await getMessages();

  // Sort messages by creation date (newest first)
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
    const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMessages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            sortedMessages.map((message) => (
              <TableRow key={message.$id}>
                <TableCell className="font-medium">{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>
                  <Link
                    href={`https://wa.me/${message.PhoneNumber.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline"
                  >
                    {message.PhoneNumber}
                  </Link>
                </TableCell>

                <TableCell>
                  {message.$createdAt
                    ? formatDate(message.$createdAt)
                    : "Unknown"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ViewMessageButton message={message} />
                    <DeleteMessageButton id={message.$id || ""} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
