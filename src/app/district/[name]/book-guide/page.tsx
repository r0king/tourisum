import { Suspense } from "react";
import { getUnavailableDates } from "@/lib/bookings";
import BookingForm from "@/components/booking/BookingForm";
import { CalendarClock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BookingPage({
  params,
}: {
  params: { name: string };
}) {
  const unavailableDates = await getUnavailableDates(params.name);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/district/${params.name}`}>
          <Button variant="ghost" size="sm" className="mb-2">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to {params.name}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<BookingFormSkeleton />}>
            <BookingForm
              district={params.name}
              unavailableDates={unavailableDates}
              className="w-full"
            />
          </Suspense>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">
              About {params.name} Tours
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Expert local guides with deep knowledge</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Customized itineraries based on your interests</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Discover hidden gems and local favorites</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Flexible scheduling to fit your travel plans</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-lg font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about booking a tour? Our team is here to help you
              plan the perfect experience.
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingFormSkeleton() {
  return (
    <div className="space-y-4 border rounded-lg p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-4 w-1/4 mt-6" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-20" />
      </div>
      <div className="pt-4 flex gap-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  );
}
