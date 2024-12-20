import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card'

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge"
import { BookText, EditIcon, IterationCw, PlusCircleIcon, UserCircle2, UserIcon } from 'lucide-react';
import { getPatientById } from '@/data/get-patient-info';
import PatientHistoryViewPage from '@/components/patient-history-view';
import { FaMapMarkerAlt } from 'react-icons/fa';
import FollowUpListPage from '@/components/follow-up-list';
import EditPatientInformationPage from '@/components/edit/edit-patient-information';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ViewPatientRecordPage = async ({ params }: { params: { id: string } }) => {

    const patient = await getPatientById(params.id);

    if (!patient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        Missing Patient Record
                    </CardTitle>
                    <CardDescription>
                    Patient Not Found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className='my-button-blue max-w-xs' asChild>
                        <Link href='/dashboard/add-existing-patient'>
                        <PlusCircleIcon className='size-4 mr-2' />
                            Add Existing Patient Record
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // Only parse the month, day, and year
    const lastVisitParsed = new Date(patient.lastVisit?.toString() ?? 'N/A');
    const nextVisitParsed = new Date(patient.lastVisit?.toString() ?? 'N/A');

    return (
        <Card className='p-8'>
            <CardContent>
                <div className='grid grid-cols-5 grid-flow-row gap-x-12'>
                    <div className='flex flex-col flex-shrink-0 gap-y-8'>
                        <Avatar className='2xl:size-60 xl:size-48 md:size-38 size-32 rounded-sm max-w-auto max-h-auto'>
                            <AvatarImage src={patient.imageURL ?? ''} />
                            <AvatarFallback className='rounded-sm'>
                                <UserCircle2 className='size-24' />
                            </AvatarFallback>
                        </Avatar>

                        <div className='mt-1.5 text-gray 2xl:text-base font-medium uppercase flex flex-row items-center'>
                            Visits
                            <Separator className='ml-1' />
                        </div>

                        <div className='flex flex-col gap-y-3'>
                            <h3 className='text-lg font-semibold'>
                                Last Visit
                            </h3>
                            <div className='text-gray text-sm'>
                                {lastVisitParsed.toDateString()}
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-3'>
                            <h3 className='text-lg font-semibold'>
                                Next Visit
                            </h3>

                            <div className='text-gray text-sm'>
                                {nextVisitParsed.toDateString()}
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-3'>
                            <h3 className='text-lg font-semibold'>
                                Patient Status
                            </h3>
                            <div>
                                <Badge
                                    className='my-button-blue'
                                    variant="custom"
                                >
                                    {patient.patientStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>


                    {/* Right Side */}
                    <div className='flex flex-col col-span-4'>
                        <div className='flex flex-col gap-y-2 px-4'>
                            <div className='flex flex-row'>
                                <CardTitle>
                                    {patient.name}
                                </CardTitle>
                                <div className='flex items-center ml-3'>
                                    <FaMapMarkerAlt className='size-4 mr-1 text-[#2F80ED]' />
                                    <CardDescription>
                                        {patient.city}
                                    </CardDescription>
                                </div>
                            </div>
                            <CardDescription>
                                {patient.phone}
                            </CardDescription>
                        </div>
                        <CardHeader>
                            <Tabs defaultValue="about" className="relative mr-auto w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="about"
                                        className="relative data-[state=active]:bg-none rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                                    >
                                        <UserIcon className='size-4 mr-2' />
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="history"
                                        className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                                    >
                                        <BookText className='size-4 mr-2' />
                                        History
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="followUp"
                                        className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                                    >
                                        <IterationCw className='size-4 mr-2' />
                                        Follow Up
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="about" className='p-2'>
                                    <div className='grid grid-cols-5'>
                                        <CardDescription className='uppercase col-span-5 my-6'>
                                            <Dialog>
                                                <DialogTrigger className='flex flex-row items-center '>
                                                    Patient Information
                                                    <EditIcon className='text-gray hover:text-[#2F80ED] cursor-pointer size-5 ml-3' />
                                                </DialogTrigger>
                                                <DialogContent className='2xl:max-w-[80%] max-w-[90%]'>
                                                    <DialogHeader>
                                                        <DialogTitle>Patient Information</DialogTitle>
                                                        <DialogDescription>
                                                            Update the patient&apos;s information here.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <EditPatientInformationPage patientId={patient.id} />
                                                </DialogContent>
                                            </Dialog>

                                        </CardDescription>
                                        <div className='mt-3 grid grid-cols-3 grid-flow-row gap-y-4 col-span-5'>
                                            <div className='col-span-1 font-semibold'>
                                                Complete Address:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.completeAddress}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Birthday:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.birthday?.toDateString()}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Age:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.age}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Sex:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.sex}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Civil Status:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.civilStatus}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Occupation:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.occupation}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Religion:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.religion}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                Handedness:
                                            </div>
                                            <div className='col-span-2 capitalize'>
                                                {patient.handedness}
                                            </div>
                                            <div className='col-span-1 font-semibold'>
                                                E-mail:
                                            </div>
                                            <div className='col-span-2'>
                                                {patient.email}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="history">
                                    <PatientHistoryViewPage patientId={params.id} />
                                </TabsContent>
                                <TabsContent value="followUp">
                                    <FollowUpListPage patientId={params.id} />
                                </TabsContent>
                            </Tabs>
                        </CardHeader>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ViewPatientRecordPage