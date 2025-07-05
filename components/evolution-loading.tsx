import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"

export function EvolutionChainSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Evolution Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Stage 1 Skeleton */}
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-lg mb-2" />
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Arrow and Method Skeleton */}
          <div className="flex flex-col items-center">
            <ArrowRight className="w-6 h-6 text-gray-300 mb-1" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Stage 2 Skeleton */}
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-lg mb-2" />
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Arrow and Method Skeleton */}
          <div className="flex flex-col items-center">
            <ArrowRight className="w-6 h-6 text-gray-300 mb-1" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Stage 3 Skeleton */}
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-lg mb-2" />
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Requirements Skeleton */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
