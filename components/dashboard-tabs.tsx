"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ActiveStakes } from "./active-stakes"
import { PendingResolution } from "./pending-resolution"
import { CompletedPredictions } from "./completed-predictions"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="bg-surface border-2 border-border mb-8 h-14 p-1">
        <TabsTrigger
          value="active"
          className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-sm tracking-wider px-6 h-full"
        >
          Active Stakes
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-sm tracking-wider px-6 h-full"
        >
          Pending Resolution
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-sm tracking-wider px-6 h-full"
        >
          Completed
        </TabsTrigger>
      </TabsList>

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
