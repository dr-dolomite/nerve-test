"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  FolderPenIcon,
  ListStart,
  UserRoundCog,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

const ClerkDashboardPage = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleString("default", { weekday: "long" });
  const year = currentDate.getFullYear();
  const dayOfMonth = currentDate.getDate();

  const patientNames = [
    {
      patientName: "Patient 1",
      patientStatus: "Current Patient",
      chiefComplaint: "Chief Complain 1",
      paymentAmount: "₱ 500.00",
    },
    {
      patientName: "Patient 2",
      patientStatus: "Next Patient",
      chiefComplaint: "Chief Complain 2",
      paymentAmount: "₱ -",
    },
    {
      patientName: "Patient 3",
      patientStatus: "Pending",
      chiefComplaint: "Chief Complain 3",
      paymentAmount: "₱ -",
    },
    {
      patientName: "Patient 4",
      patientStatus: "Pending",
      chiefComplaint: "Chief Complain 4",
      paymentAmount: "₱ -",
    },
    {
      patientName: "Patient 5",
      patientStatus: "Pending",
      chiefComplaint: "Chief Complain 5",
      paymentAmount: "₱ -",
    },
  ];

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
        </CardHeader>

        <CardContent className="grid gap-8">
          <div className="flex">
            <Button asChild className="my-button-blue">
              <Link href="/dashboard/add-existing-user">
                <ListStart className="w-6 h-6 mr-2" /> Add Patient to Queue
              </Link>
            </Button>
          </div>

          <Table>
            <TableCaption>Current Patient Queue</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Patient Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientNames.map((patientName) => (
                <TableRow key={patientName.patientName}>
                  <TableCell className="font-medium">
                    {patientName.patientName}
                  </TableCell>
                  <TableCell>{patientName.patientStatus}</TableCell>
                  <TableCell>{patientName.paymentAmount}</TableCell>
                  <TableCell className="text-right">
                    {patientName.chiefComplaint}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <div className='flex flex-col justify-center items-center'>
                <div className="grid grid-cols-2 grid-flow-row gap-x-12">
                    <Button asChild className="my-button-blue">
                        <Link href="/dashboard/add-existing-user">
                            <CirclePlus className="w-6 h-6 mr-2" /> Add Existing Patient
                        </Link>
                    </Button>
                </div>
            </div> */}
    </div>
  );
};

export default ClerkDashboardPage;
