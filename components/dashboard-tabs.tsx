"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ActiveStakes } from "./active-stakes"
import { PendingResolution } from "./pending-resolution"
import { CompletedPredictions } from "./completed-predictions"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="active" className="w-full">
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <TabsList className="bg-surface border-2 border-border mb-8 h-14 p-1 w-max md:w-auto">
          <TabsTrigger
            value="active"
                className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-xs tracking-wider shrink-0 whitespace-nowrap min-h-[44px]"
          >
            Active Stakes
          </TabsTrigger>
          <TabsTrigger
            value="pending"
                className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-xs tracking-wider shrink-0 whitespace-nowrap min-h-[44px]"
          >
            Pending Resolution
          </TabsTrigger>
          <TabsTrigger
            value="completed"
                className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-xs tracking-wider shrink-0 whitespace-nowrap min-h-[44px]"
          >
            Completed
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active">
        <ActiveStakes />
      </TabsContent>

      <TabsContent value="pending">
        <PendingResolution />
      </TabsContent>

      <TabsContent value="completed">
        <CompletedPredictions />
      </TabsContent>
    </Tabs>
  )
}
