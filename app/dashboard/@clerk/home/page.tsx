"use client";

import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  FolderPenIcon,
  ListStart,
  UserRoundCog,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import QueuePage from "@/components/view/queue-page";
import AddPatientToQueueDialog from "@/components/view/queue-dialog";
import { getOrCreateQueue } from "@/actions/queue/get-or-create";

const ClerkDashboardPage = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleString("default", { weekday: "long" });
  const year = currentDate.getFullYear();
  const dayOfMonth = currentDate.getDate();
  const [queueId, setQueueId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueueId = async () => {
      const result = await getOrCreateQueue();
      if (result.success) {
        setQueueId(result.queueId);
      } else {
        console.error(result.error);
      }
    };

    fetchQueueId();
  }, []);

  const user = useCurrentUser();

  return (
    <div className="grid gap-6">
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <h2 className="text-gray font-medium 2xl:text-lg text-md antialiased">
            Hi {user?.name},
          </h2>
          <h1 className="text-primary font-semibold 2xl:text-2xl text-xl antialiased">
            Welcome Back!
          </h1>
        </div>

        <div className="flex flex-col items-end">
          <h2 className="text-gray font-medium 2xl:text-lg text-md  antialiased">
            Today is
          </h2>
          <h1 className="text-primary font-medium 2xl:text-lg text-md antialiased">
            {day} {month} {dayOfMonth}, {year}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Since some features are not yet available, you can only add existing
            patients for now.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex 2xl:gap-12 gap-8">
            <Button asChild className="my-button-blue">
              <Link href="/dashboard/add-existing-user">
                <FolderPenIcon className="w-6 h-6 mr-2" /> Add Existing Patient
              </Link>
            </Button>

            <Button asChild className="my-button-blue">
              <Link href="/dashboard/add-new-patient">
                <CirclePlus className="w-6 h-6 mr-2" /> Add New Patient
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Patient Queueing</CardTitle>
          <CardDescription>
            Add patients to the queue for the doctor to see.
          </CardDescription>
          <p>
            Queue ID: <span className="font-semibold">{queueId}</span>
          </p>
        </CardHeader>

        <CardContent className="grid gap-8">
          <div className="flex">
            {queueId && <AddPatientToQueueDialog queueId={queueId} />}
          </div>

          <QueuePage queueId={queueId ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkDashboardPage;
