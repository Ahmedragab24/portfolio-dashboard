"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  FileText,
  ExternalLink,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Certificates } from "@/lib/appwrite";
import { getCertificates, deleteCertificate } from "@/lib/appwrite";
import { AddCertificateDialog } from "./add-certificate-dialog";
import { EditCertificateDialog } from "./edit-certificate-dialog";
import { toast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "./delete-certificate-dialog";

export default function CertificatesTable() {
  const router = useRouter();

  const [certificates, setCertificates] = useState<Certificates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificates | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const certificatesData = await getCertificates();
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error fetching certificates data:", error);
        toast({
          title: "Error",
          description: "Failed to load certificates information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  const confirmDelete = (id: string) => {
    setCertificateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!certificateToDelete) return;

    try {
      await deleteCertificate(certificateToDelete);
      // After deletion, refresh the certificates list
      const updatedCertificates = certificates.filter(
        (cert) => cert.$id !== certificateToDelete
      );
      setCertificates(updatedCertificates);
      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (certificate: Certificates) => {
    setSelectedCertificate(certificate);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = async () => {
    setIsAddDialogOpen(false);
    // Refresh certificates list after adding
    setIsLoading(true);
    try {
      const updatedCertificates = await getCertificates();
      setCertificates(updatedCertificates);
    } catch (error) {
      console.error("Error refreshing certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    // Refresh certificates list after editing
    setIsLoading(true);
    try {
      const updatedCertificates = await getCertificates();
      setCertificates(updatedCertificates);
    } catch (error) {
      console.error("Error refreshing certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>Loading certificates...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>
            Manage your professional certificates and qualifications
          </CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certificate
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-muted-foreground"
                >
                  No certificates found. Add your first certificate.
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate) => (
                <TableRow key={certificate.$id}>
                  <TableCell className="font-medium">
                    {certificate.name}
                  </TableCell>
                  <TableCell>
                    <a
                      href={certificate.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Certificate
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleEdit(certificate)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => confirmDelete(certificate.$id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <AddCertificateDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      {selectedCertificate && (
        <EditCertificateDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          certificate={selectedCertificate}
          onSuccess={handleEditSuccess}
        />
      )}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
      />
    </Card>
  );
}
