"use client";

import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllPatientFollowUpById } from "@/data/get-patient-info";
import { ArrowRight, PlusCircle } from "lucide-react";
import FollowUpViewPage from "@/components/follow-up-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FollowUpListProps {
    patientId: string;
}

interface FollowUp {
    id: string;
    date: Date;
    chiefComplaint: string;
    vitalSignsId: string;
}

const FollowUpListPageClientSide = ({ patientId }: FollowUpListProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);

    useEffect(() => {
        const fetchFollowUps = async () => {
            setIsLoading(true);
            try {
                const data = await getAllPatientFollowUpById(patientId);
                // Convert string dates to Date objects if necessary
                const formattedData = data.map(followUp => ({
                    ...followUp,
                    date: new Date(followUp.date)
                }));
                setFollowUps(formattedData);
            } catch (err) {
                console.error("Error fetching follow-ups:", err);
                setError("Failed to load follow-up records");
            } finally {
                setIsLoading(false);
            }
        };

        if (patientId) {
            fetchFollowUps();
        }
    }, [patientId]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Fetching follow-up records</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {followUps.length > 0 ? (
                <Accordion type="single" collapsible>
                    {followUps.map((followUp) => (
                        <AccordionItem key={followUp.id} value={followUp.id}>
                            <AccordionTrigger>
                                <h3>{followUp.date.toDateString()} - {followUp.chiefComplaint}</h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                <FollowUpViewPage 
                                    followUpId={followUp.id} 
                                    vitalsId={followUp.vitalSignsId} 
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Follow-ups</CardTitle>
                        <CardDescription>No follow-up records found for this patient</CardDescription>
                    </CardHeader>
                </Card>
            )}
            
            <Button
                className="my-button-blue max-w-xs"
                asChild
            >
                <Link href={`/dashboard/add-patient-vitals?type=follow-up&patientId=${patientId}`}>
                    <PlusCircle className="size-4 mr-2"/>
                    Add Follow Up Record
                </Link>
            </Button>
        </div>
    );
};

export default FollowUpListPageClientSide;