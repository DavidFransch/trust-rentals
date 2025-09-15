"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyPlaceholder, LoadingSpinner, PropertyCard, DashboardNav } from "@/components/dashboard";
import { PropertyForm } from "@/components/property-form";
import { type PropertyFormValues } from "@/lib/property-schema";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Property {
  id: string;
  title: string;
  address: string;
  image_url?: string;
  owner_id: string;
}

export default function PropertyManagementPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const router = useRouter();

  const handleDelete = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      setPropertyToDelete(null);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Fetch user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        checkAccess(session.user.id);
      } else {
        router.push("/auth");
      }
    };
    fetchSession();
  }, [router]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        checkAccess(session.user.id);
      } else {
        setUserId(null);
        router.push("/auth");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // Check that the user is a landlord before loading properties
  const checkAccess = async (id: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", id)
        .single();

      if (error || !profile) {
        router.push("/dashboard");
        return;
      }

      if (profile.role !== "landlord") {
        router.push("/dashboard");
      } else {
        fetchProperties(id);
      }
    } catch (err) {
      console.error("Error checking access:", err);
      router.push("/dashboard");
    }
  };

  const fetchProperties = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", id);

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data || []);
      }
    } catch (err) {
      console.error("Fetch properties error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: PropertyFormValues) => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .insert([{ ...data, owner_id: userId }]);

      if (error) throw error;

      await fetchProperties(userId);
      setIsModalOpen(false);
      console.log("Property created successfully");
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Loading properties..." />
      </div>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Property Management</h1>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  imageUrl={property.image_url}
                  onDelete={() => setPropertyToDelete(property)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <EmptyPlaceholder
                message="No properties yet"
                icon={
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
              />
            </Card>
          )}

          <div className="mt-6">
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <AlertDialogTrigger asChild>
                <Button>Add New Property</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Property</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSubmit({
                    title: formData.get('title') as string,
                    address: formData.get('address') as string,
                    description: formData.get('description') as string || undefined,
                    image_url: formData.get('image_url') as string || undefined,
                  });
                }}>
                  <div className="py-4">
                    <PropertyForm
                      showSubmitButton={false}
                      isLoading={isSaving}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Property"}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>

      <AlertDialog open={!!propertyToDelete} onOpenChange={() => setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="py-4">Are you sure you want to delete this property? This action cannot be undone.</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => propertyToDelete && handleDelete(propertyToDelete.id)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}